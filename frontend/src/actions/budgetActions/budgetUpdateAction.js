import axios from "axios";

import {
  updateBudgetRequest,
  updateBudgetSuccess,
  updateBudgetFail,
  updateBudgetReset,
  reducer,
} from "../../slicers/budgetSlicers/budgetUpdateSlice";

//import { budgetSuccess } from "../../slicers/budgetSlicers/budgetSlice";

export const updateBudget =
  (budget) =>
  async (dispatch, getState) => {
    try {
      dispatch(updateBudgetRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(`/api/budgets/${budget._id}/`, budget, config);

      dispatch(updateBudgetSuccess(data));
      //dispatch(budgetSuccess(data));

    } catch (error) {
      dispatch(
        updateBudgetFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
