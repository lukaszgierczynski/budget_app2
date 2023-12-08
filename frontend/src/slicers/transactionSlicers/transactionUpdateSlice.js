import { createSlice } from "@reduxjs/toolkit";

const initialState = { isUpdatedTransaction: false, updatedTransaction: {} };

export const updateTransactionSlice = createSlice({
  name: "updateTransaction",
  initialState,
  reducers: {
    updateTransactionRequest: (state) => {
      return {
        isUpdatedTransaction: false,
        loading: true,
        updatedTransaction: [],
      };
    },
    updateTransactionSuccess: (state, action) => {
      return {
        isUpdatedTransaction: true,
        loading: false,
        updatedTransaction: action.payload,
      };
    },
    updateTransactionFail: (state, action) => {
      return {
        isUpdatedTransaction: false,
        loading: false,
        error: action.payload,
      };
    },
    updateTransactionReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  updateTransactionRequest,
  updateTransactionSuccess,
  updateTransactionFail,
  updateTransactionReset,
  reducer,
} = updateTransactionSlice.actions;

export default updateTransactionSlice.reducer;
