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
  Nav,
  ListGroup,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";

import { getExpenseCategoryList } from "../actions/transactionActions/expenseCategoryListAction";
import { getIncomeCategoryList } from "../actions/transactionActions/incomeCategoryListAction";
import { createExpenseCategory } from "../actions/transactionActions/expenseCategoryCreateAction";
import { createIncomeCategory } from "../actions/transactionActions/incomeCategoryCreateAction";
import { deleteExpenseCategory } from "../actions/transactionActions/expenseCategoryDeleteAction";
import { deleteIncomeCategory } from "../actions/transactionActions/incomeCategoryDeleteAction";
import logoutAction from "../actions/userActions/userLogoutAction";

import { createExpenseCategoryReset } from "../slicers/transactionSlicers/expenseCategoryCreateSlice";
import { createIncomeCategoryReset } from "../slicers/transactionSlicers/incomeCategoryCreateSlice";
import { deleteExpenseCategoryReset } from "../slicers/transactionSlicers/expenseCategoryDeleteSlice";
import { deleteIncomeCategoryReset } from "../slicers/transactionSlicers/incomeCategoryDeleteSlice";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function TransactionCategoryListScreen() {
  const [showExpenseCategories, setShowExpenseCategories] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [isSentToAPI, setIsSentToAPI] = useState(false);

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
  const incomeCategories = useSelector((state) => state.incomeCategoryList);
  const {
    isIncomeCategoryList,
    loading: loadingIncomeCategories,
    error: errorIncomeCategories,
    incomeCategoryList,
  } = incomeCategories;
  const expenseCategoryCreated = useSelector(
    (state) => state.expenseCategoryCreate
  );
  const {
    isCreatedExpenseCategory,
    loading: loadingCreatedExpenseCategory,
    error: errorCreatedExpenseCategory,
    createdExpenseCategory,
  } = expenseCategoryCreated;
  const incomeCategoryCreated = useSelector(
    (state) => state.expenseCategoryCreate
  );
  const {
    isCreatedIncomeCategory,
    loading: loadingCreatedIncomeCategory,
    error: errorCreatedIncomeCategory,
    createdIncomeCategory,
  } = incomeCategoryCreated;
  const expenseCategoryDeleted = useSelector(
    (state) => state.expenseCategoryDelete
  );
  const {
    loading: loadingDeletedExpenseCategory,
    success: successDeletedExpenseCategory,
    error: errorDeletedExpenseCategory,
  } = expenseCategoryDeleted;
  const incomeCategoryDeleted = useSelector(
    (state) => state.incomeCategoryDelete
  );
  const {
    loading: loadingDeletedIncomeCategory,
    success: successDeletedIncomeCategory,
    error: errorDeletedIncomeCategory,
  } = expenseCategoryDeleted;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (
      errorExpenseCategories === "Given token not valid for any token type" ||
      errorIncomeCategories === "Given token not valid for any token type" ||
      !userInfo
    ) {
      dispatch(logoutAction());
      navigate("/login");
    } else {
      dispatch(getExpenseCategoryList());
      dispatch(getIncomeCategoryList());
      setIsSentToAPI(false);
    }
  }, [errorExpenseCategories, errorIncomeCategories, userInfo, isSentToAPI]);

  const addCategory = () => {
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      const categoryToCreate = { category_name: categoryName };
      if (showExpenseCategories) {
        dispatch(createExpenseCategory(categoryToCreate));
        setIsSentToAPI(true);
      } else {
        dispatch(createIncomeCategory(categoryToCreate));
        setIsSentToAPI(true);
      }
    }
  };

  const deleteCategory = (id) => {
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (showExpenseCategories) {
        dispatch(deleteExpenseCategory(id));
        setIsSentToAPI(true);
      } else {
        dispatch(deleteIncomeCategory(id));
        setIsSentToAPI(true);
      }
    }
  };

  const listCategories = () =>
    (showExpenseCategories ? expenseCategoryList : incomeCategoryList).map(
      (category) => {
        if (category.is_predefined) {
          return (
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center"
              key={category._id}
            >
              <div style={{ wordWrap: "break-word", maxWidth: "350px" }}>
                {category.category_name}
              </div>
              <div style={{ fontStyle: "italic" }}>Kategoria domyślna</div>
            </ListGroup.Item>
          );
        } else {
          return (
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center"
              key={category._id}
            >
              <div style={{ wordWrap: "break-word", maxWidth: "450px" }}>
                {category.category_name}
              </div>
              <Button
                variant="danger"
                className="btn-sm"
                style={{ marginLeft: "10px" }}
                onClick={() => deleteCategory(category._id)}
              >
                <i className="fas fa-trash"></i>
              </Button>
            </ListGroup.Item>
          );
        }
      }
    );

  const listContainer = () => {
    return (
      <Row>
        <Col>
          <p></p>
          <Form.Group controlId="transactionName" className="my-3">
            <Form.Label style={{ fontWeight: "bold" }}>
              {showExpenseCategories
                ? "Dodaj kategorię wydatków"
                : "Dodaj kategorię dochodów"}
            </Form.Label>
            <div className="d-flex justify-content-start">
              <Form.Control
                type="name"
                maxLength={200}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Podaj nazwę kategorii"
                style={{ maxWidth: "400px" }}
              ></Form.Control>
              <Button
                style={{ marginLeft: "20px" }}
                onClick={() => {
                  addCategory();
                }}
              >
                Dodaj
              </Button>
            </div>
          </Form.Group>

          <ListGroup>{listCategories()}</ListGroup>
        </Col>
      </Row>
    );
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <Container>
        <Nav variant="tabs" className="flex-nowrap">
          <Nav.Item>
            <Nav.Link
              active={showExpenseCategories === true}
              onClick={() => setShowExpenseCategories(true)}
              style={{ padding: "15px" }}
            >
              Kategorie wydatków
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={showExpenseCategories === false}
              onClick={() => setShowExpenseCategories(false)}
              style={{ padding: "15px" }}
            >
              Kategorie dochodów
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
      <Container>{listContainer()}</Container>
    </Container>
  );
}

export default TransactionCategoryListScreen;
