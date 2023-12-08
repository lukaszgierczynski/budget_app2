import { createSlice } from "@reduxjs/toolkit";

const initialState = { isExpenseCategoryList: false, expenseCategoryList: [] };

export const expenseCategoryListSlice = createSlice({
  name: "expenseCategoryList",
  initialState,
  reducers: {
    expenseCategoryListRequest: (state) => {
      return {
        isExpenseCategoryList: false,
        loading: true,
        expenseCategoryList: [],
      };
    },
    expenseCategoryListSuccess: (state, action) => {
      return {
        isExpenseCategoryList: true,
        loading: false,
        expenseCategoryList: action.payload,
      };
    },
    expenseCategoryListFail: (state, action) => {
      return {
        isExpenseCategoryList: false,
        loading: false,
        error: action.payload,
      };
    },
    expenseCategoryListReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  expenseCategoryListRequest,
  expenseCategoryListSuccess,
  expenseCategoryListFail,
  expenseCategoryListReset,
  reducer,
} = expenseCategoryListSlice.actions;

export default expenseCategoryListSlice.reducer;
