const xlsx = require('xlsx');
const Expense = require('../models/Expense');

// Add Expense 
exports.addExpense = async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, category, amount, date } = req.body;

        // Validate input
        if (!category || !amount ) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Create new expense 
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: date ? new Date(date) : new Date() // Default to current date
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

// Get All Expenses
exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId })
            .sort({ date: -1 });
            res.json(expense);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

// Delete Expense 
exports.deleteExpense = async (req, res) => {
    
    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

// Download Expenses as Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId })
            .sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map(item => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'expense');
        xlsx.writeFile(wb, 'Expense.xlsx');
        res.download('Expense.xlsx');
    } catch (error) {
        console.error('Error downloading expenses as Excel:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

