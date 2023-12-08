import { createSlice } from "@reduxjs/toolkit";

const initialState = { isCreatedExpenseCategory: false, createdExpenseCategory: {} };

export const createExpenseCategorySlice = createSlice({
  name: "createExpenseCategory",
  initialState,
  reducers: {
    createExpenseCategoryRequest: (state) => {
      return {
        isCreatedExpenseCategory: false,
        loading: true,
      };
    },
    createExpenseCategorySuccess: (state, action) => {
      return {
        isCreatedExpenseCategory: true,
        loading: false,
        createdExpenseCategory: action.payload,
      };
    },
    createExpenseCategoryFail: (state, action) => {
      return {
        isCreatedExpenseCategory: false,
        loading: false,
        error: action.payload,
      };
    },
    createExpenseCategoryReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  createExpenseCategoryRequest,
  createExpenseCategorySuccess,
  createExpenseCategoryFail,
  createExpenseCategoryReset,
  reducer,
} = createExpenseCategorySlice.actions;

export default createExpenseCategorySlice.reducer;
