import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrders, fetchOrderTracking, updateCustomerProfile } from "../redux/customer/customerSlice";
import { 
  Package, 
  Truck, 
  MapPin, 
  Edit3, 
  Save, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Bell,
  Search,
  Calendar,
  List,
  ArrowUpRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { orders, tracking, profile, loading, error } = useSelector((state) => state.customer);
  const [trackingId, setTrackingId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [scrollY, setScrollY] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

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
    setTimeout(() => setAnimateStats(true), 100);
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
        return "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white";
      case "Processing": 
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "Shipped": 
        return "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white";
      default: 
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
    }
  };
  
  // Recent activities based on orders
  const recentActivities = orders.length > 0 
    ? orders.slice(0, 5).map((order, index) => ({
        id: index,
        title: `Order #${order._id.substring(0, 8)}`,
        status: order.orderStatus,
        amount: `$${order.totalAmount.toLocaleString()}`,
        time: `${index} days ago`
      }))
    : [];

  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Floating bubbles background */}
        <div className="absolute inset-0 overflow-hidden opacity-60 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-200 opacity-40"
              style={{
                width: `${Math.random() * 150 + 80}px`,
                height: `${Math.random() * 150 + 80}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10">
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center p-6 backdrop-blur-sm bg-white/70 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Customer Orders Center
              </h1>
              <p className="text-gray-500">Welcome back{profile ? `, ${profile.name}` : ""}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="relative p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-center">
                Error: {error}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* View Selection Tabs */}
              <div className="flex border-b border-gray-200 mb-6 bg-white/80 backdrop-blur-sm rounded-t-xl px-2 pt-2">
                {['overview', 'orders', 'tracking', 'profile'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                      selectedView === tab 
                        ? 'text-indigo-600 bg-gradient-to-b from-white to-indigo-50 shadow-sm border-t border-l border-r border-gray-200' 
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                    onClick={() => setSelectedView(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickStatCard
                  title="Total Orders"
                  value={orders.length}
                  change="+5.2%"
                  isPositive={true}
                  icon={<Package size={20} />}
                  color="indigo"
                />
                <QuickStatCard
                  title="Active Shipments"
                  value={orders.filter(order => order.orderStatus !== "Delivered").length}
                  change="+3.1%"
                  isPositive={true}
                  icon={<Truck size={20} />}
                  color="blue"
                />
                <QuickStatCard
                  title="Completed"
                  value={orders.filter(order => order.orderStatus === "Delivered").length}
                  change="+8.4%"
                  isPositive={true}
                  icon={<ShieldCheck size={20} />}
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders List with Glass Effect */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-lg">
                      <Calendar size={16} />
                      <span>Last 30 days</span>
                    </div>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-indigo-50/50 rounded-lg">
                      <Package className="w-12 h-12 text-indigo-300 mb-3" />
                      <p className="text-gray-500 mb-2">No orders found</p>
                      <a 
                        href="/shop" 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Browse products <ChevronRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center p-3 hover:bg-indigo-50/70 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4 shadow-sm">
                            <Package size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">Order #{order._id.substring(0, 8)}</div>
                            <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
                          </div>
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusBadgeStyle(order.orderStatus)
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                          <div className="text-sm font-semibold text-indigo-600 ml-4">
                            ${order.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="mt-6 w-full py-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg shadow-md hover:shadow-indigo-300/30 font-medium flex items-center justify-center group">
                    View All Orders
                    <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Tracking & Profile Panel with Glass Effect */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Track Your Order</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="text"
                      placeholder="Enter Tracking ID"
                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                    <button
                      className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex-shrink-0"
                      onClick={handleTrackOrder}
                    >
                      Track
                    </button>
                  </div>

                  {tracking && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                      <h3 className="text-sm font-semibold text-indigo-800 mb-3">Tracking Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-indigo-100 mr-3">
                            <Truck className="text-indigo-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-medium text-sm">{tracking.status}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-blue-100 mr-3">
                            <Package className="text-blue-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Order ID</p>
                            <p className="font-medium text-sm">{tracking.orderId}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-cyan-100 mr-3">
                            <MapPin className="text-cyan-600 w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tracking ID</p>
                            <p className="font-medium text-sm">{tracking.trackingId}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
                    
                    {!editMode ? (
                      <div className="flex items-center bg-indigo-50 p-4 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mr-4 text-white text-lg font-bold">
                          {userData.name ? userData.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{userData.name}</h3>
                          <p className="text-sm text-gray-500">{userData.email}</p>
                        </div>
                        <button
                          className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                            <input
                              type="text"
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={userData.name}
                              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              value={userData.email}
                              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            />
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <button
                              className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center justify-center"
                              onClick={handleProfileUpdate}
                            >
                              <Save className="w-3 h-3 mr-1" /> Save
                            </button>
                            
                            <button
                              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
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
              </div>
              
              {/* Order Summary Section */}
              <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
                  <div className="flex gap-3">
                    <button className="text-sm bg-indigo-600 text-white py-1 px-4 rounded-md">Monthly</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Weekly</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Daily</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <DollarSign size={48} className="mx-auto text-indigo-400 mb-3" />
                      <p className="text-gray-600">Order spending chart would render here</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <Clock size={48} className="mx-auto text-blue-400 mb-3" />
                      <p className="text-gray-600">Delivery timeline would render here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const QuickStatCard = ({ title, value, change, isPositive, icon, color }) => {
  const getColorClasses = () => {
    switch(color) {
      case 'indigo': return 'from-indigo-500 to-indigo-600 shadow-indigo-200';
      case 'green': return 'from-green-500 to-green-600 shadow-green-200';
      case 'blue': return 'from-blue-500 to-blue-600 shadow-blue-200';
      case 'amber': return 'from-amber-500 to-amber-600 shadow-amber-200';
      default: return 'from-indigo-500 to-indigo-600 shadow-indigo-200';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses()} flex items-center justify-center text-white shadow-md`}>
          {icon}
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'} bg-white py-1 px-2 rounded-full text-xs shadow-sm`}>
          <span className="font-medium">{change}</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-1">{value}</p>
    </div>
  );
};

export default CustomerDashboard;