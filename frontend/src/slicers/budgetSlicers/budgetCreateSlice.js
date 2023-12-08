import { createSlice } from "@reduxjs/toolkit";

const initialState = { isCreatedBudget: false, createdBudget: {} };

export const createBudgetSlice = createSlice({
  name: "createBudget",
  initialState,
  reducers: {
    createBudgetRequest: (state) => {
      return {
        isCreatedBudget: false,
        loading: true,
      };
    },
    createBudgetSuccess: (state, action) => {
      return {
        isCreatedBudget: true,
        loading: false,
        createdBudget: action.payload,
      };
    },
    createBudgetFail: (state, action) => {
      return {
        isCreatedBudget: false,
        loading: false,
        error: action.payload,
      };
    },
    createBudgetReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  createBudgetRequest,
  createBudgetSuccess,
  createBudgetFail,
  createBudgetReset,
  reducer,
} = createBudgetSlice.actions;

export default createBudgetSlice.reducer;
