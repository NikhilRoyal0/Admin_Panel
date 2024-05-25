import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const UsersSlice = createSlice({
  name: "Users",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setUsersData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setUsersLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUsersError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setUsersData, setUsersLoading, setUsersError } =
  UsersSlice.actions;

export const fetchUsersData = () => async (dispatch) => {
  try {
    dispatch(setUsersLoading());
    
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "users/all/getAllUsers",
      {
        headers: {
          "api-token": apiToken, 
        },
      }
    );
    dispatch(setUsersData(response.data));
  } catch (error) {
    dispatch(setUsersError(error.message));
  }
};

export const AddUserData = (newUserData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "users/register",
      newUserData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken, 
        },
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const selectUsersData = (state) => state.Users.data;
export const selectUsersLoading = (state) => state.Users.isLoading;
export const selectUsersError = (state) => state.Users.error;

export default UsersSlice.reducer;
