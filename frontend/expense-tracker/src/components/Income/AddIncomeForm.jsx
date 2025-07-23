import React, { useState, useEffect } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddIncomeForm = ({onAddIncome, initialData, editMode}) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
        isRecurring: false,
        recurrence: "none",
        recurrenceEndDate: "",
    });

    useEffect(() => {
      if (initialData) {
        setIncome({
          source: initialData.source || "",
          amount: initialData.amount || "",
          date: initialData.date ? initialData.date.slice(0, 10) : "",
          icon: initialData.icon || "",
          isRecurring: initialData.isRecurring || false,
          recurrence: initialData.recurrence || "none",
          recurrenceEndDate: initialData.recurrenceEndDate ? initialData.recurrenceEndDate.slice(0, 10) : "",
        });
      }
    }, [initialData]);

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });
  return (
    <div>

        <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedicon) => handleChange("icon", selectedicon)}
        />

      <Input 
      value={income.source}
      onChange={({ target }) => handleChange("source", target.value)}
      label="Income Source"
      placeholder="Freelance, Salary, etc"
      type="text"
      />

      <Input
      value={income.amount}
      onChange={({ target }) => handleChange("amount", target.value)}
      label="Amount"
      placeholder="$$$$"
      type="number"
      />

      <Input 
      value={income.date}
      onChange={({ target }) => handleChange("date", target.value)}
      label="Date"
      placeholder=""
      type="date"
      />

      {/* Recurring Income Fields */}
      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={income.isRecurring}
            onChange={e => handleChange("isRecurring", e.target.checked)}
          />
          Recurring Income
        </label>
        {income.isRecurring && (
          <div className="mt-2 space-y-2">
            <label className="block text-xs font-medium">Recurrence</label>
            <select
              className="input"
              value={income.recurrence}
              onChange={e => handleChange("recurrence", e.target.value)}
            >
              <option value="none">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Input
              value={income.recurrenceEndDate}
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
        onClick={()=>onAddIncome(income)}
        >
            {editMode ? 'Update Income' : 'Add Income'}
        </button>
      </div>
    </div>
  )
}

export default AddIncomeForm
