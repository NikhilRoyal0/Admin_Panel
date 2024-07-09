import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BranchSlice = createSlice({
  name: "Branch",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setBranchData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setBranchLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setBranchError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateBranch: (state, action) => {
      const updatedBranch = action.payload;
      state.data = state.data.map((Branch) =>
        Branch.bank_id === updatedBranch.bank_id ? updatedBranch : Branch
      );
    },
    deleteBranch: (state, action) => {
      const selectedBranchId = action.payload;
      state.data = state.data.filter(
        (Branch) => Branch.bank_id !== selectedBranchId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setBranchData, setBranchLoading, setBranchError, updateBranch, deleteBranch } =
  BranchSlice.actions;

export const fetchBranchData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "branches/all/getAllBranches",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setBranchData(response.data));
  } catch (error) {
    dispatch(setBranchError(error.message));
    console.error("Error fetching branch data:", error);
  }
};

export const AddBranchData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "branches/create",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );
    dispatch(fetchBranchData());
  } catch (error) {
    console.error("Error adding branch:", error);
  }
};

export const updateBranchData = (branchId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `branches/update/${branchId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedBranchData = response.data;

    dispatch(updateBranch(updatedBranchData));
    dispatch(fetchBranchData());

  } catch (error) {
    console.error("Error updating branch :", error);
  }
};

export const deleteBranchData = (branchId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `branches/delete/${branchId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deleteBranch(deleteBranchData));
    dispatch(fetchBranchData());

  } catch (error) {
    console.error("Error deleting branch:", error);
  }
};

export const selectBranchData = (state) => state.Branch.data;
export const selectBranchLoading = (state) => state.Branch.isLoading;
export const selectBranchError = (state) => state.Branch.error;

export default BranchSlice.reducer;
