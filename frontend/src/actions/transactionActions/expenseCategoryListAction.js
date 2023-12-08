import axios from "axios";

import {
  expenseCategoryListRequest,
  expenseCategoryListSuccess,
  expenseCategoryListFail,
  expenseCategoryListReset,
  reducer,
} from "../../slicers/transactionSlicers/expenseCategoryListSlice";

export const getExpenseCategoryList =
  () =>
  async (dispatch, getState) => {
    try {
      dispatch(expenseCategoryListRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/transactions/expense_category/user_list/`, config);

      dispatch(expenseCategoryListSuccess(data));
    } catch (error) {
      dispatch(
        expenseCategoryListFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
