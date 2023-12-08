import { createSlice } from "@reduxjs/toolkit";

const initialState = { isIncomeCategoryList: false, incomeCategoryList: [] };

export const incomeCategoryListSlice = createSlice({
  name: "incomeCategoryList",
  initialState,
  reducers: {
    incomeCategoryListRequest: (state) => {
      return {
        isIncomeCategoryList: false,
        loading: true,
        incomeCategoryList: [],
      };
    },
    incomeCategoryListSuccess: (state, action) => {
      return {
        isIncomeCategoryList: true,
        loading: false,
        incomeCategoryList: action.payload,
      };
    },
    incomeCategoryListFail: (state, action) => {
      return {
        isIncomeCategoryList: false,
        loading: false,
        error: action.payload,
      };
    },
    incomeCategoryListReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  incomeCategoryListRequest,
  incomeCategoryListSuccess,
  incomeCategoryListFail,
  incomeCategoryListReset,
  reducer,
} = incomeCategoryListSlice.actions;

export default incomeCategoryListSlice.reducer;
