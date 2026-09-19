import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  Search,
  MapPin,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import { API } from "../utils/api";

const RELIGIONS = ["Any", "Hindu", "Muslim", "Christian", "Buddhist", "Sikh", "Jain", "Other"];
const COUNTRIES = ["Any", "Sri Lanka", "India", "USA", "UK", "Canada", "Australia", "Singapore", "Malaysia", "UAE"];

const getProfileImage = (profile) => {
  if (profile.default_image) return `/uploads/${profile.default_image}`;
  const seed = profile.gender === "female" ? "F" : "M";
  return `https://ui-avatars.com/api/?name=${seed}&background=f0e6ff&color=7c3aed&size=512&bold=true`;
};

export default function GuestSearch() {
  const [profiles, setProfiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    gender: "Any",
    minAge: "",
    maxAge: "",
    religion: "Any",
    country: "Any",
    cast: "",
  });

  const fetchProfiles = useCallback(async (currentFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.gender !== "Any") params.append("gender", currentFilters.gender.toLowerCase());
      if (currentFilters.minAge) params.append("minAge", currentFilters.minAge);
      if (currentFilters.maxAge) params.append("maxAge", currentFilters.maxAge);
      if (currentFilters.religion !== "Any") params.append("religion", currentFilters.religion);
      if (currentFilters.country !== "Any") params.append("country", currentFilters.country);
      if (currentFilters.cast) params.append("cast", currentFilters.cast);

      const res = await fetch(`${API}/api/user/guest-search-profiles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error("Failed to fetch guest profiles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles(filters);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchProfiles(filters);

  const clearFilters = () => {
    const reset = { gender: "Any", minAge: "", maxAge: "", religion: "Any", country: "Any", cast: "" };
    setFilters(reset);
    fetchProfiles(reset);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">

    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Pill Filter Bar */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-12 overflow-x-auto pb-4">

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
            <Users size={14} className="text-primary" />
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="bg-transparent border-none p-0 pr-8 text-xs font-bold focus:ring-0 cursor-pointer">
              <option value="Any">All Members</option>
              <option value="Female">Brides</option>
              <option value="Male">Grooms</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0 h-[38px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Age:</span>
            <input type="number" name="minAge" value={filters.minAge} onChange={handleFilterChange} placeholder="Min" className="w-10 bg-transparent border-none p-0 text-xs font-bold focus:ring-0" min="18" />
            <div className="w-2 h-[1px] bg-slate-200"></div>
            <input type="number" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} placeholder="Max" className="w-10 bg-transparent border-none p-0 text-xs font-bold focus:ring-0" max="70" />
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Religion:</span>
            <select name="religion" value={filters.religion} onChange={handleFilterChange} className="bg-transparent border-none p-0 pr-8 text-xs font-bold focus:ring-0 cursor-pointer">
              {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
            <MapPin size={14} className="text-primary" />
            <select name="country" value={filters.country} onChange={handleFilterChange} className="bg-transparent border-none p-0 pr-8 text-xs font-bold focus:ring-0 cursor-pointer">
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
            <Filter size={14} className="text-primary" />
            <input type="text" name="cast" value={filters.cast} onChange={handleFilterChange} placeholder="Caste" className="bg-transparent border-none p-0 text-xs font-bold focus:ring-0 w-20 placeholder-slate-400" />
          </div>

          <button onClick={applyFilters} className="px-6 py-2.5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all shrink-0">
            Search
          </button>
          <button onClick={clearFilters} className="px-4 py-2.5 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors shrink-0">
            Reset
          </button>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-sm font-semibold text-slate-500 mb-6">
            Showing {profiles.length} of {totalCount} profiles
          </p>
        )}

        {/* Profile Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[520px] animate-pulse shadow-sm border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black mb-3">No matching profiles</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Try broadening your search criteria or reset the filters.</p>
            <button onClick={clearFilters} className="h-14 px-10 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getProfileImage(profile)}
                      alt="Member"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${profile.gender === "female" ? "F" : "M"}&background=f0e6ff&color=7c3aed&size=512&bold=true`;
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                    {/* Member ID badge */}
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">
                          {profile.member_id || `#${profile.id}`}
                        </span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        profile.gender === "female" ? "bg-pink-500/80 text-white" : "bg-blue-500/80 text-white"
                      }`}>
                        {profile.gender === "female" ? "Bride" : "Groom"}
                      </div>
                    </div>

                    {/* Age overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 p-6 pt-0">
                      <div className="text-white font-black text-2xl leading-tight">
                        Age <span className="text-accent">{profile.age || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {profile.gender} Member
                      </div>
                    </div>
                  </div>

                  {/* Card body - basic details only */}
                  <div className="p-6 space-y-3 flex-grow">
                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors shrink-0">
                          <Users size={16} />
                        </div>
                        <span className="text-sm truncate">
                          {profile.religion || "-"}
                          {profile.cast ? ` / ${profile.cast}` : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors shrink-0">
                          <Briefcase size={16} />
                        </div>
                        <span className="text-sm truncate">{profile.occupation || "-"}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors shrink-0">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm truncate">
                          {profile.city_of_resident
                            ? `${profile.city_of_resident}, ${profile.country_of_resident || ""}`
                            : profile.country_of_resident || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                      <Link to="/sign-up" className="flex-1">
                        <button className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                          Full Profile
                        </button>
                      </Link>
                      <Link to="/sign-up" className="flex-[1.5]">
                        <button className="w-full h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2">
                          Register Free
                          <ArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* More profiles CTA */}
            {totalCount > profiles.length && (
              <div className="mt-16 text-center">
                <div className="inline-block bg-primary/5 px-8 py-10 rounded-[40px] border border-primary/10 shadow-sm max-w-md w-full">
                  <div className="h-14 w-14 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    +{totalCount - profiles.length} More Profiles
                  </h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                    Register free to browse all {totalCount} profiles and connect directly.
                  </p>
                  <Link to="/sign-up" className="group inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-base hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Register For Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
