import axios from "axios";

import {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updateProfileReset,
  reducer,
} from "../../slicers/userSlicers/profileUpdateSlice";


export const updateProfile =
  (profile) =>
  async (dispatch, getState) => {
    try {
      dispatch(updateProfileRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(`/api/users/profile/update/`, profile, config);

      dispatch(updateProfileSuccess(data));

    } catch (error) {
      dispatch(
        updateProfileFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
