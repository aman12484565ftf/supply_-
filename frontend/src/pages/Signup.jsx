import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Truck, User, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const getRoleOptions = () => [
    { value: "customer", label: "Customer" },
    { value: "driver", label: "Driver" },
    { value: "warehouse_manager", label: "Warehouse Manager" },
    { value: "admin", label: "Admin" }
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate password strength
    if (name === "password") {
      let strength = 0;
      if (value.length > 6) strength += 1;
      if (value.length > 10) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((res) => {
      if (!res.error) navigate("/dashboard"); // Redirect on success
    });
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 2) return "bg-red-500";
    if (passwordStrength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white font-sans">
      {/* Hero Section with Glass Morphism Effect - Matching Login.jsx */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Floating bubbles background - Matching Login.jsx */}
        <div className="absolute inset-0 overflow-hidden opacity-60">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-200 opacity-40"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`
              }}
            ></div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 px-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          {/* Left Column - Branding and Hero Text */}
          <div className="text-gray-900 w-full md:w-1/2 mb-10 md:mb-0">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mr-4">
                <Truck size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">LogiTrack</h3>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="block mb-2">Join</span>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                LogiTrack Platform
              </span>
            </h1>
            <p className="text-lg mb-8 text-gray-700 max-w-xl leading-relaxed">
              Create an account to access our supply chain management platform with real-time tracking, analytics, and optimization tools.
            </p>
            
            <div className="hidden md:grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Active Customers</div>
                <div className="text-2xl font-bold text-indigo-600">10,000+</div>
              </div>
              <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Global Presence</div>
                <div className="text-2xl font-bold text-blue-600">42 Countries</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Signup Form */}
          <div className="w-full md:w-1/2 max-w-md">
            <div className="relative">
              {/* Glass card with signup form */}
              <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20 p-8">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Join our platform and optimize your supply chain</p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-indigo-600" />
                      </div>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Your full name" 
                        onChange={handleChange} 
                        className="w-full pl-10 p-3 bg-white border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-indigo-600" />
                      </div>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Your email address" 
                        onChange={handleChange} 
                        className="w-full pl-10 p-3 bg-white border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-indigo-600" />
                      </div>
                      <input 
                        type="password" 
                        name="password" 
                        placeholder="Create a secure password" 
                        onChange={handleChange} 
                        className="w-full pl-10 p-3 bg-white border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required 
                      />
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Password strength:</span>
                          <span className="text-xs text-gray-500">
                            {passwordStrength < 2 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Account Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase size={18} className="text-indigo-600" />
                      </div>
                      <select 
                        name="role" 
                        onChange={handleChange} 
                        className="w-full pl-10 p-3 bg-white border border-gray-200 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                        style={{ 
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234F46E5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        {getRoleOptions().map(option => (
                          <option key={option.value} value={option.value} className="bg-white text-gray-800">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="group w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Floating cards for depth - Matching Login.jsx style */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 flex items-center justify-center">
                <User size={32} className="text-indigo-600" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 flex items-center justify-center">
                <Truck size={36} className="text-blue-600" />
              </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;