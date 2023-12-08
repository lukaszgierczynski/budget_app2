import { createSlice } from "@reduxjs/toolkit";

const initialState = { areBudgets: false, budgets: [] };

export const budgetsListSlice = createSlice({
  name: "budgetsList",
  initialState,
  reducers: {
    budgetsListRequest: (state) => {
      return {
        areBudgets: false,
        loading: true,
        budgets: [],
      };
    },
    budgetsListSuccess: (state, action) => {
      return {
        areBudgets: true,
        loading: false,
        budgets: action.payload.results,
        page: action.payload.page,
        pages: action.payload.num_pages,
      };
    },
    budgetsListFail: (state, action) => {
      return {
        areBudgets: false,
        loading: false,
        error: action.payload,
      };
    },
    budgetsListReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { budgetsListRequest, budgetsListSuccess, budgetsListFail, budgetsListReset, reducer } =
  budgetsListSlice.actions;

export default budgetsListSlice.reducer;
