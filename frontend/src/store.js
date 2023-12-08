import { applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

import userLoginReducer from "./slicers/userSlicers/userLoginSlice";
import userRegisterReducer from "./slicers/userSlicers/userRegisterSlice";
import transactionsListReducer from "./slicers/transactionSlicers/transactionsListSlice";
import transactionReducer from "./slicers/transactionSlicers/transactionSlice";
import expenseCategoryListReducer from "./slicers/transactionSlicers/expenseCategoryListSlice";
import incomeCategoryListReducer from "./slicers/transactionSlicers/incomeCategoryListSlice";
import updateTransactionReducer from "./slicers/transactionSlicers/transactionUpdateSlice";
import deleteTransactionReducer from "./slicers/transactionSlicers/transactionDeleteSlice";
import createTransactionReducer from "./slicers/transactionSlicers/transactionCreateSlice";
import createExpenseCategoryReducer from "./slicers/transactionSlicers/expenseCategoryCreateSlice";
import createIncomeCategoryReducer from "./slicers/transactionSlicers/incomeCategoryCreateSlice";
import deleteExpenseCategoryReducer from "./slicers/transactionSlicers/expenseCategoryDeleteSlice";
import deleteIncomeCategoryReducer from "./slicers/transactionSlicers/incomeCategoryDeleteSlice";
import createBudgetReducer from "./slicers/budgetSlicers/budgetCreateSlice";
import budgetsListReducer from "./slicers/budgetSlicers/budgetsListSlice";
import deleteBudgetReducer from "./slicers/budgetSlicers/budgetDeleteSlice";
import budgetReducer from "./slicers/budgetSlicers/budgetSlice";
import updateBudgetReducer from "./slicers/budgetSlicers/budgetUpdateSlice";
import profileReducer from "./slicers/userSlicers/profileSlice";
import profileUpdateReducer from "./slicers/userSlicers/profileUpdateSlice";
import graphTransactionsReducer from "./slicers/graphSlicers/graphTransactionsSlice";
import budgetsAllReducer from "./slicers/budgetSlicers/budgetsAllSlice";

const combinedReducer =  combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  transactionsList: transactionsListReducer,
  transactionDetails: transactionReducer,
  expenseCategoryList: expenseCategoryListReducer,
  incomeCategoryList: incomeCategoryListReducer,
  transactionUpdate: updateTransactionReducer,
  transactionDelete: deleteTransactionReducer,
  transactionCreate: createTransactionReducer,
  expenseCategoryCreate: createExpenseCategoryReducer,
  incomeCategoryCreate: createIncomeCategoryReducer,
  expenseCategoryDelete: deleteExpenseCategoryReducer,
  incomeCategoryDelete: deleteIncomeCategoryReducer,
  budgetCreate: createBudgetReducer,
  budgetsList: budgetsListReducer,
  budgetsAll: budgetsAllReducer,
  budgetDelete: deleteBudgetReducer,
  budgetDetails: budgetReducer,
  budgetUpdate: updateBudgetReducer,
  profileDetails: profileReducer,
  profileUpdate: profileUpdateReducer,
  graphTransactions: graphTransactionsReducer,
});

let userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//sprawdzenie czy token z userInfoFromStorage jest ważny, jeżeli nie - przypisanie do userInfoFromStorage wartości null
if (userInfoFromStorage) {
  const config = {
    headers: {
      Authorization: `Bearer ${userInfoFromStorage.token}`,
    },
  };

  try {
    const { data } = await axios.get("/api/users/check-token", config);
    if (!("valid" in data)) {
      userInfoFromStorage = null;
    }
  } catch (error) {
    userInfoFromStorage = null;
  }
}

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

export const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    incomeCategoryListRequest: (state) => {
      return {
        isIncomeCategoryList: false,
        loading: true,
        incomeCategoryList: [],
      };
    },
    incomeCategoryListSuccess: (state, action) => {
      return {
        isIncomeCategoryList: true,
        loading: false,
        incomeCategoryList: action.payload,
      };
    },
    incomeCategoryListFail: (state, action) => {
      return {
        isIncomeCategoryList: false,
        loading: false,
        error: action.payload,
      };
    },
    incomeCategoryListReset: (state) => {
      return initialState;
    },
    reducer: (state) => {
      return state;
    },
  },
});

//dodanie reducera, ktory czysci store przy wylogowywaniu uzytkownika
export const rootReducer = (state, action) => {
  if (action.type === 'logout') { 
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: middleware,
});
