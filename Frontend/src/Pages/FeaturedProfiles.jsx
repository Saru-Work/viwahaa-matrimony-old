import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Filter,
  X,
  Search,
  MapPin,
  Briefcase,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../utils/api";

export default function FeaturedProfiles() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  const [filters, setFilters] = useState({
    gender: "Any",
    minAge: "",
    maxAge: "",
    religion: "Any",
    country: "Any"
  });

  const religions = ["Any", "Hindu", "Muslim", "Christian", "Buddhist", "Other"];
  const countries = ["Any", "Sri Lanka", "India", "USA", "UK", "Canada", "Australia", "Singapore", "Malaysia", "UAE"];

  const fetchProfiles = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.limit
      });

      if (currentFilters.gender !== "Any") queryParams.append("gender", currentFilters.gender.toLowerCase());
      if (currentFilters.minAge) queryParams.append("minAge", currentFilters.minAge);
      if (currentFilters.maxAge) queryParams.append("maxAge", currentFilters.maxAge);
      if (currentFilters.religion !== "Any") queryParams.append("religion", currentFilters.religion);
      if (currentFilters.country !== "Any") queryParams.append("country", currentFilters.country);

      const res = await fetch(`${API}/api/user/all-featured?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProfiles(data.profiles);
        setPagination(data.pagination);
      } else {
        toast.error("Failed to load profiles");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("An error occurred while fetching profiles");
    } finally {
      setTimeout(() => setLoading(false), 500); // Slight delay for smoother transition
    }
  };

  useEffect(() => {
    fetchProfiles(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProfiles(1, filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      gender: "Any",
      minAge: "",
      maxAge: "",
      religion: "Any",
      country: "Any"
    };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProfiles(1, clearedFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProfiles(newPage, filters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleInterest = async (profileId) => {
    if (!currentUser) {
      toast.info("Please sign in to express interest");
      navigate("/sign-in");
      return;
    }

    try {
      const res = await fetch(`${API}/api/user/interested-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.user.id,
          profile_id: profileId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Interest error:", error);
      toast.error("Failed to process interest");
    }
  };

  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      
      {/* Premium Hero Header (Clean Figma Style) */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-20 px-4">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-4">
            Find Your <span className="text-accent underline decoration-white/20 underline-offset-[12px]">Perfect Match</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">
            Explore thousands of verified profiles tailored to your tradition and lifestyle.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Horizontal Filter Bar (Figma Style) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-12 overflow-x-auto pb-4 custom-scrollbar-hide">
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
              {religions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 shrink-0">
            <MapPin size={14} className="text-primary" />
            <select name="country" value={filters.country} onChange={handleFilterChange} className="bg-transparent border-none p-0 pr-8 text-xs font-bold focus:ring-0 cursor-pointer">
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button 
            onClick={applyFilters}
            className="px-6 py-2.5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all shrink-0"
          >
            Filter
          </button>

          <button 
            onClick={clearFilters}
            className="px-4 py-2.5 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors shrink-0"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-[520px] animate-pulse shadow-sm border border-slate-100 dark:border-slate-800"></div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-black mb-3">No matching profiles</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Try broadening your search criteria or reset the filters to see more members.</p>
            <button onClick={clearFilters} className="h-14 px-10 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {profiles.map((profile, idx) => (
                <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 4) * 0.1 }}
                  className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={`/uploads/${profile.default_image}`}
                      alt={profile.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Member"; }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-5 left-5">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <CheckCircle size={14} className="text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-white">Verified Profile</span>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-8 pt-0">
                      <h4 className="text-3xl font-black text-white leading-tight mb-1">
                        {profile.name}, <span className="text-accent">{profile.age}</span>
                      </h4>
                      <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {profile.gender} Member
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-4 flex-grow">
                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors">
                          <Users size={16} />
                        </div>
                        <span className="text-sm">{profile.religion}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors">
                          <Briefcase size={16} />
                        </div>
                        <span className="text-sm truncate">{profile.occupation || "Independent"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold group/info">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/info:text-primary transition-colors">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm">{profile.country_of_resident}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                      <Link to="/pricing" className="flex-1">
                        <button className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                          Profile
                        </button>
                      </Link>
                      {currentUser?.user?.package_plan !== "Basic Plan" && (
                        <button 
                          onClick={() => handleInterest(profile.id)}
                          className="flex-[1.5] h-12 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
                        >
                          Express Interest
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex px-2">
                    {getPageNumbers().map((num, i) => (
                      num === "..." ? (
                        <span key={`dots-${i}`} className="w-12 h-12 flex items-center justify-center text-slate-300">...</span>
                      ) : (
                        <button
                          key={`page-${num}`}
                          onClick={() => handlePageChange(num)}
                          className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${
                            pagination.page === num 
                              ? "bg-primary text-white shadow-lg shadow-primary/30" 
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    ))}
                  </div>

                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
