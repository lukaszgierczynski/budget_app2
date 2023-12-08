import axios from "axios";

import {
  deleteExpenseCategoryRequest,
  deleteExpenseCategorySuccess,
  deleteExpenseCategoryFail,
  deleteExpenseCategoryReset,
  reducer,
} from "../../slicers/transactionSlicers/expenseCategoryDeleteSlice";


export const deleteExpenseCategory =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteExpenseCategoryRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.delete(`/api/transactions/expense_category/delete/${id}/`, config);

      dispatch(deleteExpenseCategorySuccess());

    } catch (error) {
      dispatch(
        deleteExpenseCategoryFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
