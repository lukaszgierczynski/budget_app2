import axios from "axios";

import {
  updateTransactionRequest,
  updateTransactionSuccess,
  updateTransactionFail,
  updateTransactionReset,
  reducer,
} from "../../slicers/transactionSlicers/transactionUpdateSlice";

import { transactionSuccess } from "../../slicers/transactionSlicers/transactionSlice";

export const updateTransaction =
  (transaction) =>
  async (dispatch, getState) => {
    try {
      dispatch(updateTransactionRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(`/api/transactions/${transaction._id}/`, transaction, config);

      dispatch(updateTransactionSuccess(data));
      dispatch(transactionSuccess(data));

    } catch (error) {
      dispatch(
        updateTransactionFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
