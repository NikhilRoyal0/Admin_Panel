import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setpurchaseData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setpurchaseLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setpurchaseError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatepurchase: (state, action) => {
      const updatedpurchase = action.payload;
      state.data = state.data.map((purchase) =>
        purchase.purchaseId === updatedpurchase.purchaseId ? updatedpurchase : purchase
      );
    },
    deletepurchase: (state, action) => {
      const selectedpurchaseId = action.payload;
      state.data = state.data.filter(
        (purchase) => purchase.purchaseId !== selectedpurchaseId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setpurchaseData, setpurchaseLoading, setpurchaseError } =
  purchaseSlice.actions;

export const fetchpurchaseData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "course/purchase/history/all/getAllPurchaseHistory",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setpurchaseData(response.data));
  } catch (error) {
    dispatch(setpurchaseError(error.message));
  }
};

export const AddpurchaseData = (newpurchaseData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "course/purchase/history/add",
      newpurchaseData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchpurchaseData());

  } catch (error) {
    console.error("Error:", error);
  }
};

export const updatepurchaseData = (purchaseId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `course/purchase/history/update/${purchaseId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedpurchaseData = response.data;

    dispatch(updatepurchase(updatedpurchaseData));
    dispatch(fetchpurchaseData());
  } catch (error) {
    console.error("Error updating purchase:", error);
  }
};



export const selectpurchaseData = (state) => state.purchase.data;
export const selectpurchaseLoading = (state) => state.purchase.isLoading;
export const selectpurchaseError = (state) => state.purchase.error;

export default purchaseSlice.reducer;
