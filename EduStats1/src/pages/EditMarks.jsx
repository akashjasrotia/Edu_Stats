import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/ThemeStore";
import { Loader2, User, FileText, Hash, BarChart3, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function EditMarks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const darkMode = useThemeStore((s) => s.darkMode);

  const [students, setStudents] = useState([]);
  const [vizName, setVizName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/saved-results/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.visualization) {
          setStudents(data.visualization.studentResults || []);
          setVizName(data.visualization.vizName || "");
        } else {
          throw new Error("Data not found");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load data");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };

  const saveChanges = async () => {
    // Basic frontend validation
    if (students.some((s) => !s.name || !s.subject || s.marks === "" || s.totalMarks === "")) {
      return toast.error("Please fill all required fields");
    }

    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/edit-marks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      });

      if (!res.ok) throw new Error();
      toast.success("Student details updated successfully");
      navigate(`/saved-results/${id}`);
    } catch {
      toast.error("Failed to save changes");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
      </div>
    );

  const inputClass = `
    w-full px-4 py-3 rounded-xl outline-none transition
    ${
      darkMode
        ? "glass-input text-white focus:border-indigo-500"
        : "glass-input-light focus:border-indigo-500"
    }
  `;

  return (
    <div className={`min-h-screen px-6 py-16 bg-transparent`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className={`text-4xl font-light mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              Edit Student Details
            </h1>
            <p className={darkMode ? 'text-zinc-400' : 'text-zinc-500'}>
              Modifying data for <span className="font-medium text-indigo-400">{vizName}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                darkMode
                  ? "bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                  : "bg-gray-200/50 hover:bg-gray-300/50 text-black"
              }`}
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition ${
                darkMode
                  ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {students.map((s, i) => (
            <div
              key={s._id || i}
              className={`relative p-8 rounded-3xl transition-all duration-300 ${
                darkMode ? "glass-card-dark" : "glass-card"
              }`}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 rotate-[-5deg]">
                #{i + 1}
              </div>

              <div className="mt-4 space-y-5">
                {/* NAME & SUBJECT */}
                {[
                  { label: "Full Name", icon: User, field: "name", type: "text" },
                  { label: "Subject", icon: FileText, field: "subject", type: "text" },
                ].map(({ label, icon: Icon, field, type }) => (
                  <div key={field}>
                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-zinc-300':'text-zinc-600'}`}>
                      {label}
                    </label>
                    <div className="relative">
                      <Icon className={`absolute left-4 top-3.5 w-5 h-5 ${darkMode ? 'text-indigo-400':'text-indigo-500'}`} />
                      <input
                        type={type}
                        className={`${inputClass} pl-12 font-medium`}
                        value={s[field]}
                        onChange={(e) => handleChange(i, field, e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                {/* MARKS GRID */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Marks Achieved", icon: Hash, field: "marks" },
                    { label: "Total Marks", icon: BarChart3, field: "totalMarks" },
                  ].map(({ label, icon: Icon, field }) => (
                    <div key={field}>
                      <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-zinc-300':'text-zinc-600'}`}>
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className={`absolute left-3 top-3.5 w-4 h-4 ${darkMode ? 'text-emerald-400':'text-emerald-500'}`} />
                        <input
                          type="number"
                          className={`${inputClass} pl-9 font-mono text-center`}
                          value={s[field]}
                          onChange={(e) => handleChange(i, field, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* REMARKS */}
                <div>
                  <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-zinc-300':'text-zinc-600'}`}>
                    Remarks (Optional)
                  </label>
                  <textarea
                    rows="2"
                    className={`${inputClass} resize-none`}
                    value={s.remarks || ""}
                    onChange={(e) => handleChange(i, "remarks", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
