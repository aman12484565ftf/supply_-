import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDriverData } from "../redux/driver/driverSlice";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  ArrowUpRight, ArrowDownRight, Truck, MapPin, Fuel, Clock, CheckCircle, 
  AlertCircle, Calendar 
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { 
    deliveries = [], 
    totalDistance = 0, 
    fuelConsumption = 0, 
    onTimeRate = 0, 
    loading, 
    error,
    deliveryPerformance = [],  // ✅ Ensure this is correctly extracted
    routeEfficiency = []       // ✅ Ensure this is correctly extracted
  } = useSelector((state) => state.driver || {});  // ✅ Ensure `state.driver` is accessible
  

  const [animateStats, setAnimateStats] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    dispatch(fetchDriverData());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's an overview of your delivery performance.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-8">
              <p className="text-red-600 font-semibold text-center flex items-center justify-center">
                <AlertCircle size={20} className="mr-2" />
                {error}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Deliveries"
                  value={deliveries.length}
                  change="+8.3%"
                  isPositive={true}
                  icon={<Truck size={24} className="text-blue-500" />}
                  delay={0}
                  animate={animateStats}
                  color="blue"
                />
                <StatCard
                  title="Total Distance"
                  value={`${totalDistance.toLocaleString()} km`}
                  change="+12.7%"
                  isPositive={true}
                  icon={<MapPin size={24} className="text-indigo-500" />}
                  delay={100}
                  animate={animateStats}
                  color="indigo"
                />
                <StatCard
                  title="Fuel Consumption"
                  value={`${fuelConsumption} L`}
                  change="-4.2%"
                  isPositive={true}
                  icon={<Fuel size={24} className="text-green-500" />}
                  delay={200}
                  animate={animateStats}
                  color="green"
                />
                <StatCard
                  title="On-Time Rate"
                  value={`${onTimeRate}%`}
                  change="+2.5%"
                  isPositive={true}
                  icon={<Clock size={24} className="text-amber-500" />}
                  delay={300}
                  animate={animateStats}
                  color="amber"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard 
                    title="Delivery Performance" 
                    subtitle="Deliveries completed per day" 
                    chartType="bar" 
                    data={Array.isArray(deliveryPerformance) && deliveryPerformance.length > 0 ? deliveryPerformance : [{ date: "N/A", deliveries: 0 }]} 
                    dataKey="deliveries"
                    loading={loading} 
                    color="#3B82F6"
                />
                {/* <ChartCard 
                    title="Route Efficiency" 
                    subtitle="Distance vs. deliveries ratio" 
                    chartType="line" 
                    data={Array.isArray(routeEfficiency) && routeEfficiency.length > 0 ? routeEfficiency : [{ month: "N/A", efficiency: 0 }]} 
                    dataKey="efficiency"
                    loading={loading} 
                /> */}
                <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Calendar size={20} className="text-indigo-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Today's Deliveries
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    {deliveries.length === 0 ? (
                      <div className="py-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Truck size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">No deliveries assigned yet</p>
                      </div>
                    ) : (
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">
                              Order ID
                            </th>
                            <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">
                              Status
                            </th>
                            <th className="py-3 px-4 text-left text-gray-600 font-medium text-sm">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {deliveries.map((delivery) => (
                            <tr
                              key={delivery._id}
                              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                              onClick={() => setSelectedDelivery(delivery)}
                            >
                              <td className="py-3 px-4 font-medium">{delivery.order?._id || "N/A"}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                  ${delivery.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 
                                  delivery.status === 'Scheduled' ? 'bg-purple-100 text-purple-800' : 
                                  'bg-red-100 text-red-800'}`}
                                >
                                  {delivery.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-500">{delivery.location || "Unknown"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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

const StatCard = ({ title, value, change, isPositive, icon, delay, animate, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600"
  };
  
  const gradientClass = colorMap[color] || "from-blue-500 to-indigo-600";
  
  return (
    <div
      className={`p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-500 transform border border-gray-100 ${
        animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-${color}-50`}>{icon}</div>
        <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
          <span className="text-sm font-medium">{change}</span>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <h2 className="text-lg font-medium text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      <div className={`mt-4 h-1.5 w-16 bg-gradient-to-r ${gradientClass} rounded-full`}></div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, chartType, data, dataKey, loading, color }) => (
  <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300 border border-gray-100">
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
    
    {loading ? (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    ) : data && data.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 3 }} 
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <AlertCircle size={32} className="mb-2" />
        <p>No data available</p>
      </div>
    )}
  </div>
);

export default DriverDashboard;