import { NavLink } from "react-router-dom";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useThemeStore } from "../stores/ThemeStore";
import { 
  BarChart3, 
  ArrowRight,  
  Zap, 
  ShieldCheck, 
  LayoutDashboard,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const darkMode = useThemeStore((s) => s.darkMode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bgMain = darkMode ? "bg-zinc-950" : "bg-white";
  const textMain = darkMode ? "text-white" : "text-zinc-900";
  const textMuted = darkMode ? "text-zinc-400" : "text-zinc-600";

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${bgMain} ${textMain}`}>
      
      {/* Animated Background generated globally in App.jsx */}

      {/* HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${darkMode ? "glass-dark border-b-0" : "glass border-b-0"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${darkMode ? "from-indigo-500 to-purple-600" : "from-indigo-600 to-purple-700"} shadow-lg`}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">EduStats</span>
          </div>

          <nav className={`hidden md:flex gap-8 text-sm font-medium ${textMuted}`}>
            <NavLink to="/features" className="hover:text-indigo-500 transition-colors duration-200">Features</NavLink>
            <NavLink to="/pricing" className="hover:text-indigo-500 transition-colors duration-200">Pricing</NavLink>
            <NavLink to="/about" className="hover:text-indigo-500 transition-colors duration-200">About</NavLink>
            <NavLink to="/contact" className="hover:text-indigo-500 transition-colors duration-200">Contact</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <NavLink to="/login" className={`hidden md:block text-sm font-medium hover:text-indigo-600 transition-colors ${textMuted}`}>
               Sign in
            </NavLink>
            <NavLink
              to={isLoggedIn ? "/home" : "/signup"}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              {isLoggedIn ? "Dashboard" : "Get Started"}
            </NavLink>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? "border-zinc-800 bg-zinc-950" : "border-gray-200 bg-white"}`}>
            <nav className="flex flex-col p-4 gap-4">
              <NavLink to="/features" className={`text-sm font-medium ${textMuted} hover:text-indigo-500`}>Features</NavLink>
              <NavLink to="/pricing" className={`text-sm font-medium ${textMuted} hover:text-indigo-500`}>Pricing</NavLink>
              <NavLink to="/about" className={`text-sm font-medium ${textMuted} hover:text-indigo-500`}>About</NavLink>
              <NavLink to="/contact" className={`text-sm font-medium ${textMuted} hover:text-indigo-500`}>Contact</NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border backdrop-blur-md shadow-lg ${darkMode ? "bg-white/10 border-white/20 text-indigo-300" : "bg-black/5 border-black/10 text-indigo-700"}`}>
            <Sparkles className="w-3.5 h-3.5" />
            Introducing AI-Powered Analytics
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className={darkMode ? "text-white" : "text-zinc-900"}>Transform educational data</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">into actionable insights</span>
          </h1>

          <p className={`max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-10 ${textMuted}`}>
            Empower educators and institutions with intelligent analytics. Track performance, identify patterns, and make data-driven decisions that improve student outcomes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <NavLink
              to="/signup"
              className={`group px-8 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
                darkMode ? "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white" : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              }`}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="relative mx-auto max-w-6xl mt-12">
             <div className={`relative rounded-3xl p-4 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/30 ${darkMode ? "glass-dark" : "glass"}`}>
                <div className={`rounded-2xl overflow-hidden border ${darkMode ? "bg-black/40 border-white/10" : "bg-white/40 border-white/40 backdrop-blur-md"}`}>
                   <div className={`h-12 border-b flex items-center px-4 gap-2 ${darkMode ? "border-white/10 bg-black/60 backdrop-blur-xl" : "border-white/40 bg-white/60 backdrop-blur-xl"}`}>
                      <div className="flex gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-400/90 shadow-sm backdrop-blur-sm border border-red-500/50"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90 shadow-sm backdrop-blur-sm border border-amber-500/50"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-400/90 shadow-sm backdrop-blur-sm border border-green-500/50"></div>
                      </div>
                      <div className={`ml-4 flex-1 h-6 rounded-md ${darkMode ? "bg-white/10" : "bg-black/5"} max-w-sm backdrop-blur-sm`}></div>
                   </div>
                   <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`h-48 rounded-2xl col-span-1 md:col-span-2 bg-gradient-to-br ${darkMode ? "from-indigo-500/30 to-purple-500/30 border border-white/10 shadow-inner" : "from-indigo-400/20 to-purple-400/20 border border-white/50 shadow-inner"} backdrop-blur-md animate-pulse`}></div>
                      <div className={`h-48 rounded-2xl bg-gradient-to-br ${darkMode ? "from-purple-500/30 to-pink-500/30 border border-white/10 shadow-inner" : "from-purple-400/20 to-pink-400/20 border border-white/50 shadow-inner"} backdrop-blur-md animate-pulse`}></div>
                      <div className={`h-48 rounded-2xl bg-gradient-to-br ${darkMode ? "from-pink-500/30 to-indigo-500/30 border border-white/10 shadow-inner" : "from-pink-400/20 to-indigo-400/20 border border-white/50 shadow-inner"} backdrop-blur-md animate-pulse`}></div>
                      <div className={`h-48 rounded-2xl col-span-1 md:col-span-2 bg-gradient-to-br ${darkMode ? "from-indigo-500/30 to-pink-500/30 border border-white/10 shadow-inner" : "from-indigo-400/20 to-pink-400/20 border border-white/50 shadow-inner"} backdrop-blur-md animate-pulse`}></div>
                   </div>
                </div>
             </div>
             <div className={`absolute -inset-8 blur-[120px] -z-10 opacity-50 rounded-full ${darkMode ? "bg-gradient-to-r from-indigo-600/50 to-purple-600/50" : "bg-gradient-to-r from-indigo-400/40 to-purple-400/40"}`}></div>
          </div>

        </div>
      </section>

      
      {/* FEATURES */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}>
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Everything you need to succeed</h2>
          <p className={`max-w-2xl mx-auto text-lg ${textMuted}`}>Comprehensive analytics tools designed for modern education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard 
            icon={<LayoutDashboard />}
            title="Interactive Dashboards"
            desc="Transform complex data into intuitive visualizations that reveal insights at a glance. Customizable layouts adapt to your workflow."
            darkMode={darkMode}
          />
          <FeatureCard 
            icon={<Zap />}
            title="Real-Time Monitoring"
            desc="Track student progress as it happens with live updates. Set alerts for critical metrics and respond proactively to changes."
            darkMode={darkMode}
          />
          <FeatureCard 
            icon={<ShieldCheck />}
            title="AI-Powered Detection"
            desc="Machine learning algorithms automatically identify performance patterns, at-risk students, and intervention opportunities."
            darkMode={darkMode}
          />
          <FeatureCard 
            icon={<TrendingUp />}
            title="Predictive Analytics"
            desc="Forecast student outcomes and identify trends before they emerge. Make proactive decisions backed by data science."
            darkMode={darkMode}
          />
          <FeatureCard 
            icon={<Users />}
            title="Collaborative Tools"
            desc="Share insights across departments with role-based access. Enable data-driven conversations among stakeholders."
            darkMode={darkMode}
          />
          <FeatureCard 
            icon={<CheckCircle2 />}
            title="Compliance & Security"
            desc="Enterprise-grade security with SOC 2 compliance. FERPA-compliant data handling protects student privacy."
            darkMode={darkMode}
          />
        </div>
      </section>

    
      {/* FOOTER */}
      <footer className={`py-12 px-4 sm:px-6 z-10 relative ${darkMode ? "glass-dark rounded-t-3xl border-b-0 mx-4" : "glass rounded-t-3xl border-b-0 mx-4"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${darkMode ? "from-indigo-500 to-purple-600" : "from-indigo-600 to-purple-700"}`}>
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">EduStats</span>
              </div>
              <p className={`text-sm ${textMuted} max-w-xs`}>
                Empowering education through intelligent data analytics and insights.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className={`flex flex-col gap-2 text-sm ${textMuted}`}>
                <a href="#" className="hover:text-indigo-500 transition-colors">Features</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Pricing</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Security</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Roadmap</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className={`flex flex-col gap-2 text-sm ${textMuted}`}>
                <a href="#" className="hover:text-indigo-500 transition-colors">About</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Blog</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Careers</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className={`flex flex-col gap-2 text-sm ${textMuted}`}>
                <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Compliance</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? "border-zinc-800" : "border-gray-200"}`}>
            <p className={`text-sm ${textMuted}`}>© 2025 EduStats Inc. All rights reserved.</p>
            <div className={`flex gap-6 text-sm ${textMuted}`}>
               <a href="#" className="hover:text-indigo-500 transition-colors">Twitter</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">LinkedIn</a>
               <a href="#" className="hover:text-indigo-500 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, darkMode }) {
  return (
    <div className={`group p-8 transition-all duration-300 ${
      darkMode 
        ? "glass-card-dark" 
        : "glass-card"
    }`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
        darkMode ? "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20" : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200"
      }`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className={`leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{desc}</p>
    </div>
  )
}