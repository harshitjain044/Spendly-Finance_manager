# Spendly

Spendly is a full-stack personal finance manager with a React + TypeScript frontend and an Express + TypeScript backend. It helps users track income and expenses, manage recurring transactions, import transaction data in bulk, scan receipts with AI, review analytics, and schedule monthly email reports.

This README is based on the current code inside both `client/` and `backend/`, so it describes the real implementation instead of a generic project template.

## What The App Does

- User registration and login
- JWT-based protected dashboard
- Transaction create, edit, duplicate, delete, and bulk delete
- Recurring transaction support
- CSV transaction import with column mapping
- AI receipt scanning from uploaded images
- Analytics dashboard with charts and summary cards
- Expense category breakdown
- Report history and test report sending
- Monthly report scheduling toggle
- Profile name and avatar updates
- Light and dark theme switching

## Main Product Areas

### Authentication

- Sign up with `name`, `email`, and `password`
- Sign in with `email` and `password`
- JWT access token returned by backend on login
- Protected route handling on the frontend
- Persisted auth state using Redux Persist and local storage
- Automatic redirect away from auth pages after login

### Dashboard

- Personalized welcome header
- Summary cards for:
  available balance
  total income
  total expenses
  savings rate
  expense ratio
  transaction count
- Date-range aware analytics
- Income vs expense area chart
- Expense breakdown pie chart
- Recent transactions table on the overview page

### Transactions

- Add a transaction from a right-side drawer
- Edit a transaction from a global edit drawer
- View paginated transactions
- Search by title and category
- Filter by:
  transaction type
  recurring vs non-recurring
- Bulk delete selected rows
- Duplicate an existing transaction
- Support for:
  title
  amount
  type
  category
  date
  payment method
  recurring toggle
  recurring frequency
  description
  receipt URL

### CSV Bulk Import

- Multi-step import flow
- File upload step
- CSV column mapping step
- Final confirmation step
- Supports mapping common transaction fields before import
- Bulk insert endpoint on the backend

### AI Receipt Scanning

- Upload a JPG or PNG receipt image
- File is uploaded through Cloudinary-backed middleware
- Backend fetches the uploaded image and sends it to Gemini
- Extracted fields are used to prefill the transaction form
- Supported extracted fields include:
  title
  amount
  date
  description
  category
  payment method
  transaction type
  receipt URL

### Reports

- View paginated report history
- Send a test monthly report manually from the UI
- Enable or disable monthly report delivery
- Report settings are stored per user
- Backend can generate report summaries for a date range
- Report emails include AI-generated financial insights

### Settings

- Account settings:
  update display name
  upload profile picture
- Appearance settings:
  light theme
  dark theme
- Billing page:
  currently informational only
  no billing backend is implemented yet

## Frontend Routes

- `/`
  Sign-in page
- `/sign-up`
  Sign-up page
- `/overview`
  Main analytics dashboard
- `/transactions`
  Full transactions page
- `/reports`
  Report history and report actions
- `/settings`
  Settings container
- `/settings/appearance`
  Theme preferences
- `/settings/billing`
  Billing placeholder page

## Frontend Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI primitives
- Redux Toolkit
- RTK Query
- Redux Persist
- React Hook Form
- Zod
- Recharts
- `nuqs` for query-state support
- `sonner` for toasts

## Frontend Architecture

### Important Files

- `src/App.tsx`
  App entry wrapper with theme provider
- `src/main.tsx`
  Redux provider, persist gate, toast setup, and app mount
- `src/routes/index.tsx`
  Route tree for auth and protected pages
- `src/app/api-client.ts`
  RTK Query base client with `Authorization` header support
- `src/app/store.ts`
  Redux store and persisted auth state
- `src/features/auth/authSlice.ts`
  Access token, expiry, user, and report settings state
- `src/components/transaction/transaction-form.tsx`
  Shared create/edit transaction form
- `src/components/transaction/reciept-scanner.tsx`
  AI receipt scanner UI
