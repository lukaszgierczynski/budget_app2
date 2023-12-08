import { createSlice } from "@reduxjs/toolkit";

const initialState = { isTransaction: false, transaction: {} };

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    transactionRequest: (state) => {
      return {
        isTransaction: false,
        loading: true,
        transaction: [],
      };
    },
    transactionSuccess: (state, action) => {
      return {
        isTransaction: true,
        loading: false,
        transaction: action.payload,
      };
    },
    transactionFail: (state, action) => {
      return {
        isTransaction: false,
        loading: false,
        error: action.payload,
      };
    },
    transactionReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { transactionRequest, transactionSuccess, transactionFail, transactionReset, reducer } =
  transactionSlice.actions;

export default transactionSlice.reducer;
