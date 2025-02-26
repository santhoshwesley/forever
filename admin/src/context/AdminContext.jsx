import React, { createContext, useState } from "react";
import { backendUrl } from "../App";

export const AdminContext = createContext();

export const AdminProvider = ({ children, token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendUrl}/api/order/admin/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Error: ", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${backendUrl}/api/order/update/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{ orders, fetchAllOrders, updateOrderStatus }}
    >
      {children}
    </AdminContext.Provider>
  );
};
