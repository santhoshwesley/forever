import express from "express";
import {
  placeOrder,
  userOrders,
  trackOrder,
  updateStatus,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// User Routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);
orderRouter.get("/track/:trackingNumber", trackOrder);

// Admin Routes
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.get("/admin/orders", adminAuth, getAllOrders);
orderRouter.put("/update/:orderId", adminAuth, updateOrderStatus);

export default orderRouter;
