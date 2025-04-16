import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, removeProduct } from "../redux/inventory/inventorySlice";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { 
  Pencil, 
  Trash, 
  Plus, 
  Search, 
  Package, 
  Filter, 
  RefreshCw, 
  IndianRupee, 
  Calendar,
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [animateStats, setAnimateStats] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedView, setSelectedView] = useState('products');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchInventory());
    setTimeout(() => setAnimateStats(true), 100);
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Error: Missing product ID");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    try {
      await dispatch(removeProduct(id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  
  // Get unique categories
  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Filter items by search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get recent inventory activities
  const recentActivities = [
    { id: 1, title: "New product added", amount: "Wireless Earbuds", time: "Just now" },
    { id: 2, title: "Stock updated", amount: "24 units", time: "2 hours ago" },
    { id: 3, title: "Product removed", amount: "Laptop Stand", time: "Yesterday" },
    { id: 4, title: "Low stock alert", amount: "5 products", time: "3 days ago" },
    { id: 5, title: "Inventory audit", amount: "Completed", time: "1 week ago" }
  ];

  const getStockClass = (stock) => {
    if (stock <= 5) return "text-red-600 bg-red-100";
    if (stock <= 20) return "text-amber-600 bg-amber-100";
    return "text-blue-600 bg-blue-100";
  };
  
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
                Inventory Management
              </h1>
              <p className="text-gray-500">Track, monitor and manage your products</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-indigo-300/30 transition-colors flex items-center"
                  aria-label="Add new product"
                >
                  <Plus size={18} className="mr-2" /> Add Product
                </button>
              ) : null}
            </div>
          </div>
          
          {/* View Selection Tabs */}
          <div className="p-6">
            <div className="flex border-b border-gray-200 mb-6 bg-white/80 backdrop-blur-sm rounded-t-xl px-2 pt-2">
              {['products', 'categories', 'low-stock', 'archive'].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                    selectedView === tab 
                      ? 'text-indigo-600 bg-gradient-to-b from-white to-indigo-50 shadow-sm border-t border-l border-r border-gray-200' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                  onClick={() => setSelectedView(tab)}
                >
                  {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl text-red-500 text-center p-4">
                Error: {error}
              </div>
            ) : (
              <>
                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <QuickStatCard
                    title="Total Products"
                    value={items.length}
                    change="+3.5%"
                    isPositive={true}
                    icon={<Package size={20} />}
                    color="indigo"
                  />
                  <QuickStatCard
                    title="Low Stock Items"
                    value={items.filter(item => item.stock <= 5).length}
                    change="+2.4%"
                    isPositive={false}
                    icon={<RefreshCw size={20} />}
                    color="red"
                  />
                  <QuickStatCard
                    title="Categories"
                    value={new Set(items.map(item => item.category)).size}
                    change="+1.8%"
                    isPositive={true}
                    icon={<Filter size={20} />}
                    color="blue"
                  />
                  <QuickStatCard
                    title="Total Value"
                    value={`₹${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`}
                    change="+7.2%"
                    isPositive={true}
                    icon={<IndianRupee size={20} />}
                    color="green"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Inventory Table with Glass Effect */}
                  <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-800">Inventory Items</h2>
                      <div className="flex items-center gap-2">
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          aria-label="Filter by category"
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category === "all" ? "All Categories" : category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {filteredItems.length === 0 ? (
                      <div className="p-8 text-center">
                        <Package size={40} className="text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No products found matching your criteria.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse" aria-label="Inventory items">
                          <thead>
                            <tr className="bg-indigo-50/50">
                              <th scope="col" className="p-4 font-semibold text-gray-700">Product Name</th>
                              <th scope="col" className="p-4 font-semibold text-gray-700">Category</th>
                              <th scope="col" className="p-4 font-semibold text-gray-700">Stock</th>
                              <th scope="col" className="p-4 font-semibold text-gray-700">Price</th>
                              {user?.role === "admin" || user?.role === "warehouse_manager" ? 
                                <th scope="col" className="p-4 font-semibold text-gray-700">Actions</th> : null}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.slice(0, 5).map((product) => (
                              <tr key={product._id} className="border-t hover:bg-indigo-50/30 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                <td className="p-4">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockClass(product.stock)}`}>
                                    {product.stock} units
                                  </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">₹{product.price.toLocaleString()}</td>
                                {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                                  <td className="p-4">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => setEditProduct(product)}
                                        className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                                        title="Edit Product"
                                        aria-label={`Edit ${product.name}`}
                                      >
                                        <Pencil size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        title="Delete Product"
                                        aria-label={`Delete ${product.name}`}
                                      >
                                        <Trash size={16} />
                                      </button>
                                    </div>
                                  </td>
                                ) : null}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Showing {Math.min(5, filteredItems.length)} of {filteredItems.length} products</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center">
                        View All <ArrowUpRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Activity Feed with Glass Effect */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
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
                            <Package size={18} />
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
                </div>
                
                {/* Stock Level Analysis */}
                <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Stock Level Analysis</h2>
                    <div className="flex gap-3">
                      <button className="text-sm bg-indigo-600 text-white py-1 px-4 rounded-md">Monthly</button>
                      <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Weekly</button>
                      <button className="text-sm bg-white text-gray-600 py-1 px-4 rounded-md shadow-sm">Daily</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                      <div className="text-center">
                        <Filter size={48} className="mx-auto text-indigo-400 mb-3" />
                        <p className="text-gray-600">Stock level by category would render here</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-60 flex items-center justify-center">
                      <div className="text-center">
                        <IndianRupee size={48} className="mx-auto text-blue-400 mb-3" />
                        <p className="text-gray-600">Inventory value trends would render here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modals for Add/Edit Product */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
      {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  );
};

const QuickStatCard = ({ title, value, change, isPositive, icon, color }) => {
  const getColorClasses = () => {
    switch(color) {
      case 'indigo': return 'from-indigo-500 to-indigo-600 shadow-indigo-200';
      case 'green': return 'from-green-500 to-green-600 shadow-green-200';
      case 'blue': return 'from-blue-500 to-blue-600 shadow-blue-200';
      case 'red': return 'from-red-500 to-red-600 shadow-red-200';
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

export default InventoryDashboard;