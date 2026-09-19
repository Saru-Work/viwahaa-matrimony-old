import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";

const InterestedProfilesPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [sortOption, setSortOption] = useState("Newest First");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [heartLoading, setHeartLoading] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const cardsPerPage = 9;

  // Image handling configuration - same as Matching page
  const imageBaseUrls = [
    `${API}/uploads/`,
    "https://mobile.viwahaa.com/uploads/",
  ];
  const defaultImage =
    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";

  // Helper function to get proper image URL - same as Matching page
  const getProfileImageUrl = (profile) => {
    if (!profile?.profile_img) return defaultImage;
    if (profile.profile_img.includes("http")) return profile.profile_img;
    return imageBaseUrls[0] + profile.profile_img;
  };

  // Handle view profile click based on package plan - same as Matching page
  const handleViewProfile = (profileId) => {
    if (currentUser?.user?.package_plan === "Basic Plan") {
      navigate("/pricing");
    } else {
      navigate(`/single-profile/${profileId}`);
    }
  };

  // Fetch interested profiles
  const fetchInterestedProfiles = useCallback(async () => {
    if (!currentUser?.user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/user/interested-profiles/${currentUser.user.id}`
      );
      if (!res.ok) throw new Error("Failed to fetch interested profiles");
      const data = await res.json();
      // Map backend fields to frontend expected names
      const mappedProfiles = (data.profiles || []).map((p) => ({
        ...p,
        starSign: p.star_sign,
        caste: p.cast,
        countryOfResidence: p.country_of_resident,
        occupation: p.occupation,
        occupation_details: p.occupation_details,
        religion: p.religion,
        age: p.age,
        member_id: p.member_id,
        profile_img: p.profile_img,
        first_name: p.first_name,
        last_name: p.last_name,
        // Add more mappings as needed
      }));
      setProfiles(mappedProfiles);
      // Update favorites set
      const ids = mappedProfiles.map((p) => p.id || p.profile_id);
      setFavorites(new Set(ids));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching interested profiles:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.user?.id]);

  useEffect(() => {
    fetchInterestedProfiles();
  }, [fetchInterestedProfiles]);

  // Toggle interested (favorite/unfavorite) profile, same as Matching page
  const handleFavoriteClick = async (profileId, e) => {
    if (e) e.stopPropagation();
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
      if (res.ok) {
        await fetchInterestedProfiles();
      }
    } catch (err) {
      console.error("Error toggling interested profile:", err);
    } finally {
      setHeartLoading(null);
    }
  };

  // Check if user is on Basic Plan - same as Matching page
  const isBasicPlan = currentUser?.user?.package_plan === "Basic Plan";
  const shouldShowProfileImage = () => {
    return currentUser?.user?.package_plan === "Ultimate Plan";
  };

  // Skeleton loader for profiles - same as Matching page
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

  // Sorting logic
  const sortedProfiles = useMemo(() => {
    let sorted = [...profiles];
    if (sortOption === "Newest First") {
      sorted.sort((a, b) =>
        b.created_at && a.created_at
          ? new Date(b.created_at) - new Date(a.created_at)
          : 0
      );
    } else if (sortOption === "Oldest First") {
      sorted.sort((a, b) =>
        a.created_at && b.created_at
          ? new Date(a.created_at) - new Date(b.created_at)
          : 0
      );
    } else if (sortOption === "Age: Low to High") {
      sorted.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else if (sortOption === "Age: High to Low") {
      sorted.sort((a, b) => (b.age || 0) - (a.age || 0));
    }
    return sorted;
  }, [profiles, sortOption]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProfiles.length / cardsPerPage);
  const paginatedProfiles = useMemo(
    () => sortedProfiles.slice((page - 1) * cardsPerPage, page * cardsPerPage),
    [sortedProfiles, page, cardsPerPage]
  );

  return (
    <div className="min-h-screen bg-[#FCF8F3]"  style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section - same as Matching page */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8D1C21] mb-3">
            Your Interested Profiles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through profiles you've shown interest in and connect with
            potential matches
          </p>
        </div>

        {/* Results Header - same as Matching page */}
        <div className="bg-gradient-to-r from-[#8D1C21] to-[#a00000] rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {profiles.length} Interested Profiles
              </h2>
              <p className="text-white/90 text-sm">
                Profiles you've saved by clicking the heart icon
              </p>
            </div>
            <div className="flex items-center space-x-4 bg-white rounded-xl px-4 py-2 shadow-md">
              <span className="text-gray-600 text-sm font-semibold">
                Sort by:
              </span>
              <select
                className="border-0 bg-transparent text-gray-800 font-semibold focus:ring-0 focus:outline-none"
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
              >
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Age: Low to High">Age: Low to High</option>
                <option value="Age: High to Low">Age: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State - same as Matching page */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-lg">
            <p className="text-red-700 font-semibold text-center">
              ⚠️ Error loading profiles: {error}
            </p>
          </div>
        )}

        {/* Profiles Grid - same as Matching page */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {[...Array(6)].map((_, i) => (
              <ProfileSkeleton key={i} />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">💔</div>
            <div className="text-2xl font-bold text-gray-700 mb-2">
              No interested profiles yet
            </div>
            <p className="text-gray-500 text-lg mb-6">
              Start browsing profiles and click the heart icon to save them here
            </p>
            <button
              onClick={() => navigate("/matching")}
              className="bg-gradient-to-r from-[#8D1C21] to-[#a00000] text-white py-3 px-6 rounded-xl hover:from-[#a00000] hover:to-[#8D1C21] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {paginatedProfiles.map((profile) => (
                <div
                  key={profile.profile_id || profile.member_id || profile.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs xl:max-w-xs mx-auto"
                  style={{ minHeight: isBasicPlan ? "280px" : "340px" }}
                >
                  {/* Profile Image and Basic Info - EXACTLY SAME AS MATCHING PAGE */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#8D1C21] shadow-lg">
                        {shouldShowProfileImage() ? (
                          <img
                            src={getProfileImageUrl(profile)}
                            alt={
                              profile.name ||
                              profile.first_name ||
                              profile.last_name ||
                              `Profile ${profile.profile_id}`
                            }
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
                      <div className="absolute -bottom-2 -right-2 bg-[#8D1C21] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                        {profile.age ||
                          profile.profile_age ||
                          profile.member_age ||
                          "-"}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {currentUser?.user?.package_plan === "Ultimate Plan"
                        ? profile.name ||
                          `${profile.first_name || ""} ${
                            profile.last_name || ""
                          }`.trim() ||
                          "Name not available"
                        : currentUser?.user?.gender === "male"
                        ? "Bride"
                        : "Groom"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      Member ID:{" "}
                      <span className="text-[#8D1C21] font-bold">
                        {profile.member_id || profile.profile_id || "-"}
                      </span>
                    </p>
                  </div>

                  {/* Profile Details - EXACTLY SAME CONDITIONAL LOGIC AS MATCHING PAGE */}
                  <div className="w-full space-y-2 mb-4">
                    {/* Show details only if NOT on Basic Plan (same as Matching page) */}
                    {!isBasicPlan ? (
                      <>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">
                            Star:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {profile.starSign ? profile.starSign : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">
                            Religion:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {profile.religion ? profile.religion : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">
                            Caste:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {profile.caste ? profile.caste : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">
                            Location:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {profile.countryOfResidence
                              ? profile.countryOfResidence
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-600">
                            Occupation:
                          </span>
                          <span className="text-gray-800 font-medium">
                            {profile.occupation || profile.occupation_details
                              ? (
                                  profile.occupation ||
                                  profile.occupation_details
                                ).length > 28
                                ? `${(
                                    profile.occupation ||
                                    profile.occupation_details
                                  ).slice(0, 25)}...`
                                : profile.occupation ||
                                  profile.occupation_details
                              : "-"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 text-center">
                        <div className=" font-semibold text-sm mb-2">
                          Upgrade to Ultimate Plan to view profile details
                        </div>
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-[#8D1C21] to-[#a00000] text-white rounded-lg font-bold text-xs shadow hover:from-[#a00000] hover:to-[#8D1C21] transition-all"
                          onClick={() => navigate("/pricing")}
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - SAME LAYOUT AS MATCHING PAGE */}
                  <div className="w-full flex gap-3 mt-auto">
                    <button
                      onClick={() =>
                        handleViewProfile(
                          profile.id || profile.profile_id || profile.member_id
                        )
                      }
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

                    {/* RED HEART FOR REMOVING FROM INTERESTED LIST ONLY */}
                    <button
                      onClick={(e) =>
                        handleFavoriteClick(profile.id || profile.profile_id, e)
                      }
                      className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#8D1C21] group relative"
                      title={
                        favorites.has(profile.id || profile.profile_id)
                          ? "Remove from Interested List"
                          : "Add to Interested List"
                      }
                      disabled={
                        heartLoading === (profile.id || profile.profile_id)
                      }
                    >
                      {heartLoading === (profile.id || profile.profile_id) ? (
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
                      ) : favorites.has(profile.id || profile.profile_id) ? (
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - same as Matching page */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  className={`px-4 py-2 rounded-lg font-bold text-white bg-[#8D1C21] hover:bg-[#a00000] transition-colors ${
                    page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  className={`px-4 py-2 rounded-lg font-bold text-white bg-[#8D1C21] hover:bg-[#a00000] transition-colors ${
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}

            {/* Empty state when all profiles are removed */}
            {profiles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  You have removed all profiles from your interested list.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InterestedProfilesPage;
