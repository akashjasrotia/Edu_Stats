import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { Eye, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const user = useIsLoggedIn((s) => s.user);
  const navigate = useNavigate();

  const [visuals, setVisuals] = useState([]);
  const [filteredVisuals, setFilteredVisuals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [filter, setFilter] = useState("newest");
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.email) return;

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/visuals/${user.email}`
        );
        const data = await res.json();
        setVisuals(data.visualizations || []);
        setFilteredVisuals(data.visualizations || []);
      } catch {
        toast.error("Failed to load visualizations");
      }
      setLoading(false);
    };

    load();
  }, [user?.email]);

  useEffect(() => {
    let data = [...visuals];

    if (search.trim()) {
      data = data.filter((v) =>
        v.vizName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filter === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (filter === "students-high") {
      data.sort((a, b) => b.studentResults.length - a.studentResults.length);
    }

    if (filter === "students-low") {
      data.sort((a, b) => a.studentResults.length - b.studentResults.length);
    }

    setFilteredVisuals(data);
  }, [search, filter, visuals]);

  const confirmDelete = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/deleteViz", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!res.ok) throw new Error();

      setVisuals((p) => p.filter((v) => v._id !== deleteId));
      toast.success("Visualization deleted");
    } catch {
      toast.error("Delete failed");
    }

    setShowDeleteModal(false);
    setDeleteId(null);
  };

  /* ================= EDIT ================= */
  const saveEdit = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/editViz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, vizName: editName }),
      });

      if (!res.ok) throw new Error();

      setVisuals((prev) =>
        prev.map((v) => (v._id === editId ? { ...v, vizName: editName } : v))
      );

      toast.success("Visualization renamed");
    } catch {
      toast.error("Rename failed");
    }

    setShowEditModal(false);
    setEditId(null);
    setEditName("");
  };

  return (
    <div
      className={`min-h-screen px-6 py-16 bg-transparent`}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1
          className={`text-4xl font-light mb-2 ${darkMode ? "text-white" : ""}`}
        >
          Your Saved Visualizations
        </h1>
        <p className="text-zinc-500">View, manage and explore your insights</p>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 rounded-xl px-4 py-2 w-full sm:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visualization..."
            className={darkMode ? "glass-input" : "glass-input-light"}
          />
          <Search className="w-5 absolute right-4 h-5 text-zinc-500" />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={darkMode ? "glass-input w-full sm:w-auto" : "glass-input-light w-full sm:w-auto"}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="students-high">Students: High → Low</option>
          <option value="students-low">Students: Low → High</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : filteredVisuals.length === 0 ? (
        <p className="text-center text-zinc-500">No visualizations found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredVisuals.map((viz) => (
            <div
              key={viz._id}
              className={`group relative p-8 transition overflow-hidden shadow-xl ${
                darkMode
                  ? "glass-card-dark"
                  : "glass-card"
              }`}
            >
              {/* ACTIONS */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => {
                    setEditId(viz._id);
                    setEditName(viz.vizName);
                    setShowEditModal(true);
                  }}
                  className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400"
                >
                  ✎
                </button>

                <button
                  onClick={() => {
                    setDeleteId(viz._id);
                    setShowDeleteModal(true);
                  }}
                  className="w-8 h-8 rounded-full bg-red-500/20 text-red-400"
                >
                  ✕
                </button>
              </div>

              <h2
                className={`text-xl font-medium mb-2" ${
                  darkMode ? "text-white" : ""
                }`}
              >
                {viz.vizName}
              </h2>

              <p className="text-sm text-zinc-500">
                Students: {viz.studentResults.length}
              </p>

              <p className="text-sm text-zinc-500 mt-1">
                {new Date(viz.createdAt).toDateString()}
              </p>

              <button
                onClick={() => navigate(`/saved-results/${viz._id}`)}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                    : "bg-indigo-500/10 border border-indigo-200 text-indigo-700 hover:bg-indigo-500/20 hover:border-indigo-300"
                }`}
              >
                <Eye size={18} /> View Visualization
              </button>

              <button
                onClick={() => navigate(`/edit-marks/${viz._id}`)}
                className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                    : "bg-amber-500/10 border border-amber-200 text-amber-700 hover:bg-amber-500/20 hover:border-amber-300"
                }`}
              >
                ✏️ Edit Student Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <Modal darkMode={darkMode}>
          <h2 className="text-xl font-medium mb-4">Delete Visualization?</h2>
          <p className="text-zinc-500 mb-6">This action cannot be undone.</p>
          <ModalActions
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            confirmText="Delete"
            confirmColor="red"
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal darkMode={darkMode}>
          <h2 className="text-xl font-medium mb-4">Edit Visualization Name</h2>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className={`w-full px-4 py-2 rounded-xl mb-6 ${
              darkMode ? "bg-zinc-800 text-white" : "bg-gray-100"
            }`}
          />
          <ModalActions
            onCancel={() => setShowEditModal(false)}
            onConfirm={saveEdit}
            confirmText="Save"
            confirmColor="indigo"
          />
        </Modal>
      )}
    </div>
  );
}

/* ================= MODAL HELPERS ================= */

function Modal({ children, darkMode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center">
      <div
        className={`w-[90%] max-w-md rounded-3xl p-8 border ${
          darkMode ? "glass-dark border-white/10" : "glass border-white/50"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm, confirmText, confirmColor }) {
  const colors = {
    red: "bg-red-600 hover:bg-red-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  };

  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 rounded-xl text-white ${colors[confirmColor]}`}
      >
        {confirmText}
      </button>
    </div>
  );
}
