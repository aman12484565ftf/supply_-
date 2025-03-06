import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInventory, addProduct, updateProduct, deleteProduct } from "./inventoryService";

// Fetch all inventory items
export const fetchInventory = createAsyncThunk(
  "inventory/fetchAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await getInventory(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new product
export const createProduct = createAsyncThunk(
  "inventory/addProduct",
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await addProduct(productData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update a product
export const EditProduct = createAsyncThunk(
    "inventory/updateProduct",
    async ({ id, updatedData }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user?.token;
        if (!id) throw new Error("Product ID is missing");
  
        return await updateProduct(id, updatedData, token);
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

// Delete a product
export const removeProduct = createAsyncThunk(
  "inventory/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await deleteProduct(productId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(EditProduct.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload.id);
      });
  },
});

export default inventorySlice.reducer;
