import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  LogOut 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if menu item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation items
  const navItems = [
    { title: "Dashboard", icon: <BarChart size={20} />, path: "/dashboard" },
    { title: "Orders", icon: <Package size={20} />, path: "/orders" },
    { title: "Users", icon: <Users size={20} />, path: "/admin/users" },
    { title: "Products", icon: <ShoppingCart size={20} />, path: "/admin/products" },
    { title: "Shipments", icon: <Truck size={20} />, path: "/admin/shipments" },
    { title: "Inventory", icon: <Layers size={20} />, path: "/inventory" },
  ];

  // Bottom nav items
  const bottomNavItems = [
    { title: "Support", icon: <HelpCircle size={20} />, path: "/admin/support" },
    { title: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Mobile toggle button */}
      <button 
        className="fixed top-4 left-4 z-30 lg:hidden bg-blue-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu size={20} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static top-0 left-0 z-20 h-screen 
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-gradient-to-b from-blue-600 to-indigo-700 text-white
          transition-all duration-300 ease-in-out
          flex flex-col shadow-lg
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blue-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Truck size={20} className="text-blue-600" />
            </div>
            {!collapsed && <h2 className="text-xl font-bold">SupplyChainPro</h2>}
          </div>
          <button 
            className="text-blue-300 hover:text-white transition-colors hidden lg:block"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 py-5 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={isActive(item.path) ? 'text-white' : 'text-blue-200'}>{item.icon}</span>
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Notification */}
          <div className={`mx-3 mt-6 mb-6 p-4 bg-blue-500/30 rounded-lg ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? (
              <Bell size={20} className="mx-auto text-blue-100 animate-pulse" />
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <Bell size={16} className="text-blue-100" />
                  <span className="text-sm font-medium text-blue-100">Notifications</span>
                </div>
                <p className="text-xs text-blue-200">5 new orders need attention</p>
              </>
            )}
          </div>
          
          {/* Bottom Navigation */}
          <ul className="space-y-1 px-3">
            {bottomNavItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={isActive(item.path) ? 'text-white' : 'text-blue-200'}>{item.icon}</span>
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className={`p-4 mt-auto border-t border-blue-500/30 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? (
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto">
              <span className="text-blue-600 font-bold">AD</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">AD</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Admin User</h3>
                <p className="text-xs text-blue-200">admin@example.com</p>
              </div>
              <button className="ml-auto text-blue-300 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;