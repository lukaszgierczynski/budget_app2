import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";

import { getTransaction } from "../actions/transactionActions/transactionAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { transactionReset } from "../slicers/transactionSlicers/transactionSlice";

import "../bootstrap.min.css";
import "./css/TransactionScreen.css";

function TransactionScreen() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const transactionDetails = useSelector((state) => state.transactionDetails);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading, error, transaction } = transactionDetails;

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      dispatch(transactionReset());
      navigate("/login");
    } else {
      dispatch(getTransaction(id));
    }
  }, [id, error, userInfo]);

  const transactionDetailsMap = {
    "Nazwa transakcji:": transaction.transaction_name,
    "Kwota transakcji:": transaction.money_amount,
    "Data transakcji:": transaction.transaction_date,
    "Kategoria:": transaction.expense_category_details
      ? transaction.expense_category_details.category_name
      : transaction.income_category_details
      ? transaction.income_category_details.category_name
      : "-",
    "Opis:": transaction.description,
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container style={{ maxWidth: "1100px" }}>
          <Row className="justify-content-md-start">
            {Object.entries(transactionDetailsMap).map(
              ([transactionDetailName, transactionDetail], index) => (
                <Col
                  sm={6}
                  className="d-flex align-items-start justify-content-center box"
                  style={{ marginBottom: "1.5rem" }}
                  key={index}
                >
                  <Col
                    className="d-flex align-items-center justify-content-end"
                    style={{ marginRight: "1rem" }}
                  >
                    <strong>{transactionDetailName}</strong>
                  </Col>
                  <Col
                    className="d-flex align-items-center justify-content-start"
                    style={{ marginLeft: "1rem" }}
                  >
                    <p style={{ marginBottom: "0" }}>{transactionDetail}</p>
                  </Col>
                </Col>
              )
            )}
          </Row>

          <Container
           
            style={{ maxWidth: "600px" }}
          >
            <Row className="d-flex align-items-center justify-content-center">
              <Col
                xs={12}
                sm={4}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  className="mt-1 my-2"
                  type="submit"
                  variant="primary"
                  style={{ width: "160px" }}
                  onClick={() => {
                    navigate(`/transactions/${id}/update`);
                  }}
                >
                  Edytuj transakcję
                </Button>
              </Col>
            </Row>
            <Row className="d-flex align-items-center justify-content-center">
              <Col
                xs={12}
                sm={4}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  className="mt-1 my-2"
                  type="button"
                  variant="primary"
                  style={{ width: "160px" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cofnij do poprzedniej strony
                </Button>
              </Col>
              <Col
                xs={12}
                sm={4}
                className="d-flex align-items-center justify-content-center"
              >
                <Button
                  className="mt-1 my-2"
                  type="submit"
                  variant="primary"
                  style={{ width: "160px" }}
                  onClick={() => {
                    navigate("/transactions");
                  }}
                >
                  Cofnij do strony z transakcjami
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>
      )}
    </div>
  );
}

export default TransactionScreen;
