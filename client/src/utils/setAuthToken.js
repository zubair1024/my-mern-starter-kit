import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["Access-Control-Allow-Origin"];
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
