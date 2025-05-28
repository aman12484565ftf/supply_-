import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/inventory/inventorySlice";
import { X, Package, DollarSign, Tag, BarChart2, Archive, ArrowUpRight } from "lucide-react";

const AddProductModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ 
    name: "", 
    category: "", 
    stock: 0, 
    price: 0,
    description: "",
    sku: ""
  });

  const handleChange = (e) => {
    const value = e.target.type === "number" 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("🆕 Form Data Before Sending:", formData);
  
    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description,
    };
  
    try {
      console.log("🚀 Sending Product Data:", newProduct);
      await dispatch(createProduct(newProduct));
      console.log("✅ Product Added Successfully");
      onClose();
    } catch (error) {
      console.error("❌ Error adding product:", error.message);
    }
  };

  // Adding floating bubbles background effect similar to dashboard
  const bubbles = Array(6).fill().map((_, i) => ({
    size: Math.random() * 80 + 40,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden border border-white/50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating bubbles background */}
        <div className="absolute inset-0 overflow-hidden opacity-60 pointer-events-none">
          {bubbles.map((bubble, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-200 opacity-40"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                top: bubble.top,
                left: bubble.left,
              }}
            ></div>
          ))}
        </div>
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shadow-lg">
                <Package size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Product</h2>
                <p className="text-blue-100 text-sm">Enter product details below</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 relative z-10">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-indigo-600" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">SKU</label>
                <input 
                  type="text" 
                  name="sku" 
                  placeholder="SKU" 
                  className="w-full p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
                <input 
                  type="text" 
                  name="category" 
                  placeholder="Category" 
                  className="w-full p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* Stock & Price - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Archive size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-indigo-600" />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Product description"
                className="w-full p-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          {/* Statistics Card Preview */}
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-800 mb-2">Product Preview</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <BarChart2 size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{formData.name || "Product Name"}</p>
                <p className="text-xs text-gray-500">{formData.category || "Category"} • Stock: {formData.stock || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-300/30 transition-all duration-300 transform hover:-translate-y-1 font-medium flex items-center justify-center group"
            >
              Add Product
              <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;