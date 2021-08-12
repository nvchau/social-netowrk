import { LOGIN_FAILURE, LOGIN_SUCCESS } from "./constants";

const initState = {
  user: null,
  error: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { user, token } = action.payload;
      localStorage.setItem("authToken", token);
      return {
        user,
      };

    case LOGIN_FAILURE:
      return {
        error: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default authReducer;
