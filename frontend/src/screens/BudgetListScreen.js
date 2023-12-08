import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Table,
  Accordion,
  Badge,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

import { getBudgetsList } from "../actions/budgetActions/budgetsListAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { deleteBudget } from "../actions/budgetActions/budgetDeleteAction";

import { budgetsListReset } from "../slicers/budgetSlicers/budgetsListSlice";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function BudgetListScreen() {
  const [isBudgetDeleted, setIsBudgetDeleted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.userLogin);
  const budgetsList = useSelector((state) => state.budgetsList);
  const { areBudgets, loading, error, budgets, page, pages } = budgetsList;
  const budgetDelete = useSelector((state) => state.budgetDelete);
  const {
    loading: deleteLoading,
    deleteSuccess,
    error: errorLoading,
  } = budgetDelete;

  let new_page = location.search;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      dispatch(budgetsListReset());
      navigate("/login");
    } else {
      dispatch(getBudgetsList(new_page));
      setIsBudgetDeleted(false);
    }

    return () => {
      dispatch(budgetsListReset());
    };
  }, [new_page, error, userInfo, deleteSuccess, isBudgetDeleted]);

  useEffect(() => {
    dispatch(getBudgetsList(new_page));
  }, []);

  const deleteHandler = (id) => {
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (window.confirm("Czy na pewno chcesz usunąć budżet?")) {
        dispatch(deleteBudget(id));
        setIsBudgetDeleted(true);
        //sprawdzenie czy usuwana transakcja jest ostatnią na podstronie
        //jezeli tak to nastepuje przekierowanie na przedostania podstrone
        if (budgets.length === 1) {
          new_page = location.search;
          const resultArray = new_page.split("=");
          const current_page = Number(resultArray[1]);
          const previous_page = current_page - 1;
          new_page = "page=" + previous_page;
          if (previous_page > 0) {
            navigate("/budgets/?" + new_page);
          } else {
            navigate("/budgets/");
          }
        }
      }
    }
  };

  let eventKeyCounter = -1;

  return (
    <Container style={{ maxWidth: "900px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Container>
          <Container className="my-3">
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <Button
                  style={{ width: "150px" }}
                  onClick={() => {
                    navigate("/budgets/create");
                  }}
                >
                  Dodaj budżet
                </Button>
              </Col>
            </Row>
          </Container>
          <Container>
            <Accordion defaultActiveKey={["0"]}>
              {budgets.map((budget) => {
                eventKeyCounter++;
                return (
                  <Accordion.Item eventKey={eventKeyCounter} key={budget._id}>
                    <Accordion.Header>
                      <Container>
                        <Row>
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="d-flex align-items-center justify-content-center mt-1"
                          >
                            <Badge bg="primary">początek:</Badge>
                            <div style={{ marginLeft: "10px" }}>
                              {budget.start_date}
                            </div>
                          </Col>
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="d-flex align-items-center justify-content-center mt-1"
                          >
                            <Badge bg="primary" style={{ marginLeft: "10px" }}>
                              koniec:
                            </Badge>
                            <div style={{ marginLeft: "10px" }}>
                              {budget.end_date}
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-container"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "550px" }}>Kategoria</th>
                            <th style={{ width: "350px" }}>Kwota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {budget.budget_categories.map((budget_category) => {
                            return (
                              <tr key={budget_category._id}>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={
                                      budget_category.expense_category_details
                                        .category_name
                                    }
                                    disabled
                                  ></Form.Control>
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    value={budget_category.money_amount}
                                    disabled
                                  ></Form.Control>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      <div className="d-flex align-items-center justify-content-center">
                        <Button
                          className="btn-sm"
                          style={{ width: "100px", marginRight: "10px" }}
                          onClick={() => {
                            navigate(`/budgets/${budget._id}/update`);
                          }}
                        >
                          <i className="fas fa-edit"></i> Edytuj
                        </Button>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          style={{ width: "100px", marginLeft: "10px" }}
                          onClick={() => deleteHandler(budget._id)}
                        >
                          <i className="fas fa-trash"></i> Usuń
                        </Button>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Container>
          <Paginate
            className="d-flex justify-content-center my-3"
            address="/budgets"
            pages={pages}
            page={page}
          />
        </Container>
      )}
    </Container>
  );
}

export default BudgetListScreen;
