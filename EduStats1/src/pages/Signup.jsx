import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/ThemeStore";
import { Eye, EyeOff, ArrowRight, Loader2, BarChart3, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.email || !formData.password) {
        toast.error("All fields are required");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Styles
  const bgMain = darkMode ? "bg-zinc-950" : "bg-white";
  const textMain = darkMode ? "text-zinc-100" : "text-zinc-900";
  const textMuted = darkMode ? "text-zinc-400" : "text-zinc-500";
  const inputBg = darkMode ? "bg-zinc-900 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20" : "bg-white border-gray-300 focus:border-indigo-600 focus:ring-indigo-600/10";

  return (
    <div className={`min-h-screen flex ${bgMain}`}>
      
      {/* LEFT SIDE: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-24 relative z-10">
        
        {/* Logo Mobile */}
        <div className="lg:hidden flex items-center gap-2 mb-8 text-indigo-600">
           <BarChart3 className="w-6 h-6" />
           <span className="font-bold text-lg">EduStats</span>
        </div>

        <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className={`text-3xl font-semibold tracking-tight ${textMain}`}>Create an account</h1>
                <p className={`text-sm ${textMuted}`}>Enter your details below to create your account and get started.</p>
            </div>

            {/* Google Button */}
            <a
            href="http://localhost:3000/api/auth/google"
            className={`flex items-center justify-center gap-3 w-full py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                darkMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium">Google</span>
            </a>

            <div className="relative">
                <div className={`absolute inset-0 flex items-center`}>
                    <span className={`w-full border-t ${darkMode ? "border-zinc-800" : "border-gray-200"}`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className={`bg-transparent px-2 ${textMuted} ${darkMode ? "bg-zinc-950" : "bg-white"}`}>Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        type="text"
                        className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-offset-0 transition-all outline-none ${inputBg} ${textMain} placeholder:${textMuted}`}
                    />
                    
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        type="email"
                        className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-offset-0 transition-all outline-none ${inputBg} ${textMain} placeholder:${textMuted}`}
                    />

                    <div className="relative">
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:ring-2 focus:ring-offset-0 transition-all outline-none ${inputBg} ${textMain} placeholder:${textMuted}`}
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm flex justify-center items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
            </form>

            <p className={`text-center text-sm ${textMuted}`}>
                Already have an account?{" "}
                <NavLink to="/login" className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
                    Sign in <ArrowRight className="w-3 h-3" />
                </NavLink>
            </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual / Art */}
      <div className={`hidden lg:flex flex-1 relative overflow-hidden ${darkMode ? "bg-zinc-900" : "bg-zinc-50"}`}>
         {/* Abstract background blobs */}
         <div className="absolute inset-0 w-full h-full">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${darkMode ? "bg-indigo-600" : "bg-indigo-300"}`}></div>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${darkMode ? "bg-purple-600" : "bg-purple-300"}`}></div>
         </div>

         {/* Content Overlay */}
         <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            <div className="flex items-center gap-2 text-indigo-600">
               <BarChart3 className="w-6 h-6" />
               <span className={`font-bold text-lg ${textMain}`}>EduStats</span>
            </div>

            <div className="space-y-6 max-w-md">
               <blockquote className={`text-2xl font-medium leading-snug ${textMain}`}>
                  "The ability to visualize my academic growth has completely changed how I study. It's not just data, it's motivation."
               </blockquote>
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                    <div>
                        <p className={`text-sm font-semibold ${textMain}`}>Alex Chen</p>
                        <p className={`text-xs ${textMuted}`}>Computer Science Student</p>
                    </div>
                 </div>
               </div>
            </div>

            <div className="flex gap-4">
                {['Real-time Analytics', 'Secure Data', 'AI Powered'].map((tag) => (
                    <div key={tag} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${darkMode ? "border-zinc-800 bg-zinc-900/50 text-zinc-300" : "border-zinc-200 bg-white/50 text-zinc-600"}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> {tag}
                    </div>
                ))}
            </div>
         </div>
      </div>

    </div>
  );
}