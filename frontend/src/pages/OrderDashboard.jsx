import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
import { 
  Loader, AlertCircle, CheckCircle, XCircle, ShoppingBag, 
  Truck, Package, ArrowUpRight, ArrowDownRight, Calendar, 
  IndianRupee, ChartBar, BarChart2, Shield, Globe, Search, Bell, List
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const OrderDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'update' or 'cancel'
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchOrders());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !status) return;
    await dispatch(updateOrderStatus({ orderId: selectedOrder, status }));
    closeModal();
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) return;
    await dispatch(cancelOrder({ orderId: selectedOrder, reason: cancelReason }));
    closeModal();
  };

  const openModal = (type, orderId) => {
    setSelectedOrder(orderId);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
    setStatus("");
    setCancelReason("");
  };

  // Calculate summary statistics
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.orderStatus === "Processing").length || 0;
  const deliveredOrders = orders?.filter(order => order.orderStatus === "Delivered").length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  // Get recent activities from orders
  const recentActivities = orders?.slice(0, 5).map((order) => ({
    id: order._id,
    title: `Order #${order._id.substring(0, 8)}...`,
    customer: order.customer.name,
    amount: `₹${order.totalAmount.toFixed(2)}`,
    time: new Date(order.createdAt).toLocaleDateString(),
    status: order.orderStatus
  })) || [];

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders?.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
                Order Management System
              </h1>
              <p className="text-gray-500">Track, update and manage all customer orders</p>
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
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <QuickStatCard
                  title="Total Orders"
                  value={totalOrders}
                  change="+12.5%"
                  isPositive={true}
                  icon={<ShoppingBag size={20} />}
                  color="indigo"
                />
                <QuickStatCard
                  title="Pending Orders"
                  value={pendingOrders}
                  change="+3.2%"
                  isPositive={true}
                  icon={<Package size={20} />}
                  color="amber"
                />
                <QuickStatCard
                  title="Delivered"
                  value={deliveredOrders}
                  change="+8.3%"
                  isPositive={true}
                  icon={<Truck size={20} />}
                  color="green"
                />
                <QuickStatCard
                  title="Total Revenue"
                  value={`₹${totalRevenue.toLocaleString()}`}
                  change="+12.5%"
                  isPositive={true}
                  icon={<IndianRupee size={20} />}
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders with Glass Effect */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-lg">
                      <Calendar size={16} />
                      <span>Last 7 days</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-3 hover:bg-indigo-50/70 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4 shadow-sm">
                          <ShoppingBag size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{activity.title}</div>
                          <div className="text-xs text-gray-500">{activity.customer} • {activity.time}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(activity.status)}`}
                          >
                            {activity.status}
                          </span>
                          <div className="text-sm font-semibold text-indigo-600">
                            {activity.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg shadow-md hover:shadow-indigo-300/30 font-medium flex items-center justify-center group">
                    View All Orders
                    <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Quick Actions Panel with Glass Effect */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    {[
                      { title: "Process Orders", icon: <Package size={18} />, color: "bg-blue-100 text-blue-600" },
                      { title: "Update Shipment", icon: <Truck size={18} />, color: "bg-indigo-100 text-indigo-600" },
                      { title: "Generate Invoice", icon: <IndianRupee size={18} />, color: "bg-green-100 text-green-600" },
                      { title: "View Analytics", icon: <BarChart2 size={18} />, color: "bg-amber-100 text-amber-600" }
                    ].map((action, index) => (
                      <button 
                        key={index}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-50/70 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3 shadow-sm`}>
                          {action.icon}
                        </div>
                        <span className="font-medium text-gray-700">{action.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <h3 className="text-sm font-semibold text-indigo-800 mb-2">Order Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Orders Table */}
              <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">All Orders</h2>
                  <div className="flex gap-3">
                    <button className="text-sm bg-indigo-600 text-white py-1 px-4 rounded-md">Export</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Filter</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Sort</button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-700">
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Customer</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Total</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr key={order._id} className="border-t hover:bg-indigo-50/30 transition-colors">
                            <td className="p-4 text-zinc-600 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                            <td className="p-4 font-medium text-zinc-800">{order.customer.name}</td>
                            <td className="p-4 text-zinc-600">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-zinc-400" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4 font-medium text-zinc-800">
                              <div className="flex items-center">
                                <IndianRupee size={16} className="mr-1 text-zinc-400" />
                                {order.totalAmount.toFixed(2)}
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openModal('update', order._id)}
                                  className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all"
                                  title="Update Status"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => openModal('cancel', order._id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                  title="Cancel Order"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center p-8">
                            <div className="p-6 bg-zinc-50 rounded-lg inline-block">
                              <ShoppingBag size={40} className="text-zinc-400 mx-auto mb-3" />
                              <p className="text-zinc-500">No orders found.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Update Status Modal */}
      {selectedOrder && modalType === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-zinc-100">
            <h2 className="text-xl font-bold mb-4 text-zinc-800">Update Order Status</h2>
            <p className="text-zinc-600 mb-4">Select a new status for this order</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-indigo-500/30"
                disabled={!status}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {selectedOrder && modalType === 'cancel' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-zinc-100">
            <h2 className="text-xl font-bold mb-2 text-zinc-800">Cancel Order</h2>
            <p className="text-zinc-600 mb-4">Please provide a reason for cancellation</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl shadow-sm focus:ring-red-500 focus:border-red-500 transition-all min-h-24"
              placeholder="Enter cancellation reason"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-red-500/30"
                disabled={!cancelReason}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick Stat Card Component for dashboard stats
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
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-1">{value}</p>
    </div>
  );
};

export default OrderDashboard;