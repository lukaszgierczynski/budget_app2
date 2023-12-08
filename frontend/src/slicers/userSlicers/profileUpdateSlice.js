import { createSlice } from "@reduxjs/toolkit";

const initialState = { isUpdatedProfile: false, updatedProfile: {} };

export const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {
    updateProfileRequest: (state) => {
      return {
        isUpdatedProfile: false,
        loading: true,
        updatedProfile: [],
      };
    },
    updateProfileSuccess: (state, action) => {
      return {
        isUpdatedProfile: true,
        loading: false,
        updatedProfile: action.payload,
      };
    },
    updateProfileFail: (state, action) => {
      return {
        isUpdatedProfile: false,
        loading: false,
        error: action.payload,
      };
    },
    updateProfileReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

export const {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updateProfileReset,
  reducer,
} = updateProfileSlice.actions;

export default updateProfileSlice.reducer;
