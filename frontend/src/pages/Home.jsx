import { useState, useEffect } from "react";
import { TruckIcon, BoxIcon, ShieldCheckIcon, ChartBarIcon } from "lucide-react";

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
    <div className="bg-gray-50">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center bg-cover bg-center bg-[url('/images/hero-bg.jpg')] overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="text-center text-white z-10 px-4 max-w-4xl mx-auto transition-all duration-700 ease-out"
          style={{ 
            transform: `translateY(${-scrollY * 0.1}px)`,
            opacity: 1 - scrollY * 0.002
          }}
        >
          <div className="mb-6 transform transition-transform duration-700 hover:scale-105">
            <div className="inline-block p-3 rounded-full bg-blue-500/30 mb-4">
              <TruckIcon size={40} className="text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="block">Intelligent</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Supply Chain Management
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Track shipments, manage inventory, and optimize operations with our AI-powered logistics platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <a 
              href="/login" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </a>
            {/* <a 
              href="/track" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Track Shipment
            </a> */}
          </div>
        </div>
        
        {/* Animated Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-white">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section with Animation */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-4 inline-block">WHY CHOOSE US</span>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Revolutionize Your Supply Chain</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design to streamline your logistics operations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<TruckIcon size={32} />}
              title="Real-Time Tracking" 
              desc="Monitor shipments live with precision GPS tracking and predictive ETAs." 
              color="blue"
            />
            <FeatureCard 
              icon={<BoxIcon size={32} />}
              title="Smart Inventory" 
              desc="AI-powered inventory management with demand forecasting and automated reordering." 
              color="indigo"
            />
            <FeatureCard 
              icon={<ShieldCheckIcon size={32} />}
              title="Secure & Reliable" 
              desc="Enterprise-grade security with blockchain verification for every transaction." 
              color="purple"
            />
          </div>
        </div>
      </section>
      
      {/* Analytics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-4 inline-block">DATA-DRIVEN INSIGHTS</span>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Make Smarter Logistics Decisions</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our advanced analytics dashboard gives you complete visibility into your supply chain performance with actionable insights.
              </p>
              <ul className="space-y-4">
                {[
                  "Identify bottlenecks and optimize routes",
                  "Reduce costs with predictive maintenance",
                  "Improve delivery times with AI optimization",
                  "Monitor sustainability metrics across operations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a 
                  href="/dashboard" 
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-indigo-500/30 transition-all duration-300 inline-flex items-center"
                >
                  <ChartBarIcon size={20} className="mr-2" />
                  Explore Dashboard
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-white p-2 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/api/placeholder/800/500" 
                  alt="Analytics Dashboard" 
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              See why thousands of businesses rely on our platform for their logistics needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Reduced our shipping costs by 23% in the first quarter after implementation.",
                author: "Sarah Johnson",
                role: "Logistics Director, TechCorp"
              },
              {
                quote: "The real-time tracking and analytics have completely transformed our supply chain efficiency.",
                author: "Michael Chen",
                role: "COO, Global Retail Inc."
              },
              {
                quote: "Customer satisfaction increased dramatically with the improved delivery accuracy.",
                author: "Emma Rodriguez",
                role: "VP of Operations, FastShip Logistics"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl text-blue-300 mb-4">"</div>
                <p className="text-lg mb-6">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Ready to Optimize Your Logistics?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses that trust our platform for end-to-end supply chain management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/signup" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Free Trial
            </a>
            <a 
              href="/demo" 
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SupplyChainPro</h3>
              <p className="text-gray-400">
                Advanced logistics management for the modern enterprise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/solutions/tracking" className="hover:text-blue-400 transition-colors">Shipment Tracking</a></li>
                <li><a href="/solutions/inventory" className="hover:text-blue-400 transition-colors">Inventory Management</a></li>
                <li><a href="/solutions/analytics" className="hover:text-blue-400 transition-colors">Supply Chain Analytics</a></li>
                <li><a href="/solutions/integrations" className="hover:text-blue-400 transition-colors">ERP Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/resources/blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="/resources/guides" className="hover:text-blue-400 transition-colors">Industry Guides</a></li>
                <li><a href="/resources/webinars" className="hover:text-blue-400 transition-colors">Webinars</a></li>
                <li><a href="/resources/case-studies" className="hover:text-blue-400 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@supplychainpro.com</li>
                <li>+1 (888) 123-4567</li>
                <li>123 Logistics Way, Suite 100</li>
                <li>San Francisco, CA 94103</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© {new Date().getFullYear()} SupplyChainPro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Feature Card Component with Animation
const FeatureCard = ({ icon, title, desc, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getGradient = () => {
    switch(color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'indigo': return 'from-indigo-500 to-indigo-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };
  
  return (
    <div 
      className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${isHovered ? 'scale-105' : ''} bg-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`mb-6 p-4 rounded-full inline-block bg-gradient-to-r ${getGradient()} text-white transform transition-transform duration-500 ${isHovered ? 'rotate-12' : ''}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
      <div className={`mt-6 w-16 h-1 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ${isHovered ? 'w-full' : ''}`}></div>
    </div>
  );
};

export default Home;