import { createSlice } from "@reduxjs/toolkit";

const initialState = { isUpdatedBudget: false, updatedBudget: {} };

export const updateBudgetSlice = createSlice({
  name: "updateBudget",
  initialState,
  reducers: {
    updateBudgetRequest: (state) => {
      return {
        isUpdatedBudget: false,
        loading: true,
        updatedBudget: [],
      };
    },
    updateBudgetSuccess: (state, action) => {
      return {
        isUpdatedBudget: true,
        loading: false,
        updatedBudget: action.payload,
      };
    },
    updateBudgetFail: (state, action) => {
      return {
        isUpdatedBudget: false,
        loading: false,
        error: action.payload,
      };
    },
    updateBudgetReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  updateBudgetRequest,
  updateBudgetSuccess,
  updateBudgetFail,
  updateBudgetReset,
  reducer,
} = updateBudgetSlice.actions;

export default updateBudgetSlice.reducer;
