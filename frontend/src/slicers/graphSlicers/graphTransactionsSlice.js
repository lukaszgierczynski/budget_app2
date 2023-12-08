import { createSlice } from "@reduxjs/toolkit";

const initialState = { areTransactions: false, transactions: [] };

export const graphTransactionsSlice = createSlice({
  name: "graphTransactions",
  initialState,
  reducers: {
    graphTransactionsRequest: (state) => {
      return {
        areTransactions: false,
        loading: true,
        transactions: [],
      };
    },
    graphTransactionsSuccess: (state, action) => {
      return {
        areTransactions: true,
        loading: false,
        transactions: action.payload,
      };
    },
    graphTransactionsFail: (state, action) => {
      return {
        areTransactions: false,
        loading: false,
        error: action.payload,
      };
    },
    graphTransactionsReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { graphTransactionsRequest, graphTransactionsSuccess, graphTransactionsFail, graphTransactionsReset, reducer } =
graphTransactionsSlice.actions;

export default graphTransactionsSlice.reducer;
