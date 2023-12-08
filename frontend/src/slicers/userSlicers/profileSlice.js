import { createSlice } from "@reduxjs/toolkit";

const initialState = { isProfile: false, profile: {} };

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileRequest: (state) => {
      return {
        isProfile: false,
        loading: true,
        profile: [],
      };
    },
    profileSuccess: (state, action) => {
      return {
        isProfile: true,
        loading: false,
        profile: action.payload,
      };
    },
    profileFail: (state, action) => {
      return {
        isProfile: false,
        loading: false,
        error: action.payload,
      };
    },
    profileReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const { profileRequest, profileSuccess, profileFail, profileReset, reducer } =
  profileSlice.actions;

export default profileSlice.reducer;
