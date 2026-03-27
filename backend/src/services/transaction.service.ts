import axios from "axios";
import { z } from "zod";
import TransactionModel, {
  PaymentMethodEnum,
  TransactionTypeEnum,
} from "../models/transaction.model";
import { HTTPSTATUS } from "../config/http.config";
import {
  BadRequestException,
  HttpException,
  InternalServerException,
  NotFoundException,
} from "../utils/app-error";
import { calculateNextOccurrence } from "../utils/helper";
import {
  CreateTransactionType,
  UpdateTransactionType,
} from "../validators/transaction.validator";
import { genAI, genAIModel } from "../config/google-ai.config";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { receiptPrompt } from "../utils/prompt";

const aiReceiptSchema = z.object({
  title: z.string().trim().min(1).optional(),
  amount: z.number().positive("Amount must be a positive number"),
  date: z.string().date("Date must be in YYYY-MM-DD format"),
  description: z.string().trim().min(1).max(500).optional(),
  category: z.string().trim().min(1).optional(),
  paymentMethod: z.nativeEnum(PaymentMethodEnum).optional(),
  type: z.literal(TransactionTypeEnum.EXPENSE).default(TransactionTypeEnum.EXPENSE),
});

const getAIServiceError = (error: unknown) => {
  const status =
    (error as { status?: number })?.status ||
    (error as { response?: { status?: number } })?.response?.status;
  const message =
    (error as { message?: string })?.message ||
    (error as { error?: { message?: string } })?.error?.message ||
    "AI service request failed";

  if (status === HTTPSTATUS.TOO_MANY_REQUESTS || /quota exceeded|too many requests/i.test(message)) {
    return new HttpException(
      "AI receipt scanning is temporarily unavailable because the configured Gemini quota has been exceeded. Add billing to the Gemini project or use another API key, then try again.",
      HTTPSTATUS.TOO_MANY_REQUESTS
    );
  }

  if (/api key|permission|unauthorized|forbidden/i.test(message)) {
    return new HttpException(
      "AI receipt scanning is not configured correctly. Check GEMINI_API_KEY and Gemini API access.",
      HTTPSTATUS.SERVICE_UNAVAILABLE
    );
  }

  return new InternalServerException("Receipt scanning service unavailable");
};

export const createTransactionService = async (
  body: CreateTransactionType,
  userId: string
) => {
  let nextRecurringDate: Date | undefined;
  const currentDate = new Date();

  if (body.isRecurring && body.recurringInterval) {
    const calulatedDate = calculateNextOccurrence(
      body.date,
      body.recurringInterval
    );

    nextRecurringDate =
      calulatedDate < currentDate
        ? calculateNextOccurrence(currentDate, body.recurringInterval)
        : calulatedDate;
  }

  const transaction = await TransactionModel.create({
    ...body,
    userId,
    category: body.category,
    amount: Number(body.amount),
    isRecurring: body.isRecurring || false,
    recurringInterval: body.recurringInterval || null,
    nextRecurringDate,
    lastProcessed: null,
  });

  return transaction;
};

