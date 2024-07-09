import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setcourseData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setcourseLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setcourseError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatecourse: (state, action) => {
      const updatedcourse = action.payload;
      state.data = state.data.map((course) =>
        course.courseId === updatedcourse.courseId ? updatedcourse : course
      );
    },
    deletecourse: (state, action) => {
      const courseIdToDelete = action.payload;
      state.data = state.data.filter(course => course.courseId !== courseIdToDelete);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setcourseData,
  setcourseLoading,
  setcourseError,
  updatecourse,
  deletecourse,
} = courseSlice.actions;

export const fetchcourseData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");
    const response = await axios.get(import.meta.env.VITE_BASE_URL + "courses/all/getAllcourses", {
      headers: {
        "api-token": apiToken,
      },
    });
    dispatch(setcourseData(response.data));
  } catch (error) {
    dispatch(setcourseError(error.message));
  }
};

export const AddcourseData = (formData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(import.meta.env.VITE_BASE_URL + 'courses/add',
      formData, {
      headers: {
        'Content-Type': 'application/json',
        "api-token": apiToken,
      },
    });
    dispatch(fetchcourseData());
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const updatecourseData = (updatedFormData, courseId) => async (dispatch) => {
  try {

    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(import.meta.env.VITE_BASE_URL + `courses/update/${courseId}`,
      updatedFormData,
      {
        headers: {
          'Content-Type': 'application/json',
          "api-token": apiToken,
        },
      }
    );

    const updatedcourseData = response.data;

    dispatch(updatecourse(updatedcourseData));
    dispatch(fetchcourseData());

  } catch (error) {
    console.error('Error:', error);
  }
}


export const deletecourseData = (courseId) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(import.meta.env.VITE_BASE_URL + `courses/delete/${courseId}`, {
      headers: {
        "api-token": apiToken,
      },
    });

    dispatch(deletecourse(courseId));
    dispatch(fetchcourseData());

  } catch (error) {
    console.error('Error:', error);
  }
};

export const selectcourseData = (state) => state.course.data;
export const selectcourseLoading = (state) => state.course.isLoading;
export const selectcourseError = (state) => state.course.error;

export default courseSlice.reducer;
