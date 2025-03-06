import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, TruckIcon, Search, Bell, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/auth/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Define Menu Items Based on Role
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Track Order", path: "/track" },
    ...(user?.role === "admin" || user?.role === "warehouse_manager"
      ? [{ name: "Analytics", path: "/analytics" }]
      : []),
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
            <div className={`p-2 rounded-lg ${scrolled ? "bg-blue-600" : "bg-blue-500"} text-white`}>
              <TruckIcon size={24} />
            </div>
            <span className={`text-2xl font-bold ${scrolled ? "text-blue-600" : "text-white"}`}>
              SupplyChainPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8 text-gray-800">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="relative font-medium hover:text-blue-600 transition-colors py-2">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action Items */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <Search size={20} />
              </button>

              {/* Notifications */}
              {user && (
                <button className="p-2 rounded-full hover:bg-gray-200 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              )}

              {/* User Menu */}
              {user ? (
                <>
                  <Link to="/dashboard" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <User size={20} />
                  </Link>
                  <button onClick={handleLogout} className="ml-4 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300">
                    Login
                  </Link>
                  <Link to="/signup" className="px-5 py-2.5 border border-blue-600 text-blue-600 font-medium rounded-lg transition-all duration-300">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg text-gray-800" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white shadow-md p-4 transition-transform duration-300">
            <div className="relative max-w-3xl mx-auto">
              <input type="text" placeholder="Search for shipments, orders, products..." className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
              <Search size={20} className="absolute right-3 top-3.5 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-3 bg-gray-100 text-center rounded-lg">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-3 bg-red-500 text-white text-center rounded-lg hover:bg-red-600 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-4 py-3 border text-center rounded-lg hover:bg-gray-50 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
