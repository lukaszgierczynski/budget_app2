import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Loader from "../components/Loader";

import { getProfile } from "../actions/userActions/profileAction";
import { updateProfile } from "../actions/userActions/profileUpdateAction";
import logoutAction from "../actions/userActions/userLogoutAction";
import { profileReset } from "../slicers/userSlicers/profileSlice";
import { updateProfileReset } from "../slicers/userSlicers/profileUpdateSlice";

import {
  editBannedList,
  isAllowed,
} from "../utilities/userUtilities/userPermissions";

function ProfileScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [submitAlert, setSubmitAlert] = useState("");

  //frontendowe zmienne walidacyjne dla formularza
  const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false);

  let isFormValid;
  isFormValid = areAllFieldsFilled;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const profileDetails = useSelector((state) => state.profileDetails);
  const { isProfile, loading, error, profile } = profileDetails;
  const updatedProfile = useSelector((state) => state.profileUpdate);
  const {
    isUpdatedProfile,
    loading: loadingUpdate,
    error: errorUpdate,
    profileUpdate,
  } = updatedProfile;

  const isUserAllowed = isAllowed(userInfo.username, editBannedList);

  useEffect(() => {
    if (error === "Given token not valid for any token type" || !userInfo) {
      dispatch(logoutAction());
      navigate("/login");
    }

    return () => {
      dispatch(profileReset());
      dispatch(updateProfileReset());
    };
  }, [error, userInfo]);

  useEffect(() => {
    if (!isProfile) {
      dispatch(getProfile());
    } else {
      setUsername(profile.username);
      setEmail(profile.email);
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
    }
  }, [isProfile]);

  useEffect(() => {
    if (isUpdatedProfile && !errorUpdate) {
      navigate("/user-home");
    }
  }, [isUpdatedProfile, errorUpdate]);

  useEffect(() => {
    if (
      username === "" ||
      email === "" ||
      firstName === "" ||
      lastName === "" ||
      password === ""
    ) {
      setAreAllFieldsFilled(false);
    } else {
      setAreAllFieldsFilled(true);
    }
  }, [username, email, firstName, lastName, password]);

  const submitHandler = () => {
    setSubmitAlert("");
    if (!isUserAllowed) {
      window.confirm("Nie masz uprawnień do wykonania tej operacji.");
    } else {
      if (isFormValid) {
        const profileToUpdate = {
          username: username,
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
        };
        dispatch(updateProfile(profileToUpdate));
        setPassword("");
      } else {
        if (!areAllFieldsFilled) {
          setSubmitAlert("Wypełnij wszystkie pola.");
        }
      }
    }
  };

  return (loading || loadingUpdate) ? (
    <Loader />
  ) : (
    <Container style={{ maxWidth: "600px" }}>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Nazwa użytkownika
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Podaj nazwę użytkownika"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="Podaj e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="first_name" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>Imię</Form.Label>
              <Form.Control
                type="text"
                placeholder="Podaj imię"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="last_name" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>Nazwisko</Form.Label>
              <Form.Control
                type="text"
                placeholder="Podaj nazwisko"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Potwierdź zmiany hasłem:
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Podaj hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <div className="d-flex flex-column justify-content-center align-items-center">
              {submitAlert ? (
                <p
                  style={{ color: "red", fontWeight: "bold" }}
                  className="mt-2"
                >
                  {submitAlert}
                </p>
              ) : errorUpdate ? (
                <p
                  style={{ color: "red", fontWeight: "bold" }}
                  className="mt-2"
                >
                  {errorUpdate}
                </p>
              ) : (
                ""
              )}
              <div>
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => navigate("/user-home")}
                >
                  Anuluj
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  type="submit"
                  onClick={submitHandler}
                >
                  Zapisz
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileScreen;
