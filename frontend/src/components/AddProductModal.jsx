import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/inventory/inventorySlice";
import { X, Package, DollarSign, Tag, BarChart2, Truck } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with black gradient */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Truck size={18} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-600" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all" 
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all" 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
                <input 
                  type="text" 
                  name="category" 
                  placeholder="Category" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all" 
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
                    <BarChart2 size={18} className="text-gray-600" />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-gray-600" />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all" 
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gray-800 focus:border-gray-800 transition-all"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:shadow-lg hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;