import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const StudentSlice = createSlice({
  name: "Student",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setStudentData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setStudentLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setStudentError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateStudent: (state, action) => {
      const updatedStudent = action.payload;
      state.data = state.data.map((student) =>
        student.student_id === updatedStudent.student_id ? updatedStudent : student
      );
    },
    deleteStudent: (state, action) => {
      const deletedStudentId = action.payload;
      state.data = state.data.filter((student) => student.student_id !== deletedStudentId);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setStudentData,
  setStudentLoading,
  setStudentError,
  updateStudent,
  deleteStudent,
} = StudentSlice.actions;

export const fetchStudentData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "students/all/getAllStudents",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setStudentData(response.data));
  } catch (error) {
    dispatch(setStudentError(error.message));
    console.error("Error fetching student data:", error);
  }
};

export const AddStudentData = (formData2) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "students/register",
      formData2,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );
    dispatch(fetchStudentData());
  } catch (error) {
    console.error("Error adding student:", error);
  }
};

export const updateStudentData = (student_id, updatedFormData) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `students/update/${student_id}`,
      updatedFormData,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedStudentData = response.data;

    dispatch(updateStudent(updatedStudentData));
    dispatch(fetchStudentData());

  } catch (error) {
    console.error("Error updating student:", error);
  }
};

export const deleteStudentData = (student_id) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `students/delete/${student_id}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deleteStudent(student_id));
    dispatch(fetchStudentData());

  } catch (error) {
    console.error("Error deleting student:", error);
  }
};

export const checkStudentExistence = (student_id) => async () => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `students/student/${student_id}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    return response.data.exists;
  } catch (error) {
    console.error("Error checking student existence:", error);
    return false;
  }
};

export const selectStudentData = (state) => state.Student.data;
export const selectStudentLoading = (state) => state.Student.isLoading;
export const selectStudentError = (state) => state.Student.error;

export default StudentSlice.reducer;
