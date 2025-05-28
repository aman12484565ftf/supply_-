import { useState, useEffect } from "react";
import { Truck, Package, Shield, BarChart2, ArrowRight, MapPin, Clock, Globe, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="bg-white font-sans">
      {/* Hero Section with Glass Morphism Effect */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Floating bubbles background */}
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
        <div className="relative z-10 px-6 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-gray-900">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="block mb-2">Revolutionize Your</span>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Supply Chain Management
              </span>
            </h1>
            <p className="text-lg lg:text-xl mb-10 text-gray-700 max-w-xl leading-relaxed">
            Our platform offers real-time tracking, automated inventory management, and seamless logistics coordination for a smarter supply chain.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* <button className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center">
                Get Started
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button> */}
              <a
  href="/login"
  className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center"
>
  Get Started
  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
</a>
              {/* <button className="px-8 py-4 bg-white/80 backdrop-blur-lg hover:bg-white border border-gray-200 text-gray-800 font-medium rounded-xl transition-all duration-300">
                Watch Demo
              </button> */}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative w-full h-full min-h-[500px]">
              {/* Glass card with dashboard */}
              <div className="absolute top-0 right-0 w-full h-full bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-white/20">
                <div className="p-6">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <Truck size={20} />
                      </div>
                      <h3 className="ml-3 font-semibold text-gray-800">Logistics Dashboard</h3>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="text-sm text-gray-500">Active Shipments</div>
                      <div className="text-2xl font-bold text-indigo-600">142</div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full w-3/4 bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                      <div className="text-sm text-gray-500">On-Time Rate</div>
                      <div className="text-2xl font-bold text-blue-600">98.2%</div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full w-11/12 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map visualization */}
                  <div className="bg-white/80 p-4 rounded-xl shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm font-medium text-gray-700">Shipment Activity</div>
                      <div className="text-xs text-indigo-600 font-medium">Live View</div>
                    </div>
                    <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Simplified map dots */}
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute rounded-full bg-indigo-400"
                            style={{
                              width: `${Math.random() * 10 + 4}px`,
                              height: `${Math.random() * 10 + 4}px`,
                              top: `${Math.random() * 80 + 10}%`,
                              left: `${Math.random() * 80 + 10}%`,
                              opacity: 0.7
                            }}
                          ></div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-md border-2 border-indigo-500 flex items-center justify-center">
                          <Truck size={24} className="text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent activity */}
                  {/* <div className="bg-white/80 p-4 rounded-xl shadow-sm">
                    <div className="text-sm font-medium text-gray-700 mb-3">Recent Activity</div>
                    <div className="space-y-3">
                      {[
                        { time: "2 min ago", event: "Shipment #4587 picked up", status: "in-progress" },
                        { time: "15 min ago", event: "Delivery #3245 completed", status: "completed" },
                        { time: "1 hr ago", event: "New order received", status: "new" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-start">
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' : 
                            item.status === 'in-progress' ? 'bg-blue-500' : 'bg-indigo-500'
                          }`}></div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-800">{item.event}</div>
                            <div className="text-xs text-gray-500">{item.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
              
              {/* Floating cards for depth */}
              {/* <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 flex items-center justify-center">
                <Package size={32} className="text-indigo-600" />
              </div> */}
              {/* <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 flex items-center justify-center">
                <BarChart2 size={36} className="text-blue-600" />
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Scrolling indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-600"> */}
          {/* <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
          </div> */}
        {/* </div> */}

      </section>
      
      {/* Stats Section */}
      {/* <section className="w-full bg-white py-12 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "99.5%", label: "System Uptime" },
              { value: "3.2M", label: "Packages Delivered" },
              { value: "42%", label: "Cost Reduction" },
              { value: "24/7", label: "Support Coverage" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl">
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section className="w-full bg-white py-12 border-t border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { value: "99.5%", label: "System Uptime" },
        { value: "3.2M", label: "Packages Delivered" },
        { value: "42%", label: "Cost Reduction" },
        { value: "24/7", label: "Support Coverage" }
      ].map((stat, i) => (
        <div key={i} className="text-center p-6 rounded-xl">
          <div className="text-3xl lg:text-4xl font-bold mb-2 text-blue-600">
            {stat.value}
          </div>
          <div className="text-gray-700 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

      
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-900">Comprehensive Supply Chain Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our integrated platform provides end-to-end visibility and control for modern logistics operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Truck size={28} className="text-indigo-600" />}
              title="Real-Time Tracking" 
              desc="Monitor shipments with live GPS updates and predictive ETAs."
              color="indigo"
            />
            <FeatureCard 
              icon={<Package size={28} className="text-blue-600" />}
              title="Inventory Management" 
              desc="Automated stock control with smart reordering alerts."
              color="blue"
            />
            <FeatureCard 
              icon={<Shield size={28} className="text-green-600" />}
              title="Security & Compliance" 
              desc="End-to-end encryption and regulatory compliance tools."
              color="green"
            />
            <FeatureCard 
              icon={<BarChart2 size={28} className="text-purple-600" />}
              title="Advanced Analytics" 
              desc="Custom reports and actionable business insights."
              color="purple"
            />
            <FeatureCard 
              icon={<MapPin size={28} className="text-red-600" />}
              title="Route Optimization" 
              desc="AI-powered routing to reduce fuel costs and delays."
              color="red"
            />
            <FeatureCard 
              icon={<Globe size={28} className="text-cyan-600" />}
              title="Global Network" 
              desc="Seamless integration with international carriers."
              color="cyan"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      {/* <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-900">Simple Integration, Powerful Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get up and running quickly with our easy-to-use platform.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              icon={<div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Truck size={24} className="text-indigo-600" />
              </div>}
              title="Connect Your Systems"
              desc="Integrate with your existing ERP, WMS, and TMS in minutes."
            />
            <StepCard 
              number="2"
              icon={<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>}
              title="Configure Workflows"
              desc="Set up your logistics processes with our intuitive tools."
            />
            <StepCard 
              number="3"
              icon={<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart2 size={24} className="text-green-600" />
              </div>}
              title="Optimize & Scale"
              desc="Use analytics to continuously improve your operations."
            />
          </div>
        </div>
      </section> */}
      
      {/* Testimonials */}

      {/* <section className="py-24 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Trusted by Industry Leaders</h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Join thousands of businesses revolutionizing their supply chains.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Reduced our logistics costs by 28% while improving delivery times.",
                author: "Sarah Johnson",
                role: "COO, RetailCorp"
              },
              {
                quote: "The real-time visibility has transformed how we manage our supply chain.",
                author: "Michael Chen",
                role: "Logistics Director"
              },
              {
                quote: "Implementation was seamless and the results were immediate.",
                author: "Emma Rodriguez",
                role: "Operations VP"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                <div className="text-lg mb-6">"{testimonial.quote}"</div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-indigo-200 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* CTA Section */}
      {/* <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center">
              Get Started Now
              <ArrowRight size={18} className="ml-2" />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white font-medium rounded-xl transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section> */}
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="mr-3 w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
                  <Truck size={18} className="text-white" />
                </div>
                LogiTrack
              </div>
              
              <p className="mb-6">
                Revolutionizing supply chain management with cutting-edge technology and seamless integration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Phone size={16} className="mt-1 mr-2 flex-shrink-0" />
                  <span>+91 123-4567</span>
                </li>
                <li className="flex items-start">
                  <Mail size={16} className="mt-1 mr-2 flex-shrink-0" />
                  <span>logitrack.com</span>
                </li>
                <li className="flex items-start">
                  <MapPin size={16} className="mt-1 mr-2 flex-shrink-0" />
                  <span>123 Ajeet Nagar,Delhi</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} LogiTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, desc, color }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

// Step Card Component
const StepCard = ({ number, icon, title, desc }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">
          {number}
        </div>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
};

export default Home;