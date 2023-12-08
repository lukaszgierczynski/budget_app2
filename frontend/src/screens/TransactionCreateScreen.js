import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container, Table, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { transactionReset } from "../slicers/transactionSlicers/transactionSlice";
import { expenseCategoryListReset } from "../slicers/transactionSlicers/expenseCategoryListSlice";
import { incomeCategoryListReset } from "../slicers/transactionSlicers/incomeCategoryListSlice";
import { createTransactionReset } from "../slicers/transactionSlicers/transactionCreateSlice";

import logoutAction from "../actions/userActions/userLogoutAction";
import { getExpenseCategoryList } from "../actions/transactionActions/expenseCategoryListAction";
import { getIncomeCategoryList } from "../actions/transactionActions/incomeCategoryListAction";
import { createTransaction } from "../actions/transactionActions/transactionCreateAction";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function TransactionCreateScreen() {
  const [expenseCategory, setExpenseCategory] = useState("");
  const [isIncome, setIsIncome] = useState(true);
  const [incomeCategory, setIncomeCategory] = useState("");
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionName, setTransactionName] = useState("");
  const [showFormInvalidAlert, setShowFormInvalidAlert] = useState(false);
  const [showFieldsEmptyAlert, setShowFieldsEmptyAlert] = useState(false);
  const [showNotAllowedAlert, setShowNotAllowedAlert] = useState(false);

  //zmienne walidacyjne
  let isMoneyAmountValid = true;
  if (moneyAmount >= 0 && isIncome === false) {
    isMoneyAmountValid = false;
  } else if (moneyAmount < 0 && isIncome === true) {
    isMoneyAmountValid = false;
  }

  let isMoneyAmountDecimalsValid =
    (moneyAmount.toString().split(".")[1] || "").length <= 2;

  const areAllFields =
    transactionDate != "" && transactionName != "" && description != "";
  const isFormValid = isMoneyAmountValid && isMoneyAmountDecimalsValid;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const transactionDetails = useSelector((state) => state.transactionDetails);
  const { isTransaction, loading, error, transaction } = transactionDetails;
  const expenseCategories = useSelector((state) => state.expenseCategoryList);
  const {
    isExpenseCategoryList,
    loading: loadingExpenseCategories,
    error: errorExpenseCategories,
    expenseCategoryList,
  } = expenseCategories;
  const incomeCategories = useSelector((state) => state.incomeCategoryList);
  const {
    isIncomeCategoryList,
    loading: loadingIncomeCategories,
    error: errorIncomeCategories,
    incomeCategoryList,
  } = incomeCategories;
  const transactionCreate = useSelector((state) => state.transactionCreate);
  const {
    isCreatedTransaction,
    loading: loadingCreateTransaction,
    error: errorCreateTransaction,
    createdTransaction,
  } = transactionCreate;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      dispatch(transactionReset());
      dispatch(expenseCategoryListReset());
      dispatch(incomeCategoryListReset());
      dispatch(createTransactionReset());
      navigate("/login");
    } else {
      if (isCreatedTransaction) {
        dispatch(createTransactionReset());
        navigate(`/transactions/${transaction._id}`);
      }
      if (!isExpenseCategoryList) {
        dispatch(getExpenseCategoryList());
      } else if (!isIncomeCategoryList) {
        dispatch(getIncomeCategoryList());
      }
      if (isExpenseCategoryList) {
        setExpenseCategory(expenseCategoryList[0]._id);
      }
      if (isIncomeCategoryList) {
        setIncomeCategory(incomeCategoryList[0]._id);
      }
    }
  }, [
    transaction,
    error,
    userInfo,
    isExpenseCategoryList,
    isIncomeCategoryList,
    isCreatedTransaction,
  ]);

  const submitHandler = (event) => {
    setShowFormInvalidAlert(false);
    setShowFieldsEmptyAlert(false);
    setShowNotAllowedAlert(false);

    if (isFormValid && areAllFields) {
      event.preventDefault();
      let transactionToCreate = {
        is_income: isIncome,
        money_amount: moneyAmount,
        transaction_name: transactionName,
        description: description,
        transaction_date: transactionDate,
      };
      transactionToCreate = {
        ...transactionToCreate,
        ...(isIncome
          ? { expense_category: null, income_category: incomeCategory }
          : { expense_category: expenseCategory, income_category: null }),
      };
      console.log(transactionToCreate);
      dispatch(createTransaction(transactionToCreate));
    } else if (!isUserAllowed) {
      setShowNotAllowedAlert(true);
    } else if (errorCreateTransaction) {
      setShowFormInvalidAlert(true);
    } else if (!areAllFields) {
      setShowFieldsEmptyAlert(true);
    } else if (!isFormValid) {
      setShowFormInvalidAlert(true);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  console.log(isUserAllowed);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container style={{ maxWidth: "700px" }} className="my-container">
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="isIncome" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Transakcja jest dochodem czy wydatkiem?
              </Form.Label>
              <Form.Check
                type="radio"
                label="Wydatek"
                id="expense"
                checked={isIncome === false}
                onChange={() => setIsIncome(false)}
              />
              <Form.Check
                type="radio"
                label="Dochód"
                id="income"
                checked={isIncome === true}
                onChange={() => setIsIncome(true)}
              />
            </Form.Group>

            <Form.Group controlId="transactionDate" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Data transakcji
              </Form.Label>
              <Form.Control
                type="date"
                max={getCurrentDate()}
                placeholder="Podaj datę transakcji"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="transactionName" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Nazwa transakcji
              </Form.Label>
              <Form.Control
                type="name"
                maxLength={200}
                placeholder="Podaj nazwę transakcji"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="moneyAmount" className="my-3">
              {!isMoneyAmountValid && (
                <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
                  {isIncome
                    ? "Jeżeli transakcja jest dochodem, kwota musi być większa lub równa 0."
                    : "Jeżeli transakcja jest wydatkiem, kwota musi być mniejsza niż 0."}
                </p>
              )}
              {!isMoneyAmountDecimalsValid && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Kwota transakcji nie mieć więcej niż 2 cyfry dziesiętne.
                </p>
              )}
              <Form.Label style={{ fontWeight: "bold" }}>
                Kwota transakcji
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Podaj kwotę transakcji"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Opis transakcji
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                type="text"
                placeholder="Podaj opis transakcji"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isIncome" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>Kategoria</Form.Label>
              <Form.Select
                value={isIncome ? incomeCategory : expenseCategory}
                className="category-select"
                onChange={(event) => {
                  isIncome
                    ? setIncomeCategory(event.target.value)
                    : setExpenseCategory(event.target.value);
                }}
              >
                {isIncome
                  ? incomeCategoryList.map((category) => (
                      <option value={category._id} key={category._id}>
                        {category.category_name}
                      </option>
                    ))
                  : expenseCategoryList.map((category) => (
                      <option value={category._id} key={category._id}>
                        {category.category_name}
                      </option>
                    ))}
              </Form.Select>
            </Form.Group>
            {showNotAllowedAlert && (
              <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
                Nie masz uprawnień do wykonania tej operacji.
              </p>
            )}
            {showFieldsEmptyAlert && (
              <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
                Wypełnij wszystkie pola.
              </p>
            )}
            {showFormInvalidAlert && (
              <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
                Nie można zaktualizować, ponieważ formularz zawiera błędy.
              </p>
            )}

            <div className="d-flex justify-content-center">
              <Button
                className="mt-1"
                type="button"
                variant="primary"
                style={{ marginRight: "10px", width: "100px" }}
                onClick={() => {
                  navigate(`/transactions/`);
                }}
              >
                Anuluj
              </Button>
              <Button
                className="mt-1"
                type="submit"
                variant="primary"
                style={{ marginLeft: "10px", width: "100px" }}
              >
                Zapisz
              </Button>
            </div>
          </Form>
        </Container>
      )}
    </div>
  );
}

export default TransactionCreateScreen;
