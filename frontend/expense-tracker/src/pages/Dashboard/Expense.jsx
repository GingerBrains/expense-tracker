import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { useEffect } from 'react';
import { API_PATHS } from '../../utils/apiPaths';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';


const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
  
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [editRecurring, setEditRecurring] = useState({ show: false, data: null });
    const [cancelRecurring, setCancelRecurring] = useState({ show: false, data: null });

      // Get all Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data){
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.",error);
    } finally {
      setLoading(false);
    }
  };

      // Handle Add Expense
  const handleAddExpense = async (expense) => {
      // Validation Checks
      if(!expense.category.trim()) {
        toast.error("Category is required.");
        return;
      }

      if(!expense.amount || isNaN(expense.amount) || Number(expense.amount) <= 0) {
        toast.error("Amount should be a valid number.");
        return;
      }

      if (!expense.date) {
        toast.error("Date is required");
        return;
      }

      if (!expense.icon) {
        toast.error("Icon is required");
        return;
      }

      try {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, expense);
        setOpenAddExpenseModal(false);
        toast.success("Expense added successfully");
        fetchExpenseDetails();
      } catch (error) {
        console.error(
          "Error adding Expense",
          error.response?.data?.message || error.message
        )
      }
    };

      // Delete Expense
  const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
    setOpenDeleteAlert({ show: false, data: null });
    toast.success("Expense details deleted successfully");
    fetchExpenseDetails();
  } catch (error) {
    console.error(
      "Error deleting expense:",
      error.response?.data?.message || error.message
    );
  }
};

      // Handle Download Expense Details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense-details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:",error);
      toast.error("Download Failed!! Try Again!!")
    }
  };

  const handleEditRecurring = (expense) => {
    setEditRecurring({ show: true, data: expense });
  };

  const handleCancelRecurring = (expense) => {
    setCancelRecurring({ show: true, data: expense });
  };

  const confirmCancelRecurring = async () => {
    try {
      await axiosInstance.put(API_PATHS.EXPENSE.DELETE_EXPENSE(cancelRecurring.data._id), {
        isRecurring: false,
        recurrence: 'none',
        recurrenceEndDate: null,
      });
      toast.success('Recurring expense cancelled');
      setCancelRecurring({ show: false, data: null });
      fetchExpenseDetails();
    } catch (error) {
      toast.error('Failed to cancel recurrence');
    }
  };

  const handleUpdateRecurring = async (updatedExpense) => {
    try {
      await axiosInstance.put(API_PATHS.EXPENSE.DELETE_EXPENSE(editRecurring.data._id), updatedExpense);
      setEditRecurring({ show: false, data: null });
      toast.success('Recurring expense updated');
      fetchExpenseDetails();
    } catch (error) {
      toast.error('Failed to update recurring expense');
    }
  };

    useEffect(() => {
      fetchExpenseDetails();

      return () => {};
    }, []);

  return (
    <DashboardLayout activeMenu="Expense">
    <div className="my-5 mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
            />
        </div>

        <ExpenseList
        transactions={expenseData}
        onDelete={(id) => {
          setOpenDeleteAlert({ show: true, data: id });
        }}
        onDownload={handleDownloadExpenseDetails}
        onEditRecurring={handleEditRecurring}
        onCancelRecurring={handleCancelRecurring}
        />
      </div>

      <Modal
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

         <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show: false, data: null})}
        title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
        </Modal>

        <Modal
          isOpen={editRecurring.show}
          onClose={() => setEditRecurring({ show: false, data: null })}
          title="Edit Recurring Expense"
        >
          <AddExpenseForm
            onAddExpense={handleUpdateRecurring}
            initialData={editRecurring.data}
            editMode
          />
        </Modal>
        <Modal
          isOpen={cancelRecurring.show}
          onClose={() => setCancelRecurring({ show: false, data: null })}
          title="Cancel Recurring Expense"
        >
          <div>
            <p className="text-sm">Are you sure you want to cancel recurrence for <b>{cancelRecurring.data?.category}</b>?</p>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="add-btn mr-2"
                onClick={() => setCancelRecurring({ show: false, data: null })}
              >
                No
              </button>
              <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={confirmCancelRecurring}
              >
                Yes, Cancel Recurrence
              </button>
            </div>
          </div>
        </Modal>
    </div>
    </DashboardLayout>
  )
}

export default Expense
