const mongoose = require("mongoose");
const Delivery = require("../models/Delivery");
const Order = require("../models/orderModel");
const User = require("../models/User");
require("dotenv").config();

const seedDeliveries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const driver = await User.findOne({ role: "driver" });
    if (!driver) {
      throw new Error("No driver found. Create a driver user first.");
    }

    const order = await Order.findOne();
    if (!order) {
      throw new Error("No orders found. Create an order first.");
    }

    const deliveries = [
      {
        order: order._id,
        driver: driver._id,
        status: "Assigned",
        location: "Warehouse",
        deliveryOTP: "123456",
      },
    ];

    await Delivery.insertMany(deliveries);
    console.log("✅ Test Deliveries Added!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error Seeding Deliveries:", error);
    mongoose.connection.close();
  }
};

seedDeliveries();
