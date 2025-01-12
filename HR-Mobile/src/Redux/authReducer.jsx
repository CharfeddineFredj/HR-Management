/* eslint-disable prettier/prettier */
// authReducer.js

import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT  } from './authActions';

const initialState = {
  token: null,
  id: null,
  roles: [],
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        id: action.payload.id,
        roles: action.payload.roles,  // Save roles to the state
        loading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...initialState,
      };  // Reset the state
    default:
      return state;
  }
};

export default authReducer;
