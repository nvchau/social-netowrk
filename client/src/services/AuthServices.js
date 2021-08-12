import { PREFIX, RESOURCE } from "../constants";
import axios from "../helpers/axios";

const login = (body) =>
  axios.post(
    `${PREFIX.API}/${PREFIX.AUTH}/${PREFIX.AUTH}/${RESOURCE.LOGIN}`,
    body
  );

const authApi = { login };

export default authApi;
