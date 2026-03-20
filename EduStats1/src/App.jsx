import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ProtectedRoute2 from "./components/ProtectedRoute2";
import Contact from "./pages/Contact";
import ManualEntry from "./pages/TrackManually";
import ResultsPage from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import SavedResultsPage from "./pages/Saved-results";
import Profile from "./pages/Profile";
import CompareVisualizations from "./pages/CompareVisualizations";
import CompareResult from "./pages/CompareResults";
import Timeline from "./pages/Timeline";
import Anomaly from "./pages/Anomaly";
import EditMarks from "./pages/EditMarks";
import { useThemeStore } from "./stores/ThemeStore";

export default function App() {
  const darkMode = useThemeStore((s) => s.darkMode);

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${darkMode ? "bg-zinc-950 text-white" : "bg-slate-50 text-zinc-900"}`}>
      {/* Global Animated Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-inherit">
        <div style={{ animation: 'gradientX 20s infinite alternate ease-in-out' }} 
             className={`absolute -top-1/4 -right-1/4 w-[150vw] h-[150vh] rounded-[100%] opacity-30 mix-blend-screen filter blur-[150px] ${darkMode ? "bg-indigo-900/60" : "bg-indigo-300"}`}></div>
             
        <div style={{ animation: 'gradientY 25s infinite alternate-reverse ease-in-out' }}
             className={`absolute -bottom-1/4 -left-1/4 w-[120vw] h-[120vh] rounded-[100%] opacity-30 mix-blend-screen filter blur-[120px] ${darkMode ? "bg-purple-900/60" : "bg-purple-300"}`}></div>
             
        <div style={{ animation: 'gradientZ 15s infinite alternate ease-in-out' }}
             className={`absolute top-1/2 left-1/2 w-[100vw] h-[100vh] rounded-[100%] opacity-20 mix-blend-screen filter blur-[140px] transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? "bg-fuchsia-900/40" : "bg-pink-300"}`}></div>
      </div>

      <div className="relative z-0 min-h-screen flex flex-col">
          <BrowserRouter>
            <Toaster position="top-right" 
                     toastOptions={{
                       className: darkMode ? '!bg-zinc-900/90 !text-white !backdrop-blur-md !border !border-white/10' : '!bg-white/90 !text-black !backdrop-blur-md !border !border-black/10',
                     }} 
            />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<MainLayout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/compare-visualizations" element={<CompareVisualizations />} />
            <Route path="/compare/result" element={<CompareResult />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/anomaly" element={<Anomaly />} />
            <Route path="/edit-marks/:id" element={<EditMarks />} />
            <Route
            path="/home/manual"
            element={
              <ProtectedRoute>
                <ManualEntry />
              </ProtectedRoute>
            }
          />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/saved-results/:id" element={<SavedResultsPage />} />

            <Route
              path="/login"
              element={
                <ProtectedRoute2>
                  <Login />
                </ProtectedRoute2>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute2>
                  <Signup />
                </ProtectedRoute2>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
     </div>
    </div>
  );
}
