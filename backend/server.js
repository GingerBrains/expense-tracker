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

// Scheduled cleanup of unverified, expired users
const cron = require('node-cron');
const User = require('./models/User');

// Run every hour at minute 0
cron.schedule('0 * * * *', async () => {
  try {
    const result = await User.deleteMany({
      isVerified: false,
      emailVerificationExpires: { $lt: Date.now() }
    });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} unverified expired users.`);
    }
  } catch (err) {
    console.error('Error deleting unverified users:', err);
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