- `src/components/transaction/import-transaction-modal/index.tsx`
  CSV import modal flow

### UI and UX Notes

- Responsive layout with mobile navigation sheet
- Light and dark theme support via a theme provider
- Finance-focused green accent visual style
- Toast feedback for success and error states
- Data tables with pagination and filter controls
- Skeleton loaders and empty states in analytics and tables

## Backend Stack

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Passport JWT
- Zod validation
- Cloudinary + Multer
- Gemini API via `@google/genai`
- Resend for email delivery
- node-cron for scheduled jobs

## Backend Responsibilities

- User registration and login
- Password hashing through model hooks
- JWT creation and protected route auth
- Transaction CRUD and bulk operations
- CSV-backed bulk transaction insertion
- Receipt image upload handling
- AI receipt parsing
- Analytics aggregation queries
- Report generation and report history persistence
- Monthly report scheduling
- Recurring transaction processing
- User profile updates

## API Endpoints

All protected routes require a Bearer token.

### Public

- `GET /`
  Backend status message
- `GET /health`
  Health check
- `POST {BASE_PATH}/auth/register`
  Register a new user
- `POST {BASE_PATH}/auth/login`
  Log in a user

### User

- `GET {BASE_PATH}/user/current-user`
  Get current user profile
- `PUT {BASE_PATH}/user/update`
  Update name and/or profile picture

### Transactions

- `POST {BASE_PATH}/transaction/create`
  Create one transaction
- `POST {BASE_PATH}/transaction/scan-receipt`
  Upload and AI-scan a receipt image
- `POST {BASE_PATH}/transaction/bulk-transaction`
  Bulk insert transactions
- `PUT {BASE_PATH}/transaction/duplicate/:id`
  Duplicate a transaction
- `PUT {BASE_PATH}/transaction/update/:id`
  Update a transaction
- `GET {BASE_PATH}/transaction/all`
  Get paginated transactions with filters
- `GET {BASE_PATH}/transaction/:id`
  Get one transaction
- `DELETE {BASE_PATH}/transaction/delete/:id`
  Delete one transaction
- `DELETE {BASE_PATH}/transaction/bulk-delete`
  Bulk delete multiple transactions

### Reports

- `GET {BASE_PATH}/report/all`
  Get paginated report history
- `GET {BASE_PATH}/report/generate`
  Generate a report for a custom date range
- `POST {BASE_PATH}/report/send-test`
  Send a test monthly report email
- `PUT {BASE_PATH}/report/update-setting`
  Enable or disable monthly report delivery

### Analytics

- `GET {BASE_PATH}/analytics/summary`
  Dashboard summary metrics
- `GET {BASE_PATH}/analytics/chart`
  Time-series income/expense chart data
- `GET {BASE_PATH}/analytics/expense-breakdown`
  Expense category pie-chart breakdown

## Data Model

### User

- `name`
- `email`
- `password`
- `profilePicture`
- `createdAt`
- `updatedAt`

### Transaction

- `userId`
- `title`
- `type`
- `amount`
- `category`
- `receiptUrl`
- `date`
- `description`
- `isRecurring`
- `recurringInterval`
- `nextRecurringDate`
- `lastProcessed`
- `status`
- `paymentMethod`
- `createdAt`
- `updatedAt`

### Report Setting

- `userId`
- `frequency`
- `isEnabled`
- `nextReportDate`
- `lastSentDate`
- `createdAt`
- `updatedAt`

### Report History

- `userId`
- `period`
- `sentDate`
- `status`
- `createdAt`
- `updatedAt`

## Supported Enums And Fixed Values

### Transaction Types

- `INCOME`
- `EXPENSE`

### Recurring Intervals

- `DAILY`
- `WEEKLY`
- `MONTHLY`
- `YEARLY`

### Payment Methods

- `CARD`
- `BANK_TRANSFER`
- `MOBILE_PAYMENT`
- `AUTO_DEBIT`
- `CASH`
- `OTHER`

