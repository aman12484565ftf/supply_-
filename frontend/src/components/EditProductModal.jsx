import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditProduct } from "../redux/inventory/inventorySlice";
import { X, Package, DollarSign, Tag, BarChart2, IndianRupee, Archive } from "lucide-react";

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    price: product?.price || 0,
    description: product?.description || "",
    sku: product?.sku || "",
  });

  const handleChange = (e) => {
    const value = e.target.type === "number" 
      ? parseFloat(e.target.value) 
      : e.target.value;
      
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !product._id) {
      console.error("Error: Product ID is missing");
      return;
    }

    const updatedProductData = {
      name: formData.name || product.name,
      price: formData.price || product.price,
      stock: formData.stock || product.stock,
      category: formData.category || product.category,
      description: formData.description || product.description,
    };

    try {
      console.log("🔄 Updating Product:", updatedProductData);
      await dispatch(EditProduct({ id: product._id, updatedData: updatedProductData }));
      console.log("✅ Product Updated Successfully");
      onClose(); // Close the modal after update
    } catch (error) {
      console.error("❌ Error updating product:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/70 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden opacity-60 pointer-events-none">
        {[...Array(8)].map((_, i) => (
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
      
      <div 
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 p-0 overflow-hidden border border-white/50 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with indigo gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-md">
                <Package size={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Edit Product</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-indigo-500" />
                </div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                  value={formData.name}
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            {/* SKU & Category - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Archive size={18} className="text-blue-500" />
                  </div>
                  <input 
                    type="text" 
                    name="sku" 
                    placeholder="SKU" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={18} className="text-amber-500" />
                  </div>
                  <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                    value={formData.category}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Stock & Price - 2 column layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart2 size={18} className="text-blue-500" />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    placeholder="0" 
                    min="0" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                    value={formData.stock}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={18} className="text-green-500" />
                  </div>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                    value={formData.price}
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Product description"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/80 backdrop-blur-sm"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-white/80 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;