import React, {useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";


function HomeScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error, loading } = userLogin;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo) {
      navigate("/user-home");
    }
  }, [navigate, userInfo]);

  return <div>HomeScreen</div>;
}

export default HomeScreen;
