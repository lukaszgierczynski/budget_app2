import axios from "axios";

import {
  registerUserRequest,
  registerUserSuccess,
  registerUserFail,
  registerUserReset,
  reducer,
} from "../../slicers/userSlicers/userRegisterSlice";


export const registerUser =
  (user) =>
  async (dispatch, getState) => {
    try {
      dispatch(registerUserRequest());

      const config = {
        headers: {
            "Content-type": "application/json",
        },
    };

    const { data } = await axios.post(
        "/api/users/register/",
        user,
        config
    );

      dispatch(registerUserSuccess(data));

    } catch (error) {
      dispatch(registerUserFail(error.response ? error.response.data : error.message));
    }
  };
