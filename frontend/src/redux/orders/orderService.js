import axios from "axios";

const API_URL = "http://localhost:5000/api/orders"; // Adjust if needed

// ✅ Get all orders
const getOrders = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// ✅ Update order status
const updateOrder = async (orderId, status, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${orderId}`, { status }, config);
  return response.data;
};

// ✅ Cancel order
const cancelOrder = async (orderId, reason, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${orderId}/cancel`, { reason }, config);
  return response.data;
};

const orderService = { getOrders, updateOrder, cancelOrder };
export default orderService;
