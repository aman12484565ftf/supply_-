import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWarehouseStats, fetchWarehouses } from "../redux/warehouse/warehouseSlice";
import { Loader2, Package, ClipboardList, Truck, ShieldCheck, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Sidebar from "../components/Sidebar";

const WarehouseDashboard = () => {
  const dispatch = useDispatch();
  const { stats, warehouses, loading, error } = useSelector((state) => state.warehouse);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    dispatch(fetchWarehouseStats());
    dispatch(fetchWarehouses());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Warehouse Manager Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Monitor inventory, orders, and stock levels across all warehouses</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 ml-4">Loading warehouse data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-xl border border-red-200 mb-8">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Total Products" 
                  value={stats.totalProducts || 0} 
                  change="+5.2%" 
                  isPositive={true} 
                  icon={<Package size={24} className="text-blue-500" />} 
                  delay={0} 
                  animate={animateStats} 
                />
                <StatCard 
                  title="Low Stock Items" 
                  value={stats.lowStock || 0} 
                  change="+2.8%" 
                  isPositive={false} 
                  icon={<ClipboardList size={24} className="text-amber-500" />} 
                  delay={100} 
                  animate={animateStats} 
                />
                <StatCard 
                  title="Pending Orders" 
                  value={stats.pendingOrders || 0} 
                  change="+7.3%" 
                  isPositive={true} 
                  icon={<Truck size={24} className="text-indigo-500" />} 
                  delay={200} 
                  animate={animateStats} 
                />
                <StatCard 
                  title="Completed Orders" 
                  value={stats.completedOrders || 0} 
                  change="+12.4%" 
                  isPositive={true} 
                  icon={<ShieldCheck size={24} className="text-green-500" />} 
                  delay={300} 
                  animate={animateStats} 
                />
              </div>

              {/* Warehouse List Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Warehouses</h2>
                <div className="bg-white p-6 shadow-md rounded-xl hover:shadow-lg transition-all duration-300">
                  {warehouses.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No warehouses found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 font-semibold text-gray-700 border-b-2 border-gray-100">Warehouse Name</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 border-b-2 border-gray-100">Location</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 border-b-2 border-gray-100">Capacity</th>
                            <th className="py-4 px-6 font-semibold text-gray-700 border-b-2 border-gray-100">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(warehouses) && warehouses.length > 0 ? (
                          warehouses.map((warehouse, index) => (
                            <tr 
                              key={warehouse._id} 
                              className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="py-4 px-6 font-medium">{warehouse.name}</td>
                              <td className="py-4 px-6">
                                <div className="flex items-center">
                                  <MapPin size={16} className="text-gray-500 mr-2" />
                                  {warehouse.location}
                                </div>
                              </td>
                              <td className="py-4 px-6">{warehouse.capacity} units</td>
                              <td className="py-4 px-6">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="py-4 px-6 text-gray-600 text-center">No warehouses found.</td>
                          </tr>
                        )}
                      </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Warehouse Capacity Utilization Section - You could add a chart here */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Warehouse Utilization</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 shadow-md rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Space Utilization</h3>
                      <span className="text-xs font-medium text-gray-500">Updated today</span>
                    </div>
                    {/* You could add a chart or visualization here */}
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <p>Space utilization visualization placeholder</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 shadow-md rounded-xl hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Inventory Distribution</h3>
                      <span className="text-xs font-medium text-gray-500">Updated today</span>
                    </div>
                    {/* You could add a chart or visualization here */}
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <p>Inventory distribution visualization placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Enhanced StatCard Component
const StatCard = ({ title, value, change, isPositive, icon, delay, animate }) => (
  <div className={`p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-500 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        <span className="text-sm font-medium">{change}</span>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
    </div>
    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
  </div>
);

export default WarehouseDashboard;