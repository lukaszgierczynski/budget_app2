import axios from "axios";

import { loginRequest, loginSuccess, loginFail, logout, reducer } from "../../slicers/userSlicers/userLoginSlice";

export const login = (username, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());

        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users/login/",
            {username: username, password: password},
            config
        );
        
        dispatch(loginSuccess(data));

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch(loginFail(error.response && error.response.data.detail ? error.response.data.detail : error.message))
    }
};