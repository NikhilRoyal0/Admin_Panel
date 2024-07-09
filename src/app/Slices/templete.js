import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const templeteSlice = createSlice({
  name: "templete",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    settempleteData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    settempleteLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    settempleteError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatetemplete: (state, action) => {
      const updatedtemplete = action.payload;
      state.data = state.data.map((templete) =>
        templete.templeteId === updatedtemplete.templeteId ? updatedtemplete : templete
      );
    },
    deletetemplete: (state, action) => {
      const selectedtempleteId = action.payload;
      state.data = state.data.filter(
        (templete) => templete.templeteId !== selectedtempleteId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { settempleteData, settempleteLoading, settempleteError } =
  templeteSlice.actions;

export const fetchtempleteData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "certificate/all/getAllCertificateTemplete",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(settempleteData(response.data));
  } catch (error) {
    dispatch(settempleteError(error.message));
  }
};

export const AddtempleteData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "certificate/templete/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchtempleteData());

  } catch (error) {
    console.error("Error:", error);
  }
};

export const updatetempleteData = (templeteId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `certificate/templete/update/${templeteId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedtempleteData = response.data;

    dispatch(updatetemplete(updatedtempleteData));
    dispatch(fetchtempleteData());

  } catch (error) {
    console.error("Error updating templete:", error);
  }
};

export const deletetempleteData = (templeteId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `certificate/templete/delete/${templeteId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletetemplete(deletetempleteData));
    dispatch(fetchtempleteData());

  } catch (error) {
    console.error("Error deleting templete:", error);
  }
};


export const selecttempleteData = (state) => state.templete.data;
export const selecttempleteLoading = (state) => state.templete.isLoading;
export const selecttempleteError = (state) => state.templete.error;

export default templeteSlice.reducer;
