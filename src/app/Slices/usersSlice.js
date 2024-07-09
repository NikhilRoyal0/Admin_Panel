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
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      state.data = state.data.map((User) =>
        User.userId === updatedUser.userId ? updatedUser : User
      );
    },
    deleteUser: (state, action) => {
      const selectedUserId = action.payload;
      state.data = state.data.filter(
        (User) => User.userId !== selectedUserId
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUsersData, setUsersLoading, setUsersError } =
  UsersSlice.actions;

export const fetchUsersData = () => async (dispatch) => {
  try {

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

    dispatch(fetchUsersData());

  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateUserData = (userId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `users/updateuser/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedUserData = response.data;

    dispatch(updateUser(updatedUserData));
    dispatch(fetchUsersData());

  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const deleteUserData = (userId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `users/deleteuser/${userId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deleteUser(deleteUserData));
    dispatch(fetchUsersData());

  } catch (error) {
    console.error("Error deleting user:", error);
  }
};


export const selectUsersData = (state) => state.Users.data;
export const selectUsersLoading = (state) => state.Users.isLoading;
export const selectUsersError = (state) => state.Users.error;

export default UsersSlice.reducer;
