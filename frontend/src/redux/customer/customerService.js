import axios from "axios";

const API_URL = "https://supplychainpro.onrender.com/api/customer"; // Adjust API URL if needed

// Fetch customer orders
export const getCustomerOrders = async () => {
  "customer/fetchOrders",
    async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://supplychainpro.onrender.com/api/customer/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure authentication cookies are sent
      });
      const data = await response.json();
      
      if (!Array.isArray(data)) {   // Ensure response is an array
        console.error("Invalid orders response:", data);
        return [];
      }
  
      return data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.message);
    }
  }
  };

  export const fetchCustomerOrders = async () => (
    "customer/fetchOrders",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetch("https://supplychainpro.onrender.com/api/customer/orders", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure authentication cookies are sent
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("✅ API Response for Orders:", data); // Debugging
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("❌ Error fetching customer orders:", error);
        return rejectWithValue(error.message);
      }
    }
  );
  
  

// Fetch order tracking details
export const trackOrder = async (trackingId) => {
  const response = await axios.get(`${API_URL}/track/${trackingId}`);
  return response.data;
};

// Update customer profile
export const updateProfile = async (token, userData) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/profile`, userData, config);
  return response.data;
};

export default { getCustomerOrders, trackOrder, updateProfile };
