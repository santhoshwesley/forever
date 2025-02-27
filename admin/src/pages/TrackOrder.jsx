import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TrackOrder = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const trackingNumberFromUrl = params.get("trackingNumber");

  const [trackingNumber, setTrackingNumber] = useState(
    trackingNumberFromUrl || ""
  );
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackingNumberFromUrl) {
      handleTrackOrder();
    }
  }, [trackingNumberFromUrl]);

  const handleTrackOrder = async () => {
    setError("");
    setTrackingData(null);

    if (!trackingNumber.trim()) {
      setError("Please enter a valid Tracking Number.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to track orders.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/order/track/${trackingNumber}`
      );

      if (response.status === 401) {
        setError("Not Authorized: Login Again");
        localStorage.removeItem("token");
        return;
      }

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.trackingNumber && data.status) {
        setTrackingData(data);
        setTrackingNumber("");
      } else {
        setError(data.message || "Tracking information not found.");
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-2xl font-bold text-center">Track Your Order</h2>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Tracking Number"
          className="w-full p-2 border rounded-md"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button
          onClick={handleTrackOrder}
          className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {trackingData && (
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <p>
            <strong>Order ID:</strong> {trackingData.orderId}
          </p>
          <p>
            <strong>Status:</strong> {trackingData.status}
          </p>
          {trackingData.estimatedDelivery && (
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Tracking Number:</strong> {trackingData.trackingNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
