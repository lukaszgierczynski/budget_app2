import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    loginRequest: (state) => {
      return {
        loading: true,
      };
    },
    loginSuccess: (state, action) => {
      return {
        loading: false,
        userInfo: action.payload,
      };
    },
    loginFail: (state, action) => {
      return {
        loading: false,
        error: action.payload,
      };
    },
    logout: (state) => {
      return {};
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { loginRequest, loginSuccess, loginFail, logout, reducer } =
  userLoginSlice.actions;

export default userLoginSlice.reducer;
