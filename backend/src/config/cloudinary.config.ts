import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

const STORAGE_PARAMS = {
  folder: "images",
  allowed_formats: ["jpg", "png", "jpeg"],
  resource_type: "image" as const, // <-- Fixed typo: was 'rescource_type'
  quality: "auto:good" as const,
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (_req: Request, _file: Express.Multer.File) => ({
    ...STORAGE_PARAMS,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype);
    if (!isValid) {
      return cb(null, false);
    }

    cb(null, true);
  },
});
