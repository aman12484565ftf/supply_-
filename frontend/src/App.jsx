import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import InventoryDashboard from "./pages/InventoryDashboard";
import OrderDashboard from "./pages/OrderDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerOrders from "./pages/CustomerOrder";
function App() {
  const { user } = useSelector((state) => state.auth);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Only Logged-In Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            user?.role === "admin" ? <Dashboard /> :
            user?.role === "driver" ? <DriverDashboard /> :
            user?.role === "customer" ? <CustomerDashboard /> :
            <Dashboard />
          } />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/orders" element={<OrderDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/order" element={<CustomerOrders />} />  {/* ✅ Fix this route */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
