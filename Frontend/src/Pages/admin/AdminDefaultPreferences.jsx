import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Save, RefreshCw, Settings } from "lucide-react";
import { API } from "../../utils/api";

const AdminDefaultPreferences = () => {
  const [preferences, setPreferences] = useState({
    min_age: 18,
    max_age: 50,
    religion: "Any",
    cast: "Any",
    gender: "female",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/admin/default-preferences`);
      const data = await res.json();
      if (data.success) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch(`${API}/api/admin/default-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Default preferences updated successfully");
      } else {
        toast.error(data.error || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-primary/5">
        <div className="p-6 bg-primary/5 border-b border-primary/10">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Default Partner Preferences
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Setting default preferences for non-registered users searching for profiles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Preferred Gender
              </label>
              <select
                name="gender"
                value={preferences.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Min Age
                </label>
                <input
                  type="number"
                  name="min_age"
                  value={preferences.min_age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  min="18"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Max Age
                </label>
                <input
                  type="number"
                  name="max_age"
                  value={preferences.max_age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  min="18"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Preferred Religion
              </label>
              <select
                name="religion"
                value={preferences.religion}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="Any">Any</option>
                <option value="Hindu">Hindu</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
                <option value="Buddhist">Buddhist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Preferred Caste
              </label>
              <input
                type="text"
                name="cast"
                value={preferences.cast}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Vellalar or Any"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDefaultPreferences;
