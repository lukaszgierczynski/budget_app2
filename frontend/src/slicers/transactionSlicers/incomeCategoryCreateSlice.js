import { createSlice } from "@reduxjs/toolkit";

const initialState = { isCreatedIncomeCategory: false, createdIncomeCategory: {} };

export const createIncomeCategorySlice = createSlice({
  name: "createIncomeCategory",
  initialState,
  reducers: {
    createIncomeCategoryRequest: (state) => {
      return {
        isCreatedIncomeCategory: false,
        loading: true,
      };
    },
    createIncomeCategorySuccess: (state, action) => {
      return {
        isCreatedIncomeCategory: true,
        loading: false,
        createdIncomeCategory: action.payload,
      };
    },
    createIncomeCategoryFail: (state, action) => {
      return {
        isCreatedIncomeCategory: false,
        loading: false,
        error: action.payload,
      };
    },
    createIncomeCategoryReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  createIncomeCategoryRequest,
  createIncomeCategorySuccess,
  createIncomeCategoryFail,
  createIncomeCategoryReset,
  reducer,
} = createIncomeCategorySlice.actions;

export default createIncomeCategorySlice.reducer;
