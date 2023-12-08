import { createSlice } from "@reduxjs/toolkit";

const initialState = { };

export const deleteExpenseCategorySlice = createSlice({
  name: "deleteExpenseCategory",
  initialState,
  reducers: {
    deleteExpenseCategoryRequest: (state) => {
      return {
        loading: true,
      };
    },
    deleteExpenseCategorySuccess: (state, action) => {
      return {
        loading: false,
        success: true,
      };
    },
    deleteExpenseCategoryFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    deleteExpenseCategoryReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  deleteExpenseCategoryRequest,
  deleteExpenseCategorySuccess,
  deleteExpenseCategoryFail,
  deleteExpenseCategoryReset,
  reducer,
} = deleteExpenseCategorySlice.actions;

export default deleteExpenseCategorySlice.reducer;
