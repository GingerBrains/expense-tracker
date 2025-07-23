import React from 'react'
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from 'react-icons/lu';

const TransactionInfoCard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
    isRecurring,
    recurrence,
    recurrenceEndDate,
    onEdit,
    onCancelRecurrence
}) => {
    const getAmountStyles = () => type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
    
  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60'>
        <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
            {icon ? (
                <img src={icon} alt={title} className='w-6 h-6' />
            ) : (
                <LuUtensils />
            )}
        </div>

        <div className='flex-1 flex items-center justify-between'>
            <div>
                <p className='text-sm text-gray-700 font-medium flex items-center gap-2'>
                  {title}
                  {isRecurring && <span title="Recurring" className="text-blue-500 text-xs">🔁</span>}
                </p>
                <p className='text-xs text-gray-400 mt-1'>{date}</p>
                {isRecurring && (
                  <p className='text-xs text-blue-500 mt-1'>
                    {recurrence && recurrence !== 'none' && `Repeats: ${recurrence.charAt(0).toUpperCase() + recurrence.slice(1)}`}
                    {recurrenceEndDate && (
                      <span> | Ends: {new Date(recurrenceEndDate).toLocaleDateString()}</span>
                    )}
                  </p>
                )}
                {/* Edit and Cancel Recurrence Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                  {isRecurring && (
                    <button
                      className="text-xs text-red-500 underline hover:text-red-700"
                      onClick={onCancelRecurrence}
                    >
                      Cancel Recurrence
                    </button>
                  )}
                </div>
            </div>

            <div className='flex items-center gap-2'>
                {!hideDeleteBtn && (
                    <button className='text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer' onClick={onDelete}>
                        <LuTrash2 size={18} />
                    </button>
                    )}

                    <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
                    >
                        <h6 className='text-xs font-medium'>
                            {type === "income" ? "+" : "-"} ${amount}
                        </h6>
                        {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
                    </div>
            </div>
        </div>
    </div>
  )
}

export default TransactionInfoCard
