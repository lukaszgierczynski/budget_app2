import axios from "axios";

import {
  transactionRequest,
  transactionSuccess,
  transactionFail,
  reducer,
} from "../../slicers/transactionSlicers/transactionSlice";

export const getTransaction =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(transactionRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/transactions/${id}`, config);

      dispatch(transactionSuccess(data));
    } catch (error) {
      dispatch(
        transactionFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
