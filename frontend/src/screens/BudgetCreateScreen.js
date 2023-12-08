import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container, Table, Form } from "react-bootstrap";

import logoutAction from "../actions/userActions/userLogoutAction";
import { createBudget } from "../actions/budgetActions/budgetCreateAction";
import { getExpenseCategoryList } from "../actions/transactionActions/expenseCategoryListAction";
import { getBudgetsAll } from "../actions/budgetActions/budgetsAllAction";
import { budgetsAllReset } from "../slicers/budgetSlicers/budgetsAllSlice";

import {
  getFirstAndLastDayOfMonth,
  getBudgetYears,
  getMonthsAlreadyWithBudget,
} from "../utilities/budgetUtilities/createBudget";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function BudgetCreateScreen() {
  const currentYear = new Date().getFullYear();

  const [budgetMonth, setBudgetMonth] = useState(1);
  const [budgetYear, setBudgetYear] = useState(currentYear);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [showNoCategoryAlert, setShowNoCategoryAlert] = useState(false);
  const [monthsWithBudget, setMonthsWithBudget] = useState([]);
  const [isMonthOccupied, setIsMonthOccupied] = useState(false);
  const [showMonthOccupiedAlert, setShowMonthOccupiedAlert] = useState(false);

  const yearAndMonth =
    budgetMonth < 10
      ? budgetYear + "-" + "0" + budgetMonth
      : budgetYear + "-" + budgetMonth;

  //zmienne walidacyjne dla dodawania kategorii do budżetu
  const [isCategoryInBudget, setIsCategoryInBudget] = useState(false);
  const [isAnyCategory, setIsAnyCategory] = useState(false);

  let isFormValid;
  isFormValid = isAnyCategory && !isMonthOccupied;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const expenseCategories = useSelector((state) => state.expenseCategoryList);
  const {
    isExpenseCategoryList,
    loading: loadingExpenseCategories,
    error: errorExpenseCategories,
    expenseCategoryList,
  } = expenseCategories;
  const budgetsAll = useSelector((state) => state.budgetsAll);
  const {
    areAllBudgets,
    budgets,
    loading: loadingBudgetsAll,
    error: errorBudgetsAll,
  } = budgetsAll;

  const monthMap = {
    styczeń: 1,
    luty: 2,
    marzec: 3,
    kwiecień: 4,
    maj: 5,
    czerwiec: 6,
    lipiec: 7,
    sierpień: 8,
    wrzesień: 9,
    październik: 10,
    listopad: 11,
    grudzień: 12,
  };

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  const budgetYears = getBudgetYears();

  useEffect(() => {
    if (
      errorExpenseCategories === "Given token not valid for any token type" ||
      !userInfo
    ) {
      dispatch(logoutAction());
      navigate("/login");
    } else {
      dispatch(getExpenseCategoryList());
      dispatch(getBudgetsAll());
    }

    return () => {
      dispatch(budgetsAllReset());
    };
  }, []);

  useEffect(() => {
    if (areAllBudgets) {
      setMonthsWithBudget(getMonthsAlreadyWithBudget(budgets));
    }
  }, [areAllBudgets, budgets]);

  useEffect(() => {
    if (monthsWithBudget.includes(yearAndMonth)) {
      setIsMonthOccupied(true);
      setShowMonthOccupiedAlert(true);
    } else {
      setIsMonthOccupied(false);
      setShowMonthOccupiedAlert(false);
    }
  }, [budgetYear, budgetMonth, monthsWithBudget]);

  useEffect(() => {
    if (isExpenseCategoryList) {
      setSelectedCategory(expenseCategoryList[0]._id);
    }

    setIsAnyCategory(budgetCategories.length > 0);
  }, [budgetCategories, isExpenseCategoryList, isFormValid]);

  const findCategoryName = (category_id) => {
    let foundCategory;
    for (var i = 0; i < expenseCategoryList.length; i++) {
      if (expenseCategoryList[i]._id === Number(category_id)) {
        foundCategory = expenseCategoryList[i];
        break;
      }
    }
    return foundCategory.category_name;
  };

  const addCategoryToBudget = (newCategory) => {
    setBudgetCategories((prevState) => [...prevState, newCategory]);
  };

  const addingCategoryToBudgetHandler = (event) => {
    event.preventDefault();
    const categoryToAdd = {
      expense_id: selectedCategory,
      money_amount: moneyAmount,
    };

    if (
      budgetCategories.some(
        (obj) => obj.expense_id === categoryToAdd.expense_id
      )
    ) {
      setIsCategoryInBudget(true);
    } else {
      addCategoryToBudget(categoryToAdd);
      setIsCategoryInBudget(false);
      setShowNoCategoryAlert(false);
    }
  };

  const deleteCategoryHandler = (id) => {
    const updatedBudgetCategories = budgetCategories.filter(
      (category) => category.expense_id !== id
    );
    setBudgetCategories(updatedBudgetCategories);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setShowMonthOccupiedAlert(false);
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (isFormValid) {
        const firstAndLastDayOfMonth = getFirstAndLastDayOfMonth(
          budgetMonth,
          budgetYear
        );
        const budgetToCreate = {
          start_date: firstAndLastDayOfMonth.firstDayFormat,
          end_date: firstAndLastDayOfMonth.lastDayFormat,
          budget_categories: budgetCategories,
        };

        dispatch(createBudget(budgetToCreate));
        navigate("/budgets");
      } else {
        if (isMonthOccupied) {
          setShowMonthOccupiedAlert(true);
        }
        if (!isAnyCategory) {
          setIsCategoryInBudget(false);
          setShowNoCategoryAlert(true);
        }
        setShowSubmitAlert(true);
      }
    }
  };

  return (
    <Container style={{ maxWidth: "700px" }}>
      <Row>
        <Col>
          <Form
            onSubmit={submitHandler}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Button type="submit" style={{ fontSize: "0.9rem" }}>
                Zapisz budżet
              </Button>
              {showSubmitAlert && (
                <p
                  style={{ color: "red", fontWeight: "bold" }}
                  className="mt-2"
                >
                  Nie można zapisać, ponieważ formularz zawiera błędy.
                </p>
              )}
            </div>
            <Container>
              <Row>
                <Col xs={6} sm={3}>
                  <Form.Group controlId="month" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Miesiąc
                    </Form.Label>
                    <Form.Select
                      value={budgetMonth}
                      onChange={(event) => {
                        setBudgetMonth(event.target.value);
                      }}
                    >
                      {Object.keys(monthMap).map((month) => (
                        <option value={monthMap[month]} key={month}>
                          {month}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={6} sm={3}>
                  <Form.Group controlId="category" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>Rok</Form.Label>
                    <Form.Select
                      value={budgetYear}
                      onChange={(event) => {
                        setBudgetYear(event.target.value);
                      }}
                    >
                      {budgetYears.map((year) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                {showMonthOccupiedAlert && showSubmitAlert && (
                  <p
                    style={{ color: "red", fontWeight: "bold" }}
                    className="mt-2"
                  >
                    Wybrany miesiąc posiada już budżet.
                  </p>
                )}
              </Row>
            </Container>
          </Form>
          <Form
            onSubmit={addingCategoryToBudgetHandler}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <Container>
              <Row className="d-flex flex-row justify-content-center align-items-center">
                <Col xs={6} sm={4}>
                  <Form.Group controlId="category" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Kategoria wydatków
                    </Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(event) => {
                        setSelectedCategory(event.target.value);
                      }}
                    >
                      {expenseCategoryList.map((category) => (
                        <option value={category._id} key={category._id}>
                          {category.category_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={6} sm={4}>
                  <Form.Group controlId="moneyAmount" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Kwota dla danej kategorii
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      placeholder="Podaj kwotę dla danej kategorii"
                      value={moneyAmount}
                      onChange={(e) => setMoneyAmount(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={6} sm={4}>
                  <Button type="submit" style={{ fontSize: "0.9rem" }}>
                    Dodaj kategorię do budżetu
                  </Button>
                </Col>
                <Col
                  xs={12}
                  className="d-flex justify-content-center align-items-center"
                >
                  {isCategoryInBudget && (
                    <p
                      style={{ color: "red", fontWeight: "bold" }}
                      className="mt-2"
                    >
                      Kategoria jest już w budżecie. Usuń dodaną kategorię, aby
                      dodać nową.
                    </p>
                  )}
                </Col>
                <Col
                  xs={12}
                  className="d-flex justify-content-center align-items-center"
                >
                  {showNoCategoryAlert && (
                    <p
                      style={{ color: "red", fontWeight: "bold" }}
                      className="mt-2"
                    >
                      Dodaj co najmniej jedną kategorię do budżetu.
                    </p>
                  )}
                </Col>
              </Row>
            </Container>
            <Form.Group className="mt-3">
              <p
                style={{
                  fontWeight: "bold",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: "300px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                }}
              >
                Kategorie wydatków w budżecie:
              </p>
              <Table
                striped
                bordered
                hover
                responsive
                className="table-container"
              >
                <thead>
                  <tr>
                    <th style={{ width: "430px" }}>Kategoria</th>
                    <th style={{ width: "200px" }}>Kwota</th>
                    <th style={{ width: "70px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {budgetCategories.map((category) => {
                    const categoryName = findCategoryName(category.expense_id);
                    return (
                      <tr key={category.expense_id}>
                        <td>
                          <Form.Control
                            type="text"
                            value={categoryName}
                            disabled
                          ></Form.Control>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={category.money_amount}
                            disabled
                          ></Form.Control>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            style={{ marginTop: "4px" }}
                            onClick={() => {
                              deleteCategoryHandler(category.expense_id);
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default BudgetCreateScreen;
