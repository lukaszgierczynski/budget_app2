import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Container, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

import { getTransactionsList } from "../actions/transactionActions/transactionsListAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { deleteTransaction } from "../actions/transactionActions/transactionDeleteAction";
import { transactionsListReset } from "../slicers/transactionSlicers/transactionsListSlice";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

import "../bootstrap.min.css";
import "./css/TransactionsListScreen.css";

function TransactionsListScreen() {
  const [isTransactionDeleted, setIsTransactionDeleted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const transactionsList = useSelector((state) => state.transactionsList);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading, error, transactions, page, pages } = transactionsList;
  const transactionDelete = useSelector((state) => state.transactionDelete);
  const {
    loading: deleteLoading,
    success,
    error: errorLoading,
  } = transactionDelete;

  let new_page = location.search;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      dispatch(transactionsListReset());
      navigate("/login");
    } else {
      setIsTransactionDeleted(false);
      dispatch(getTransactionsList(new_page));
    }
  }, [new_page, error, userInfo, success, isTransactionDeleted]);

  const deleteHandler = (id) => {
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (window.confirm("Czy na pewno chcesz usunąć transakcję?")) {
        dispatch(deleteTransaction(id));
        setIsTransactionDeleted(true);
        //sprawdzenie czy usuwana transakcja jest ostatnią na podstronie
        //jezeli tak to nastepuje przekierowanie na przedostania podstrone
        if (transactions.length === 1) {
          new_page = location.search;
          const resultArray = new_page.split("=");
          const current_page = Number(resultArray[1]);
          const previous_page = current_page - 1;
          new_page = "page=" + previous_page;
          if (previous_page > 0) {
            navigate("/transactions/?" + new_page);
          } else {
            navigate("/transactions/");
          }
        }
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Container className="my-3">
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <Button
                  style={{ width: "150px" }}
                  onClick={() => {
                    navigate("/transactions/create");
                  }}
                >
                  Dodaj transakcję
                </Button>
              </Col>
            </Row>
          </Container>
          <Table striped bordered hover responsive className="table-container">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>Data</th>
                <th style={{ width: "150px" }}>Nazwa</th>
                <th style={{ width: "150px" }}>Kategoria</th>
                <th style={{ width: "150px" }}>Kwota</th>
                <th style={{ width: "50px", minWidth: "100px" }}></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="content-row align-middle">
                  <LinkContainer to={`/transactions/${transaction._id}`}>
                    <td>{transaction.transaction_date}</td>
                  </LinkContainer>
                  <LinkContainer to={`/transactions/${transaction._id}`}>
                    <td>{transaction.transaction_name}</td>
                  </LinkContainer>
                  <LinkContainer to={`/transactions/${transaction._id}`}>
                    <td>
                      {transaction.expense_category
                        ? transaction.expense_category_details.category_name
                        : transaction.income_category_details.category_name}
                    </td>
                  </LinkContainer>
                  <LinkContainer
                    to={`/transactions/${transaction._id}`}
                    style={{
                      color: transaction.money_amount >= 0 ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    <td>{transaction.money_amount}</td>
                  </LinkContainer>
                  <td>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        deleteHandler(transaction._id);
                      }}
                      style={{ marginRight: "10px" }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => {
                        navigate(`/transactions/${transaction._id}/update`);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            className="d-flex justify-content-center my-1"
            address="/transactions"
            pages={pages}
            page={page}
          />
        </>
      )}
    </Container>
  );
}

export default TransactionsListScreen;
