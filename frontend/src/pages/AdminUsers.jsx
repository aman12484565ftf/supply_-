import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/admin/adminSlice";
import { Users, Mail, ShieldCheck, XCircle, Search, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight, ChartBar } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
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
    dispatch(fetchUsers());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate stats
  const totalUsers = filteredUsers.length;
  const adminUsers = filteredUsers.filter(user => user.isAdmin).length;
  const activeUsers = filteredUsers.filter(user => user.isActive).length;

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
                <Users size={16} className="mr-2" />
                USER MANAGEMENT
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">User Control</span>
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Management & Insights
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">View and manage all user accounts in your system</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
              <StatCard 
                title="Total Users" 
                value={totalUsers} 
                change="+5.3%" 
                isPositive={true} 
                icon={<Users size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="emerald" 
              />
              <StatCard 
                title="Admin Users" 
                value={adminUsers} 
                change="+2.1%" 
                isPositive={true} 
                icon={<ShieldCheck size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="teal" 
              />
              <StatCard 
                title="Active Accounts" 
                value={`${activeUsers}/${totalUsers}`} 
                change="+7.4%" 
                isPositive={true} 
                icon={<Mail size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="cyan" 
              />
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-zinc-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="pl-10 pr-4 py-3 w-full border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-4 py-3 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors">
                    <Filter size={16} />
                    <span>Filter</span>
                  </button>
                  <button className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Add User
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-6 rounded-xl shadow-md flex items-center">
                <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                <p className="font-medium">Error loading users: {error}</p>
              </div>
            ) : !Array.isArray(users) || users.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl shadow-lg text-center border border-zinc-100">
                <Users className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-800 mb-2">No Users Found</h3>
                <p className="text-zinc-500 max-w-md mx-auto">
                  There are no users matching your criteria. Try adjusting your search or add a new user.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-zinc-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                      <th className="py-4 px-6 font-semibold text-zinc-600">Name</th>
                      <th className="py-4 px-6 font-semibold text-zinc-600">Email</th>
                      <th className="py-4 px-6 font-semibold text-zinc-600">Role</th>
                      <th className="py-4 px-6 font-semibold text-zinc-600">Status</th>
                      <th className="py-4 px-6 font-semibold text-zinc-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr 
                        key={user._id} 
                        className={`border-b border-zinc-200 hover:bg-zinc-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-colors`}
                      >
                        <td className="py-4 px-6 font-medium text-zinc-800">{user.name}</td>
                        <td className="py-4 px-6 flex items-center gap-2 text-zinc-600">
                          <Mail className="w-4 h-4 text-zinc-400" />
                          {user.email}
                        </td>
                        <td className="py-4 px-6">
                          {user.isAdmin ? (
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-700 rounded-full text-xs font-medium">
                              <ShieldCheck size={12} className="mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-xs font-medium">
                              User
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {user.isActive ? (
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                              <span className="text-emerald-600 text-sm font-medium">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-red-600 text-sm font-medium">Inactive</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-zinc-500 hover:text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors">
                              <MoreHorizontal size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-500">Showing {filteredUsers.length} of {totalUsers} users</p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 transition-colors">Previous</button>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm hover:shadow-md transition-all">Next</button>
                  </div>
                </div>
              </div>
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

export default AdminUsers;