import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, removeProduct } from "../redux/inventory/inventorySlice";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Pencil, Trash, Plus, Search, Package, Filter, RefreshCw, Download } from "lucide-react";

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchInventory());
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

  const getStockClass = (stock) => {
    if (stock <= 5) return "text-red-600 bg-red-100";
    if (stock <= 20) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with animated gradient */}
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-white relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory Management</h1>
                <p className="text-blue-100 max-w-3xl">
                  Track your products, monitor stock levels, and manage your inventory efficiently.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title="Total Products" 
              value={items.length} 
              icon={<Package size={24} />} 
              color="blue"
            />
            <DashboardCard 
              title="Low Stock Items" 
              value={items.filter(item => item.stock <= 5).length} 
              icon={<RefreshCw size={24} />} 
              color="red"
            />
            <DashboardCard 
              title="Categories" 
              value={new Set(items.map(item => item.category)).size} 
              icon={<Filter size={24} />} 
              color="indigo"
            />
            <DashboardCard 
              title="Total Value" 
              value={`₹${items.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}`} 
              icon={<Download size={24} />} 
              color="green"
            />
          </div>

          {/* Control Panel with Search, Filter & Add */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-auto flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-3 w-full border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto flex-1 md:max-w-xs">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Only Admin & Warehouse Manager Can Add Products */}
              {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Plus size={18} className="mr-2" /> Add New Product
                </button>
              ) : null}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Price</th>
                  {user?.role === "admin" || user?.role === "warehouse_manager" ? <th className="p-4 font-semibold">Actions</th> : null}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-3 text-gray-600">Loading inventory data...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div className="p-4 bg-red-50 text-red-600 rounded-lg inline-block">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8">
                      <div className="p-6 bg-gray-50 rounded-lg inline-block">
                        <Package size={40} className="text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No products found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-blue-50/30 transition-colors">
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
                      <td className="p-4 font-medium">₹{product.price.toLocaleString()}</td>
                      {user?.role === "admin" || user?.role === "warehouse_manager" ? (
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditProduct(product)}
                              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow hover:shadow-md"
                              title="Edit Product"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow hover:shadow-md"
                              title="Delete Product"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modals for Add/Edit Product */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
      {editProduct && <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, color }) => {
  // Determine gradient based on color
  const getGradient = () => {
    switch(color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'red': return 'from-red-500 to-red-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${getGradient()} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;