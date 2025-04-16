const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes.js");
const inventoryRoutes = require("./routes/inventoryRoutes");
const customerRoutes = require("./routes/customerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT"],
    credentials: false // No credentials needed
  }
});

// app.use(cors({
//   origin: "http://localhost:5173", // Your frontend URL
//   credentials: true // Allow credentials
// }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// WebSocket for real-time shipment tracking
io.on("connection", (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  socket.on("trackShipment", (shipmentId) => {
    console.log(`📦 Tracking shipment: ${shipmentId}`);
    socket.join(shipmentId); // Join room for shipment
  });

  socket.on("updateShipment", (data) => {
    console.log(`🚚 Shipment ${data.shipmentId} updated to: ${data.status}`);
    io.to(data.shipmentId).emit("shipmentUpdated", data); // Notify users
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
// app.use(userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/driver", require("./routes/driverRoutes"));
app.use("/api/customer", customerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/invoice", invoiceRoutes);

app.get('/ping', (req, res) => {
  console.log('Keep-alive ping received');
  res.status(200).send('OK');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);



// Export io instance for WebSocket events in routes
module.exports = { app,io };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
