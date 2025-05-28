import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";
import axios from "axios";
// ✅ Fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await orderService.getOrders(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ✅ Update order status
export const updateOrderStatus = createAsyncThunk("orders/updateStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await orderService.updateOrder(orderId, status, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// ✅ Cancel order
export const cancelOrder = createAsyncThunk("orders/cancelOrder", async ({ orderId, reason }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    return await orderService.cancelOrder(orderId, reason, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
export const placeOrder = createAsyncThunk("orders/placeOrder", async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post("https://logitrackplus.netlify.app/api/orders", orderData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  });
  
// 🎯 Initial State
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// 🎯 Redux Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
