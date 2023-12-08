import axios from "axios";

import {
  transactionsListRequest,
  transactionsListSuccess,
  transactionsListFail,
  reducer,
} from "../../slicers/transactionSlicers/transactionsListSlice";

export const getTransactionsList =
  (new_page) =>
  async (dispatch, getState) => {
    try {
      dispatch(transactionsListRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(`/api/transactions/${new_page}`, config);

      dispatch(transactionsListSuccess(data));
    } catch (error) {
      dispatch(
        transactionsListFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
