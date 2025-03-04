import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Date, default: Date.now },
    estimatedDelivery: { type: Date, default: null },
    trackingNumber: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
