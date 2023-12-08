import { createSlice } from "@reduxjs/toolkit";

const initialState = { isRegisteredUser: false, registeredUser: {} };

export const registerUserSlice = createSlice({
  name: "registerUser",
  initialState,
  reducers: {
    registerUserRequest: (state) => {
      return {
        isRegisteredUser: false,
        loading: true,
      };
    },
    registerUserSuccess: (state, action) => {
      return {
        isRegisteredUser: true,
        loading: false,
        registeredUser: action.payload,
      };
    },
    registerUserFail: (state, action) => {
      return {
        isRegisteredUser: false,
        loading: false,
        error: action.payload,
      };
    },
    registerUserReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  registerUserRequest,
  registerUserSuccess,
  registerUserFail,
  registerUserReset,
  reducer,
} = registerUserSlice.actions;

export default registerUserSlice.reducer;
