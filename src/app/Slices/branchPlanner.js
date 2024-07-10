import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const branchPlannerSlice = createSlice({
  name: "branchPlanner",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setbranchPlannerData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setbranchPlannerLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setbranchPlannerError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatebranchPlanner: (state, action) => {
      const updatedbranchPlanner = action.payload;
      state.data = state.data.map((branchPlanner) =>
        branchPlanner.bank_id === updatedbranchPlanner.bank_id ? updatedbranchPlanner : branchPlanner
      );
    },
    deletebranchPlanner: (state, action) => {
      const selectedplanerId = action.payload;
      state.data = state.data.filter(
        (branchPlanner) => branchPlanner.bank_id !== selectedplanerId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setbranchPlannerData, setbranchPlannerLoading, setbranchPlannerError, updatebranchPlanner, deletebranchPlanner } =
  branchPlannerSlice.actions;

export const fetchbranchPlannerData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "branch/plan/all/getAllBranchPlan",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setbranchPlannerData(response.data));
  } catch (error) {
    dispatch(setbranchPlannerError(error.message));
    console.error("Error fetching branch plan data:", error);
  }
};

export const AddbranchPlannerData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "branch/plan/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );
    dispatch(fetchbranchPlannerData());
    return response.data;
  } catch (error) {
    console.error("Error adding branch plan:", error);
  }
};

export const updatebranchPlannerData = (planerId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `branch/plan/update/${planerId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedbranchPlannerData = response.data;

    dispatch(updatebranchPlanner(updatedbranchPlannerData));
    dispatch(fetchbranchPlannerData());

  } catch (error) {
    console.error("Error updating branch plan:", error);
  }
};

export const deletebranchPlannerData = (planerId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `branch/plan/delete/${planerId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletebranchPlanner(deletebranchPlannerData));
    dispatch(fetchbranchPlannerData());

  } catch (error) {
    console.error("Error deleting branch plan:", error);
  }
};

export const selectbranchPlannerData = (state) => state.branchPlanner.data;
export const selectbranchPlannerLoading = (state) => state.branchPlanner.isLoading;
export const selectbranchPlannerError = (state) => state.branchPlanner.error;

export default branchPlannerSlice.reducer;
