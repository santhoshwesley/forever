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
        date: new Date().toLocaleDateString(),
        status: "Ready to Ship",
      };

      setOrders([...orders, newOrder]);
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to place order.");
    }
  };

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    const updatedCart = { ...cartItems };
    if (updatedCart[itemId]) {
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
    } else {
      updatedCart[itemId] = { [size]: 1 };
    }
    setCartItems(updatedCart);
  };

  const updateQuantity = (itemId, size, quantity) => {
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
    addToCart,
    getCartCount,
    getCartAmount,
    placeOrder,
    orders,
    navigate,
    updateQuantity,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
