import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/admin/adminSlice";
import { Users, Mail, ShieldCheck, XCircle, Search, Filter, MoreHorizontal, ArrowUpRight } from "lucide-react";
import Sidebar from "../components/Sidebar";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateStats, setAnimateStats] = useState(false);

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">View and manage all user accounts in your system</p>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Users" 
              value={totalUsers} 
              change="+5.3%" 
              isPositive={true} 
              icon={<Users size={24} className="text-blue-500" />} 
              delay={0} 
              animate={animateStats} 
            />
            <StatCard 
              title="Admin Users" 
              value={adminUsers} 
              change="+2.1%" 
              isPositive={true} 
              icon={<ShieldCheck size={24} className="text-indigo-500" />} 
              delay={100} 
              animate={animateStats} 
            />
            <StatCard 
              title="Active Accounts" 
              value={`${activeUsers}/${totalUsers}`} 
              change="+7.4%" 
              isPositive={true} 
              icon={<Mail size={24} className="text-green-500" />} 
              delay={200} 
              animate={animateStats} 
            />
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-600 p-6 rounded-xl shadow-md flex items-center">
              <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
              <p className="font-medium">Error loading users: {error}</p>
            </div>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <div className="bg-white p-16 rounded-xl shadow-md text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are no users matching your criteria. Try adjusting your search or add a new user.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-4 px-6 font-semibold text-gray-600">Name</th>
                    <th className="py-4 px-6 font-semibold text-gray-600">Email</th>
                    <th className="py-4 px-6 font-semibold text-gray-600">Role</th>
                    <th className="py-4 px-6 font-semibold text-gray-600">Status</th>
                    <th className="py-4 px-6 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-800">{user.name}</td>
                      <td className="py-4 px-6 flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        {user.isAdmin ? (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                            Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {user.isActive ? (
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-green-700 text-sm font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-red-700 text-sm font-medium">Inactive</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {totalUsers} users</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Previous</button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Next</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, change, isPositive, icon, delay, animate }) => (
  <div 
    className={`p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition-all duration-500 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} 
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        <span className="text-sm font-medium">{change}</span>
        <ArrowUpRight size={16} />
      </div>
    </div>
    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
  </div>
);

export default AdminUsers;