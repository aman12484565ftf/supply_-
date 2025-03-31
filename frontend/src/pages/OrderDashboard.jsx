import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
import { 
  Loader, AlertCircle, CheckCircle, XCircle, ShoppingBag, 
  Truck, Package, ArrowUpRight, ArrowDownRight, Calendar, 
  IndianRupee, ChartBar
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-cyan-100 text-cyan-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 h-64"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Geometric shapes for modern aesthetic */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-cyan-500 blur-3xl"
                style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-teal-400 blur-3xl"
                style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium tracking-wider">
                <ShoppingBag size={16} className="mr-2" />
                ORDER MANAGEMENT
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Orders</span>
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Track & Process
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Track, update and manage all customer orders from one place</p>
            </header>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
              <StatCard 
                title="Total Orders" 
                value={totalOrders} 
                change="+5.2%" 
                isPositive={true} 
                icon={<ShoppingBag size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="emerald" 
              />
              <StatCard 
                title="Pending Orders" 
                value={pendingOrders} 
                change="-2.1%" 
                isPositive={false} 
                icon={<Package size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="teal" 
              />
              <StatCard 
                title="Delivered" 
                value={deliveredOrders} 
                change="+8.3%" 
                isPositive={true} 
                icon={<Truck size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="cyan" 
              />
              <StatCard 
                title="Total Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                change="+12.5%" 
                isPositive={true} 
                icon={<IndianRupee size={24} className="text-white" />} 
                delay={300} 
                animate={animateStats}
                color="emerald" 
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center rounded-xl flex items-center justify-center space-x-2">
                <AlertCircle />
                <span>{error}</span>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-zinc-100">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-800">Recent Orders</h2>
                    <p className="text-sm text-zinc-500">Manage and update customer order status</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <ChartBar size={20} />
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
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order._id} className="border-t hover:bg-emerald-50/30 transition-colors">
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
                                  className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all shadow hover:shadow-md"
                                  title="Update Status"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => openModal('cancel', order._id)}
                                  className="p-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition-all shadow hover:shadow-md"
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
            )}
          </div>
        </div>
      </main>

      {/* Update Status Modal */}
      {selectedOrder && modalType === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-zinc-100">
            <h2 className="text-xl font-bold mb-4 text-zinc-800">Update Order Status</h2>
            <p className="text-zinc-600 mb-4">Select a new status for this order</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-zinc-200 rounded-xl shadow-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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

// Stat Card Component for dashboard stats
const StatCard = ({ title, value, change, isPositive, icon, delay, animate, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getGradient = () => {
    switch(color) {
      case 'emerald': return 'from-emerald-500 to-emerald-600';
      case 'teal': return 'from-teal-500 to-teal-600';
      case 'cyan': return 'from-cyan-500 to-cyan-600';
      default: return 'from-emerald-500 to-emerald-600';
    }
  };

  return (
    <div 
      className={`p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-500 transform ${
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${isHovered ? "-translate-y-1" : ""} border border-zinc-100 relative overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient()} transform transition-all duration-500 ${
          isHovered ? "rotate-6 scale-110" : ""
        }`}>
          {icon}
        </div>
        <div className={`flex items-center ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          <span className="text-sm font-medium">{change}</span>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <h2 className="text-lg font-medium text-zinc-600">{title}</h2>
      <p className="text-3xl font-bold text-zinc-800 mt-1">{value}</p>
      <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
        isHovered ? "w-3/4" : ""
      }`}></div>
    </div>
  );
};

export default OrderDashboard;