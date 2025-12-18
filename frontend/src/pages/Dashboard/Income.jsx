import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editRecurring, setEditRecurring] = useState({ show: false, data: null });
  const [cancelRecurring, setCancelRecurring] = useState({ show: false, data: null });

  const handleEditRecurring = (income) => {
    setEditRecurring({ show: true, data: income });
  };

  const handleCancelRecurring = (income) => {
    setCancelRecurring({ show: true, data: income });
  };

  const confirmCancelRecurring = async () => {
    try {
      await axiosInstance.put(API_PATHS.INCOME.DELETE_INCOME(cancelRecurring.data._id), {
        isRecurring: false,
        recurrence: 'none',
        recurrenceEndDate: null,
      });
      toast.success('Recurring income cancelled');
      setCancelRecurring({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      toast.error('Failed to cancel recurrence');
    }
  };

  const handleUpdateRecurring = async (updatedIncome) => {
    try {
      await axiosInstance.put(API_PATHS.INCOME.DELETE_INCOME(editRecurring.data._id), updatedIncome);
      setEditRecurring({ show: false, data: null });
      toast.success('Recurring income updated');
      fetchIncomeDetails();
    } catch (error) {
      toast.error('Failed to update recurring income');
    }
  };

  // Get all Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data){
        //console.log("Fetched Income Data:", response.data);
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.",error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Income
  const handleAddIncome = async (income) => {
    // Validation Checks
    if(!income.source.trim()) {
      toast.error("Source is required.");
      return;
    }
    if(!income.amount || isNaN(income.amount) || Number(income.amount) <= 0) {
      toast.error("Amount should be a valid number.");
      return;
    }
    if (!income.date) {
      toast.error("Date is required");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, income);
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding Income",
        error.response?.data?.message || error.message
      )
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
    setOpenDeleteAlert({ show: false, data: null });
    toast.success("Income details deleted successfully");
    fetchIncomeDetails();
  } catch (error) {
    console.error(
      "Error deleting income:",
      error.response?.data?.message || error.message
    );
  }
};

  // Handle Download Income Details
  const handleDownloadIncomeDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income-details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:",error);
      toast.error("Download Failed!! Try Again!!")
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => {};
  }, []);


  return (
    <DashboardLayout activeMenu="Income">
    <div className="my-5 mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <IncomeOverview
          transactions={incomeData}
          onAddIncome={() => setOpenAddIncomeModal(true)}
          />
        </div>

        <IncomeList
        transactions={incomeData}
        onDelete={(id) => {
          setOpenDeleteAlert({ show: true, data: id });
        }}
        onDownload={handleDownloadIncomeDetails}
        onEditRecurring={handleEditRecurring}
        onCancelRecurring={handleCancelRecurring}
        />
      </div>

      <Modal
        isOpen={openAddIncomeModal}
        onClose={() => setOpenAddIncomeModal(false)}
        title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show: false, data: null})}
        title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
            />
        </Modal>

        <Modal
          isOpen={editRecurring.show}
          onClose={() => setEditRecurring({ show: false, data: null })}
          title="Edit Recurring Income"
        >
          <AddIncomeForm
            onAddIncome={handleUpdateRecurring}
            initialData={editRecurring.data}
            editMode
          />
        </Modal>

        <Modal
          isOpen={cancelRecurring.show}
          onClose={() => setCancelRecurring({ show: false, data: null })}
          title="Cancel Recurring Income"
        >
          <div>
            <p className="text-sm">Are you sure you want to cancel recurrence for <b>{cancelRecurring.data?.source}</b>?</p>
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

export default Income
