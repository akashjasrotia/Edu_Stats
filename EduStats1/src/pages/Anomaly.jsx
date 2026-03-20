import { use, useEffect, useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  LoaderCircleIcon
} from "lucide-react";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useNavigate } from "react-router-dom";

export default function AnomalyDetection() {
    const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useIsLoggedIn((s) => s.user);
  const darkMode = useThemeStore((s) => s.darkMode);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/anomaly/${user.email}`)
      .then((res) => res.json())
      .then((d) => setData(d.results || []));
  }, [user?.email]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // Styles
  const bgMain = darkMode ? "bg-zinc-950" : "bg-gray-50";
  const bgCard = darkMode ? "bg-zinc-900" : "bg-white";
  const borderClass = darkMode ? "border-zinc-800" : "border-gray-200";
  const textMain = darkMode ? "text-zinc-100" : "text-zinc-900";
  const textMuted = darkMode ? "text-zinc-400" : "text-zinc-500";

  if(loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgMain}`}>
        <LoaderCircleIcon className="animate-spin w-8 h-8 text-zinc-500" />
      </div>
    );
  }
  return (
    <div className={`min-h-screen px-4 sm:px-6 py-12 ${bgMain} ${textMain}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 text-red-500 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Risk & Anomaly Detection
          </h1>
          <p className={`max-w-2xl mx-auto text-base ${textMuted}`}>
            AI-driven analysis identifying students requiring academic intervention based on performance thresholds and statistical deviations.
          </p>
        </div>

        {/* Content Area */}
        {data.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border border-dashed ${borderClass} ${bgCard}`}>
            <p className={textMuted}>No anomaly reports found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {data.map((viz) => (
              <div
                key={viz.vizId}
                className={`overflow-hidden rounded-xl border transition-all duration-200 ${bgCard} ${borderClass}`}
              >
                {/* Card Header */}
                <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${borderClass}`}>
                  <div>
                    <h2 className="text-3xl  flex items-center gap-2">
                      {viz.vizName}
                    </h2>
                    <p className={`text-sm ${textMuted}`}>
                      Generated on {new Date(viz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/saved-results/${viz.vizId}`)} 
                    className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        darkMode 
                        ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100" 
                        : "border-gray-200 bg-gray-50 hover:bg-white text-gray-700"
                    }`}
                  >
                    View Full Report
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* Risk Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x dark:divide-zinc-800 divide-gray-200">
                    
                    <Section
                      title="High Risk"
                      description="Immediate intervention required."
                      students={viz.highRisk}
                      theme="red"
                      darkMode={darkMode}
                    />

                    <Section
                      title="Moderate Risk"
                      description="Monitor for potential decline."
                      icon={<Activity className="w-5 h-5" />}
                      students={viz.moderateRisk}
                      theme="amber"
                      darkMode={darkMode}
                    />

                    <Section
                      title="Statistical Anomalies"
                      description="Deviations from class patterns."
                      icon={<TrendingUp className="w-5 h-5" />}
                      students={viz.anomalies}
                      theme="indigo"
                      darkMode={darkMode}
                    />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, description, icon, students, theme, darkMode }) {
  const colors = {
    red: {
      text: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      badge: darkMode ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-100"
    },
    amber: {
      text: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      badge: darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-100"
    },
    indigo: {
      text: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      badge: darkMode ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border-indigo-100"
    }
  };

  const currentTheme = colors[theme];
  const hasStudents = students && students.length > 0;

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className={`${currentTheme.text}`}>{icon}</span>
             <h3 className={`text-sm uppercase tracking-wide ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>
               {title}
             </h3>
           </div>
           <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{description}</p>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded border ${currentTheme.badge}`}>
            {students?.length || 0}
        </span>
      </div>

      <div className="flex-1">
        {!hasStudents ? (
            <div className={`flex items-center gap-2 text-sm italic py-2 ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>
                <CheckCircle2 className="w-4 h-4 opacity-50" />
                No students flagged
            </div>
        ) : (
            <div className="flex flex-wrap gap-2">
            {students.map((name) => (
                <span 
                    key={name} 
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border ${currentTheme.badge}`}
                >
                {name}
                </span>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}