# Expense Tracker – MERN Stack

A fully responsive Expense Tracker App using the MERN (MongoDB, Express, React, Node.js) stack! This app includes user authentication with JWT, income and expense tracking, interactive charts, and the ability to export data in Excel format.

---

## Features

- User authentication (JWT, email verification, password reset)
- Track income and expenses with categories and icons
- Recurring transactions (income & expense)
- Dashboard with charts and summaries
- Export income and expense data to Excel
- Profile management with photo upload
- Responsive UI (React + TailwindCSS)
- API endpoints for all major actions

---

## Project Structure

- **backend/** – Node.js/Express API, MongoDB models, authentication, scheduled jobs
- **frontend/expense-tracker/** – React app (Vite, TailwindCSS), all UI and API calls

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- (Optional) Mailtrap/Ethereal for email testing

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_user
SMTP_PASS=your_ethereal_pass
SMTP_FROM=no-reply@expensetracker.com
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend/expense-tracker
npm install
```

Create a `.env` file in `frontend/expense-tracker/`:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register` – Register user
- `POST /api/v1/auth/login` – Login
- `GET /api/v1/auth/getUser` – Get user info (auth required)
- `GET /api/v1/auth/verify-email` – Email verification
- `POST /api/v1/auth/forgot-password` – Request password reset
- `POST /api/v1/auth/reset-password` – Reset password
- `PUT /api/v1/auth/update` – Update user info (auth required)
- `POST /api/v1/auth/upload-image` – Upload profile image

### Income
- `POST /api/v1/income/add` – Add income
- `GET /api/v1/income/get` – Get all income
- `GET /api/v1/income/downloadexcel` – Export income to Excel
- `DELETE /api/v1/income/:id` – Delete income

### Expense
- `POST /api/v1/expense/add` – Add expense
- `GET /api/v1/expense/get` – Get all expenses
- `GET /api/v1/expense/downloadexcel` – Export expenses to Excel
- `DELETE /api/v1/expense/:id` – Delete expense
- `PUT /api/v1/expense/:id` – Update expense

### Dashboard
- `GET /api/v1/dashboard` – Get dashboard data

---

## Scheduled Jobs

- **Cleanup:** Deletes unverified users every hour
- **Recurring Transactions:** Generates recurring income/expense entries daily

---

## License

This project is licensed under the GNU GPL v3.

---

## Contribution

Feel free to fork, open issues, or submit pull requests!
