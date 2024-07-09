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
      const updatedRole = action.payload;
      state.data = state.data.map((role) =>
        role.roleId === updatedRole.roleId ? updatedRole : role
      );
    },
    deleteroles: (state, action) => {
      const roleIdToDelete = action.payload;
      state.data = state.data.filter(role => role.roleId !== roleIdToDelete);
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
    const apiToken = sessionStorage.getItem("api-token");

    dispatch(setrolesLoading());
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "roles/all/getAllRoles", {
      headers: {
        "api-token": apiToken,
      },
    });
    dispatch(setrolesData(response.data));
  } catch (error) {
    dispatch(setrolesError(error.message));
  }
};

export const addrolesData = ({ roleName, permissions, createdBy, createdOn, status }) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(import.meta.env.VITE_BASE_URL + 'roles/addRole', {
      roleName,
      permissions,
      createdBy,
      createdOn,
      status,
    }, {
      headers: {
        'Content-Type': 'application/json',
        "api-token": apiToken,
      },
    });
    dispatch(fetchrolesData());

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updaterolesData = ({ roleId, roleName, permissions, updatedOn }) => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(import.meta.env.VITE_BASE_URL + `roles/updateRole/${roleId}`,
      { roleName, permissions, updatedOn },
      {
        headers: {
          'Content-Type': 'application/json',
          "api-token": apiToken,
        },
      }
    );

    const updatedRoleData = response.data;

    dispatch(updateroles(updatedRoleData));
    dispatch(fetchrolesData());

  } catch (error) {
    console.error('Error:', error);
  }
}


export const deleterolesData = (roleId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(import.meta.env.VITE_BASE_URL + `roles/deleteRole/${roleId}`, {
      headers: {
        "api-token": apiToken,
      },
    });

    dispatch(deleteroles(roleId));
    dispatch(fetchrolesData());

  } catch (error) {
    console.error('Error:', error);
  }
};

export const selectrolesData = (state) => state.roles.data;
export const selectrolesLoading = (state) => state.roles.isLoading;
export const selectrolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
