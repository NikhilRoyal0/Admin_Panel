import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const referenceSlice = createSlice({
  name: "reference",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setreferenceData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setreferenceLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setreferenceError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatereference: (state, action) => {
      const updatedreference = action.payload;
      state.data = state.data.map((reference) =>
        reference.referenceId === updatedreference.referenceId ? updatedreference : reference
      );
    },
    deletereference: (state, action) => {
      const selectedreferenceId = action.payload;
      state.data = state.data.filter(
        (reference) => reference.referenceId !== selectedreferenceId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setreferenceData, setreferenceLoading, setreferenceError } =
  referenceSlice.actions;

export const fetchreferenceData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "reference/all/getAllreference",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setreferenceData(response.data));
  } catch (error) {
    dispatch(setreferenceError(error.message));
  }
};

export const AddreferenceData = (newReferenceData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "reference/add",
      newReferenceData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchreferenceData());
    return response.data; 


  } catch (error) {
    console.error("Error:", error);
  }
};

export const updatereferenceData = (referenceId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `reference/update/${referenceId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedreferenceData = response.data;

    dispatch(updatereference(updatedreferenceData));
    dispatch(fetchreferenceData());

  } catch (error) {
    console.error("Error updating reference:", error);
  }
};

export const deletereferenceData = (referenceId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `reference/delete/${referenceId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletereference(deletereferenceData));
    dispatch(fetchreferenceData());

  } catch (error) {
    console.error("Error deleting reference:", error);
  }
};


export const selectreferenceData = (state) => state.reference.data;
export const selectreferenceLoading = (state) => state.reference.isLoading;
export const selectreferenceError = (state) => state.reference.error;

export default referenceSlice.reducer;
