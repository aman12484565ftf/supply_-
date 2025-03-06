import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus, cancelOrder } from "../redux/orders/orderSlice";
import { Loader, AlertCircle, CheckCircle, XCircle, ShoppingBag, Truck, Package, ArrowUpRight, Calendar, IndianRupee  } from "lucide-react";
import Sidebar from "../components/Sidebar";

const OrderDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'update' or 'cancel'
  const [status, setStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [animateStats, setAnimateStats] = useState(false);

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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-gray-600 mt-2">Track, update and manage all customer orders from one place</p>
          </header>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Orders"
              value={totalOrders}
              change="+5.2%"
              isPositive={true}
              icon={<ShoppingBag size={24} className="text-blue-500" />}
              delay={0}
              animate={animateStats}
            />
            <StatCard
              title="Pending Orders"
              value={pendingOrders}
              change="-2.1%"
              isPositive={false}
              icon={<Package size={24} className="text-yellow-500" />}
              delay={100}
              animate={animateStats}
            />
            <StatCard
              title="Delivered"
              value={deliveredOrders}
              change="+8.3%"
              isPositive={true}
              icon={<Truck size={24} className="text-green-500" />}
              delay={200}
              animate={animateStats}
            />
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              change="+12.5%"
              isPositive={true}
              icon={<IndianRupee size={24} className="text-indigo-500" />}
              delay={300}
              animate={animateStats}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center space-x-2">
              <AlertCircle />
              <span>{error}</span>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                <p className="text-sm text-gray-500">Manage and update customer order status</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
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
                        <tr key={order._id} className="border-t hover:bg-blue-50/30 transition-colors">
                          <td className="p-4 text-gray-600 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                          <td className="p-4 font-medium text-gray-800">{order.customer.name}</td>
                          <td className="p-4 text-gray-600">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2 text-gray-400" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 font-medium text-gray-800">
                            <div className="flex items-center">
                              <IndianRupee size={16} className="mr-1 text-gray-400" />
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
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow hover:shadow-md"
                                title="Update Status"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => openModal('cancel', order._id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow hover:shadow-md"
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
                          <div className="p-6 bg-gray-50 rounded-lg inline-block">
                            <ShoppingBag size={40} className="text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No orders found.</p>
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
      </main>

      {/* Update Status Modal */}
      {selectedOrder && modalType === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Update Order Status</h2>
            <p className="text-gray-600 mb-4">Select a new status for this order</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Cancel Order</h2>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition-all min-h-[100px]"
              placeholder="Enter cancellation reason"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
const StatCard = ({ title, value, change, isPositive, icon, delay, animate }) => (
  <div className={`p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-500 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        <span className="text-sm font-medium">{change}</span>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowUpRight size={16} className="transform rotate-180" />}
      </div>
    </div>
    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
  </div>
);

export default OrderDashboard;