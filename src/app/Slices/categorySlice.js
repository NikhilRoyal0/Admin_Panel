import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setcategoryData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setcategoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setcategoryError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatecategory: (state, action) => {
      const updatedcategory = action.payload;
      state.data = state.data.map((category) =>
        category.categoryId === updatedcategory.categoryId ? updatedcategory : category
      );
    },
    deletecategory: (state, action) => {
      const deletedcategoryId = action.payload;
      state.data = state.data.filter((category) => category.categoryId !== deletedcategoryId);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setcategoryData,
  setcategoryLoading,
  setcategoryError,
  updatecategory,
  deletecategory,
} = categorySlice.actions;

export const fetchcategoryData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "courses/all/getAllCourseCategory",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setcategoryData(response.data));
  } catch (error) {
    dispatch(setcategoryError(error.message));
    console.error("Error fetching category data:", error);
  }
};

export const AddcategoryData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "courses/categories/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );
    dispatch(fetchcategoryData());
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

export const updatecategoryData = (categoryId, formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `courses/categories/update/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedcategoryData = response.data;

    dispatch(updatecategory(updatedcategoryData));
    dispatch(fetchcategoryData());

  } catch (error) {
    console.error("Error updating category:", error);
  }
};

export const deletecategoryData = (categoryId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `courses/categories/delete/${categoryId}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deletecategory(categoryId));
    dispatch(fetchcategoryData());

  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

export const selectcategoryData = (state) => state.category.data;
export const selectcategoryLoading = (state) => state.category.isLoading;
export const selectcategoryError = (state) => state.category.error;

export default categorySlice.reducer;
