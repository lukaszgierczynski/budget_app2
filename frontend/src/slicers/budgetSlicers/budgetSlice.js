import { createSlice } from "@reduxjs/toolkit";

const initialState = { isBudget: false, budget: {} };

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    budgetRequest: (state) => {
      return {
        isBudget: false,
        loading: true,
        budget: [],
      };
    },
    budgetSuccess: (state, action) => {
      return {
        isBudget: true,
        loading: false,
        budget: action.payload,
      };
    },
    budgetFail: (state, action) => {
      return {
        isBudget: false,
        loading: false,
        error: action.payload,
      };
    },
    budgetReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { budgetRequest, budgetSuccess, budgetFail, budgetReset, reducer } =
  budgetSlice.actions;

export default budgetSlice.reducer;
