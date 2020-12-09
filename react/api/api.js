import axios from "axios";

const axionsInstance = axios.create({
  baseURL: "http://api.biggylabs.com.br/rec-api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axionsInstance;