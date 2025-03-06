import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { placeOrder } from "../redux/orders/orderSlice";
import { ShoppingCart, Package, Loader2, Plus, Minus, Trash2, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerOrder = () => {
    
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products || {});
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.product === product._id);
    if (exists) {
      setCart(cart.map((item) => item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        image: product.image || null 
      }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const exists = cart.find((item) => item.product === productId);
    if (exists.quantity === 1) {
      setCart(cart.filter((item) => item.product !== productId));
    } else {
      setCart(cart.map((item) => item.product === productId ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };

  const handleDeleteFromCart = (productId) => {
    setCart(cart.filter((item) => item.product !== productId));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    dispatch(placeOrder({ 
      items: cart, 
      totalAmount: calculateTotal() 
    }));
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setOrderSuccess(false);
    }, 3000);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with Animated Gradient */}
          <header 
            className="mb-8 p-6 rounded-xl bg-white shadow-lg relative overflow-hidden"
            style={{ 
              transform: `translateY(${-scrollY * 0.03}px)`,
              opacity: 1 - scrollY * 0.001
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Place an Order
              </h1>
              <p className="text-gray-600 mt-2">Browse products and add items to your cart.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 mr-4">
                    <Package className="text-indigo-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Available Products</p>
                    <p className="text-lg font-semibold text-gray-800">{products?.length || 0}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <ShoppingCart className="text-purple-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Cart Items</p>
                    <p className="text-lg font-semibold text-gray-800">{getItemsCount()}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <DollarSign className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Cart Total</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{calculateTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products List */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 shadow-lg rounded-xl mb-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-indigo-600" />
                    Available Products
                  </h2>
                  {products?.length > 0 && (
                    <span className="text-sm text-gray-500">
                      Showing {products.length} product{products.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Loader2 className="animate-spin text-indigo-500 w-16 h-16 mx-auto mb-4" />
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : products?.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No products available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <div 
                        key={product._id} 
                        className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                            <div className="flex items-center mt-1">
                              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                              <span className="font-semibold text-gray-700">₹{product.price.toLocaleString()}</span>
                            </div>
                            {product.description && (
                              <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                            )}
                          </div>
                          {product.image && (
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-lg rounded-xl sticky top-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                  <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
                  Your Cart
                </h2>

                {orderSuccess ? (
                  <div className="text-center py-8 animate-fadeIn">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Placed Successfully!</h3>
                    <p className="text-gray-600">Your order has been placed and is being processed.</p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">Your cart is empty.</p>
                    <p className="text-sm text-gray-400">Add some products to get started.</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.product} className="p-3 border border-gray-200 rounded-lg mb-3 hover:border-purple-200 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">{item.name}</h3>
                              <p className="text-gray-600 text-sm">₹{item.price.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleRemoveFromCart(item.product)}
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="font-medium text-gray-800">{item.quantity}</span>
                              <button 
                                onClick={() => handleAddToCart({ _id: item.product, name: item.name, price: item.price })}
                                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                            <button 
                              onClick={() => handleDeleteFromCart(item.product)}
                              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-semibold">{getItemsCount()}</span>
                      </div>
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-purple-700 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Add this CSS to your global styles
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.4s ease-out forwards;
// }

export default CustomerOrder;