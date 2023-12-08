import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { LinkContainer } from "react-router-bootstrap";

import { registerUser } from "../actions/userActions/userRegisterAction";

import { loginSuccess } from "../slicers/userSlicers/userLoginSlice";
import { registerUserReset } from "../slicers/userSlicers/userRegisterSlice";

function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error, loading } = userLogin;
  const userRegister = useSelector((state) => state.userRegister);
  const {
    isRegisteredUser,
    error: registerError,
    loading: registerLoading,
    registeredUser,
  } = userRegister;

  //zmienne dla walidacji na poziomie frontendu
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false);
  const [submitAlert, setSubmitAlert] = useState("");

  const isFormValid = areAllFieldsFilled;

  useEffect(() => {
    if (userInfo) {
      navigate("/user-home");
    }
  }, [userInfo, error]);

  useEffect(() => {
    if (isRegisteredUser) {
      dispatch(loginSuccess(registeredUser));
      localStorage.setItem("userInfo", JSON.stringify(registeredUser));
    }
  }, [isRegisteredUser]);

  //useEffect dla zmiennych walidacyjnych
  useEffect(() => {
    if (username && email && password) {
      setAreAllFieldsFilled(true);
    } else {
      setAreAllFieldsFilled(false);
    }
  }, [username, email, password]);

  useEffect(() => {
    if (registerError) {
      if (registerError.hasOwnProperty("username")) {
        setSubmitAlert(registerError.username[0]);
      }
      if (registerError.hasOwnProperty("email")) {
        setSubmitAlert("Podaj prawidłowy adres email.");
      }
    }
    return () => {
      dispatch(registerUserReset());
    };
  }, [registerError]);

  const submitHandler = (e) => {
    if (isFormValid) {
      e.preventDefault();
      const userToRegister = {
        username: username,
        email: email,
        password: password,
      };
      dispatch(registerUser(userToRegister));
    } else {
      if (!areAllFieldsFilled) {
        setSubmitAlert("Wypełnij wszystkie pola.");
      }
    }
  };

  console.log(registerError);

  return (
    <FormContainer>
      <h1 style={{ fontSize: "32px" }}>Rejestracja</h1>
      {error && <Message variant="danger">error</Message>}
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

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Wpisz adres email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <p style={{ color: "red", fontWeight: "bold" }} className="mt-2">
          {submitAlert}
        </p>
        <div className="d-flex justify-content-start align-items-center">
          <Button variant="primary" type="submit">
            Zarejestruj się
          </Button>
          <p className="mb-0" style={{ marginLeft: "10px" }}>
            Posiadasz już konto?
          </p>
          <LinkContainer
            to="/login"
            style={{ marginLeft: "10px", cursor: "pointer" }}
          >
            <p className="mb-0 text-decoration-underline">Zaloguj się!</p>
          </LinkContainer>
        </div>
      </Form>
    </FormContainer>
  );
}

export default RegisterScreen;
