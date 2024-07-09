import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setinquiryData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setinquiryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setinquiryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateinquiry: (state, action) => {
      const updatedinquiry = action.payload;
      state.data = state.data.map((inquiry) =>
        inquiry.inquiryId === updatedinquiry.inquiryId ? updatedinquiry : inquiry
      );
    },
    deleteinquiry: (state, action) => {
      const selectedinquiryId = action.payload;
      state.data = state.data.filter(
        (inquiry) => inquiry.inquiryId !== selectedinquiryId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setinquiryData, setinquiryLoading, setinquiryError } =
  inquirySlice.actions;

export const fetchinquiryData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "inquiry/all/getAllinquiry",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setinquiryData(response.data));
  } catch (error) {
    dispatch(setinquiryError(error.message));
  }
};

export const AddinquiryData = (newinquiryData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "inquiry/add",
      newinquiryData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchinquiryData());

  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateinquiryData = (inquiryId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `inquiry/update/${inquiryId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedinquiryData = response.data;

    dispatch(updateinquiry(updatedinquiryData));
    dispatch(fetchinquiryData());

  } catch (error) {
    console.error("Error updating inquiry:", error);
  }
};

export const deleteinquiryData = (inquiryId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `inquiry/delete/${inquiryId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deleteinquiry(deleteinquiryData));
    dispatch(fetchinquiryData());

  } catch (error) {
    console.error("Error deleting inquiry:", error);
  }
};


export const selectinquiryData = (state) => state.inquiry.data;
export const selectinquiryLoading = (state) => state.inquiry.isLoading;
export const selectinquiryError = (state) => state.inquiry.error;

export default inquirySlice.reducer;
