import axios from "axios";

import {
  budgetsListRequest,
  budgetsListSuccess,
  budgetsListFail,
  reducer,
} from "../../slicers/budgetSlicers/budgetsListSlice";

export const getBudgetsList =
  (new_page) =>
  async (dispatch, getState) => {
    try {
      dispatch(budgetsListRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(`/api/budgets/${new_page}`, config);

      dispatch(budgetsListSuccess(data));
    } catch (error) {
      dispatch(
        budgetsListFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
