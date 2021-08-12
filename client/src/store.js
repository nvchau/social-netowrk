import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./redux/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";

let middleware;
if (process.env.REACT_APP_ENVIRONMENT === "prod") {
  middleware = applyMiddleware(thunk);
} else {
  middleware = applyMiddleware(thunk, logger);
}

const store = createStore(rootReducer, composeWithDevTools(middleware));
export default store;
