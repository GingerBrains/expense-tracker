require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Scheduled jobs for recurring transactions
const cron = require('node-cron');
const Income = require('./models/Income');
const Expense = require('./models/Expense');

// Scheduled job to generate recurring income transactions
cron.schedule('0 1 * * *', async () => { // Run daily at 1:00 AM
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find all active recurring incomes
    const recurringIncomes = await Income.find({
      isRecurring: true,
      recurrence: { $ne: 'none' },
      $or: [
        { recurrenceEndDate: null },
        { recurrenceEndDate: { $gte: today } }
      ]
    });

    for (const income of recurringIncomes) {
      // Calculate the next due date based on recurrence
      let lastDate = new Date(income.date);
      let nextDate = new Date(lastDate);

      switch (income.recurrence) {
        case 'daily':
          nextDate.setDate(lastDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(lastDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(lastDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(lastDate.getFullYear() + 1);
          break;
        default:
          nextDate = null;
      }

      // If today is the next due date, create a new income entry
      if (
        nextDate &&
        nextDate.getTime() === today.getTime() &&
        (!income.recurrenceEndDate || today <= income.recurrenceEndDate)
      ) {
        await Income.create({
          userId: income.userId,
          icon: income.icon,
          source: income.source,
          amount: income.amount,
          date: today,
          isRecurring: false, // The generated entry is not itself recurring
          recurrence: 'none',
          recurrenceEndDate: null
        });
        // Update the original recurring income's date to today
        income.date = today;
        await income.save();
        console.log(`Generated recurring income for user ${income.userId} on ${today.toISOString()}`);
      }
    }
  } catch (err) {
    console.error('Error generating recurring incomes:', err);
  }
});

// Scheduled job to generate recurring expense transactions
cron.schedule('5 1 * * *', async () => { // Run daily at 1:05 AM
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find all active recurring expenses
    const recurringExpenses = await Expense.find({
      isRecurring: true,
      recurrence: { $ne: 'none' },
      $or: [
        { recurrenceEndDate: null },
        { recurrenceEndDate: { $gte: today } }
      ]
    });

    for (const expense of recurringExpenses) {
      // Calculate the next due date based on recurrence
      let lastDate = new Date(expense.date);
      let nextDate = new Date(lastDate);

      switch (expense.recurrence) {
        case 'daily':
          nextDate.setDate(lastDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(lastDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(lastDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(lastDate.getFullYear() + 1);
          break;
        default:
          nextDate = null;
      }

      // If today is the next due date, create a new expense entry
      if (
        nextDate &&
        nextDate.getTime() === today.getTime() &&
        (!expense.recurrenceEndDate || today <= expense.recurrenceEndDate)
      ) {
        await Expense.create({
          userId: expense.userId,
          icon: expense.icon,
          category: expense.category,
          amount: expense.amount,
          date: today,
          isRecurring: false, // The generated entry is not itself recurring
          recurrence: 'none',
          recurrenceEndDate: null
        });
        // Update the original recurring expense's date to today
        expense.date = today;
        await expense.save();
        console.log(`Generated recurring expense for user ${expense.userId} on ${today.toISOString()}`);
      }
    }
  } catch (err) {
    console.error('Error generating recurring expenses:', err);
  }
});

app.use(cors());  // Allows all origins

// app.use(
//     cors({
//         origin: process.env.CLIENT_URL || "*",
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// )

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
