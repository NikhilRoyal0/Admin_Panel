import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setrolesData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setrolesLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setrolesError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateroles: (state, action) => {
      const updatedroles = action.payload;
      state.data.map((roles) => roles.rolesId === updatedroles.rolesId);
    },
    deleteroles: (state, action) => {
      const rolesIdToDelete = action.payload;
      state.data = state.data.filter((roles) => roles.rolesId !== rolesIdToDelete);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setrolesData,
  setrolesLoading,
  setrolesError,
  updateroles,
  deleteroles,
} = rolesSlice.actions;

export const fetchrolesData = () => async (dispatch) => {
  try {
    dispatch(setrolesLoading());
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "feature/roles");
    dispatch(setrolesData(response.data));
  } catch (error) {
    dispatch(setrolesError(error.message));
  }
};

export const AddData = (form) => async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + 'feature/insertroles', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

export const updaterolesData = (rolesId, data) => async (dispatch) => {
  try {

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `feature/updateroles/${rolesId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const updatedrolesData = response.data;

    dispatch(updateroles(updatedrolesData));

  } catch (error) {
    console.error('Error:', error);
  }
}

export const deleterolesData = (rolesId, data) => async (dispatch) => {
  try {

    const response = await axios.delete(
      import.meta.env.VITE_BASE_URL + `feature/deleteroles/${rolesId}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const deleterolesData = response.data;

    dispatch(deleteroles(deleterolesData));

  } catch (error) {
    console.error('Error:', error);
  }
};



export const selectrolesData = (state) => state.roles.data;
export const selectrolesLoading = (state) => state.roles.isLoading;
export const selectrolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
