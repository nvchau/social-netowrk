/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable symbol-description */
import axios from "axios";

import { isEmpty, assign, isObject, reduce } from "lodash";
import { BASE_API_URL } from "../constants";

const JSONBig = require("json-bigint");

const singletonEnforcer = Symbol();

class AxiosClient {
  constructor(enforcer) {
    if (enforcer !== singletonEnforcer) {
      throw new Error("Cannot initialize Axios client single instance");
    }

    this.axiosClient = axios.create({
      baseURL: BASE_API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });

    this.getExistTokenOnLocalStorage();

    this.axiosClient.defaults.transformResponse = (data) => JSONBig.parse(data);

    this.axiosClient.interceptors.request.use(
      (configure) => configure,
      (error) => Promise.reject(error)
    );

    this.axiosClient.interceptors.response.use(
      ({ data, config }) => {
        const { url } = config;
        // update header after login
        if (url.includes("login") || url.includes("callback")) {
          this.setHeader(data.token);
        }
        return data;
      },
      (error) => {
        // const { status } = error.response

        if (error.response.data.errors) {
          error.response.data.message = reduce(
            error.response.data.errors,
            (errorObject, item) => [...errorObject, ...item],
            []
          );
          return Promise.reject(error.response.data);
        }
        if (error.response.data && isObject(error.response.data)) {
          return Promise.reject(error.response.data);
        }

        return Promise.reject(error.response);
      }
    );
  }

  static get instance() {
    if (!this.axiosClientInstance) {
      this.axiosClientInstance = new AxiosClient(singletonEnforcer);
    }

    return this.axiosClientInstance;
  }

  getExistTokenOnLocalStorage() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      this.setHeader(userToken);
    }
  }

  setHeader = (userToken = null) => {
    this.axiosClient.defaults.headers.common.Authorization = `Bearer ${userToken}`;
  };

  get = async (resource, slug = "", config = {}) => {
    const requestURL = isEmpty(slug) ? `${resource}` : `${resource}/${slug}`;
    return this.axiosClient.get(requestURL, {
      data: null,
      ...assign(config, {
        headers: isEmpty(config.headers)
          ? this.axiosClient.defaults.headers
          : { ...this.axiosClient.defaults.headers, ...config.headers },
      }),
    });
  };

  post = async (resource, data, config = {}) =>
    this.axiosClient.post(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );

  update = async (resource, data, config = {}) =>
    this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );

  put = async (resource, data, config = {}) =>
    this.axiosClient.put(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );

  patch = async (resource, data, config = {}) =>
    this.axiosClient.patch(
      `${resource}`,
      data,
      assign(config, this.axiosClient.defaults.headers)
    );

  delete = async (resource, data, config = {}) =>
    this.axiosClient.delete(`${resource}`, {
      params: data,
      ...assign(config, { headers: this.axiosClient.defaults.headers }),
    });
}

export default AxiosClient.instance;
