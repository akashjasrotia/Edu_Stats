import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";

export default function VisualizationTimeline() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const user = useIsLoggedIn((s) => s.user);
  const navigate = useNavigate();

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/timeline/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setTimeline(data.timeline || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-zinc-950" : "bg-gray-50"
        }`}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 py-16 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-light mb-2">
            Your Visualization Journey
          </h1>
          <p className="text-zinc-500">
            A timeline of everything you’ve analyzed so far
          </p>
        </div>

        {/* TIMELINE */}
        {timeline.length > 0 ? (
          <div className="relative border-l border-zinc-700 pl-8 space-y-12">
            {timeline.map((viz) => {
              const passCount = viz.stats?.passCount ?? 0;
              const failCount = viz.stats?.failCount ?? 0;

              const totalStudents = passCount + failCount;

              const passPercent =
                totalStudents > 0
                  ? Math.round((passCount / totalStudents) * 100)
                  : 0;

              return (
                <div key={viz._id} className="relative">
                  {/* DOT */}
                  <div className="absolute -left-[11px] top-3 w-5 h-5 rounded-full bg-indigo-500"></div>

                  {/* CARD */}
                  <div
                    className={`p-6 rounded-2xl transition ${
                      darkMode
                        ? "bg-zinc-900 border border-zinc-800"
                        : "bg-white border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div>
                        <h3 className="text-xl font-medium mb-1">
                          {viz.vizName}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {new Date(viz.createdAt).toDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/saved-results/${viz._id}`)}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
                      >
                        View <ArrowRight size={16} />
                      </button>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                      <Stat
                        label="Students"
                        value={`${totalStudents} students`}
                      />
                      <Stat label="Mean" value={viz.stats.mean} />
                      <Stat label="Pass %" value={`${passPercent}%`} />
                      <Stat label="Std Dev" value={viz.stats.stdDeviation} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-zinc-500">
            No visualizations created yet
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
