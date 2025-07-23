import moment from 'moment';
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuDownload } from 'react-icons/lu';

const ExpenseList = ({ transactions, onDelete, onDownload, onEditRecurring, onCancelRecurring }) => {
  // Separate recurring and non-recurring expenses
  const recurring = transactions?.filter(e => e.isRecurring);
  const nonRecurring = transactions?.filter(e => !e.isRecurring);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Categories</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {/* Recurring Expenses Section */}
      {recurring?.length > 0 && (
        <div className="mb-4">
          <h6 className="text-sm font-semibold text-blue-600 flex items-center gap-2">Recurring Expenses <span className="text-xs">🔁</span></h6>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {recurring.map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={moment(expense.date).format("Do MMM YYYY")}
                amount={expense.amount}
                type="expense"
                isRecurring={expense.isRecurring}
                recurrence={expense.recurrence}
                recurrenceEndDate={expense.recurrenceEndDate}
                onDelete={() => onDelete(expense._id)}
                onEdit={() => onEditRecurring && onEditRecurring(expense)}
                onCancelRecurrence={() => onCancelRecurring && onCancelRecurring(expense)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Non-Recurring Expenses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {nonRecurring?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            isRecurring={expense.isRecurring}
            recurrence={expense.recurrence}
            recurrenceEndDate={expense.recurrenceEndDate}
            onDelete={() => onDelete(expense._id)}
            onEdit={() => onEditRecurring && onEditRecurring(expense)}
          />
        ))}
      </div>
    </div>
  );
}

export default ExpenseList
