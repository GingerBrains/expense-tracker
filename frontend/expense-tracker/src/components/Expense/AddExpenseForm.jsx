import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({ onAddExpense }) => {
     const [expense, setExpense] = useState({
            category: "",
            amount: "",
            date: "",
            icon: "",
            isRecurring: false,
            recurrence: "none",
            recurrenceEndDate: "",
        });

        const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

  return (
    <div>
        <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedicon) => handleChange("icon", selectedicon)}
        onIconError={() => toast.error("Please select an icon!")}
        />

      <Input 
      value={expense.category}
      onChange={({ target }) => handleChange("category", target.value)}
      label="Category"
      placeholder="Rent, Meds, etc"
      type="text"
      />

      <Input
      value={expense.amount}
      onChange={({ target }) => handleChange("amount", target.value)}
      label="Amount"
      placeholder="$$$$"
      type="number"
      />

      <Input 
      value={expense.date}
      onChange={({ target }) => handleChange("date", target.value)}
      label="Date"
      placeholder=""
      type="date"
      />

      {/* Recurring Expense Fields */}
      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={expense.isRecurring}
            onChange={e => handleChange("isRecurring", e.target.checked)}
          />
          Recurring Expense
        </label>
        {expense.isRecurring && (
          <div className="mt-2 space-y-2">
            <label className="block text-xs font-medium">Recurrence</label>
            <select
              className="input"
              value={expense.recurrence}
              onChange={e => handleChange("recurrence", e.target.value)}
            >
              <option value="none">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Input
              value={expense.recurrenceEndDate}
              onChange={({ target }) => handleChange("recurrenceEndDate", target.value)}
              label="End Date (optional)"
              type="date"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
        type="button"
        className="add-btn add-btn-fill"
        onClick={()=>onAddExpense(expense)}
        >
        Add Expense
        </button>
      </div>   
      
    </div>
  )
}

export default AddExpenseForm