export const getAllTransactionService = async (
  userId: string,
  filters: {
    keyword?: string;
    type?: keyof typeof TransactionTypeEnum;
    recurringStatus?: "RECURRING" | "NON_RECURRING";
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { keyword, type, recurringStatus } = filters;

  const filterConditions: Record<string, any> = {
    userId,
  };

  if (keyword) {
    filterConditions.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  if (type) {
    filterConditions.type = type;
  }

  if (recurringStatus) {
    if (recurringStatus === "RECURRING") {
      filterConditions.isRecurring = true;
    } else if (recurringStatus === "NON_RECURRING") {
      filterConditions.isRecurring = false;
    }
  }

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [transations, totalCount] = await Promise.all([
    TransactionModel.find(filterConditions)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),
    TransactionModel.countDocuments(filterConditions),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    transations,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });
  if (!transaction) throw new NotFoundException("Transaction not found");

  return transaction;
};

export const duplicateTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });
  if (!transaction) throw new NotFoundException("Transaction not found");

  const duplicated = await TransactionModel.create({
    ...transaction.toObject(),
    _id: undefined,
    title: `Duplicate - ${transaction.title}`,
    description: transaction.description
      ? `${transaction.description} (Duplicate)`
      : "Duplicated transaction",
    isRecurring: false,
    recurringInterval: undefined,
    nextRecurringDate: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  return duplicated;
};

export const updateTransactionService = async (
  userId: string,
  transactionId: string,
  body: UpdateTransactionType
) => {
  const existingTransaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });
  if (!existingTransaction)
    throw new NotFoundException("Transaction not found");

  const now = new Date();
  const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;

  const date =
    body.date !== undefined ? new Date(body.date) : existingTransaction.date;

  const recurringInterval =
    body.recurringInterval || existingTransaction.recurringInterval;

  let nextRecurringDate: Date | undefined;

  if (isRecurring && recurringInterval) {
    const calulatedDate = calculateNextOccurrence(date, recurringInterval);

    nextRecurringDate =
      calulatedDate < now
        ? calculateNextOccurrence(now, recurringInterval)
        : calulatedDate;
  }

  existingTransaction.set({
    ...(body.title && { title: body.title }),
    ...(body.description && { description: body.description }),
    ...(body.category && { category: body.category }),
    ...(body.type && { type: body.type }),
    ...(body.paymentMethod && { paymentMethod: body.paymentMethod }),
    ...(body.amount !== undefined && { amount: Number(body.amount) }),
    date,
    isRecurring,
    recurringInterval,
    nextRecurringDate,
  });

  await existingTransaction.save();

  return;
};

export const deleteTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const deleted = await TransactionModel.findByIdAndDelete({
    _id: transactionId,
    userId,
  });
  if (!deleted) throw new NotFoundException("Transaction not found");

  return;
};

export const bulkDeleteTransactionService = async (
  userId: string,
  transactionIds: string[]
) => {
  const result = await TransactionModel.deleteMany({
    _id: { $in: transactionIds },
    userId,
  });

  if (result.deletedCount === 0)
    throw new NotFoundException("No transations found");

  return {
    sucess: true,
    deletedCount: result.deletedCount,
  };
};

export const bulkTransactionService = async (
  userId: string,
  transactions: CreateTransactionType[]
) => {
  try {
    const bulkOps = transactions.map((tx) => ({
      insertOne: {
        document: {
          ...tx,
          userId,
          isRecurring: false,
          nextRecurringDate: null,
          recurringInterval: null,
          lastProcesses: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    }));

    const result = await TransactionModel.bulkWrite(bulkOps, {
      ordered: true,
    });

    return {
      insertedCount: result.insertedCount,
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

export const scanReceiptService = async (
  file: Express.Multer.File | undefined
) => {
  if (!file) throw new BadRequestException("No file uploaded");

  if (!file.path) throw new BadRequestException("Failed to upload receipt");

  try {
    const responseData = await axios.get<ArrayBuffer>(file.path, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(responseData.data).toString("base64");

    if (!base64String) {
      throw new BadRequestException("Could not process receipt image");
    }

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [
        createUserContent([
          receiptPrompt,
          createPartFromBase64(base64String, file.mimetype),
        ]),
      ],
      config: {
        temperature: 0,
        topP: 1,
        responseMimeType: "application/json",
      },
    });

    const cleanedText = result.text?.replace(/```(?:json)?\n?/g, "").trim();

    if (!cleanedText) {
      throw new BadRequestException(
        "The AI scan could not read details from this receipt"
      );
    }

    const parsedJson = JSON.parse(cleanedText);
    const data = aiReceiptSchema.parse(parsedJson);

    return {
      title: data.title || "Receipt",
      amount: data.amount,
      date: data.date,
      description: data.description || "",
      category: data.category || "other",
      paymentMethod: data.paymentMethod || PaymentMethodEnum.CASH,
      type: data.type,
      receiptUrl: file.path,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(
        "The AI scan returned incomplete receipt details. Try a clearer image."
      );
    }

    if (error instanceof BadRequestException) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new BadRequestException(
        "The AI scan returned an unreadable response. Please try again."
      );
    }

    throw getAIServiceError(error);
  }
};
