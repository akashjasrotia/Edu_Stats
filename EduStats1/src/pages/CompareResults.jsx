import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/ThemeStore";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CompareResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const darkMode = useThemeStore((s) => s.darkMode);

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state?.vizAId || !state?.vizBId) {
      navigate("/compare");
      return;
    }

    const fetchComparison = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/compare-visualizations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vizAId: state.vizAId,
              vizBId: state.vizBId,
            }),
          }
        );

        const data = await res.json();
        setComparison(data);
      } catch {
        navigate("/compare");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [state, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!comparison) return null;

  const chartData = {
  labels: ["Mean", "Median", "Pass %"],
  datasets: [
    {
      label: comparison.vizA.name,
      data: [
        comparison.statsComparison.mean.A,
        comparison.statsComparison.median.A,
        comparison.statsComparison.passRate.A,
      ],
      backgroundColor: "#6366f1",
    },
    {
      label: comparison.vizB.name,
      data: [
        comparison.statsComparison.mean.B,
        comparison.statsComparison.median.B,
        comparison.statsComparison.passRate.B,
      ],
      backgroundColor: "#22c55e",
    },
  ],
};


return (
    <div
        className={`min-h-screen px-6 py-16 bg-transparent ${
            darkMode ? "text-white" : "text-black"
        }`}
    >
        <div className="max-w-7xl mx-auto space-y-12">
            {/* HEADER */}
            <div className="text-center">
                <h1 className="text-4xl font-light mb-2">Visualization Comparison</h1>
                <p className={`${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                    Detailed performance analysis between two datasets
                </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompareCard
                    title={comparison.vizA.name}
                    stats={comparison.statsComparison}
                    side="A"
                />

                <CompareCard
                    title={comparison.vizB.name}
                    stats={comparison.statsComparison}
                    side="B"
                />
            </div>

            <div
                className={`p-8 rounded-3xl ${
                    darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
            >
                <h3 className="text-xl font-medium mb-4">Statistical Comparison</h3>
                <Bar data={chartData} />
            </div>

            {/* STUDENT TABLE */}
            <div
                className={`overflow-x-auto rounded-3xl ${
                    darkMode ? "glass-panel-dark" : "glass-panel"
                }`}
            >
                <table className="w-full text-sm">
                    <thead className={darkMode ? "bg-zinc-900/40" : "bg-gray-100"}>
                        <tr>
                            <th className={`p-3 ${darkMode ? "text-zinc-300" : "text-zinc-600"}`}>Student</th>
                            <th className={darkMode ? "text-zinc-300" : "text-zinc-600"}>Before</th>
                            <th className={darkMode ? "text-zinc-300" : "text-zinc-600"}>After</th>
                            <th className={darkMode ? "text-zinc-300" : "text-zinc-600"}>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.studentComparison.map((s) => (
                            <tr
                                key={s.name}
                                className={darkMode ? "border-t border-zinc-800" : "border-t border-gray-200"}
                            >
                                <td className="p-3">{s.name}</td>
                                <td>{s.before ?? "-"}</td>
                                <td>{s.after}</td>
                                <td
                                    className={
                                        s.change > 0
                                            ? "text-green-400"
                                            : s.change < 0
                                            ? "text-red-400"
                                            : ""
                                    }
                                >
                                    {s.change ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* BACK */}
            <div className="text-center">
                <button
                    onClick={() => navigate(-1)}
                    className={`px-8 py-3 rounded-xl font-semibold backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                        darkMode
                            ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                            : "bg-black/80 text-white hover:bg-black"
                    }`}
                >
                    ← Back to Selection
                </button>
            </div>
        </div>
    </div>
);
}

/* ================= COMPONENTS ================= */

function CompareCard({ title, stats, side }) {
    const darkMode = useThemeStore((s) => s.darkMode);

    return (
        <div
            className={`p-6 rounded-3xl transition-all duration-300 ${
                darkMode
                    ? "glass-card-dark text-white"
                    : "glass-card text-black"
            }`}
        >
            <h3 className="text-xl font-medium mb-4">{title}</h3>

            <div className="space-y-2 text-sm">
                <StatRow label="Mean" value={stats.mean[side]} />
                <StatRow label="Median" value={stats.median[side]} />
                <StatRow label="Pass %" value={`${stats.passRate[side]}%`} />
            </div>
        </div>
    );
}


function StatRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}
