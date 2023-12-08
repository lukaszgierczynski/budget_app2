import axios from "axios";

import {
  createIncomeCategoryRequest,
  createIncomeCategorySuccess,
  createIncomeCategoryFail,
  createIncomeCategoryReset,
  reducer,
} from "../../slicers/transactionSlicers/incomeCategoryCreateSlice";

export const createIncomeCategory =
  (category) =>

  async (dispatch, getState) => {
    try {
      dispatch(createIncomeCategoryRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/transactions/income_category/create/`, category, config);

      dispatch(createIncomeCategorySuccess(data));

    } catch (error) {
      dispatch(
        createIncomeCategoryFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
