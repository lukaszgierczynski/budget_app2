import axios from "axios";

import {
  deleteBudgetRequest,
  deleteBudgetSuccess,
  deleteBudgetFail,
  deleteBudgetReset,
  reducer,
} from "../../slicers/budgetSlicers/budgetDeleteSlice";


export const deleteBudget =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteBudgetRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.delete(`/api/budgets/${id}/`, config);

      dispatch(deleteBudgetSuccess());

    } catch (error) {
      dispatch(
        deleteBudgetFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
