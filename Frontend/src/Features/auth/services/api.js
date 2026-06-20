import axios from "axios";

const API = axios.create({
  baseURL: "https://snitch-e-commerce.onrender.com/api", // 👈 your backend URL
  withCredentials: true, // optional (useful for cookies later)
});

export default API;