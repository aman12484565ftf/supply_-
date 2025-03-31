import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  BarChart, 
  Package, 
  Users, 
  Settings, 
  ShoppingCart, 
  Truck, 
  Layers, 
  HelpCircle, 
  Bell, 
  ChevronLeft, 
  Menu, 
  LogOut, 
  ClipboardList, 
  Home, 
  MapPin,
  ArrowRightIcon,
  ChartBarIcon,
  BoxIcon,
  ShieldCheckIcon
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || "customer"; // Default to customer

  // Check if menu item is active
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // **Role-Based Navigation Items**
  const roleBasedNav = {
    admin: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
      { title: "Users", icon: <Users size={20} />, path: "/admin/users" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
    ],
    customer: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Place Order", icon: <ShoppingCart size={20} />, path: "/customer/order" },
    ],
    warehouse_manager: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
      { title: "Orders", icon: <Package size={20} />, path: "/orders" },
      { title: "Shipments", icon: <Truck size={20} />, path: "/warehouse/shipments" },
    ],
    driver: [
      { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
      { title: "My Deliveries", icon: <Truck size={20} />, path: "/driver/deliveries" },
      { title: "Track Shipment", icon: <MapPin size={20} />, path: "/driver/track" },
    ],
  };

  // Get items based on role
  const navItems = roleBasedNav[userRole] || [];

  // Bottom nav items
  const bottomNavItems = [
    { title: "Support", icon: <HelpCircle size={20} />, path: "/support" },
    { title: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/70 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Mobile toggle button */}
      <button 
        className="fixed top-4 left-4 z-30 lg:hidden bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg shadow-lg transition-all duration-300"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 z-20 h-screen 
          ${collapsed ? "w-20" : "w-64"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-gradient-to-b from-emerald-950 via-teal-900 to-cyan-900 text-white
          transition-all duration-300 ease-in-out
          flex flex-col shadow-xl border-r border-zinc-800/30
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-900/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <Truck size={16} className="text-white" />
            </div>
            {!collapsed && <h2 className="text-xl font-bold text-zinc-50">SupplyChainPro</h2>}
          </div>
          <button 
            className="text-emerald-400 hover:text-white transition-colors hidden lg:block"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-5 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                    ${isActive(item.path) 
                      ? "bg-gradient-to-r from-emerald-600/80 to-teal-600/80 text-white shadow-md" 
                      : "text-zinc-300 hover:bg-emerald-800/40 hover:text-white"}
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <span className={isActive(item.path) ? "text-white" : "text-emerald-400"}>{item.icon}</span>
                  {!collapsed && (
                    <span className="font-medium">
                      {item.title}
                    </span>
                  )}
                  {!collapsed && isActive(item.path) && (
                    <div className="ml-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Notification Card */}
          <div className={`mx-3 mt-6 mb-6 p-4 bg-emerald-800/30 rounded-lg border border-emerald-700/30 backdrop-blur-sm ${collapsed ? "text-center" : ""}`}>
            {collapsed ? (
              <Bell size={20} className="mx-auto text-emerald-300 animate-pulse" />
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <Bell size={16} className="text-emerald-300" />
                  <span className="text-sm font-medium text-emerald-300">Notifications</span>
                </div>
                <p className="text-xs text-zinc-400">5 new orders need attention</p>
                <div className="mt-3">
                  <Link 
                    to="/notifications" 
                    className="group text-xs flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                  >
                    View all 
                    <ArrowRightIcon size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            )}
          </div>
          
          {/* Bottom Navigation */}
          <div className="px-3 pb-5">
            <div className="py-2">
              <div className="text-xs text-zinc-500 px-3 mb-2 uppercase font-medium tracking-wider">
                {!collapsed && "Support"}
              </div>
              <ul className="space-y-1">
                {bottomNavItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                        ${isActive(item.path) 
                          ? "bg-zinc-800/40 text-white" 
                          : "text-zinc-400 hover:bg-zinc-800/20 hover:text-zinc-300"}
                        ${collapsed ? "justify-center" : ""}
                      `}
                    >
                      <span className={isActive(item.path) ? "text-emerald-400" : "text-zinc-500"}>{item.icon}</span>
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-emerald-900/30">
          <div className={`flex ${collapsed ? "justify-center" : "items-center space-x-3"}`}>
            {collapsed ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email || "user@example.com"}</p>
                </div>
                <LogOut size={18} className="text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;