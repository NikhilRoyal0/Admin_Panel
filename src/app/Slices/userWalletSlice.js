import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userWalletSlice = createSlice({
    name: "userWallet",
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setuserWalletData: (state, action) => {
            state.data = action.payload.data;
            state.isLoading = false;
            state.error = null;
        },
        setuserWalletLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        setuserWalletError: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateuserWallet: (state, action) => {
            const updateduserWallet = action.payload;
            state.data = state.data.map((userWallet) =>
                userWallet.trans_id === updateduserWallet.trans_id ? updateduserWallet : userWallet
            );
        },
    },
});

export const { setuserWalletData, setuserWalletLoading, setuserWalletError } =
    userWalletSlice.actions;

export const fetchuserWalletData = () => async (dispatch) => {
    try {

        const apiToken = sessionStorage.getItem("api-token");

        const response = await axios.get(
            import.meta.env.VITE_BASE_URL + "user/transaction/all/getAllWalletHistory",
            {
                headers: {
                    "api-token": apiToken,
                },
            }
        );
        dispatch(setuserWalletData(response.data));
    } catch (error) {
        dispatch(setuserWalletError(error.message));
    }
};

export const AdduserWalletData = (formData) => async (dispatch) => {
    try {
        const apiToken = sessionStorage.getItem("api-token");

        const response = await axios.post(
            import.meta.env.VITE_BASE_URL + "user/transaction/add",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-token": apiToken,
                },
            }
        );

        dispatch(fetchuserWalletData());

    } catch (error) {
        console.error("Error:", error);
    }
};

export const updateuserWalletData = (trans_id, formData) => async (dispatch) => {
    try {
        const apiToken = sessionStorage.getItem("api-token");

        const response = await axios.put(
            import.meta.env.VITE_BASE_URL + `user/transaction/update/${trans_id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-token": apiToken,
                },
            }
        );

        const updateduserWalletData = response.data;

        dispatch(updateuserWallet(updateduserWalletData));
        dispatch(fetchuserWalletData());

    } catch (error) {
        console.error("Error updating userWallet:", error);
    }
};


export const selectuserWalletData = (state) => state.userWallet.data;
export const selectuserWalletLoading = (state) => state.userWallet.isLoading;
export const selectuserWalletError = (state) => state.userWallet.error;

export default userWalletSlice.reducer;
