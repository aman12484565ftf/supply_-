import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData, fetchRevenueAnalytics } from "../redux/admin/adminSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Package, IndianRupee, Archive, ChartBar } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, revenue = 0, users, stock = 0, loading, error } = useSelector(
    (state) => state.admin || {}
  );
  const { revenueData = [], loadingnew } = useSelector((state) => state.admin);
  
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
    dispatch(fetchAdminData());
    dispatch(fetchRevenueAnalytics());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);
  
  // Calculate total users - handle both array of users and direct number
  const totalUsers = Array.isArray(users) ? users.length : (typeof users === 'number' ? users : 0);

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
                <ChartBar size={16} className="mr-2" />
                ADMIN CONTROL CENTER
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Dashboard</span>
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Analytics & Insights
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Welcome back! Here's an overview of your business performance</p>
            </header>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <p className="bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-center p-4 rounded-xl">
                Error: {error}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-16">
                  <StatCard 
                    title="Total Orders" 
                    value={typeof orders === 'number' ? orders : 0} 
                    change="+12.5%" 
                    isPositive={true} 
                    icon={<Package size={24} className="text-white" />} 
                    delay={0} 
                    animate={animateStats}
                    color="emerald" 
                  />
                  <StatCard 
                    title="Total Revenue" 
                    value={`₹${(typeof revenue === 'number' ? revenue : 0).toLocaleString()}`} 
                    change="+8.2%" 
                    isPositive={true} 
                    icon={<IndianRupee size={24} className="text-white" />} 
                    delay={100} 
                    animate={animateStats}
                    color="teal" 
                  />
                  <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    change="+5.3%" 
                    isPositive={true} 
                    icon={<Users size={24} className="text-white" />} 
                    delay={200} 
                    animate={animateStats}
                    color="cyan" 
                  />
                  <StatCard 
                    title="Available Stock" 
                    value={typeof stock === 'number' ? stock : 0} 
                    change="-2.4%" 
                    isPositive={false} 
                    icon={<Archive size={24} className="text-white" />} 
                    delay={300} 
                    animate={animateStats}
                    color="emerald" 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <ChartCard 
                    title="Sales Analytics" 
                    subtitle="Monthly revenue from orders" 
                    chartType="bar" 
                    data={revenueData} 
                    loading={loadingnew}
                    className="lg:col-span-2" 
                  />
                  <ChartCard 
                    title="Revenue Trend" 
                    subtitle="Last 6 months" 
                    chartType="line" 
                    data={revenueData} 
                    loading={loadingnew} 
                  />
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 border border-zinc-100 mb-8">
                  <h2 className="text-xl font-semibold text-zinc-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Run Reports", icon: <TrendingUp size={20} /> },
                      { label: "Manage Inventory", icon: <Archive size={20} /> },
                      { label: "User Analytics", icon: <Users size={20} /> },
                      { label: "Order Processing", icon: <Package size={20} /> },
                    ].map((action, index) => (
                      <button 
                        key={index}
                        className="flex items-center justify-center gap-2 p-4 bg-zinc-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl border border-zinc-200 transition-all hover:shadow-md group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white transform transition-all duration-300 group-hover:rotate-6">
                          {action.icon}
                        </div>
                        <span className="font-medium text-zinc-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

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

const ChartCard = ({ title, subtitle, chartType, data, loading, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 border border-zinc-100 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-800">{title}</h2>
          <p className="text-zinc-500">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white transform transition-all duration-500 ${isHovered ? "rotate-6 scale-110" : ""}`}>
          <ChartBar size={20} />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-zinc-500">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                ))}
              </Bar>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.8}/>
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#colorRevenue)" 
                strokeWidth={3} 
                dot={{ r: 6, strokeWidth: 3, fill: "white", stroke: "#10b981" }} 
                activeDot={{ r: 8, strokeWidth: 3, fill: "white", stroke: "#10b981" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AdminDashboard;