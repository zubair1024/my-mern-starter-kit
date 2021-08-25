import axios from "axios";

import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./constants";

export const loadUser = () => async (dispatch) => {
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"));
  }

  try {
    const res = await axios.get("http://localhost:5000/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const registerUser =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      name,
      email,
      password,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users",
        body,
        config
      );
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { token: res.data.token },
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors && errors.length) {
        errors.forEach((errorEl) => {
          dispatch(setAlert(errorEl.msg, "danger"));
        });
      }
      dispatch({ type: REGISTER_FAIL });
    }
  };

export const loginUser =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth",
        body,
        config
      );
      console.log(`LOGIN_SUCCESS`);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: res.data.token },
      });
      console.log(`loadUser`);
      dispatch(loadUser());
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors && errors.length) {
        errors.forEach((errorEl) => {
          dispatch(setAlert(errorEl.msg, "danger"));
        });
      }
      dispatch({ type: LOGIN_FAIL });
    }
  };

export const logoutUser = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
