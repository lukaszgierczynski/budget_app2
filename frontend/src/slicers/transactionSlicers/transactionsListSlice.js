import { createSlice } from "@reduxjs/toolkit";

const initialState = { transactions: [] };

export const transactionsListSlice = createSlice({
  name: "transactionsList",
  initialState,
  reducers: {
    transactionsListRequest: (state) => {
      return {
        loading: true,
        transactions: [],
      };
    },
    transactionsListSuccess: (state, action) => {
      return {
        loading: false,
        transactions: action.payload.results,
        page: action.payload.page,
        pages: action.payload.num_pages,
      };
    },
    transactionsListFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    transactionsListReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { transactionsListRequest, transactionsListSuccess, transactionsListFail, transactionsListReset, reducer } =
  transactionsListSlice.actions;

export default transactionsListSlice.reducer;
