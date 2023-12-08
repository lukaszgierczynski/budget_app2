import axios from "axios";

import {
  deleteTransactionRequest,
  deleteTransactionSuccess,
  deleteTransactionFail,
  deleteTransactionReset,
  reducer,
} from "../../slicers/transactionSlicers/transactionDeleteSlice";


export const deleteTransaction =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteTransactionRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.delete(`/api/transactions/${id}/`, config);

      dispatch(deleteTransactionSuccess());

    } catch (error) {
      dispatch(
        deleteTransactionFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
