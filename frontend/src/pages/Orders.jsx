import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const { orders, currency, getUserOrders } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await getUserOrders();
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currency, orders]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="py-4 border-t border-b text-gray-700">
                <p className="font-semibold text-lg mb-2">
                  Order ID: {order._id}
                </p>
                <p className="font-semibold text-lg mb-2">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col md:flex-row md:items-center gap-4 py-4 border-b"
                  >
                    <div className="flex items-start gap-6 text-sm w-full md:w-1/2">
                      <img
                        className="w-16 sm:w-20"
                        src={item.images[0]}
                        alt=""
                      />
                      <div>
                        <p className="sm:text-base font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                          <p className="text-lg">
                            {currency}
                            {item.price}
                          </p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-full md:w-1/4">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <p className="text-sm md:text-base">
                        {order.status?.toLowerCase() === "order placed"
                          ? "Ready to Ship"
                          : order.status || "Pending"}
                      </p>
                    </div>

                    <div className="flex justify-center w-full md:w-1/4">
                      <button
                        onClick={() =>
                          navigate(
                            `/track-order?trackingNumber=${order.trackingNumber}`
                          )
                        }
                        className="border px-4 py-2 text-sm font-medium rounded-sm"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No orders placed yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
