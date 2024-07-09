import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const invoicelice = createSlice({
  name: "invoice",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setinvoiceData: (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
      state.error = null;
    },
    setinvoiceLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setinvoiceError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateinvoice: (state, action) => {
      const updatedinvoice = action.payload;
      state.data = state.data.map((invoice) =>
        invoice.invoice_id === updatedinvoice.invoice_id ? updatedinvoice : invoice
      );
    },
    deleteinvoice: (state, action) => {
      const deletedinvoiceId = action.payload;
      state.data = state.data.filter((invoice) => invoice.invoice_id !== deletedinvoiceId);
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setinvoiceData,
  setinvoiceLoading,
  setinvoiceError,
  updateinvoice,
  deleteinvoice,
} = invoicelice.actions;

export const fetchinvoiceData = () => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + "invoice/all/getAllinvoice",
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );
    dispatch(setinvoiceData(response.data));
  } catch (error) {
    dispatch(setinvoiceError(error.message));
    console.error("Error fetching invoice data:", error);
  }
};

export const AddinvoiceData = (invoiceDataToSend) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "invoice/new",
      invoiceDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );


    dispatch(fetchinvoiceData());

    return response.data;
  } catch (error) {
    console.error("Error adding invoice:", error);
    throw error; 
  }
};


export const updateinvoiceData = (lead_id, invoiceDataToSend) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    const response = await axios.put(
      import.meta.env.VITE_BASE_URL + `invoice/update/${lead_id}`,
      invoiceDataToSend,
      {
        headers: {
          "Content-Type": "application/json",
          "api-token": apiToken,
        },
      }
    );

    const updatedinvoiceData = response.data;

    dispatch(updateinvoice(updatedinvoiceData));
    dispatch(fetchinvoiceData());
  } catch (error) {
    console.error("Error updating invoice:", error);
  }
};

export const deleteinvoiceData = (invoice_id) => async (dispatch) => {
  try {
    const apiToken = sessionStorage.getItem("api-token");

    await axios.delete(
      import.meta.env.VITE_BASE_URL + `invoice/delete/${invoice_id}`,
      {
        headers: {
          "api-token": apiToken,
        },
      }
    );

    dispatch(deleteinvoice(invoice_id));
    dispatch(fetchinvoiceData());
  } catch (error) {
    console.error("Error deleting invoice:", error);
  }
};

export const selectinvoiceData = (state) => state.invoice.data;
export const selectinvoiceLoading = (state) => state.invoice.isLoading;
export const selectinvoiceError = (state) => state.invoice.error;

export default invoicelice.reducer;
