import axios from "axios";

import {
  graphTransactionsRequest,
  graphTransactionsSuccess,
  graphTransactionsFail,
  reducer,
} from "../../slicers/graphSlicers/graphTransactionsSlice";

export const getGraphTransactions =
  (query_params = "") =>
  async (dispatch, getState) => {
    try {
      dispatch(graphTransactionsRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(`/api/graphs/transactions${query_params}`, config);

      dispatch(graphTransactionsSuccess(data));
    } catch (error) {
      dispatch(
        graphTransactionsFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
