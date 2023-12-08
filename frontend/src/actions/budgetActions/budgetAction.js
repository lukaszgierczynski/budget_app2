import axios from "axios";

import {
  budgetRequest,
  budgetSuccess,
  budgetFail,
  reducer,
} from "../../slicers/budgetSlicers/budgetSlice";

export const getBudget =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(budgetRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/budgets/${id}`, config);

      dispatch(budgetSuccess(data));
    } catch (error) {
      dispatch(
        budgetFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
