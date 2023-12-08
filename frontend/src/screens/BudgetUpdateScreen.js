import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Row, Col, Container, Table, Form } from "react-bootstrap";

import { budgetReset } from "../slicers/budgetSlicers/budgetSlice";

import logoutAction from "../actions/userActions/userLogoutAction";
import { getExpenseCategoryList } from "../actions/transactionActions/expenseCategoryListAction";
import { getBudget } from "../actions/budgetActions/budgetAction";
import { updateBudget } from "../actions/budgetActions/budgetUpdateAction";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function BudgetCreateScreen() {
  const [budgetStartDate, setBudgetStartDate] = useState("");
  const [budgetEndDate, setBudgetEndDate] = useState("");
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [showNoCategoryAlert, setShowNoCategoryAlert] = useState(false);

  //zmienne walidacyjne dla dodawania kategorii do budżetu
  const [isCategoryInBudget, setIsCategoryInBudget] = useState(false);

  //zmienne walidacyjne dla głównego formularza
  const [isStartDateBeforeEndDate, setIsStartDateBeforeEndDate] =
    useState(true);
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false);
  const [isAnyCategory, setIsAnyCategory] = useState(false);

  let isFormValid;
  isFormValid = isStartDateBeforeEndDate && areAllFieldsFilled && isAnyCategory;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.userLogin);
  const budgetDetails = useSelector((state) => state.budgetDetails);
  const { isBudget, loading, error, budget } = budgetDetails;
  const expenseCategories = useSelector((state) => state.expenseCategoryList);
  const {
    isExpenseCategoryList,
    loading: loadingExpenseCategories,
    error: errorExpenseCategories,
    expenseCategoryList,
  } = expenseCategories;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (
      errorExpenseCategories === "Given token not valid for any token type" ||
      !userInfo
    ) {
      dispatch(logoutAction());
      navigate("/login");
    }

    //reset budżetu w Redux żeby przy ponownym wejściu do edycji budżetu pracować
    //na jego najnowszej wersji
    return () => {
      dispatch(budgetReset());
    };
  }, [errorExpenseCategories, userInfo]);

  useEffect(() => {
    if (!isExpenseCategoryList) {
      dispatch(getExpenseCategoryList());
    } else {
      setSelectedCategory(expenseCategoryList[0]._id);
    }
  }, [isExpenseCategoryList]);

  useEffect(() => {
    if (isBudget) {
      setBudgetStartDate(budget.start_date);
      setBudgetEndDate(budget.end_date);
      setBudgetCategories(
        budget.budget_categories.map((budget_category) => ({
          expense_id: budget_category.category_id,
          money_amount: budget_category.money_amount,
        }))
      );
    } else {
      dispatch(getBudget(id));
    }
  }, [isBudget]);

  //useEffect dla zmiennych walidacyjnych
  useEffect(() => {
    const convertedStartDate = new Date(budgetStartDate);
    const convertedEndDate = new Date(budgetEndDate);
    if (convertedStartDate > convertedEndDate) {
      setIsStartDateBeforeEndDate(false);
    } else {
      setIsStartDateBeforeEndDate(true);
    }

    if (budgetStartDate !== "" && budgetEndDate !== "") {
      setAreAllFieldsFilled(true);
    }

    setIsAnyCategory(budgetCategories.length > 0);
  }, [budgetCategories, budgetStartDate, budgetEndDate, isFormValid]);

  const findCategoryName = (category_id) => {
    let foundCategory;
    for (var i = 0; i < expenseCategoryList.length; i++) {
      if (expenseCategoryList[i]._id === Number(category_id)) {
        foundCategory = expenseCategoryList[i];
        console.log(foundCategory);
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
      expense_id: Number(selectedCategory),
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
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (isFormValid) {
        const budgetToCreate = {
          _id: id,
          start_date: budgetStartDate,
          end_date: budgetEndDate,
          budget_categories: budgetCategories,
        };

        dispatch(updateBudget(budgetToCreate));
        navigate("/budgets");
      } else {
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
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  type="submit"
                  style={{
                    fontSize: "0.9rem",
                    marginRight: "10px",
                    width: "150px",
                  }}
                >
                  Zaktualizuj budżet
                </Button>
                <Button
                  style={{
                    fontSize: "0.9rem",
                    marginLeft: "10px",
                    width: "150px",
                  }}
                  onClick={() => navigate("/budgets")}
                >
                  Anuluj
                </Button>
              </div>
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
                <Col sm={6}>
                  <Form.Group controlId="budgetStartDate" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Data rozpoczęcia budżetu
                    </Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Podaj datę rozpoczęcia budżetu"
                      value={budgetStartDate}
                      onChange={(e) => setBudgetStartDate(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="budgetEndDate" className="my-3">
                    <Form.Label style={{ fontWeight: "bold" }}>
                      Data zakończenia budżetu
                    </Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Podaj datę zakończenia budżetu"
                      value={budgetEndDate}
                      onChange={(e) => setBudgetEndDate(e.target.value)}
                      disabled
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                  {!isStartDateBeforeEndDate && (
                    <p
                      style={{ color: "red", fontWeight: "bold" }}
                      className="mt-2"
                    >
                      Data rozpoczęcia budżetu nie może być później niż data
                      zakończenia budżetu.
                    </p>
                  )}
                </Col>
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
                    <th style={{ width: "400px" }}>Kategoria</th>
                    <th style={{ width: "230px" }}>Kwota</th>
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
