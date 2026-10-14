import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducer/authSlice";
const reducer = {
  auth: authReducer,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
