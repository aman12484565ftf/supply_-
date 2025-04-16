import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { placeOrder } from "../redux/orders/orderSlice";
import { 
  ShoppingCart, 
  Package, 
  Loader2, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Search,
  Bell,
  TrendingUp
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerOrder = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products || {});
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    setTimeout(() => setAnimateStats(true), 100);
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
  
    const orderData = {
      items: cart,
      totalAmount: calculateTotal(),
    };
  
    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        setOrderSuccess(true);
        setCart([]);
      })
      .catch((error) => {
        console.error("Order failed:", error);
        alert("Failed to place order. Please try again.");
      });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Filter products based on search term
  const filteredProducts = searchTerm 
    ? products?.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : products;

  const QuickStatCard = ({ title, value, icon, delay, animate, color }) => {
    const [isHovered, setIsHovered] = useState(false);
  
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
      <div 
        className={`bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } border border-white/50`}
        style={{ transitionDelay: `${delay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses()} flex items-center justify-center text-white shadow-md ${
            isHovered ? "scale-110 rotate-6" : ""
          } transition-all duration-300`}>
            {icon}
          </div>
          {isHovered && (
            <TrendingUp size={18} className="text-green-500" />
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mt-1">{value}</p>
        <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getColorClasses()} rounded-full transition-all duration-500 ${
          isHovered ? "w-3/4" : ""
        }`}></div>
      </div>
    );
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
                Customer Order Center
              </h1>
              <p className="text-gray-500">Browse products and place your order</p>
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
              <button className="relative p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-sm">
                <Bell size={20} className="text-gray-600" />
                {getItemsCount() > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <QuickStatCard
                  title="Available Products"
                  value={products?.length || 0}
                  icon={<Package size={20} className="text-white" />}
                  delay={0}
                  animate={animateStats}
                  color="indigo"
                />
                <QuickStatCard
                  title="Items in Cart"
                  value={getItemsCount()}
                  icon={<ShoppingCart size={20} className="text-white" />}
                  delay={100}
                  animate={animateStats}
                  color="blue"
                />
                <QuickStatCard
                  title="Cart Total"
                  value={`₹${calculateTotal().toLocaleString()}`}
                  icon={<DollarSign size={20} className="text-white" />}
                  delay={200}
                  animate={animateStats}
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2">
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md mr-3">
                          <Package className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Available Products</h2>
                      </div>
                      {filteredProducts?.length > 0 && (
                        <span className="text-sm text-indigo-600 bg-indigo-50 py-1 px-3 rounded-lg">
                          Showing {filteredProducts.length} product{filteredProducts.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    {filteredProducts?.length === 0 ? (
                      <div className="text-center py-10 bg-indigo-50/70 rounded-lg">
                        <Package className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No products available.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                          <div 
                            key={product._id} 
                            className="p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm border border-white/50 group hover:-translate-y-1"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                <div className="flex items-center mt-1">
                                  <DollarSign className="w-4 h-4 text-indigo-600 mr-1" />
                                  <span className="font-semibold text-indigo-700">₹{product.price.toLocaleString()}</span>
                                </div>
                                {product.description && (
                                  <p className="text-gray-500 text-sm mt-2">{product.description}</p>
                                )}
                              </div>
                              {product.image && (
                                <div className="w-16 h-16 rounded-md overflow-hidden bg-indigo-100">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center shadow-md text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transform transition-transform duration-200 hover:scale-[1.02]"
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
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 p-6 sticky top-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md mr-3">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
                    </div>

                    {orderSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Placed Successfully!</h3>
                        <p className="text-gray-600">Your order has been placed and is being processed.</p>
                        <button
                          onClick={() => setOrderSuccess(false)}
                          className="mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                        >
                          Place Another Order
                        </button>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="text-center py-10 bg-indigo-50/70 rounded-lg">
                        <ShoppingCart className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">Your cart is empty.</p>
                        <p className="text-sm text-gray-400">Add some products to get started.</p>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                          {cart.map((item) => (
                            <div 
                              key={item.product} 
                              className="p-3 rounded-lg mb-3 hover:shadow-md transition-all bg-white/90 backdrop-blur-sm border border-indigo-100 group hover:-translate-y-1"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                                  <p className="text-indigo-600 text-sm">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => handleRemoveFromCart(item.product)}
                                    className="p-1 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
                                  >
                                    <Minus className="w-4 h-4 text-indigo-600" />
                                  </button>
                                  <span className="font-medium text-gray-800">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleAddToCart({ _id: item.product, name: item.name, price: item.price })}
                                    className="p-1 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors"
                                  >
                                    <Plus className="w-4 h-4 text-indigo-600" />
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
                            <span className="font-semibold text-gray-800">₹{calculateTotal().toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-semibold text-gray-800">{getItemsCount()}</span>
                          </div>
                          <button
                            onClick={handlePlaceOrder}
                            className="w-full py-3 px-4 rounded-lg flex items-center justify-center text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
                          >
                            <CreditCard className="w-5 h-5 mr-2" /> Place Order
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerOrder;