import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch Warehouse Stats
export const fetchWarehouseStats = createAsyncThunk(
  "warehouse/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/warehouses/stats");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch warehouse stats");
    }
  }
);

// ✅ Fetch List of Warehouses
export const fetchWarehouses = createAsyncThunk("warehouse/fetchWarehouses", async (_, thunkAPI) => {
  try {
    const response = await axios.get("https://logitrack-o2rk.onrender.com/api/warehouses");
    
    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response: Expected an array.");
    }

    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch warehouses");
  }
});


const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    stats: {},
    warehouses: [],  // ✅ Ensure this is an array
    loading: false,
    error: null,
  },  
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchWarehouseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default warehouseSlice.reducer;
