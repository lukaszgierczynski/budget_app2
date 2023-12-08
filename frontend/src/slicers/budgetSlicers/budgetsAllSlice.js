import { createSlice } from "@reduxjs/toolkit";

const initialState = { budgets: [] };

export const budgetsAllSlice = createSlice({
  name: "budgetsAll",
  initialState,
  reducers: {
    budgetsAllRequest: (state) => {
      return {
        areAllBudgets: false,
        loading: true,
        budgets: [],
      };
    },
    budgetsAllSuccess: (state, action) => {
      return {
        areAllBudgets: true,
        loading: false,
        budgets: action.payload,
      };
    },
    budgetsAllFail: (state, action) => {
      return {
        areAllBudgets: false,
        loading: false,
        error: action.payload,
      };
    },
    budgetsAllReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { budgetsAllRequest, budgetsAllSuccess, budgetsAllFail, budgetsAllReset, reducer } =
  budgetsAllSlice.actions;

export default budgetsAllSlice.reducer;
