import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/admin/adminSlice";
import { 
  Users, 
  Mail, 
  ShieldCheck, 
  XCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Bell,
  Calendar
} from "lucide-react";
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
                User Management
              </h1>
              <p className="text-gray-500">Manage system users and privileges</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Search users..."
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-center flex items-center justify-center gap-2">
                <XCircle size={20} />
                Error: {error}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickStatCard
                  title="Total Users"
                  value={totalUsers}
                  change="+5.3%"
                  isPositive={true}
                  icon={<Users size={20} />}
                  color="blue"
                />
                <QuickStatCard
                  title="Admin Users"
                  value={adminUsers}
                  change="+2.1%"
                  isPositive={true}
                  icon={<ShieldCheck size={20} />}
                  color="indigo"
                />
                <QuickStatCard
                  title="Active Accounts"
                  value={`${activeUsers}/${totalUsers}`}
                  change="+7.4%"
                  isPositive={true}
                  icon={<Mail size={20} />}
                  color="green"
                />
              </div>

              {/* Search and Filter with Glass Effect */}
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg mb-6 border border-white/50 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors bg-white/80 shadow-sm">
                      <Filter size={16} />
                      <span>Filter</span>
                    </button>
                    <button className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-indigo-300/30 transition-all">
                      Add User
                    </button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              {!Array.isArray(users) || users.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-lg p-16 rounded-xl shadow-lg text-center border border-white/50">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are no users matching your criteria. Try adjusting your search or add a new user.
                  </p>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden border border-white/50">
                  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">User Accounts</h2>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-lg">
                      <Calendar size={16} />
                      <span>Last updated today</span>
                    </div>
                  </div>
                  
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-indigo-50/70 border-b border-gray-200">
                        <th className="py-4 px-6 font-semibold text-gray-600">Name</th>
                        <th className="py-4 px-6 font-semibold text-gray-600">Email</th>
                        <th className="py-4 px-6 font-semibold text-gray-600">Role</th>
                        <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                        <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user._id} 
                          className="border-b border-gray-200 hover:bg-indigo-50/40 transition-colors"
                        >
                          <td className="py-4 px-6 font-medium text-gray-800">{user.name}</td>
                          <td className="py-4 px-6 flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email}
                          </td>
                          <td className="py-4 px-6">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                <ShieldCheck size={12} className="mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                User
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {user.isActive ? (
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-green-600 text-sm font-medium">Active</span>
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
                              <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between p-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {totalUsers} users</p>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white/80 shadow-sm">Previous</button>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow-md hover:shadow-indigo-300/30 transition-all">Next</button>
                    </div>
                  </div>
                </div>
              )}
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

export default AdminUsers;