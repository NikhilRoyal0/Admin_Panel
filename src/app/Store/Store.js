import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";
import UserReducer from "../Slices/usersSlice";

const Store = configureStore({
  reducer: {
    menu: menuReducer,
    Users:UserReducer,
  },
});

export default Store;
