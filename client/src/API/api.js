import axios from "axios";
import {
  API_NOTIFICATION_MESSAGES,
  SERVICE_URLS,
} from "../constants/config.js";
// import {
//   getAccessToken,
//   getRefreshToken,
//   setAccessToken,
//   getType,
// } from "../utils/common-utils";

const API_URL = "http://localhost:5000";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "content-type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  function (response) {
    //stop loader
    return processResponse(response);
  },
  function (error) {
    // stop loader
    return Promise.reject(processError(error));
  }
);
const processResponse = (response) => {
  if (response) {
    if (response.status === 200) {
      return {
        isSuccess: true,
        data: response.data,
      };
    } else {
      return {
        isFailure: true,
        status: response.status,
        msg: response.msg,
        code: response.code,
      };
    }
  } else {
    console.log("no response");
  }
};
const processError = (error) => {
  if (error.response) {
    // Request made and server responded with a status code
    // that falls out of the range of 2xx
    console.log("error msg in response:", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.responseFailure,
      code: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.log("error msg in request:", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailure,
      code: "",
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("error msg in network:", error.toJSON());
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.networkFailure,
      code: "",
    };
  }
};
const API = {};
for (const [key, value] of Object.entries(SERVICE_URLS)) {
  API[key] = (body, showUploadProgress, showDownloadProgress) =>
    axiosInstance({
      method: value.method,
      url: value.url,
      data: body,
      responseType: value.responseType,
      // data: value.method === 'DELETE' ? '' : body,

      // headers: {
      //     authorization: getAccessToken(),
      // },
      // TYPE: getType(value, body),
      onUploadProgress: function (progressEvent) {
        if (showUploadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showUploadProgress(percentCompleted);
        }
      },
      onDownloadProgress: function (progressEvent) {
        if (showDownloadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showDownloadProgress(percentCompleted);
        }
      },
    });
}

export { API };

