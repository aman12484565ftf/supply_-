import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData } from "../redux/admin/adminSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Package, IndianRupee, Archive } from "lucide-react";
import { fetchRevenueAnalytics } from "../redux/admin/adminSlice";

const AdminDashboard = () => {

  const dispatch = useDispatch();
  const { orders, revenue = 0, users , stock = 0, loading, error } = useSelector(
    (state) => state.admin || {}
  );
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminData());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  // Format data for revenue trend
  useEffect(() => {
    dispatch(fetchAdminData());
    dispatch(fetchRevenueAnalytics()); // Fetch revenue trend
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);
  
  const { revenueData = [], loadingnew } = useSelector((state) => state.admin);
  

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your business performance</p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 font-semibold text-center">Error: {error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={orders || 0} change="+12.5%" isPositive={true} icon={<Package size={24} className="text-blue-500" />} delay={0} animate={animateStats} />
                <StatCard title="Total Revenue" value={`₹${revenue.toLocaleString()}`} change="+8.2%" isPositive={true} icon={<IndianRupee size={24} className="text-green-500" />} delay={100} animate={animateStats} />
                <StatCard title="Total Users" value={users || 0} change="+5.3%" isPositive={true} icon={<Users size={24} className="text-indigo-500" />} delay={200} animate={animateStats} />
                <StatCard title="Available Stock" value={stock || 0} change="-2.4%" isPositive={false} icon={<Archive size={24} className="text-amber-500" />} delay={300} animate={animateStats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <ChartCard title="Sales Analytics" subtitle="Monthly revenue from orders" chartType="bar" data={revenueData} loading={loading} />
                <ChartCard title="Revenue Trend" subtitle="Last 6 months" chartType="line" data={revenueData} loading={loading} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

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

//   <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300">
//     <div className="flex justify-between items-center mb-6">
//       <div>
//         <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
//         <p className="text-gray-500">{subtitle}</p>
//       </div>
//       <div className="flex items-center text-green-500 text-sm font-medium">
//         <span>+12.5%</span>
//         <TrendingUp size={16} className="ml-1" />
//       </div>
//     </div>
//     {loading ? (
//       <div className="h-32 flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     ) : (
//       <ResponsiveContainer width="100%" height={300}>
//         {chartType === "bar" ? (
//           <BarChart data={data}>
//             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//             <YAxis axisLine={false} tickLine={false} />
//             <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
//             <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         ) : (
//           <LineChart data={data}>
//             <XAxis dataKey="name" axisLine={false} tickLine={false} />
//             <YAxis axisLine={false} tickLine={false} />
//             <Tooltip contentStyle={{ backgroundColor: "#fff", border: "none", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
//             <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, strokeWidth: 3 }} />
//           </LineChart>
//         )}
//       </ResponsiveContainer>
//     )}
//   </div>
// );
const ChartCard = ({ title, subtitle, chartType, data, loadingnew }) => (
  <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
      </div>
    </div>
    {loadingnew ? (
      <div className="flex items-center justify-center h-40">Loading...</div>
    ) : data.length === 0 ? (
      <div className="flex items-center justify-center h-40 text-gray-500">No data available</div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, strokeWidth: 3 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    )}
  </div>
);

  
export default AdminDashboard;