### Transaction Statuses

- `PENDING`
- `COMPLETED`
- `FAILED`

### Report Statuses

- `SENT`
- `PENDING`
- `FAILED`
- `NO_ACTIVITY`

### Default Frontend Categories

- groceries
- dining
- transportation
- utilities
- entertainment
- shopping
- healthcare
- travel
- housing
- income
- investments
- other

## Scheduled Jobs

The backend includes cron-based automation when `ENABLE_CRONS=true`.

### Recurring Transactions Job

- Scans for recurring transactions whose next date is due
- Creates a non-recurring generated copy for the due occurrence
- Updates the source recurring transaction with the next occurrence date

### Reports Job

- Finds users with enabled monthly report settings
- Generates a report for the previous month
- Sends report email if data exists
- Stores a report-history record with status:
  `SENT`
  `FAILED`
  `NO_ACTIVITY`
- Updates next scheduled send date

## Environment Variables

## Frontend

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:8000/api
```

Optional notes:

- The frontend expects the backend base path, not just the backend root.
- The Redux persist encryption key is referenced in comments only and is not active in the current implementation.

## Backend

Create `backend/.env` with values for:

```env
NODE_ENV=development
PORT=8000
BASE_PATH=/api
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_ORIGIN=http://localhost:5173
ENABLE_CRONS=false

GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RESEND_API_KEY=your_resend_api_key
RESEND_MAILER_SENDER=your_verified_sender_email
```

## Local Setup

### 1. Install Dependencies

```bash
cd client
npm install

cd ../backend
npm install
```

### 2. Configure Environment Variables

- Add `client/.env`
- Add `backend/.env`

### 3. Start The Backend

```bash
cd backend
npm run dev
```

Backend default port:

```text
http://localhost:8000
```

### 4. Start The Frontend

```bash
cd client
npm run dev
```

Frontend default dev server:

```text
http://localhost:5173
```

## Available Scripts

### Client

- `npm run dev`
  Start the Vite development server
- `npm run build`
  Run TypeScript build and generate the production bundle
- `npm run preview`
  Preview the production build locally
- `npm run lint`
  Run ESLint

### Backend

- `npm run dev`
  Start Express with `ts-node-dev`
- `npm run build`
  Compile TypeScript to `dist/`
- `npm start`
  Run the built backend from `dist/`

## Project Structure

```text
Finance_manager/
|-- client/
|   |-- src/
|   |   |-- app/
|   |   |-- components/
|   |   |-- context/
|   |   |-- features/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   `-- routes/
|   |-- public/
|   `-- package.json
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- cron/
|   |   |-- mailers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- validators/
|   `-- package.json
`-- README.md
```

## Implementation Notes

- Amounts are stored in MongoDB in minor currency units and exposed to the app in major units through model getters/setters.
- The analytics layer supports preset date ranges and custom ranges.
- Report insights are generated through Gemini and included in outbound emails when available.
- Receipt scanning currently expects image uploads and rejects unsupported file types.
- Cloudinary upload limits are set to one file up to 5 MB.
- CSV sample files are present in `client/src/data/`.

## Current Limitations

- No production billing system is implemented yet
- Billing page is present but informational only
- No social login is active
- The frontend includes refresh/logout RTK Query endpoints, but the current backend route file only exposes `register` and `login`
- No dedicated budgeting goals module exists yet
- No multi-user shared household/team finance workspace exists
- No automated tests are included in the repository yet

## Summary

Spendly already covers the main personal-finance workflow end to end:

- create an account
- sign in to a protected dashboard
- record and manage transactions
- analyze income and expenses visually
- import transactions in bulk
- scan receipts with AI assistance
- schedule and review monthly reports
- update your profile and theme preferences

For this codebase, `client/README.md` now documents the whole product because the frontend and backend are tightly connected and many of the most important user-facing features depend on backend services.
