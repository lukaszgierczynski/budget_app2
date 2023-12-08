import { createSlice } from "@reduxjs/toolkit";

const initialState = { isCreatedTransaction: false, createdTransaction: {} };

export const createTransactionSlice = createSlice({
  name: "createTransaction",
  initialState,
  reducers: {
    createTransactionRequest: (state) => {
      return {
        isCreatedTransaction: false,
        loading: true,
      };
    },
    createTransactionSuccess: (state, action) => {
      return {
        isCreatedTransaction: true,
        loading: false,
        createdTransaction: action.payload,
      };
    },
    createTransactionFail: (state, action) => {
      return {
        isCreatedTransaction: false,
        loading: false,
        error: action.payload,
      };
    },
    createTransactionReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  createTransactionRequest,
  createTransactionSuccess,
  createTransactionFail,
  createTransactionReset,
  reducer,
} = createTransactionSlice.actions;

export default createTransactionSlice.reducer;
