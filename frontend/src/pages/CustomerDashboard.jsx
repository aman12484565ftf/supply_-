import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrders, fetchOrderTracking, updateCustomerProfile } from "../redux/customer/customerSlice";
import { Loader2, Package, Truck, MapPin, Edit3, Save, User, ShieldCheck, ChevronRight, Clock, DollarSign } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { orders, tracking, profile, loading, error } = useSelector((state) => state.customer);
  const [trackingId, setTrackingId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchCustomerOrders());
    dispatch(updateCustomerProfile()); // Fetch profile if needed
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUserData({ name: profile.name, email: profile.email });
    }
  }, [profile]);

  const handleTrackOrder = () => {
    if (trackingId) {
      dispatch(fetchOrderTracking(trackingId));
    }
  };

  const handleProfileUpdate = () => {
    dispatch(updateCustomerProfile(userData));
    setEditMode(false);
  };

  // Get the status badge styling
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case "Delivered": 
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "Processing": 
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "Shipped": 
        return "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white";
      default: 
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with Animated Gradient */}
          <header 
            className="mb-8 p-6 rounded-xl bg-white shadow-lg relative overflow-hidden"
            style={{ 
              transform: `translateY(${-scrollY * 0.03}px)`,
              opacity: 1 - scrollY * 0.001
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome Back{profile ? `, ${profile.name}` : ""}
              </h1>
              <p className="text-gray-600 mt-2">Manage your orders, track shipments, and update your profile.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Package className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-800">{orders.length}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 mr-4">
                    <Truck className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Shipments</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {orders.filter(order => order.orderStatus !== "Delivered").length}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <ShieldCheck className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {orders.filter(order => order.orderStatus === "Delivered").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-500 w-16 h-16 mx-auto mb-4" />
                <p className="text-gray-600">Loading your order information...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-8">
              <p className="text-red-600 font-semibold text-center">Error: {error}</p>
              <p className="text-center mt-2 text-gray-600">Please try refreshing the page.</p>
            </div>
          ) : (
            <>
              {/* Order History with Enhanced UI */}
              <div className="bg-white p-6 shadow-lg rounded-xl mb-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Order History
                  </h2>
                  {orders.length > 0 && (
                    <span className="text-sm text-gray-500">
                      Showing {orders.length} order{orders.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">No orders found.</p>
                    <a 
                      href="/shop" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Browse products <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 rounded-tl-lg font-semibold text-gray-700">Order ID</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Total</th>
                          <th className="py-3 px-4 rounded-tr-lg font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr 
                            key={order._id} 
                            className={`border-b hover:bg-blue-50 transition-colors duration-150 ${
                              index === orders.length - 1 ? 'border-none' : ''
                            }`}
                          >
                            <td className="py-4 px-4">
                              <span className="font-medium">#{order._id.substring(0, 8)}</span>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              
                              {new Date().toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span 
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  getStatusBadgeStyle(order.orderStatus)
                                }`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                                <span className="font-semibold">
                                  {order.totalAmount.toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-105 shadow-md"
                                onClick={() => setTrackingId(order.trackingId)}
                              >
                                <Truck className="inline-block w-4 h-4 mr-1" />
                                Track
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    Track Order
                  </h2>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Enter Tracking ID"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                    <button
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-105 shadow-md flex-shrink-0"
                      onClick={handleTrackOrder}
                    >
                      Track
                    </button>
                  </div>

                  {tracking && (
                    <div className="mt-6 p-5 border rounded-lg bg-blue-50 border-blue-100 transition-all duration-500 animate-fadeIn">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tracking Details</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-indigo-100 mr-3">
                            <Truck className="text-indigo-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">{tracking.status}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-blue-100 mr-3">
                            <Package className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium">{tracking.orderId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-green-100 mr-3">
                            <MapPin className="text-green-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tracking ID</p>
                            <p className="font-medium">{tracking.trackingId}</p>
                          </div>
                        </div>
                      </div>
                      
                      {tracking.qrCode && (
                        <div className="mt-5 flex justify-center">
                          <div className="p-2 bg-white rounded-lg shadow border">
                            <img src={tracking.qrCode} alt="QR Code" className="w-32 h-32" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Profile
                  </h2>
                  
                  {!editMode ? (
                    <div className="flex flex-col items-center text-center p-5 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 text-white text-2xl font-bold">
                        {userData.name ? userData.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{userData.name}</h3>
                      <p className="text-gray-500 mb-5">{userData.email}</p>
                      <button
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-105 shadow-md flex items-center"
                        onClick={() => setEditMode(true)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          />
                        </div>
                        
                        <div className="flex space-x-3 pt-3">
                          <button
                            className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transform transition-transform duration-200 hover:scale-105 shadow-md flex items-center justify-center"
                            onClick={handleProfileUpdate}
                          >
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                          </button>
                          
                          <button
                            className="flex-1 px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// You'll need to add this CSS to your global styles
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.4s ease-out forwards;
// }

export default CustomerDashboard;