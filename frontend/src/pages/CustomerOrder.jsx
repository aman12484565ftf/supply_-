import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { placeOrder } from "../redux/orders/orderSlice";
import { ShoppingCart, Package, Loader2, Plus, Minus, Trash2, CreditCard, DollarSign, CheckCircle, TrendingUp } from "lucide-react";
import Sidebar from "../components/Sidebar";

const CustomerOrder = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products || {});
  const [cart, setCart] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

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

  const StatCard = ({ title, value, icon, delay, animate, color }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const getGradient = () => {
      switch(color) {
        case 'emerald': return 'from-emerald-500 to-emerald-600';
        case 'teal': return 'from-teal-500 to-teal-600';
        case 'cyan': return 'from-cyan-500 to-cyan-600';
        default: return 'from-emerald-500 to-emerald-600';
      }
    };
  
    return (
      <div 
        className={`p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all duration-500 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${isHovered ? "-translate-y-1" : ""} border border-zinc-100 relative overflow-hidden`}
        style={{ transitionDelay: `${delay}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient()} transform transition-all duration-500 ${
            isHovered ? "rotate-6 scale-110" : ""
          }`}>
            {icon}
          </div>
        </div>
        <h2 className="text-lg font-medium text-zinc-600">{title}</h2>
        <p className="text-3xl font-bold text-zinc-800 mt-1">{value}</p>
        <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${
          isHovered ? "w-3/4" : ""
        }`}></div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Background with depth layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 h-64"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          {/* Geometric shapes for modern aesthetic */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
            <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-cyan-500 blur-3xl"
                style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
            <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-teal-400 blur-3xl"
                style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
          </div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 pt-6 text-white">
              <div className="mb-4 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium tracking-wider">
                <ShoppingCart size={16} className="mr-2" />
                CUSTOMER ORDER CENTER
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                <span className="text-zinc-50 block">Place an Order</span>
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Browse Products & Checkout
                </span>
              </h1>
              <p className="text-zinc-300 mt-2">Add items to your cart and complete your purchase.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-16">
              <StatCard 
                title="Available Products" 
                value={products?.length || 0}
                icon={<Package size={24} className="text-white" />} 
                delay={0} 
                animate={animateStats}
                color="emerald" 
              />
              <StatCard 
                title="Cart Items" 
                value={getItemsCount()}
                icon={<ShoppingCart size={24} className="text-white" />} 
                delay={100} 
                animate={animateStats}
                color="teal" 
              />
              <StatCard 
                title="Cart Total" 
                value={`₹${calculateTotal().toLocaleString()}`}
                icon={<DollarSign size={24} className="text-white" />} 
                delay={200} 
                animate={animateStats}
                color="cyan" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products List */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 shadow-lg rounded-2xl mb-8 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-zinc-100">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white mr-3">
                        <Package className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-semibold text-zinc-800">Available Products</h2>
                    </div>
                    {products?.length > 0 && (
                      <span className="text-sm text-zinc-500">
                        Showing {products.length} product{products.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : products?.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-50 rounded-lg">
                      <Package className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                      <p className="text-zinc-500">No products available.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((product) => (
                        <div 
                          key={product._id} 
                          className="p-4 border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-200 bg-white group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-zinc-800">{product.name}</h3>
                              <div className="flex items-center mt-1">
                                <DollarSign className="w-4 h-4 text-emerald-600 mr-1" />
                                <span className="font-semibold text-zinc-700">₹{product.price.toLocaleString()}</span>
                              </div>
                              {product.description && (
                                <p className="text-zinc-500 text-sm mt-2">{product.description}</p>
                              )}
                            </div>
                            {product.image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:from-emerald-600 hover:to-teal-700 transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
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
                <div className="bg-white p-6 shadow-lg rounded-2xl sticky top-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-zinc-100">
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white mr-3">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-800">Your Cart</h2>
                  </div>

                  {orderSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-800 mb-2">Order Placed Successfully!</h3>
                      <p className="text-zinc-600">Your order has been placed and is being processed.</p>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-50 rounded-lg">
                      <ShoppingCart className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                      <p className="text-zinc-500 mb-2">Your cart is empty.</p>
                      <p className="text-sm text-zinc-400">Add some products to get started.</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto pr-2">
                        {cart.map((item) => (
                          <div key={item.product} className="p-3 border border-zinc-200 rounded-lg mb-3 hover:border-teal-200 transition-colors bg-white group">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-zinc-800">{item.name}</h3>
                                <p className="text-zinc-600 text-sm">₹{item.price.toLocaleString()} × {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-zinc-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleRemoveFromCart(item.product)}
                                  className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-zinc-600" />
                                </button>
                                <span className="font-medium text-zinc-800">{item.quantity}</span>
                                <button 
                                  onClick={() => handleAddToCart({ _id: item.product, name: item.name, price: item.price })}
                                  className="p-1 rounded-md bg-zinc-100 hover:bg-zinc-200 transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-zinc-600" />
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

                      <div className="mt-6 pt-4 border-t border-zinc-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-zinc-600">Subtotal:</span>
                          <span className="font-semibold text-zinc-800">₹{calculateTotal().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-zinc-600">Items:</span>
                          <span className="font-semibold text-zinc-800">{getItemsCount()}</span>
                        </div>
                        <button
                          onClick={handlePlaceOrder}
                          className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-medium flex items-center justify-center hover:from-teal-600 hover:to-cyan-700 transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
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