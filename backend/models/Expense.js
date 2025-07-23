const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrence: {
        type: String, // 'daily', 'weekly', 'monthly', 'yearly'
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'none'
    },
    recurrenceEndDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);