import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CertificateSlice = createSlice({
  name: "Certificate",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCertificateData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setCertificateLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCertificateError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCertificateData,
  setCertificateLoading,
  setCertificateError,
  updateCertificate,
  deleteCertificate,
} = CertificateSlice.actions;

export const fetchCertificateData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "certificates/all/getAllCertificates",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setCertificateData(response.data));
  } catch (error) {
    dispatch(setCertificateError(error.message));
    console.error("Error fetching Certificate data:", error);
  }
};

export const AddCertificateData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "certificates/generate",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );
    dispatch(fetchCertificateData());
  } catch (error) {
    console.error("Error adding Certificate:", error);
  }
};


export const selectCertificateData = (state) => state.Certificate.data;
export const selectCertificateLoading = (state) => state.Certificate.isLoading;
export const selectCertificateError = (state) => state.Certificate.error;

export default CertificateSlice.reducer;
