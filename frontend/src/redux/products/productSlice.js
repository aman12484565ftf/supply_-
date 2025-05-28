import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch products from backend
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("https://logitrack-o2rk.onrender.com/api/products", config);
    return response.data; // Ensure this returns an array
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [], // ✅ Ensure it's an array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
