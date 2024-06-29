import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CountSlice = createSlice({
  name: "Count",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCountData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setCountLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCountError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setCountData, setCountLoading, setCountError } =
  CountSlice.actions;

export const fetchCountData = () => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "count/getAllCounts",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setCountData(response.data));
  } catch (error) {
    dispatch(setCountError(error.message));
  }
};


export const selectCountData = (state) => state.Count.data;
export const selectCountLoading = (state) => state.Count.isLoading;
export const selectCountError = (state) => state.Count.error;

export default CountSlice.reducer;
