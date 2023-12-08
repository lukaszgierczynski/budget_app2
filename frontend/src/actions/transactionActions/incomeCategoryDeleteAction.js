import axios from "axios";

import {
  deleteIncomeCategoryRequest,
  deleteIncomeCategorySuccess,
  deleteIncomeCategoryFail,
  deleteIncomeCategoryReset,
  reducer,
} from "../../slicers/transactionSlicers/incomeCategoryDeleteSlice";


export const deleteIncomeCategory =
  (id) =>
  async (dispatch, getState) => {
    try {
      dispatch(deleteIncomeCategoryRequest());

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.delete(`/api/transactions/income_category/delete/${id}/`, config);

      dispatch(deleteIncomeCategorySuccess());

    } catch (error) {
      dispatch(
        deleteIncomeCategoryFail(
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        )
      );
    }
  };
