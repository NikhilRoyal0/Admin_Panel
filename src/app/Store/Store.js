import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";
import UserReducer from "../Slices/usersSlice";
import BranchReducer from "../Slices/branchSlice";
import StudentReducer from  "../Slices/studentSlice";

const Store = configureStore({
  reducer: {
    menu: menuReducer,
    Users: UserReducer,
    Branch: BranchReducer,
    Student: StudentReducer,
  },
});

export default Store;
