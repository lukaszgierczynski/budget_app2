import axios from "axios";

import {
  incomeCategoryListRequest,
  incomeCategoryListSuccess,
  incomeCategoryListFail,
  incomeCategoryListReset,
  reducer,
} from "../../slicers/transactionSlicers/incomeCategoryListSlice";

export const getIncomeCategoryList =
  () =>
  async (dispatch, getState) => {
    try {
      dispatch(incomeCategoryListRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/transactions/income_category/user_list/`, config);
      
      dispatch(incomeCategoryListSuccess(data));
    } catch (error) {
      dispatch(
        incomeCategoryListFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
