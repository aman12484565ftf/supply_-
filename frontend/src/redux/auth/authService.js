import axios from "axios";

const API_URL = "https://logitrackplus.netlify.app/api/users"; // Update with your backend URL

// 📌 Register User
const register = async (userData) => {
  const response = await axios.post(`https://logitrackplus.netlify.app/api/users/register`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data)); // Store token in localStorage
  }
  return response.data;
};

// 📌 Login User
const login = async (userData) => {
  // const response = await axios.post(`https://logitrackplus.netlify.app/api/users/login`, userData);
    const response = await axios.post(`https://logitrackplus.netlify.app/api/users/login`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// 📌 Logout User
const logout = () => {
  localStorage.removeItem("user");
};

export default { register, login, logout };
