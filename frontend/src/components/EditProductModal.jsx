import { useState } from "react";
import { useDispatch } from "react-redux";
import { EditProduct } from "../redux/inventory/inventorySlice";

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    stock: product?.stock || 0,
    price: product?.price || 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full mb-3 p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full mb-3 p-2 border rounded"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="w-full mb-3 p-2 border rounded"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full mb-3 p-2 border rounded"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            Update Product
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProductModal;
