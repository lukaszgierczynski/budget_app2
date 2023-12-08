import { createSlice } from "@reduxjs/toolkit";

const initialState = { };

export const deleteTransactionSlice = createSlice({
  name: "deleteTransaction",
  initialState,
  reducers: {
    deleteTransactionRequest: (state) => {
      return {
        loading: true,
      };
    },
    deleteTransactionSuccess: (state, action) => {
      return {
        loading: false,
        success: true,
      };
    },
    deleteTransactionFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    deleteTransactionReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  deleteTransactionRequest,
  deleteTransactionSuccess,
  deleteTransactionFail,
  deleteTransactionReset,
  reducer,
} = deleteTransactionSlice.actions;

export default deleteTransactionSlice.reducer;
