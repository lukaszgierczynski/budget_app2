import axios from "axios";

import {
  createBudgetRequest,
  createBudgetSuccess,
  createBudgetFail,
  createBudgetReset,
  reducer,
} from "../../slicers/budgetSlicers/budgetCreateSlice";

export const createBudget =
  (budget) =>
  async (dispatch, getState) => {
    try {
      dispatch(createBudgetRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/budgets/`, budget, config);

      dispatch(createBudgetSuccess(data));

    } catch (error) {
      dispatch(
        createBudgetFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
