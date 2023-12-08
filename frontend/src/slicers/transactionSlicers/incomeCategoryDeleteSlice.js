import { createSlice } from "@reduxjs/toolkit";

const initialState = { };

export const deleteIncomeCategorySlice = createSlice({
  name: "deleteIncomeCategory",
  initialState,
  reducers: {
    deleteIncomeCategoryRequest: (state) => {
      return {
        loading: true,
      };
    },
    deleteIncomeCategorySuccess: (state, action) => {
      return {
        loading: false,
        success: true,
      };
    },
    deleteIncomeCategoryFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    deleteIncomeCategoryReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  deleteIncomeCategoryRequest,
  deleteIncomeCategorySuccess,
  deleteIncomeCategoryFail,
  deleteIncomeCategoryReset,
  reducer,
} = deleteIncomeCategorySlice.actions;

export default deleteIncomeCategorySlice.reducer;
