import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrders, fetchOrderTracking, updateCustomerProfile } from "../redux/customer/customerSlice";
import { Loader2, Package, Truck, MapPin, Edit3, Save, User, ShieldCheck, ChevronRight, Clock, DollarSign } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  
  // ✅ Ensure `orders` is always an array
  const { orders = [], tracking, profile, loading, error } = useSelector((state) => state.customer || {});

console.log("🛠️ Orders from Redux:", orders); // Debugging
console.log("🛠️ Orders Type:", typeof orders); // Debugging
  
  const [trackingId, setTrackingId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCustomerOrders());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUserData({ name: profile.name || "", email: profile.email || "" });
    }
  }, [profile]);

  const handleTrackOrder = () => {
    if (trackingId.trim()) {
      dispatch(fetchOrderTracking(trackingId));
    }
  };

  const handleProfileUpdate = () => {
    dispatch(updateCustomerProfile(userData));
    setEditMode(false);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-white";
      case "Processing":
        return "bg-blue-500 text-white";
      case "Shipped":
        return "bg-indigo-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header 
            className="mb-8 p-6 rounded-xl bg-white shadow-lg relative overflow-hidden"
            style={{ transform: `translateY(${-scrollY * 0.03}px)`, opacity: 1 - scrollY * 0.001 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back{profile ? `, ${profile.name}` : ""}
            </h1>
            <p className="text-gray-600 mt-2">Manage your orders, track shipments, and update your profile.</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-blue-500 w-16 h-16" />
              <p className="text-gray-600 ml-4">Loading your order information...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-8">
              <p className="text-red-600 font-semibold">Error: {error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatCard title="Total Orders" value={orders.length || 0} icon={<Package />} />
                <StatCard title="Active Shipments" value={orders.filter(order => order.orderStatus !== "Delivered").length} icon={<Truck />} />
                <StatCard title="Completed" value={orders.filter(order => order.orderStatus === "Delivered").length} icon={<ShieldCheck />} />
              </div>

              {/* Order History */}
              <div className="bg-white p-6 shadow-lg rounded-xl mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No orders found.</p>
                    <a href="/shop" className="text-blue-600 font-medium">Browse products →</a>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-gray-700">Order ID</th>
                        <th className="py-3 px-4 text-gray-700">Status</th>
                        <th className="py-3 px-4 text-gray-700">Total</th>
                        <th className="py-3 px-4 text-gray-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-blue-50">
                          <td className="py-4 px-4">#{order._id.substring(0, 8)}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <DollarSign className="w-4 h-4 text-green-600 inline-block" />
                            {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm" onClick={() => setTrackingId(order.trackingId)}>
                              <Truck className="inline-block w-4 h-4 mr-1" /> Track
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Track Order */}
              <div className="bg-white p-6 shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800">Track Order</h2>
                <div className="flex items-center gap-4">
                  <input type="text" placeholder="Enter Tracking ID" className="w-full p-3 border rounded-lg" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
                  <button className="px-5 py-3 bg-blue-600 text-white rounded-lg" onClick={handleTrackOrder}>Track</button>
                </div>
                {tracking && (
                  <div className="mt-6 p-5 border rounded-lg bg-blue-50">
                    <h3 className="text-lg font-semibold">Tracking Details</h3>
                    <p>Status: {tracking.status}</p>
                    <p>Order ID: {tracking.orderId}</p>
                    <p>Tracking ID: {tracking.trackingId}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon }) => (
  <div className="p-4 bg-white rounded-lg shadow-md flex items-center">
    <div className="p-3 rounded-full bg-gray-100 mr-4">{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default CustomerDashboard;
