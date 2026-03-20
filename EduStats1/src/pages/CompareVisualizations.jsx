import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2} from "lucide-react";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";

export default function CompareVisualizations() {
    const [loading, setLoading] = useState(true);
  const user = useIsLoggedIn((s) => s.user);
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();

  const [visuals, setVisuals] = useState([]);
  const [selected, setSelected] = useState([]);
    const bgMain = darkMode ? "bg-zinc-950" : "bg-gray-50";

  useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, []);
  useEffect(() => {
    if (!user?.email) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/visuals/${user.email}`)
      .then((res) => res.json())
      .then((data) => setVisuals(data.visualizations || []));
  }, [user.email]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const handleCompare = () => {
    if (selected.length !== 2) return;

    navigate("/compare/result", {
      state: {
        vizAId: selected[0],
        vizBId: selected[1],
      },
    });
  };
   if(loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgMain}`}>
        <Loader2 className="animate-spin w-8 h-8 text-zinc-500" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-6 py-16 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-light mb-2">
            Compare Visualizations
          </h1>
          <p className="text-zinc-500">
            Select any two datasets to analyze progress and performance changes
          </p>
        </div>

        {/* VISUALIZATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visuals.map((v) => {
            const isSelected = selected.includes(v._id);

            return (
              <button
                key={v._id}
                onClick={() => toggleSelect(v._id)}
                className={`relative p-6 rounded-2xl text-left transition-all duration-300
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                      : darkMode
                      ? "border border-zinc-800 bg-zinc-900 hover:bg-zinc-900/80"
                      : "border border-gray-200 bg-white hover:shadow-md"
                  }
                `}
              >
                {isSelected && (
                  <CheckCircle className="absolute top-4 right-4 text-indigo-400" />
                )}

                <h3 className="text-xl font-medium mb-1">
                  {v.vizName}
                </h3>

                <p className="text-sm text-zinc-500 mb-4">
                  Created on {new Date(v.createdAt).toDateString()}
                </p>

                {/* QUICK STATS */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Info label="Students" value={v.studentResults.length} />
                  <Info label="Mean" value={v.stats.mean} />
                  <Info
                    label="Pass %"
                    value={`${Math.round(
                      (v.stats.passCount / v.studentResults.length) * 100
                    )}%`}
                  />
                  <Info label="Std Dev" value={v.stats.stdDeviation} />
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTION */}
        <div className="text-center">
          <button
            disabled={selected.length !== 2}
            onClick={handleCompare}
            className={`px-8 py-3 rounded-xl font-medium transition ${
              selected.length === 2
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400/30 cursor-not-allowed"
            }`}
          >
            Compare Selected
          </button>

          <p className="mt-3 text-sm text-zinc-500">
            {selected.length}/2 selected
          </p>
        </div>
      </div>
    </div>
  );
}


function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
