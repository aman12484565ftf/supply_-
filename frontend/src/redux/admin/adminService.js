import axios from "axios";

const API_URL = "https://logitrackplus.netlify.app/api/admin"; // Ensure correct base URL

export const getDashboardStats = async (token) => {
  if (!token) {
    console.error("No token provided"); // Debugging log
    return Promise.reject("No token available");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Ensure token is included
    },
  };

  try {
    const response = await axios.get(`${API_URL}/dashboard`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.response?.data || error);
    throw error;
  }
};


// Fetch All Orders
const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

// Fetch All Users
const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};
export const getRevenueAnalytics = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/revenue-analytics`, config);
  return response.data;
};
export default { getDashboardStats, getAllOrders, getAllUsers, getRevenueAnalytics };
