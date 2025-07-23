import moment from 'moment';
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuDownload } from 'react-icons/lu';

const IncomeList = ({transactions, onDelete, onDownload, onEditRecurring, onCancelRecurring}) => {
  // Separate recurring and non-recurring incomes
  const recurring = transactions?.filter(i => i.isRecurring);
  const nonRecurring = transactions?.filter(i => !i.isRecurring);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {/* Recurring Incomes Section */}
      {recurring?.length > 0 && (
        <div className="mb-4">
          <h6 className="text-sm font-semibold text-blue-600 flex items-center gap-2">Recurring Incomes <span className="text-xs">🔁</span></h6>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {recurring.map((income) => (
              <TransactionInfoCard
                key={income._id}
                title={income.source}
                icon={income.icon}
                date={moment(income.date).format("Do MMM YYYY")}
                amount={income.amount}
                type="income"
                isRecurring={income.isRecurring}
                recurrence={income.recurrence}
                recurrenceEndDate={income.recurrenceEndDate}
                onDelete={() => onDelete(income._id)}
                onEdit={() => onEditRecurring && onEditRecurring(income)}
                onCancelRecurrence={() => onCancelRecurring && onCancelRecurring(income)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Non-Recurring Incomes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {nonRecurring?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            isRecurring={income.isRecurring}
            recurrence={income.recurrence}
            recurrenceEndDate={income.recurrenceEndDate}
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList
