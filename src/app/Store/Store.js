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
import categoryReducer from "../Slices/categorySlice";
import templeteReducer from "../Slices/templete";
import inquiryReducer from "../Slices/inquirySlice";
import purchaseReducer from "../Slices/purchaseSlice";
import studentWalletReducer from "../Slices/studentWalletSlice";
import userWalletReducer from "../Slices/userWalletSlice";
import leadReducer from "../Slices/leadSlice";
import referenceReducer from "../Slices/referenceSlice";
import invoiceReducer from "../Slices/invoiceSlice";
import moduleReducer from "../Slices/moduleSlice";

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
    category: categoryReducer,
    templete: templeteReducer,
    inquiry: inquiryReducer,
    purchase: purchaseReducer,
    studentWallet: studentWalletReducer,
    userWallet: userWalletReducer,
    lead: leadReducer,
    reference: referenceReducer,
    invoice: invoiceReducer,
    module: moduleReducer,
  },
});

export default Store;
