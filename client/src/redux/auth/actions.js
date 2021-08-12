import { AuthService } from "../../services";
import { LOGIN_FAILURE, LOGIN_SUCCESS } from "./constants";

export const loginSuccess = (data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const doLogin = (data) => {
  return async (dispatch) => {
    AuthService.login(data)
      .then((res) => {
        if (res) {
          const { data } = res;
          dispatch(loginSuccess(data));
        }
      })
      .catch((error) => {
        if (error) {
          dispatch(loginFailure(error.response.data.message));
        }
      });
  };
};
