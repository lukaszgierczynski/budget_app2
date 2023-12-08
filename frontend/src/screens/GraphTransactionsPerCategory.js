import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Loader from "../components/Loader";

import Plot from "react-plotly.js";

import { getGraphTransactions } from "../actions/graphActions/graphTransactionsAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { graphTransactionsReset } from "../slicers/graphSlicers/graphTransactionsSlice";

import {
  transactionsAggrPerCategory,
  countDaysBetweenDates,
  getInitialDates,
} from "../utilities/graphUtilities/generateGraphData";

function GraphTransactionsPerCategory() {
  const dates = getInitialDates();

  const [startDate, setStartDate] = useState(dates.lastMonth);
  const [endDate, setEndDate] = useState(dates.today);
  const [showExpenses, setShowExpenses] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [graphTitle, setGraphTitle] = useState("");

  //frontendowe zmienne walidacyjne dla formularza
  const [submitAlert, setSubmitAlert] = useState("");
  const [isStartDateBeforeEndDate, setIsStartDateBeforeEndDate] =
    useState(true);
  const [isGapLessThanPeriod, setIsGapLessThanPeriod] = useState(true);
  const specificPeriod = 150;

  let isFormValid;
  isFormValid = isStartDateBeforeEndDate && isGapLessThanPeriod;

  let graphLayout = {
    width: 1000,
    height: 500,
    title: graphTitle,
    autosize: true,
    barmode: "stack",
    showlegend: true,
    xaxis: {
      automargin: true,
      title: {
        text: "dzień",
      },
      type: "category",
      categoryorder: "array",
      categoryarray: graphData.expenses ? graphData.expenses[0].x : [],
    },
    yaxis: {
      automargin: true,
      title: "suma transakcji / dzień",
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const graphTransactions = useSelector((state) => state.graphTransactions);
  const { areTransactions, transactions, loading, error } = graphTransactions;

  let query_params = `?start_date=${startDate}&end_date=${endDate}`;

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      navigate("/login");
    }

    return () => {
      dispatch(graphTransactionsReset());
    };
  }, [error, userInfo]);

  useEffect(() => {
    if (!areTransactions) {
      dispatch(getGraphTransactions(query_params));
    } else if (areTransactions) {
      const graphDataAll = transactionsAggrPerCategory(
        transactions,
        startDate,
        endDate
      );

      if (showExpenses) {
        setGraphData(graphDataAll.expensesGraphData);
      } else {
        setGraphData(graphDataAll.incomesGraphData);
      }
    }

    setGraphTitle(
      `Wydatki i dochody wg kategorii w okresie od ${startDate} do ${endDate}`
    );
  }, [areTransactions]);

  useEffect(() => {
    if (startDate > endDate) {
      setIsStartDateBeforeEndDate(false);
    } else {
      setIsStartDateBeforeEndDate(true);
    }

    if (countDaysBetweenDates(startDate, endDate) <= specificPeriod) {
      setIsGapLessThanPeriod(true);
    } else {
      setIsGapLessThanPeriod(false);
    }
  }, [startDate, endDate]);

  const submitHandler = (event) => {
    event.preventDefault();
    setSubmitAlert("");
    if (isFormValid) {
      dispatch(getGraphTransactions(query_params));
      setGraphTitle(
        `Wydatki i dochody wg kategorii okresie od ${startDate} do ${endDate}`
      );
    } else {
      if (!isStartDateBeforeEndDate) {
        setSubmitAlert(
          "Początek okresu nie może być póżniej niż koniec okresu."
        );
      } else if (!isGapLessThanPeriod) {
        setSubmitAlert(
          "Liczba dni pomiędzy datami musi być mniejsza lub równa 90."
        );
      }
    }
  };

  return (
    <Container>
      <Form
        onSubmit={submitHandler}
        className="d-flex justify-content-center align-items-center mb-4"
      >
        <Container
          style={{
            maxWidth: "600px",
            border: "2px solid #C0C0C0",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <Row>
            <Col xs={6}>
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold" }}>
                  Początek okresu
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Podaj datę początku okresu"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col xs={6} className="mb-3">
              <Form.Group>
                <Form.Label style={{ fontWeight: "bold" }}>
                  Koniec okresu
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Podaj datę końca okresu"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <Form.Group controlId="expensesOrIncomes" className="mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Wyświetlić wydatki czy dochody?
                </Form.Label>
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Check
                    type="radio"
                    label="Wydatki"
                    id="expenses"
                    checked={showExpenses === true}
                    onChange={() => setShowExpenses(true)}
                    style={{ marginRight: "10px" }}
                  />
                  <Form.Check
                    type="radio"
                    label="Dochody"
                    id="income"
                    checked={showExpenses === false}
                    onChange={() => setShowExpenses(false)}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <Button
                type="submit"
                style={{
                  fontSize: "0.9rem",
                  marginRight: "10px",
                  width: "150px",
                }}
              >
                Stwórz wykres
              </Button>
            </Col>
            <Col
              xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              {submitAlert ? (
                <p
                  style={{ color: "red", fontWeight: "bold" }}
                  className="mt-2"
                >
                  {submitAlert}
                </p>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Container>
      </Form>
      {!areTransactions ? (
        <Loader />
      ) : (
        <div className="d-flex justify-content-center mt-2">
          <div style={{ overflowX: "auto" }}>
            <div style={{ width: "100%" }}>
              <Plot data={graphData} layout={graphLayout} useResizeHandler />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default GraphTransactionsPerCategory;
