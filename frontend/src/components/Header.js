import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, Row, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import logoutAction from "../actions/userActions/userLogoutAction";

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    navigate("/login");
    dispatch(logoutAction());
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>BudgetApp</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo && (
              <>
                <Nav className="ms-auto">
                  <NavDropdown title="Transakcje" id="basic-nav-dropdown">
                    <LinkContainer to="/transactions">
                      <NavDropdown.Item>Wszystkie transakcje</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/transactions/create">
                      <NavDropdown.Item>Dodaj transakcję</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <LinkContainer to="/transactions/categories">
                      <NavDropdown.Item>Kategorie transakcji</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>

                  <NavDropdown title="Budżet" id="basic-nav-dropdown">
                    <LinkContainer to="/budgets">
                      <NavDropdown.Item>Wszystkie budżety</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/budgets/create">
                      <NavDropdown.Item>Stwórz budżet</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>

                  <NavDropdown title="Wykresy" id="basic-nav-dropdown">
                    <LinkContainer to="/user-home">
                      <NavDropdown.Item>Suma transakcji na dzień</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/graphs/transactions-per-category">
                      <NavDropdown.Item>Suma transakcji wg kategorii</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/graphs/budget-per-month">
                      <NavDropdown.Item>Budżet i wydatki</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </Nav>
                <Nav className="ms-auto">
                  <NavDropdown
                    title={
                      userInfo.first_name
                        ? userInfo.first_name
                        : userInfo.username
                    }
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profil</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                      Wyloguj
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
