import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Loader2,
  User,
  ShieldCheck,
  Activity,
  LogOut,
  Settings,
  LayoutDashboard,
  Clock,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Mail,
  Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import { useResultStore } from "../stores/ResultStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";

export default function Profile() {
  const clearResults = useResultStore((s) => s.clearResults);
  const logout = useIsLoggedIn((s) => s.logout);

  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
        setVisualizations(data.visualizations || []);
      } catch {
        toast.error("Please login again");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        logout();
        clearResults();
        toast.success("Logged out successfully");
        setTimeout(() => navigate("/login"), 800);
      } else toast.error("Logout failed");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-zinc-950" : "bg-gray-50"}`}>
        <Loader2 className={`w-10 h-10 animate-spin ${darkMode ? "text-gray-300" : "text-gray-800"}`} />
      </div>
    );

  if (!user) return null;

  const joinedDate = new Date(user.createdAt);
  const daysMember = Math.floor((Date.now() - joinedDate) / (1000 * 60 * 60 * 24));

  // Shared classes for consistent styling
  const cardBaseClass = darkMode
    ? "bg-zinc-900 border-zinc-800/50"
    : "bg-white border-gray-200 shadow-sm";
  
  const textMuted = darkMode ? "text-zinc-400" : "text-zinc-500";
  const textMain = darkMode ? "text-zinc-100" : "text-zinc-900";

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-300 ${darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"}`}>
      
      {/* Background Decor */}
      <div className={`absolute inset-0 h-64 overflow-hidden pointer-events-none ${darkMode ? 'opacity-20' : 'opacity-10'}`}>
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        
        {/* ================= HEADER ================= */}
        <div className={`relative overflow-hidden rounded-3xl p-8 mb-8 border transition-all duration-300 ${cardBaseClass}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl  shadow-lg ring-4 ${
                darkMode ? "bg-indigo-500/10 text-indigo-400 ring-zinc-800" : "bg-indigo-100 text-indigo-600 ring-white"
              }`}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left space-y-2 mt-2">
              <h1 className={`text-3xl sm:text-4xl  tracking-tight ${textMain}`}>{user.name}</h1>
              <div className={`flex flex-wrap items-center justify-center md:justify-start gap-4 ${textMuted}`}>
                <span className="flex items-center gap-1.5 text-sm">
                  <Mail className="w-4 h-4" /> {user.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4" /> Joined {joinedDate.toDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
                <span className={`px-3 py-1 rounded-full text-xs  border ${darkMode ? 'border-zinc-700 bg-zinc-800' : 'border-gray-200 bg-gray-100 text-gray-600'}`}>
                    Teacher
                </span>
              </div>
            </div>

            {/* Dashboard CTA (Desktop) */}
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 "
            >
              <LayoutDashboard className="w-5 h-5" />
              Open Dashboard
            </button>
          </div>
        </div>

        {/* ================= GRID CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Stats & Quick Actions */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Stats Grid */}
            <div className="grid font-light grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                icon={<BarChart3 className="w-5 h-5 text-indigo-400" />}
                label="Total Viz"
                value={visualizations.length}
                darkMode={darkMode}
              />
              <StatCard 
                icon={<Clock className="w-5 h-5 text-blue-400" />}
                label="Days Active"
                value={daysMember}
                darkMode={darkMode}
              />
              <StatCard 
                icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
                label="Status"
                value="Secure"
                darkMode={darkMode}
              />
            </div>

            {/* Quick Actions */}
            <Section title="Quick Actions" icon={<Activity />} darkMode={darkMode}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <ActionButton 
                   icon={<Clock />} 
                   label="Visualization Timeline" 
                   desc="View history of your work"
                   onClick={() => navigate("/timeline")}
                   colorClass="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                 />
                 <ActionButton 
                   icon={<AlertTriangle />} 
                   label="Risk & Anomaly" 
                   desc="Check detection logs"
                   onClick={() => navigate("/anomaly")}
                   colorClass="bg-red-500/10 text-red-400 hover:bg-red-500/20"
                 />
              </div>
            </Section>

            {/* Recent Visualizations List */}
            <Section title="Recent Visualizations" icon={<LayoutDashboard />} darkMode={darkMode}>
              {visualizations.length === 0 ? (
                <div className={`flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl ${darkMode ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50"}`}>
                  <BarChart3 className={`w-10 h-10 mb-2 ${textMuted} opacity-50`} />
                  <p className={`text-sm ${textMuted}`}>No visualizations created yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visualizations.map((viz) => (
                    <div
                      key={viz._id}
                      className={`group flex justify-between items-center p-4 rounded-xl border transition-all duration-200 cursor-default
                        ${darkMode 
                          ? "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800" 
                          : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={` ${textMain}`}>{viz.vizName}</p>
                          <p className={`text-xs ${textMuted}`}>
                            {new Date(viz.createdAt).toLocaleDateString()} • {viz.studentResults?.length || 0} students
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${textMuted} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* RIGHT COLUMN: Settings & Details */}
          <div className="space-y-6">
            
            {/* Security & Prefs Panel */}
            <div className={`rounded-3xl p-6 border ${cardBaseClass}`}>
              <div className="flex items-center gap-2 mb-6 text-indigo-500">
                <User className="w-5 h-5" />
                <h2>Account Details</h2>
              </div>
              
              <div className="space-y-5">
                 <div className="space-y-1">
                   <p className={`text-xs uppercase tracking-wider  ${textMuted}`}>Theme Preference</p>
                   <div className="flex items-center justify-between">
                     <span className={textMain}>{darkMode ? "Dark Mode" : "Light Mode"}</span>
                     <Settings className={`w-4 h-4 ${textMuted}`} />
                   </div>
                 </div>

                 <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                 <div className="space-y-1">
                   <p className={`text-xs uppercase tracking-wider  ${textMuted}`}>Security</p>
                   <div className="flex items-center justify-between">
                     <span className={textMain}>Password</span>
                     <button className="text-xs text-indigo-500 hover:underline">Change</button>
                   </div>
                 </div>

                 <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                 
                 <div className="space-y-1">
                   <p className={`text-xs uppercase tracking-wider  ${textMuted}`}>Notifications</p>
                   <span className={`text-sm ${textMain}`}>Enabled</span>
                 </div>
              </div>

              {/* Mobile Dashboard Button */}
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full mt-8 md:hidden flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-4 md:mt-8 flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function Section({ title, icon, children, darkMode }) {
  return (
    <div className={`rounded-3xl p-6 border mb-6 ${darkMode ? "bg-zinc-900/40 border-zinc-800/50" : "bg-white border-gray-200 shadow-sm"}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
          {icon}
        </div>
        <h2 className={`text-lg  ${darkMode ? "text-zinc-100" : "text-zinc-800"}`}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatCard({ icon, label, value, darkMode }) {
  return (
    <div className={`p-5 rounded-2xl border flex flex-col justify-between h-28 transition-transform hover:scale-[1.02] ${
      darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-100 shadow-sm"
    }`}>
      <div className="flex justify-between items-start">
        <span className={`text-sm  ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{label}</span>
        {icon}
      </div>
      <span className={`text-2xl ${darkMode ? "text-white" : "text-zinc-900"}`}>{value}</span>
    </div>
  );
}

function ActionButton({ icon, label, desc, onClick, colorClass }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left p-4 rounded-xl border border-transparent transition-all active:scale-95 ${colorClass}`}
    >
      <div className="flex items-center gap-3 mb-1">
        {icon}
        <span className=" text-sm">{label}</span>
      </div>
      <p className="text-xs opacity-70 ml-0.5">{desc}</p>
    </button>
  );
}