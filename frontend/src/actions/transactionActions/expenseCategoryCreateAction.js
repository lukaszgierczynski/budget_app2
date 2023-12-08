import axios from "axios";

import {
  createExpenseCategoryRequest,
  createExpenseCategorySuccess,
  createExpenseCategoryFail,
  createExpenseCategoryReset,
  reducer,
} from "../../slicers/transactionSlicers/expenseCategoryCreateSlice";

export const createExpenseCategory =
  (category) => async (dispatch, getState) => {
    try {
      console.log('createExpenseCategory');
      dispatch(createExpenseCategoryRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/transactions/expense_category/create/`,
        category,
        config
      );

      dispatch(createExpenseCategorySuccess(data));
    } catch (error) {
      dispatch(
        createExpenseCategoryFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
