import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { orders, currency } = useContext(ShopContext);
  console.log(orders);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="py-4 border-t border-b text-gray-700">
              <p className="font-semibold text-lg mb-2">
                Order ID: {order.id} - Date: {order.date}
              </p>

              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col md:flex-row md:items-center gap-4 py-4 border-b"
                >
                  {/* Image and product details (50%) */}
                  <div className="flex items-start gap-6 text-sm w-full md:w-1/2">
                    <img
                      className="w-16 sm:w-20"
                      src={item.productImage}
                      alt=""
                    />
                    <div>
                      <p className="sm:text-base font-medium">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {currency}
                          {item.productPrice}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ready to Ship (25%) */}
                  <div className="flex items-center justify-center w-full md:w-1/4">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <p className="text-sm md:text-base">Ready to Ship</p>
                  </div>

                  {/* Track Order button (25%) */}
                  <div className="flex justify-center w-full md:w-1/4">
                    <button className="border px-4 py-2 text-sm font-medium rounded-sm">
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
    </div>
  );
};

export default Orders;
