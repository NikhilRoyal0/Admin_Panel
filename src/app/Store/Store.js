import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";
import UserReducer from "../Slices/usersSlice";
import BranchReducer from "../Slices/branchSlice";
import StudentReducer from  "../Slices/studentSlice";
import rolesReducer from "../Slices/roleSlice";
import CountReducer from "../Slices/countSlice";

const Store = configureStore({
  reducer: {
    menu: menuReducer,
    Users: UserReducer,
    Branch: BranchReducer,
    Student: StudentReducer,
    roles: rolesReducer,
    Count: CountReducer,
  },
});

export default Store;
