import axios from "axios";

const API_URL = "http://localhost:5000/api/inventory"; // Adjust the endpoint as per your backend

// Fetch all inventory items
export const getInventory = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Add a new product to inventory
export const addProduct = async (productData, token) => {
    if (!productData) throw new Error("Product data is missing");
  
    console.log("📤 Sending to API:", productData);
  
    const response = await fetch(`http://localhost:5000/api/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
      },
      body: JSON.stringify(productData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error("❌ Error Response:", data);
      throw new Error(`Failed to add product: ${data.message}`);
    }
  
    return data;
  };
  
  

// Update an existing product
export const updateProduct = async (id, updatedData, token) => {
    if (!id) throw new Error("Missing product ID");
  
    const response = await fetch(`http://localhost:5000/api/inventory/${id}`, {  // ✅ Ensure Correct Backend URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Ensure Authentication Token is Sent
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update product: ${errorData.message}`);
    }
  
    return response.json();
  };
  
  
  
// Delete a product from inventory
export const deleteProduct = async (productId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/${productId}`, config);
  return response.data;
};
