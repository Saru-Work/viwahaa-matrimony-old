import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Search, } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../utils/api";

function Matching() {
  const [sortOption, setSortOption] = useState(() => {
    const saved = sessionStorage.getItem("matching_sortOption");
    return saved || "Newest First";
  });
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("matching_formData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing matching_formData:", e);
      }
    }
    return {
      caste: "",
      starSign: "",
      sevvayThoosam: "", // default to empty string
      eatingHabit: "",
      maritalStatus: "",
      religion: "",
      minAge: "",
      maxAge: "",
      countryOfResidence: "",
      member_id: "",
    };
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem("matching_page");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;
  const [initialLoadComplete, setInitialLoadComplete] = useState(() => {
    return sessionStorage.getItem("matching_currentPage") !== null;
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  // Track loading state for heart icon
  const [heartLoading, setHeartLoading] = useState(null);
  const resultsRef = useRef(null);

  // Image handling configuration
  const imageBaseUrls = [
    `${API}/uploads/`,
    "https://mobile.viwahaa.com/uploads/",
  ];
  const defaultImage =
    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";

  // Helper function to get proper image URL
  const getProfileImageUrl = (profile) => {
    if (!profile?.profile_img) return defaultImage;
    if (profile.profile_img.includes("http")) return profile.profile_img;
    return imageBaseUrls[0] + profile.profile_img;
  };

  // Set initial form data from user preferences
  useEffect(() => {
    if (currentUser?.user?.id && !initialLoadComplete) {
      setFormData((prev) => ({
        ...prev,
        caste:
          currentUser.user.partner_cast &&
          currentUser.user.partner_cast !== "Any" &&
          currentUser.user.partner_cast !== "any"
            ? currentUser.user.partner_cast
            : "",
        starSign:
          currentUser.user.partner_star_sign &&
          currentUser.user.partner_star_sign !== "Any" &&
          currentUser.user.partner_star_sign !== "any"
            ? currentUser.user.partner_star_sign
            : "",
        eatingHabit:
          currentUser.user.partner_eating_habit &&
          currentUser.user.partner_eating_habit !== "Any" &&
          currentUser.user.partner_eating_habit !== "any"
            ? currentUser.user.partner_eating_habit
            : "",
        maritalStatus:
          currentUser.user.partner_marital_status &&
          currentUser.user.partner_marital_status !== "Any" &&
          currentUser.user.partner_marital_status !== "any"
            ? currentUser.user.partner_marital_status
            : "",
        religion:
          currentUser.user.partner_religion &&
          currentUser.user.partner_religion !== "Any" &&
          currentUser.user.partner_religion !== "any"
            ? currentUser.user.partner_religion
            : "",
        minAge: currentUser.user.partner_minimum_age
          ? String(currentUser.user.partner_minimum_age)
          : "",
        maxAge: currentUser.user.partner_maximum_age
          ? String(currentUser.user.partner_maximum_age)
          : "",
        countryOfResidence:
          currentUser.user.partner_country_of_resident &&
          currentUser.user.partner_country_of_resident !== "Any" &&
          currentUser.user.partner_country_of_resident !== "any"
            ? currentUser.user.partner_country_of_resident
            : "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Handle view profile click based on package plan
  const handleViewProfile = (profileId) => {
    // Save pagination and filter state before navigating away
    sessionStorage.setItem("matching_currentPage", currentPage.toString());
    sessionStorage.setItem("matching_page", page.toString());
    sessionStorage.setItem("matching_sortOption", sortOption);
    sessionStorage.setItem("matching_formData", JSON.stringify(formData));

    if (currentUser?.user?.package_plan === "Basic Plan") {
      navigate("/pricing");
    } else {
      navigate(`/single-profile/${profileId}`);
    }
  };

  // Cleanup saved pagination/filter state on mount
  useEffect(() => {
    sessionStorage.removeItem("matching_currentPage");
    sessionStorage.removeItem("matching_page");
    sessionStorage.removeItem("matching_sortOption");
    sessionStorage.removeItem("matching_formData");
  }, []);

  // Fetch interested profiles for current user
  const fetchInterestedProfiles = useCallback(async () => {
    if (!currentUser?.user?.id) return;
    try {
      const res = await fetch(
        `/api/user/interested-profiles/${currentUser.user.id}`,
      );
      if (res.ok) {
        const data = await res.json();
        // Use the correct id field from backend (should be 'id')
        const ids = (data.profiles || []).map((p) => p.id);
        setFavorites(new Set(ids));
      }
    } catch {
      // Silent fail
    }
  }, [currentUser?.user?.id]);

  useEffect(() => {
    fetchInterestedProfiles();
  }, [fetchInterestedProfiles]);

  // Handle favorite (heart) click: sync with backend
  const handleFavoriteClick = async (profileId, e) => {
    e.stopPropagation();
    if (!currentUser?.user?.id) return;
    setHeartLoading(profileId);
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
      if (res.ok) {
        toast.success(data.message || "Interest updated successfully!");
        // Always refetch favorites from backend after update
        await fetchInterestedProfiles();
      } else {
        toast.error(data.message || "Failed to update interest");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setHeartLoading(null);
    }
  };

  // Fetch matching profiles
  const fetchMatchingProfiles = useCallback(
    async (signal) => {
      if (!currentUser?.user?.id) return;

      setLoading(true);
      setError(null);

      const targetGender =
        currentUser?.user?.gender === "male" ? "female" : "male";

      try {
        // Build query parameters
        const params = new URLSearchParams({
          userId: currentUser.user.id,
          gender: targetGender,
          page: page,
          limit: limit,
        });

        // Helper to add parameter only if not searching by Member ID
        const addSearchParam = (key, value) => {
          if (!formData.member_id && value && value !== "any") {
            params.append(key, value);
          }
        };

        // Add filters (only if Member ID is NOT being searched)
        addSearchParam("sevvayThoosam", formData.sevvayThoosam);

        // Add position filter (only if Member ID is NOT being searched)
        if (!formData.member_id && formData.sevvayThoosamPosition) {
          params.append(
            "sevvayThoosamPosition",
            formData.sevvayThoosamPosition,
          );
        }

        // Add member_id filter if set
        if (formData.member_id) {
          params.append("member_id", formData.member_id);
        }

        const response = await fetch(
          `/api/user/matchingusers?${params.toString()}`,
          { signal },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const receivedProfiles = Array.isArray(data) ? data : data.data || [];

        setProfiles((prev) => {
          if (page === 1) return receivedProfiles;
          const existingIds = new Set(prev.map((p) => p.id));
          const newProfiles = receivedProfiles.filter(
            (p) => !existingIds.has(p.id),
          );
          return [...prev, ...newProfiles];
        });

        setHasMore(receivedProfiles.length === limit);
        if (page === 1) setInitialLoadComplete(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch Error:", error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      currentUser?.user?.id,
      currentUser?.user?.gender,
      page,
      limit,
      formData.sevvayThoosam,
      formData.sevvayThoosamPosition,
      formData.member_id,
    ],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMatchingProfiles(controller.signal);
    return () => controller.abort();
  }, [fetchMatchingProfiles]);

  // Infinite scroll implementation
  useEffect(() => {
    if (!initialLoadComplete || loading || !hasMore) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 >=
        document.documentElement.offsetHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialLoadComplete, loading, hasMore]);

  // Filter profiles based on form data
  const filteredProfiles = useMemo(() => {
    let filtered = profiles.filter((profile) => {
      // If member_id is provided, prioritize it and ignore other filters
      if (formData.member_id) {
        return (
          profile.member_id?.toLowerCase() === formData.member_id.toLowerCase()
        );
      }

      // Sevvay Thoosam filter
      if (
        formData.sevvayThoosam &&
        formData.sevvayThoosam.toLowerCase() !== "any"
      ) {
        // Convert profile's sevvay_thoosam value to match form data
        const profileHasSevvayThoosam =
          profile.sevvay_thoosam === "yes" || profile.sevvayThoosam === "yes";

        if (formData.sevvayThoosam === "yes") {
          // User wants profiles with Sevvay Thoosam = yes
          if (!profileHasSevvayThoosam) return false;

          // If position is specified, also check the position
          if (formData.sevvayThoosamPosition) {
            const profilePosition =
              profile.sevvay_thoosam_position || profile.sevvayThoosamPosition;
            if (profilePosition !== formData.sevvayThoosamPosition)
              return false;
          }
        } else if (formData.sevvayThoosam === "no") {
          // User wants profiles without Sevvay Thoosam
          const profileHasNoSevvayThoosam =
            profile.sevvay_thoosam === "no" ||
            profile.sevvayThoosam === "no" ||
            !profileHasSevvayThoosam;
          if (!profileHasNoSevvayThoosam) return false;
        }
      }

      if (
        formData.starSign &&
        formData.starSign.toLowerCase() !== "any" &&
        profile.starSign !== formData.starSign
      )
        return false;
      if (
        formData.sevvayThoosam &&
        formData.sevvayThoosam.toLowerCase() !== "any" &&
        ((formData.sevvayThoosam === "yes" &&
          profile.sevvayThoosam !== "yes") ||
          (formData.sevvayThoosam === "no" && profile.sevvayThoosam !== "no"))
      )
        return false;
      if (
        formData.religion &&
        formData.religion.toLowerCase() !== "any" &&
        profile.religion !== formData.religion
      )
        return false;
      if (
        formData.caste &&
        formData.caste.toLowerCase() !== "any" &&
        profile.caste !== formData.caste
      )
        return false;
      if (
        formData.eatingHabit &&
        formData.eatingHabit.toLowerCase() !== "any" &&
        profile.eatingHabit !== formData.eatingHabit
      )
        return false;
      if (
        formData.maritalStatus &&
        formData.maritalStatus.toLowerCase() !== "any" &&
        profile.maritalStatus !== formData.maritalStatus
      )
        return false;
      if (formData.minAge && profile.age < parseInt(formData.minAge))
        return false;
      if (formData.maxAge && profile.age > parseInt(formData.maxAge))
        return false;
      if (
        formData.countryOfResidence &&
        !profile.countryOfResidence
          ?.toLowerCase()
          .includes(formData.countryOfResidence.toLowerCase())
      )
        return false;
      return true;
    });

    // Sorting logic
    let sorted = [...filtered];
    // Sorting and favorites logic
    if (sortOption === "Favorites") {
      sorted = sorted.filter((profile) => favorites.has(profile.id));
    } else if (sortOption === "Newest First") {
      sorted.sort((a, b) =>
        b.created_at && a.created_at
          ? new Date(b.created_at) - new Date(a.created_at)
          : 0,
      );
    } else if (sortOption === "Oldest First") {
      sorted.sort((a, b) =>
        a.created_at && b.created_at
          ? new Date(a.created_at) - new Date(b.created_at)
          : 0,
      );
    } else if (sortOption === "Age: Low to High") {
      sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else if (sortOption === "Age: High to Low") {
      sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    } else if (sortOption === "Recently Active") {
      sorted.sort((a, b) =>
        b.last_active && a.last_active
          ? new Date(b.last_active) - new Date(a.last_active)
          : 0,
      );
    }
    return sorted;
  }, [profiles, formData, sortOption, favorites]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setCurrentPage(1);
    setInitialLoadComplete(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetFilters = () => {
    setFormData({
      caste: "",
      starSign: "",
      eatingHabit: "",
      maritalStatus: "",
      religion: "",
      minAge: "",
      maxAge: "",
      countryOfResidence: "",
      member_id: "",
      sevvayThoosam: "any",
    });
    setPage(1);
    setCurrentPage(1);
    setInitialLoadComplete(false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const shouldShowProfileImage = () => {
    return currentUser?.user?.package_plan === "Ultimate Plan";
  };

  const isBasicPlan = currentUser?.user?.package_plan === "Basic Plan";

  // Get active filters for display
  const activeFilters = useMemo(() => {
    const filters = [];
    if (formData.minAge || formData.maxAge) {
      const min = formData.minAge || "18";
      const max = formData.maxAge || "100";
      filters.push(`Age: ${min}–${max}`);
    }
    if (formData.eatingHabit && formData.eatingHabit !== "any") {
      filters.push(formData.eatingHabit);
    }
    if (formData.countryOfResidence) {
      filters.push(formData.countryOfResidence);
    }
    if (formData.starSign && formData.starSign !== "any") {
      filters.push(formData.starSign);
    }
    if (formData.religion && formData.religion !== "any") {
      filters.push(formData.religion);
    }
    if (formData.caste && formData.caste !== "any") {
      filters.push(formData.caste);
    }
    if (formData.maritalStatus && formData.maritalStatus !== "any") {
      filters.push(formData.maritalStatus);
    }
    if (formData.member_id) {
      filters.push(`ID: ${formData.member_id}`);
    }
    if (formData.sevvayThoosam && formData.sevvayThoosam !== "any") {
      let filterText = `Sevvay Thoosam: ${
        formData.sevvayThoosam === "yes" ? "Yes" : "No"
      }`;
      if (formData.sevvayThoosam === "yes" && formData.sevvayThoosamPosition) {
        filterText += ` (Position: ${formData.sevvayThoosamPosition})`;
      }
      filters.push(filterText);
    }
    return filters;
  }, [formData]);

  // Remove individual filter
  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith("Age:")) {
      setFormData((prev) => ({ ...prev, minAge: "", maxAge: "" }));
    } else if (filterToRemove.startsWith("ID:")) {
      setFormData((prev) => ({ ...prev, member_id: "" }));
    } else if (filterToRemove.startsWith("Sevvay Thoosam:")) {
      // Handle Sevvay Thoosam filter removal
      if (filterToRemove.includes("Yes")) {
        setFormData((prev) => ({
          ...prev,
          sevvayThoosam: "",
          sevvayThoosamPosition: "",
        }));
      } else if (filterToRemove.includes("No")) {
        setFormData((prev) => ({ ...prev, sevvayThoosam: "" }));
      }
    } else {
      // Find which field this filter corresponds to by checking formData values
      let fieldCleared = false;
      const keysToCheck = [
        "eatingHabit",
        "maritalStatus",
        "religion",
        "starSign",
        "caste",
        "countryOfResidence",
      ];

      for (const key of keysToCheck) {
        if (formData[key] === filterToRemove) {
          setFormData((prev) => ({ ...prev, [key]: "" }));
          fieldCleared = true;
          break;
        }
      }

      // If we didn't find an exact match (e.g. casing differences), try fallback fieldMap strategy
      if (!fieldCleared) {
        const lowerFilter = filterToRemove.toLowerCase();
        for (const key of keysToCheck) {
          if (formData[key] && formData[key].toLowerCase() === lowerFilter) {
            setFormData((prev) => ({ ...prev, [key]: "" }));
            fieldCleared = true;
            break;
          }
        }
      }
    }
  };

  // Skeleton loader for profiles
  const ProfileSkeleton = () => (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse flex flex-col items-center justify-between"
      style={{ width: "280px", height: "380px" }}
    >
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-1/2 h-3 bg-gray-200 rounded mb-4"></div>
      <div className="w-full space-y-2">
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-10 bg-gray-200 rounded-lg mt-4"></div>
    </div>
  );

  // Pagination state for cards per page
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("matching_currentPage");
    return saved ? parseInt(saved, 10) : 1;
  });
  const cardsPerPage = 9;
  const totalPages = Math.ceil(filteredProfiles.length / cardsPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  // Scroll to top when current page changes
  useEffect(() => {
    // We only want to scroll if it's not the initial mount or if user manually changed page
    if (initialLoadComplete) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);


  return (
    <div
      className="min-h-screen bg-[#FCF8F3]"
      style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div ref={resultsRef} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8D1C21] mb-3 ">
            Find Your Perfect Match
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover compatible profiles that match your preferences and start
            your journey towards a meaningful relationship
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-6  top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary ">
                  Refine Search
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-primary text-white rounded-lg px-3 py-2 hover:bg-primary/90 transition-colors"
                >
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className={`space-y-6 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Member ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Member ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                      type="text"
                      name="member_id"
                      value={formData.member_id}
                      onChange={handleInputChange}
                      placeholder="Enter Member ID"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center shadow-lg hover:shadow-primary/20"
                      title="Search Member ID"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </div>

                {/* Astrological Details */}
                <div className="bg-gradient-to-r from-[#fff5f5] to-[#ffeaea] p-4 rounded-xl border border-[#ffd6d6]">
                  <h3 className="text-lg font-bold text-[#8D1C21] mb-4 ">
                    Astrological Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Star Sign
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="starSign"
                        value={formData.starSign}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Star Sign</option>
                        <option value="any">Any Star Sign</option>
                        <option value="அச்வினி (Aswini)">
                          அச்வினி (Aswini)
                        </option>
                        <option value="பரணி (Bharani)">பரணி (Bharani)</option>
                        <option value="கார்த்திகை (Karthigai)">
                          கார்த்திகை (Karthigai)
                        </option>
                        <option value="ரோகிணி (Rohini)">ரோகிணி (Rohini)</option>
                        <option value="மிருகசீரிடம் (Mrigasiridam)">
                          மிருகசீரிடம் (Mrigasiridam)
                        </option>
                        <option value="திருவாதிரை (Thiruvathirai)">
                          திருவாதிரை (Thiruvathirai)
                        </option>
                        <option value="புனர்பூசம் (Punarpoosam)">
                          புனர்பூசம் (Punarpoosam)
                        </option>
                        <option value="பூசம் (Poosam)">பூசம் (Poosam)</option>
                        <option value="ஆயில்யம் (Ayilyam)">
                          ஆயில்யம் (Ayilyam)
                        </option>
                        <option value="மகம் (Magam)">மகம் (Magam)</option>
                        <option value="பூரம் (Pooram)">பூரம் (Pooram)</option>
                        <option value="உத்திரம் (Uthiram)">
                          உத்திரம் (Uthiram)
                        </option>
                        <option value="ஹஸ்தம் (Hastham)">
                          ஹஸ்தம் (Hastham)
                        </option>
                        <option value="சித்திரை (Chithirai)">
                          சித்திரை (Chithirai)
                        </option>
                        <option value="சுவாதி (Swathi)">சுவாதி (Swathi)</option>
                        <option value="விசாகம் (Visakam)">
                          விசாகம் (Visakam)
                        </option>
                        <option value="அனுஷம் (Anusham)">
                          அனுஷம் (Anusham)
                        </option>
                        <option value="கேட்டை (Kettai)">கேட்டை (Kettai)</option>
                        <option value="மூலம் (Moolam)">மூலம் (Moolam)</option>
                        <option value="பூராடம் (Pooradam)">
                          பூராடம் (Pooradam)
                        </option>
                        <option value="உத்திராடம் (Uthiradam)">
                          உத்திராடம் (Uthiradam)
                        </option>
                        <option value="திரைகடகம் (Thiruvonam)">
                          திரைகடகம் (Thiruvonam)
                        </option>
                        <option value="அவிட்டம் (Avittam)">
                          அவிட்டம் (Avittam)
                        </option>
                        <option value="சதயம் (Sathayam)">
                          சதயம் (Sathayam)
                        </option>
                        <option value="பூரட்டாதி (Purattadhi)">
                          பூரட்டாதி (Purattadhi)
                        </option>
                        <option value="உத்திரட்டாதி (Uthiraadhi)">
                          உத்திரட்டாதி (Uthiraadhi)
                        </option>
                        <option value="ரேவதி (Revadhi)">ரேவதி (Revadhi)</option>
                      </select>
                    </div>
                    {/* Sevvay Thoosam Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sevvay Thoosam (செவ்வாய் தோசம்)
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="sevvayThoosam"
                        value={formData.sevvayThoosam}
                        onChange={handleInputChange}
                      >
                        <option value="any">Any</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    {/* Show Position field if Sevvay Thoosam is Yes */}
                    {formData.sevvayThoosam === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                          name="sevvayThoosamPosition"
                          value={formData.sevvayThoosamPosition || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Position</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="4">4</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="12">12</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Details */}
                <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] p-4 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-[#8D1C21] mb-4 ">
                    Basic Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Min Age
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                          type="number"
                          name="minAge"
                          value={formData.minAge}
                          onChange={handleInputChange}
                          placeholder="25"
                          min="18"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Age
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                          type="number"
                          name="maxAge"
                          value={formData.maxAge}
                          onChange={handleInputChange}
                          placeholder="32"
                          min="18"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Religion
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="religion"
                        value={formData.religion}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Religion</option>
                        <option value="any">Any Religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="christian">Christian</option>
                        <option value="muslim">Muslim</option>
                        <option value="buddhist">Buddhist</option>
                        <option value="sikh">Sikh</option>
                        <option value="jewish">Jewish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Caste
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="caste"
                        value={formData.caste}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Caste</option>
                        <option value="any">Any Caste</option>
                        <option value="Mixed Jaffna Vellalar">
                          Mixed Jaffna Vellalar
                        </option>
                        <option value="Vellalar">Vellalar</option>
                        <option value="Other Vellatar">Other Vellatar</option>
                        <option value="Viswakulam">Viswakulam</option>
                        <option value="Mukkulanthor">Mukkulanthor</option>
                        <option value="Koviyor">Koviyor</option>
                        <option value="Kurukulam">Kurukulam</option>
                        <option value="Bhramin">Bhramin</option>
                        <option value="Kounder">Kounder</option>
                        <option value="Veera Saiva Vellalar">
                          Veera Saiva Vellalar
                        </option>
                        <option value="Kujavar">Kujavar</option>
                        <option value="Chettiar">Chettiar</option>
                        <option value="Devar">Devar</option>
                        <option value="Kaller">Kaller</option>
                        <option value="Malayalee">Malayalee</option>
                        <option value="Mukkuwar">Mukkuwar</option>
                        <option value="Muthaliyar">Muthaliyar</option>
                        <option value="Naiyudu">Naiyudu</option>
                        <option value="Nadar">Nadar</option>
                        <option value="Pallar">Pallar</option>
                        <option value="Parawar">Parawar</option>
                        <option value="Senkunthar">Senkunthar</option>
                        <option value="Siviyar">Siviyar</option>
                        <option value="Dadar">Dadar</option>
                        <option value="Sayakkarar">Sayakkarar</option>
                        <option value="Nalavar">Nalavar</option>
                        <option value="Agamiliyar">Agamiliyar</option>
                        <option value="Dobi">Dobi</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Marital Status
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Marital Status</option>
                        <option value="any">Any Marital Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="separated">Separated</option>
                        <option value="widowed">Widowed</option>
                        <option value="Never Married">Never Married</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lifestyle & Location */}
                <div className="bg-gradient-to-r from-[#fff5f5] to-[#ffeaea] p-4 rounded-xl border border-[#ffd6d6]">
                  <h3 className="text-lg font-bold text-[#8D1C21] mb-4 ">
                    Lifestyle & Location
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Eating Habit
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        name="eatingHabit"
                        value={formData.eatingHabit}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Eating Habit</option>
                        <option value="any">Any Eating Habit</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="nonVegetarian">Non-Vegetarian</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="flexitarian">Flexitarian</option>
                        <option value="rawFood">Raw Food</option>
                        <option value="glutenFree">Gluten-Free</option>
                        <option value="lactoseFree">Lactose-Free</option>
                        <option value="organic">Organic</option>
                        <option value="halal">Halal</option>
                        <option value="kosher">Kosher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country of Residence
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8D1C21] focus:border-[#8D1C21] transition-all"
                        type="text"
                        name="countryOfResidence"
                        value={formData.countryOfResidence}
                        onChange={handleInputChange}
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8D1C21] to-[#a00000] text-white py-4 px-6 rounded-xl hover:from-[#a00000] hover:to-[#8D1C21] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 4h18v2l-6 7v5l-6 3v-8L3 6V4zm5.38 4l3.62 4.23L15.62 8H8.38z" />
                    </svg>
                    Apply Filters
                  </button>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-4 px-6 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Profiles Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div  className="bg-gradient-to-r from-[#8D1C21] to-[#a00000] rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 ">
                    {filteredProfiles.length} Matching Profiles Found
                  </h2>

                  {/* Active Filters */}
                  {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeFilters.map((filter, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white text-[#8D1C21] shadow-md"
                        >
                          {filter}
                          <button
                            onClick={() => removeFilter(filter)}
                            className="ml-2 text-[#8D1C21] hover:text-[#a00000] font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort by dropdown - hide Favorites for Basic Plan */}
                <div className="flex items-center space-x-4 bg-white rounded-xl px-4 py-2 shadow-md">
                  <span className="text-gray-60 whitespace-nowrap text-sm font-semibold">
                    Sort by:
                  </span>
                  <select
                    className="border-0 bg-transparent text-gray-800 font-semibold focus:ring-0 focus:outline-none"
                    onChange={(e) => setSortOption(e.target.value)}
                    value={sortOption}
                  >
                    <option value="Newest First">Newest First</option>
                    <option value="Oldest First">Oldest First</option>
                    {!isBasicPlan && (
                      <option value="Favorites">Favorites</option>
                    )}
                    <option value="Age: Low to High">Age: Low to High</option>
                    <option value="Age: High to Low">Age: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-lg">
                <p className="text-red-700 font-semibold text-center">
                  ⚠️ Error loading profiles: {error}
                </p>
              </div>
            )}

            {/* Profiles Grid */}
            {!initialLoadComplete && loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {[...Array(6)].map((_, i) => (
                  <ProfileSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {filteredProfiles.length === 0 && !loading ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg">
                      <div className="text-6xl mb-4">🔍</div>
                      <div className="text-2xl font-bold text-gray-700 mb-2">
                        No matching profiles found
                      </div>
                      <p className="text-gray-500 text-lg">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  ) : (
                    paginatedProfiles.map((profile) => (
                      <div
                        key={profile.id || profile._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-xs mx-auto"
                        style={{ minHeight: isBasicPlan ? "280px" : "340px" }}
                      >
                        {/* Profile Image and Basic Info */}
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8D1C21] shadow-lg">
                              {shouldShowProfileImage() ? (
                                <img
                                  src={getProfileImageUrl(profile)}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                  onError={(e) => {
                                    if (
                                      !profile.profile_img?.includes("http") &&
                                      !e.target.src.includes(imageBaseUrls[1])
                                    ) {
                                      e.target.src =
                                        imageBaseUrls[1] +
                                        (profile.profile_img || "");
                                    } else {
                                      e.target.src = defaultImage;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs text-center font-semibold px-2">
                                    Upgrade to Ultimate Plan to view photos
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                              {profile.age}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-1 ">
                            {currentUser?.user?.package_plan &&
                            currentUser.user.package_plan !== "Basic Plan"
                              ? profile.name ||
                                `${profile.first_name || ""} ${
                                  profile.last_name || ""
                                }`.trim() ||
                                "Name not available"
                              : profile.member_id}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 font-medium">
                            Member ID:{" "}
                            <span className="text-primary font-bold">
                              {profile.member_id}
                            </span>
                          </p>
                        </div>

                        {/* Profile Details */}
                        <div className="w-full space-y-2 mb-4">
                          {!isBasicPlan && (
                            <>
                              {profile.starSign && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Star:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {profile.starSign}
                                  </span>
                                </div>
                              )}
                              {profile.religion && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Religion:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {profile.religion}
                                  </span>
                                </div>
                              )}
                              {profile.caste && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Caste:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {profile.caste}
                                  </span>
                                </div>
                              )}
                              {profile.countryOfResidence && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Location:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {profile.countryOfResidence}
                                  </span>
                                </div>
                              )}
                              {(profile.occupation ||
                                profile.occupation_details) && (
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Occupation:
                                  </span>
                                  <span className="text-gray-800 font-medium">
                                    {(
                                      profile.occupation ||
                                      profile.occupation_details
                                    )?.length > 28
                                      ? `${(
                                          profile.occupation ||
                                          profile.occupation_details
                                        ).slice(0, 25)}...`
                                      : profile.occupation ||
                                        profile.occupation_details}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="w-full flex gap-3 mt-auto">
                          <button
                            onClick={() => handleViewProfile(profile.id)}
                            className="flex-1 bg-gradient-to-r from-[#8D1C21] to-[#a00000] text-white py-3 px-4 rounded-xl hover:from-[#a00000] hover:to-[#8D1C21] transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Profile
                          </button>
                          {/* Hide heart icon for Basic Plan */}
                          {!isBasicPlan && (
                            <button
                              onClick={(e) =>
                                handleFavoriteClick(profile.id, e)
                              }
                              className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#8D1C21] group relative"
                              title={
                                favorites.has(profile.id)
                                  ? "Remove from Interested List"
                                  : "Add to Interested List"
                              }
                              disabled={heartLoading === profile.id}
                            >
                              {heartLoading === profile.id ? (
                                <svg
                                  className="animate-spin w-6 h-6 text-[#8D1C21]"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                  />
                                </svg>
                              ) : favorites.has(profile.id) ? (
                                <svg
                                  className="w-6 h-6 text-[#8D1C21] fill-current transition-transform group-hover:scale-110"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-6 h-6 text-[#8D1C21] group-hover:text-[#a00000] transition-all duration-300 group-hover:scale-110"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      className={`px-4 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Loading More */}
                {loading && initialLoadComplete && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 justify-center">
                    {[...Array(3)].map((_, i) => (
                      <ProfileSkeleton key={`loading-${i}`} />
                    ))}
                  </div>
                )}

                {/* No More Results */}
                {/* {!hasMore && initialLoadComplete && filteredProfiles.length > 0 && (
                  <div className="text-center mt-12 py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 ">You've reached the end!</h3>
                    <p className="text-gray-600 text-lg">No more profiles to load</p>
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Matching;
