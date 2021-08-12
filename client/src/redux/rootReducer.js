import { combineReducers } from "redux";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
  authData: authReducer,
});

export default rootReducer;
