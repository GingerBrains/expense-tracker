const xlsx = require('xlsx');
const Income = require('../models/Income');

// Add Income Source
exports.addIncome = async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, source, amount } = req.body;

        // Check amount is a number
        if (isNaN(amount)) {
            return res.status(400).json({ message: 'Amount must be a number.' });
        }

        // Validate input
        if (!source || !amount ) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Create new income source
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date() // Default to current date
        });

        await newIncome.save();
        res.status(200).json(newIncome);
    } catch (error) {
        // Log the entire error object
        console.error('Error adding income source:', error);
        
        // Return a detailed error message (optional)
        res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
    }
}

// Get All Income Sources
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId })
            .sort({ date: -1 });
            res.json(income);
    } catch (error) {
        console.error('Error fetching income sources:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

// Delete Income Source
exports.deleteIncome = async (req, res) => {
    
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: 'Income source deleted successfully.' });
    } catch (error) {
        console.error('Error deleting income source:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

// Download Income Sources as Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId })
            .sort({ date: -1 });

        // Prepare data for Excel
        const data = income.map(item => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'income');
        xlsx.writeFile(wb, 'Income.xlsx');
        res.download('Income.xlsx');
    } catch (error) {
        console.error('Error downloading income sources as Excel:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

