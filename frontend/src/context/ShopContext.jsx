import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const placeOrder = async (orderData) => {
    try {
      const orderItems = Object.entries(cartItems).flatMap(
        ([itemId, sizes]) => {
          const product = products.find((product) => product._id === itemId);
          if (!product) return [];
          return Object.entries(sizes).map(([size, quantity]) => ({
            productImage: product.images[0],
            productName: product.name,
            productPrice: product.price,
            quantity,
            size,
          }));
        }
      );

      const newOrder = {
        id: orders.length + 1,
        items: orderItems,
        ...orderData,
        date: new Date().toISOString(),
        status: "Ready to Ship",
      };

      setOrders([...orders, newOrder]);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to place order.");
    }
  };

  const addToCart = async (itemId, sizes) => {
    if (sizes.length === 0) {
      toast.error("Select Product Size");
      return;
    }

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, sizes },
          { headers: { token } }
        );
        setCartItems((prevCart) => {
          const updatedCart = { ...prevCart };
          updatedCart[itemId] = {
            ...(updatedCart[itemId] || {}),
            ...sizes.reduce((acc, size) => {
              acc[size] = (updatedCart[itemId]?.[size] || 0) + 1;
              return acc;
            }, {}),
          };
          return updatedCart;
        });

        toast.success("Item added to cart!");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      if (quantity > 0) {
        updatedCart[itemId] = {
          ...(updatedCart[itemId] || {}),
          [size]: quantity,
        };
      } else {
        delete updatedCart[itemId][size];
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
      }
      return updatedCart;
    });

    // Sync with the backend if the user is logged in
    if (token) {
      try {
        // Send request to update the cart in the backend
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to update cart:", error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, sizes) => {
      return (
        total +
        Object.values(sizes).reduce(
          (sizeTotal, quantity) => sizeTotal + quantity,
          0
        )
      );
    }, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((product) => product._id === itemId);
      if (!product) return total;
      return (
        total +
        Object.entries(sizes).reduce(
          (subTotal, [size, quantity]) => subTotal + product.price * quantity,
          0
        )
      );
    }, 0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getUserOrders = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: token },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders); // Update the orders state
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserOrders();
    }
  }, [token]);

  useEffect(() => {
    getProductsData();
  }, []);

  // useEffect(() => {
  //   if (!token && localStorage.getItem('token')) {
  //     setToken(localStorage.getItem('token'))
  //     getUserCart(localStorage.getItem('token'))
  //   }
  // }, [])

  useEffect(() => {
    // Check for token in local storage on component mount
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    // Fetch cart data once token is available
    if (token) {
      getUserCart();
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    getCartAmount,
    placeOrder,
    orders,
    navigate,
    updateQuantity,
    setToken,
    token,
    backendUrl,
    getUserOrders,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
