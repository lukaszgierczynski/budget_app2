import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import Loader from "../components/Loader";

import Plot from "react-plotly.js";

import { getGraphTransactions } from "../actions/graphActions/graphTransactionsAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { graphTransactionsReset } from "../slicers/graphSlicers/graphTransactionsSlice";
import { getBudgetsAll } from "../actions/budgetActions/budgetsAllAction";
import { budgetsAllReset } from "../slicers/budgetSlicers/budgetsAllSlice";

import { getBudgetAndExpensesPerMonth } from "../utilities/graphUtilities/generateGraphData";
import { LinkContainer } from "react-router-bootstrap";

function GraphBudgetPerMonth() {
  const [budgetId, setBudgetId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [graphTitle, setGraphTitle] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [showNoBudgetAlert, setShowNoBudgetAlert] = useState(false);

  let graphLayout = {
    width: 1000,
    height: 500,
    title: graphTitle,
    autosize: true,
    showlegend: true,
    xaxis: {
      automargin: true,
      title: {
        text: "kategoria wydatków",
      },
      type: "category",
      categoryorder: "array",
      categoryarray: graphData ? graphData[0].x : [],
    },
    yaxis: {
      automargin: true,
      title: "suma",
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const graphTransactions = useSelector((state) => state.graphTransactions);
  const { areTransactions, transactions, loading, error } = graphTransactions;
  const budgetsAll = useSelector((state) => state.budgetsAll);
  const {
    areAllBudgets,
    budgets,
    loading: loadingBudgetsAll,
    error: errorBudgetsAll,
  } = budgetsAll;


  let transactionsQueryParams = `?start_date=${startDate}&end_date=${endDate}`;

  
  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      navigate("/login");
    }

    return () => {
      dispatch(graphTransactionsReset());
      dispatch(budgetsAllReset());
    };
  }, [error, userInfo]);

  useEffect(() => {
    if (!areAllBudgets) {
      dispatch(getBudgetsAll());
    }
    if (!budgetId && areAllBudgets) {
      if (budgets.length !== 0) {
        setShowNoBudgetAlert(false);
        setBudgetId(budgets[0]._id);
      } else {
        setShowNoBudgetAlert(true);
      }
    }
  }, [areAllBudgets, budgetId]);

  useEffect(() => {
    if (budgetId && areAllBudgets) {
      const chosenBudget = budgets.find(
        (budget) => Number(budget._id) === Number(budgetId)
      );
      setStartDate(chosenBudget.start_date);
      setEndDate(chosenBudget.end_date);
    }
  }, [budgetId, areAllBudgets, budgets]);

  useEffect(() => {
    dispatch(graphTransactionsReset());
    if (startDate && endDate) {
      dispatch(getGraphTransactions(transactionsQueryParams));
    }
  }, [startDate, endDate]);

  const submitHandler = () => {
    const chosenBudget = budgets.find(
      (budget) => Number(budget._id) === Number(budgetId)
    );

    const newGraphData = getBudgetAndExpensesPerMonth(
      chosenBudget,
      transactions
    );
    setGraphData(newGraphData);
    setGraphTitle(
      `Wydatki i budżet wg kategorii w okresie od ${startDate} do ${endDate}`
    );
  };

  return (!areAllBudgets) ? (
    <Loader />
  ) : showNoBudgetAlert ? (
    <>
      <p
        style={{ color: "red", fontWeight: "bold" }}
        className="mt-2 d-flex justify-content-center align-items-center"
      >
        Brak budżetów do wyświetlenia. Dodaj swój pierwszy budżet
        <Link
          to="/budgets/create"
          style={{ color: "red", fontWeight: "bold", marginLeft: "3px" }}
        >
          tutaj
        </Link>
        .
      </p>
    </>
  ) : (
    <Container>
      <Container>
        <Row>
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <Form.Group controlId="month" className="my-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Wybierz miesiąc z budżetem:
              </Form.Label>
              {budgetId && (
                <Form.Select
                  value={budgetId}
                  onChange={(event) => {
                    setBudgetId(event.target.value);
                  }}
                >
                  {budgets.map((budget) => (
                    <option value={budget._id} key={budget._id}>
                      {budget.start_date.substring(0, 7)}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            <Button
              style={{
                fontSize: "0.9rem",
                marginRight: "10px",
                width: "150px",
              }}
              onClick={submitHandler}
              disabled={!areTransactions}
            >
              Stwórz wykres
            </Button>
          </Col>
        </Row>
      </Container>
      {graphData && (
        <div className="d-flex justify-content-center mt-3">
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

export default GraphBudgetPerMonth;
