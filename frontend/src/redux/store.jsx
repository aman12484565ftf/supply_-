import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice"; // Ensure this path is correct
import authReducer from "./auth/authSlice"; // Ensure this path is correct
import inventoryReducer from "./inventory/inventorySlice";
import orderReducer from "./orders/orderSlice";
import driverReducer from "./driver/driverSlice";
import customerReducer from "./customer/customerSlice";
import productReducer from "./products/productSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    driver: driverReducer,
    customer: customerReducer,
    products: productReducer,
  },
});

export default store; // ✅ Ensure this line is present
