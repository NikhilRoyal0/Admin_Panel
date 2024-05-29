import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";
import UserReducer from "../Slices/usersSlice";
import BranchReducer from "../Slices/branchSlice";
import StudentReducer from "../Slices/studentSlice";
import rolesReducer from "../Slices/roleSlice";
import CountReducer from "../Slices/countSlice";
import branchPlannerReducer from "../Slices/branchPlanner";
import CertificateReducer from "../Slices/certificateSlice";
import CourseReducer from "../Slices/courseSlice";

const Store = configureStore({
  reducer: {
    menu: menuReducer,
    Users: UserReducer,
    Branch: BranchReducer,
    Student: StudentReducer,
    roles: rolesReducer,
    Count: CountReducer,
    branchPlanner: branchPlannerReducer,
    Certificate: CertificateReducer,
    course: CourseReducer,
  },
});

export default Store;
