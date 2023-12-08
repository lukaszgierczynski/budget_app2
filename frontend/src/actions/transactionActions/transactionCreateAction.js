import axios from "axios";

import {
  createTransactionRequest,
  createTransactionSuccess,
  createTransactionFail,
  createTransactionReset,
  reducer,
} from "../../slicers/transactionSlicers/transactionCreateSlice";

import { transactionSuccess } from "../../slicers/transactionSlicers/transactionSlice";

export const createTransaction =
  (transaction) =>
  async (dispatch, getState) => {
    try {
      dispatch(createTransactionRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/transactions/`, transaction, config);

      dispatch(createTransactionSuccess(data));
      dispatch(transactionSuccess(data));

    } catch (error) {
      dispatch(
        createTransactionFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
