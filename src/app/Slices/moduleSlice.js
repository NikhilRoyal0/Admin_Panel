import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const moduleSlice = createSlice({
  name: "module",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setmoduleData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setmoduleLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setmoduleError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatemodule: (state, action) => {
      const updatedmodule = action.payload;
      state.data = state.data.map((module) =>
        module.moduleId === updatedmodule.moduleId ? updatedmodule : module
      );
    },
    deletemodule: (state, action) => {
      const selectedmoduleId = action.payload;
      state.data = state.data.filter(
        (module) => module.moduleId !== selectedmoduleId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setmoduleData, setmoduleLoading, setmoduleError } =
  moduleSlice.actions;

export const fetchmoduleData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "modules/all/getAllmodule",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setmoduleData(response.data));
  } catch (error) {
    dispatch(setmoduleError(error.message));
  }
};

export const AddmoduleData = (newmoduleData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "modules/add",
      newmoduleData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    dispatch(fetchmoduleData());
    return response.data; 


  } catch (error) {
    console.error("Error:", error);
  }
};

export const updatemoduleData = (moduleId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `modules/update/${moduleId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedmoduleData = response.data;

    dispatch(updatemodule(updatedmoduleData));
    dispatch(fetchmoduleData());

  } catch (error) {
    console.error("Error updating module:", error);
  }
};

export const deletemoduleData = (moduleId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `modules/delete/${moduleId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletemodule(deletemoduleData));
    dispatch(fetchmoduleData());

  } catch (error) {
    console.error("Error deleting module:", error);
  }
};


export const selectmoduleData = (state) => state.module.data;
export const selectmoduleLoading = (state) => state.module.isLoading;
export const selectmoduleError = (state) => state.module.error;

export default moduleSlice.reducer;
