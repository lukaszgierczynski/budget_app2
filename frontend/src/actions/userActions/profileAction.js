import axios from "axios";

import {
  profileRequest,
  profileSuccess,
  profileFail,
  reducer,
} from "../../slicers/userSlicers/profileSlice";

export const getProfile =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(profileRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/profile`, config);

      dispatch(profileSuccess(data));
    } catch (error) {
      dispatch(
        profileFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
