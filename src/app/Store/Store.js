import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";

const Store = configureStore({
  reducer: {
    menuSlice: menuReducer,
  },
});

export default Store;
