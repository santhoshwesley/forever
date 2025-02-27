import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    placeOrder,
  } = useContext(ShopContext);

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      // Prepare delivery and payment data
      const orderData = {
        address: deliveryInfo,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        // API calls for COD orders
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/confirmation");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }

          break;

        // Handle other payment methods here if necessary
        default:
          await placeOrder({
            ...deliveryInfo,
            paymentMethod: method,
            orderItems,
          });
          navigate("/confirmation");
          break;
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side: Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="firstName"
            placeholder="First name"
            onChange={handleChange}
            value={deliveryInfo.firstName}
          />
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="lastName"
            placeholder="Last name"
            onChange={handleChange}
            value={deliveryInfo.lastName}
          />
        </div>
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          value={deliveryInfo.email}
        />
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          name="street"
          placeholder="Street"
          onChange={handleChange}
          value={deliveryInfo.street}
        />
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
            value={deliveryInfo.city}
          />
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="state"
            placeholder="State"
            onChange={handleChange}
            value={deliveryInfo.state}
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            name="zip"
            placeholder="Zip Code"
            onChange={handleChange}
            value={deliveryInfo.zip}
          />
          <input
            required
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            name="country"
            placeholder="Country"
            onChange={handleChange}
            value={deliveryInfo.country}
          />
        </div>
        <input
          required
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={deliveryInfo.phone}
        />
      </div>

      {/* Right Side: Cart Summary and Payment Method */}
      <div className="mt-8">
        <CartTotal />

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
