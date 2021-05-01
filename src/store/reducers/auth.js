import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../Utils/utility';

const initialState = {
  token: null,
  userId: null,
  role: null,
  error: null,
  loading: false,
  authRedirect: '/list',
};

const authStart = (state) => (updateObject(state, { error: null, loading: true }));

const authSuccess = (state, action) => (
  updateObject(state, {
    error: null,
    loading: false,
    token: action.idToken,
    userId: action.userId,
    role: action.role,
  })
);

const authFail = (state, action) => (
  updateObject(state, { error: action.error, loading: false })
);

const authLogout = (state) => (
  updateObject(
    state,
    {
      token: null,
      userId: null,
      role: null,
      authRedirect: '/list',
    },
  )
);

const setAuthRedirectPath = (state, action) => (
  updateObject(state, { authRedirect: action.path })
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT: return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
