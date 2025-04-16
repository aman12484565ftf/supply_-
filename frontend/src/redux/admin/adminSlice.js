import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStats, getRevenueAnalytics } from "./adminService";
import axios from "axios";
// Fetch dashboard stats (orders, revenue, users, stock)
export const fetchAdminData = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) return thunkAPI.rejectWithValue("No token available");

      const data = await getDashboardStats(token);
      console.log("📊 Dashboard Data Received in Redux:", data);

      return {
        orders: data.orders || 0,
        revenue: data.revenue || 0,
        users: data.users || 0,
        stock: data.stock || 0,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Error fetching dashboard stats");
    }
  }
);
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const response = await axios.get("http://localhost:5000/api/admin/users", config);
    console.log("✅ Fetched Users:", response.data); // 🔍 Debugging

    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});
// Fetch monthly revenue analytics
export const fetchRevenueAnalytics = createAsyncThunk(
  "admin/fetchRevenueAnalytics",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) return thunkAPI.rejectWithValue("No token available");

      const revenueData = await getRevenueAnalytics(token);
      console.log("📊 Revenue Analytics Data:", revenueData);

      return revenueData || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Error fetching revenue analytics");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    orders: 0,
    revenue: 0,
    users: 0,
    stock: 0,
    revenueData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        console.log("📊 Updating Admin State:", action.payload);
        state.orders = action.payload.orders;
        state.revenue = action.payload.revenue;
        state.users = action.payload.users;
        state.stock = action.payload.stock;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
