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

  /** Fetch products from the backend */
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  /** Fetch user cart items */
  const getUserCart = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart");
    }
  };

  /** Fetch user orders */
  const getUserOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  /** Add item to cart */
  const addToCart = async (itemId, sizes) => {
    if (sizes.length === 0) {
      toast.error("Select Product Size");
      return;
    }

    if (!token) {
      toast.error("Please log in to add items to the cart");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, sizes },
        { headers: { token } }
      );

      setCartItems((prevCart) => ({
        ...prevCart,
        [itemId]: {
          ...(prevCart[itemId] || {}),
          ...sizes.reduce((acc, size) => {
            acc[size] = (prevCart[itemId]?.[size] || 0) + 1;
            return acc;
          }, {}),
        },
      }));

      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  /** Update cart item quantity */
  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) return;

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

    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  /** Place an order */
  const placeOrder = async (orderData) => {
    try {
      const orderItems = Object.entries(cartItems).flatMap(
        ([itemId, sizes]) => {
          const product = products.find((p) => p._id === itemId);
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
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  /** Get total number of items in the cart */
  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (total, sizes) =>
        total +
        Object.values(sizes).reduce(
          (sizeTotal, quantity) => sizeTotal + quantity,
          0
        ),
      0
    );
  };

  /** Get total amount of items in the cart */
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
      const product = products.find((p) => p._id === itemId);
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

  /** Initialize token from localStorage */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  /** Fetch cart and orders when token changes */
  useEffect(() => {
    if (token) {
      getUserCart();
      getUserOrders();
    }
  }, [token]);

  /** Fetch products on mount */
  useEffect(() => {
    getProductsData();
  }, []);

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
