import { createSlice } from "@reduxjs/toolkit";

const initialState = { };

export const deleteBudgetSlice = createSlice({
  name: "deleteBudget",
  initialState,
  reducers: {
    deleteBudgetRequest: (state) => {
      return {
        loading: true,
      };
    },
    deleteBudgetSuccess: (state, action) => {
      return {
        loading: false,
        success: true,
      };
    },
    deleteBudgetFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    deleteBudgetReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  deleteBudgetRequest,
  deleteBudgetSuccess,
  deleteBudgetFail,
  deleteBudgetReset,
  reducer,
} = deleteBudgetSlice.actions;

export default deleteBudgetSlice.reducer;
