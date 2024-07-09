import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const studentWalletSlice = createSlice({
  name: "studentWallet",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setstudentWalletData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setstudentWalletLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setstudentWalletError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatestudentWallet: (state, action) => {
      const updatedstudentWallet = action.payload;
      state.data = state.data.map((studentWallet) =>
        studentWallet.trans_id === updatedstudentWallet.trans_id ? updatedstudentWallet : studentWallet
      );
    },
  },
});

export const { setstudentWalletData, setstudentWalletLoading, setstudentWalletError } =
  studentWalletSlice.actions;

export const fetchstudentWalletData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "students/transaction/all/getAllWalletHistory",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setstudentWalletData(response.data));
  } catch (error) {
    dispatch(setstudentWalletError(error.message));
  }
};

export const AddstudentWalletData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "students/transaction/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchstudentWalletData());

  } catch (error) {
    console.error("Error:", error);
  }
};

export const updatestudentWalletData = (trans_id, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `students/transaction/update/${trans_id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedstudentWalletData = response.data;

    dispatch(updatestudentWallet(updatedstudentWalletData));
    dispatch(fetchstudentWalletData());

  } catch (error) {
    console.error("Error updating studentWallet:", error);
  }
};




export const selectstudentWalletData = (state) => state.studentWallet.data;
export const selectstudentWalletLoading = (state) => state.studentWallet.isLoading;
export const selectstudentWalletError = (state) => state.studentWallet.error;

export default studentWalletSlice.reducer;
