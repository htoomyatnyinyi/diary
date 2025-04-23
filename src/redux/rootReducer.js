import { combineReducers } from "@reduxjs/toolkit";
import jobReducer from "./slice/jobSlice.js";

const rootReducer = combineReducers({
  job: jobReducer,
});

export default rootReducer;
