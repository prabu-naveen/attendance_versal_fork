import axios from 'axios';
import instance from '../../axios-attendance';
import * as actionTypes from './actionTypes';

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSuccess = (token, userId, role) => ({
  type: actionTypes.AUTH_SUCCESS,
  idToken: token,
  userId,
  role,
});

export const authFail = (error) => ({
  type: actionTypes.AUTH_FAIL,
  error,
});

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeOut = (expirationTime) => (dispatch) => {
  setTimeout(() => {
    dispatch(logout());
  }, expirationTime * 1000);
};

export const setAuthRedirectPath = (path) => (
  {
    type: actionTypes.SET_AUTH_REDIRECT,
    path,
  }
);

export const auth = (email, password, role, fullName, isSignup) => async (dispatch) => {
  try {
    dispatch(authStart());
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCRCXWfxWK8inbfk7dsjVlgOP3QHJU23S8';
    if (!isSignup) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCRCXWfxWK8inbfk7dsjVlgOP3QHJU23S8';
    }
    const response = await axios.post(url, authData);
    const token = response.data.idToken;
    const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
    const userId = response.data.localId;
    let userRole = role;
    if (isSignup) {
      const userData = {
        userId,
        role,
        fullName,
      };
      await instance.post(`/users.json?auth=${token}`, userData);
    } else {
      const users = await instance.get(`/users.json?auth=${token}`);
      const fetchedUsers = [];
      Object.keys(users.data).forEach((key) => {
        fetchedUsers.push({
          ...users.data[key],
        });
      });
      const user = fetchedUsers.find((userData) => userData.userId === userId);
      userRole = user.role;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', userRole);
    dispatch(authSuccess(response.data.idToken, response.data.localId, userRole));
    dispatch(setAuthRedirectPath('/list'));
    dispatch(checkAuthTimeOut(response.data.expiresIn));
  } catch (error) {
    console.log(error);
    dispatch(authFail(error.response.data.error));
  }
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(logout());
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(logout());
    } else {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      dispatch(authSuccess(token, userId, role));
      dispatch(setAuthRedirectPath('/list'));
      dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
};
