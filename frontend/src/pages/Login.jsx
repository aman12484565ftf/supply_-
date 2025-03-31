import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TruckIcon, KeyIcon, MailIcon, ArrowRightIcon } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((res) => {
      if (!res.error) navigate("/dashboard"); // Redirect on success
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900">
      {/* Background with depth layers - matching Home.jsx style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl opacity-20"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
        <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-cyan-500 blur-3xl opacity-20"
            style={{ transform: `translateY(${-scrollY * 0.2}px)` }}></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-teal-400 blur-3xl opacity-20"
            style={{ transform: `translateY(${-scrollY * 0.25}px)` }}></div>
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <div className="mb-6 transform transition-transform duration-700 hover:scale-105">
            <div className="inline-block p-3 rounded-full bg-emerald-500/20 mb-2">
              <TruckIcon size={40} className="text-emerald-300" />
            </div>
          </div>
          <div className="mb-6 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium tracking-wider">
            <TruckIcon size={16} className="mr-2" />
            SUPPLY CHAIN INTELLIGENCE
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-zinc-300">Sign in to your account to continue</p>
        </div>
        
        <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-zinc-700">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white rounded-lg p-3 mb-6">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-zinc-300 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon size={18} className="text-emerald-400" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your email address" 
                  onChange={handleChange} 
                  className="w-full pl-10 p-3 bg-zinc-900/90 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-zinc-300 text-sm font-medium">Password</label>
                <a href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon size={18} className="text-emerald-400" />
                </div>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Your password" 
                  onChange={handleChange} 
                  className="w-full pl-10 p-3 bg-zinc-900/90 border border-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="group w-full py-4 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRightIcon size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-zinc-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Create One Now
              </a>
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="text-center text-sm text-zinc-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center text-zinc-400 text-sm">
          © {new Date().getFullYear()} SupplyChainPro. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;