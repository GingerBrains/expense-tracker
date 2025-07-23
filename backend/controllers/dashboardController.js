const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate userId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const userObjectId = new Types.ObjectId(String(userId));

    // Define date ranges
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Run DB operations in parallel
    const [
      totalIncomeAgg,
      totalExpenseAgg,
      last60DaysIncomeTransactions,
      last30DaysExpenseTransactions,
      last5Incomes,
      last5Expenses
    ] = await Promise.all([
      Income.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Income.find({ userId: userObjectId, date: { $gte: sixtyDaysAgo } }).sort({ date: -1 }),
      Expense.find({ userId: userObjectId, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
      Income.find({ userId }).sort({ date: -1 }).limit(5).select('amount date source note icon'),
      Expense.find({ userId }).sort({ date: -1 }).limit(5).select('amount date category note icon')
    ]);

    // Compute totals from aggregates
    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const totalExpense = totalExpenseAgg[0]?.total || 0;

    // Compute totals from filtered transactions
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, txn) => sum + txn.amount, 0
    );

    const expenseLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, txn) => sum + txn.amount, 0
    );

    // Merge and sort recent transactions
    const recentTransactions = [
      ...last5Incomes.map(txn => ({ ...txn.toObject(), type: 'income' })),
      ...last5Expenses.map(txn => ({ ...txn.toObject(), type: 'expense' }))
    ].sort((a, b) => b.date - a.date);

    // Final JSON response
    res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpenses: {
        transactions: last30DaysExpenseTransactions,
        total: expenseLast30Days
      },
      last60DaysIncome: {
        transactions: last60DaysIncomeTransactions,
        total: incomeLast60Days
      },
      recentTransactions
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
