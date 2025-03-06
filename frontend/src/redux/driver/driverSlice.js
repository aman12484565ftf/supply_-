import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDriverOrders, updateDeliveryStatus } from "./driverService";

export const fetchDriverData = createAsyncThunk("driver/fetchDriverData", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) return thunkAPI.rejectWithValue("No token available");

    const data = await getDriverOrders(token);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateDriverOrder = createAsyncThunk(
  "driver/updateOrder",
  async ({ deliveryId, status, location, otp }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      return await updateDeliveryStatus(token, deliveryId, status, location, otp);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const driverSlice = createSlice({
    name: "driver",
    initialState: {
      deliveries: [],
      totalDistance: 0,
      fuelConsumption: 0,
      onTimeRate: 0,
      deliveryPerformance: [],
      routeEfficiency: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDriverData.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchDriverData.fulfilled, (state, action) => {
          state.loading = false;
          state.deliveries = action.payload.deliveries;
          state.totalDistance = action.payload.totalDistance;
          state.fuelConsumption = action.payload.fuelConsumption;
          state.onTimeRate = action.payload.onTimeRate;
          state.deliveryPerformance = action.payload.deliveryPerformance || [];
          state.routeEfficiency = action.payload.routeEfficiency || [];
        })
        .addCase(fetchDriverData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });

export default driverSlice.reducer;
