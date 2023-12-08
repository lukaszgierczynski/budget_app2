import axios from "axios";

import {
  budgetsAllRequest,
  budgetsAllSuccess,
  budgetsAllFail,
  reducer,
} from "../../slicers/budgetSlicers/budgetsAllSlice";

export const getBudgetsAll =
  () =>
  async (dispatch, getState) => {
    try {
      dispatch(budgetsAllRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(`/api/graphs/budgets-all/`, config);

      dispatch(budgetsAllSuccess(data));
    } catch (error) {
      dispatch(
        budgetsAllFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
