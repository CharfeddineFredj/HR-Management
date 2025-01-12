/* eslint-disable prettier/prettier */
// store.js

// import { createStore, applyMiddleware } from 'redux';
// import rootReducer from './reducers'; // Import your root reducer
// import thunk from 'redux-thunk'; // Import Redux Thunk middleware if you're using it

// const store = createStore(rootReducer, applyMiddleware(thunk)); // Create the Redux store with rootReducer and apply middleware

// export default store; // Export the Redux store


import { createStore, combineReducers } from 'redux';
import authReducer from '../Redux/authReducer'; // Adjust the path as needed

// Combine reducers if you have more than one reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here if needed
});

const store = createStore(rootReducer);

export default store;
