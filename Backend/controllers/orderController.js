import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import mongoose from "mongoose";
// Track Order
export const trackOrder = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const order = await orderModel.findOne({ trackingNumber });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      orderId: order._id,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
      items: order.items,
      amount: order.amount,
      address: order.address,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Place Order using COD
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const trackingNumber = crypto.randomBytes(6).toString("hex");

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trackingNumber,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch User Orders
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const orders = await orderModel.find({ userId });

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Order Status (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
