import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminData, fetchRevenueAnalytics } from "../redux/admin/adminSlice";
import { 
  Package, 
  IndianRupee, 
  Users, 
  Archive,
  ArrowUpRight, 
  ArrowDownRight,
  Bell,
  Search,
  Calendar,
  List,
  Truck,
  BarChart2,
  Globe
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, revenue = 0, users, stock = 0, loading, error } = useSelector(
    (state) => state.admin || {}
  );
  const { revenueData = [] } = useSelector((state) => state.admin);
  
  const [selectedView, setSelectedView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    dispatch(fetchAdminData());
    dispatch(fetchRevenueAnalytics());
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);
  
  // Calculate total users
  const totalUsers = Array.isArray(users) ? users.length : (typeof users === 'number' ? users : 0);

  // Get recent activities from revenue data
  const recentActivities = revenueData.length > 0 
    ? revenueData.slice(0, 5).map((item, index) => ({
        id: index,
        title: `${item.month} revenue report`,
        amount: `₹${item.revenue.toLocaleString()}`,
        time: `${new Date().getDate() - index} days ago`
      }))
    : [
        { id: 1, title: "New order received", amount: "₹8,400", time: "Just now" },
        { id: 2, title: "Stock update", amount: "24 items", time: "2 hours ago" },
        { id: 3, title: "New user registered", amount: "", time: "Yesterday" },
        { id: 4, title: "Monthly report generated", amount: "", time: "3 days ago" }
      ];

  // Get total revenue from revenue data
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0) || revenue;

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
                Admin Control Panel
              </h1>
              <p className="text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Search..."
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
                {['overview', 'orders', 'users', 'inventory'].map((tab) => (
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
                  title="Orders"
                  value={typeof orders === 'number' ? orders : 0}
                  change="+12.5%"
                  isPositive={true}
                  icon={<Package size={20} />}
                  color="indigo"
                />
                <QuickStatCard
                  title="Revenue"
                  value={`₹${(totalRevenue).toLocaleString()}`}
                  change="+8.2%"
                  isPositive={true}
                  icon={<IndianRupee size={20} />}
                  color="green"
                />
                <QuickStatCard
                  title="Users"
                  value={totalUsers}
                  change="+5.3%"
                  isPositive={true}
                  icon={<Users size={20} />}
                  color="blue"
                />
                <QuickStatCard
                  title="Stock"
                  value={typeof stock === 'number' ? stock : 0}
                  change="-2.4%"
                  isPositive={false}
                  icon={<Archive size={20} />}
                  color="amber"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed with Glass Effect */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-lg">
                      <Calendar size={16} />
                      <span>Last 7 days</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-3 hover:bg-indigo-50/70 rounded-lg transition-colors border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4 shadow-sm">
                          <List size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{activity.title}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                        {activity.amount && (
                          <div className="text-sm font-semibold text-indigo-600">
                            {activity.amount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 text-center text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-lg shadow-md hover:shadow-indigo-300/30 font-medium flex items-center justify-center group">
                    View All Activity
                    <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Quick Actions Panel with Glass Effect */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    {[
                      { title: "Add New Product", icon: <Package size={18} />, color: "bg-blue-100 text-blue-600" },
                      { title: "Process Orders", icon: <List size={18} />, color: "bg-indigo-100 text-indigo-600" },
                      { title: "Generate Reports", icon: <BarChart2 size={18} />, color: "bg-green-100 text-green-600" },
                      { title: "View Analytics", icon: <Globe size={18} />, color: "bg-amber-100 text-amber-600" }
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
                    <h3 className="text-sm font-semibold text-indigo-800 mb-2">System Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Overview */}
              <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Logistics Performance</h2>
                  <div className="flex gap-3">
                    <button className="text-sm bg-indigo-600 text-white py-1 px-4 rounded-md">Monthly</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Weekly</button>
                    <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Daily</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <Truck size={48} className="mx-auto text-indigo-400 mb-3" />
                      <p className="text-gray-600">Revenue chart would render here</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart2 size={48} className="mx-auto text-blue-400 mb-3" />
                      <p className="text-gray-600">Order trends would render here</p>
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
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-1">{value}</p>
    </div>
  );
};

export default AdminDashboard;