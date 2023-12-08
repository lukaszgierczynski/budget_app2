import { logout } from "../../slicers/userSlicers/userLoginSlice";

const logoutAction = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: 'logout' })
    dispatch(logout());
};

export default logoutAction;
