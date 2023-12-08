import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { LinkContainer } from "react-router-bootstrap";

import { login } from "../actions/userActions/userLoginAction";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error, loading } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/user-home");
    }
    if (!username && !password) {
      setCustomError("Wprowadź nazwę użytkownika i hasło.");
    } else {
      setCustomError("");
    }
  }, [navigate, userInfo, error]);

  const logExampleUser = () => {
    dispatch(login("example_user@email.com", "example_user"));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <FormContainer>
      <h1 style={{ fontSize: "20px", color: "red", fontWeight: "bold" }}>
        Chcesz zobaczyć wersję demo aplikacji? Kliknij{" "}
        <button onClick={logExampleUser} style={{ borderRadius: "5px" }}>
          tutaj
        </button>
      </h1>
      <h1 style={{ fontSize: "32px" }}>Logowanie</h1>
      {error && (
        <Message variant="danger">{customError ? customError : error}</Message>
      )}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Nazwa użytkownika</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz nazwę użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            placeholder="Wpisz hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-start align-items-center">
          <Button variant="primary" type="submit">
            Zaloguj
          </Button>
          <p className="mb-0" style={{ marginLeft: "10px" }}>
            Nie posiadasz konta?
          </p>
          <LinkContainer
            to="/register"
            style={{ marginLeft: "10px", cursor: "pointer" }}
          >
            <p className="mb-0 text-decoration-underline">Zarejestruj się!</p>
          </LinkContainer>
        </div>
      </Form>
    </FormContainer>
  );
}

export default LoginScreen;
