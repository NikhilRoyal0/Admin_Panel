import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setleadData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setleadLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setleadError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatelead: (state, action) => {
      const updatedlead = action.payload;
      state.data = state.data.map((lead) =>
        lead.lead_id === updatedlead.lead_id ? updatedlead : lead
      );
    },
    deletelead: (state, action) => {
      const deletedleadId = action.payload;
      state.data = state.data.filter((lead) => lead.lead_id !== deletedleadId);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setleadData,
  setleadLoading,
  setleadError,
  updatelead,
  deletelead,
} = leadSlice.actions;

export const fetchleadData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "leads/all/getAllLeads",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setleadData(response.data));
  } catch (error) {
    dispatch(setleadError(error.message));
    console.error("Error fetching lead data:", error);
  }
};

export const AddleadData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "leads/new",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );


    dispatch(fetchleadData());

    return response.data;
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error; 
  }
};


export const updateleadData = (lead_id, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `leads/update/${lead_id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedleadData = response.data;

    dispatch(updatelead(updatedleadData));
    dispatch(fetchleadData());
  } catch (error) {
    console.error("Error updating lead:", error);
  }
};

export const deleteleadData = (lead_id) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `leads/delete/${lead_id}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletelead(lead_id));
    dispatch(fetchleadData());
  } catch (error) {
    console.error("Error deleting lead:", error);
  }
};

export const selectleadData = (state) => state.lead.data;
export const selectleadLoading = (state) => state.lead.isLoading;
export const selectleadError = (state) => state.lead.error;

export default leadSlice.reducer;
