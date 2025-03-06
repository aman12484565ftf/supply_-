import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice"; // Ensure this path is correct
import authReducer from "./auth/authSlice"; // Ensure this path is correct
import inventoryReducer from "./inventory/inventorySlice";
import orderReducer from "./orders/orderSlice";
import driverReducer from "./driver/driverSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    driver: driverReducer,
  },
});

export default store; // ✅ Ensure this line is present
