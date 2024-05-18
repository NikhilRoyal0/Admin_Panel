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
      state.data = state.data.map((Student) =>
        Student.student_id === updatedStudent.student_id ? updatedStudent : Student
      );
    },
    deleteStudent: (state, action) => {
      const selectedstudent_id = action.payload;
      state.data = state.data.filter(
        (Student) => Student.selectedstudent_id !== selectedstudent_id
      );
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setStudentData, setStudentLoading, setStudentError, updateStudent, deleteStudent } =
  StudentSlice.actions;

export const fetchStudentData = () => async (dispatch) => {
  try {
    dispatch(setStudentLoading());
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "students/all/getAllStudents"
    );
    dispatch(setStudentData(response.data));
  } catch (error) {
    dispatch(setStudentError(error.message));
    console.error("Error fetching Student  data:", error);
  }
};

export const AddStudentData = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "students/register",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", response.data);
    dispatch(fetchStudentData());
  } catch (error) {
    console.error("Error adding Student :", error);
  }
};

export const updateStudentData = (student_id, formData) => async (dispatch) => {
  try {
    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `students/update/${student_id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedStudentData = response.data;

    dispatch(updateStudent(updatedStudentData));
  } catch (error) {
    console.error("Error updating Student :", error);
  }
};

export const deleteStudentData = (student_id) => async (dispatch) => {
  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + `students/delete/${student_id}`
    );

    dispatch(deleteStudent(deleteStudentData));
  } catch (error) {
    console.error("Error deleting Student :", error);
  }
};

export const selectStudentData = (state) => state.Student.data;
export const selectStudentLoading = (state) => state.Student.isLoading;
export const selectStudentError = (state) => state.Student.error;

export default StudentSlice.reducer;
