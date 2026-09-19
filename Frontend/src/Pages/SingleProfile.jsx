import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API } from "../utils/api";
import {
  MapPin,
  Cake,
  Ruler,
  Palette,
  Home,
  Heart,
  Utensils,
  Wine,
  BookOpen,
  Ribbon,
  GraduationCap,
  Briefcase,
  Users,
  DollarSign,
  User,
  ArrowRight,
  Lock,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  BarChart,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  School,
  HeartPulse,
  Award,
  UsersRound,
  Eye,
  Target,
  Shield,
  Sparkles,
  Zap,
  CheckCircle,
  FileText,
  Building,
  BriefcaseBusiness,
  Banknote,
  Crown,
} from "lucide-react";

const SingleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showChartModal, setShowChartModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [resolvedImageUrls, setResolvedImageUrls] = useState([]);
  const [resolvedChartUrl, setResolvedChartUrl] = useState(null);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [expandedSection, setExpandedSection] = useState("about");

  const isBasicUser =
    !currentUser ||
    !currentUser.user.package_plan ||
    currentUser.user.package_plan === "Basic Plan";
  const isStandardOrAbove = !isBasicUser;
  const isUltimate = currentUser?.user.package_plan === "Ultimate Plan";
  const isPremiumOrUltimate =
    currentUser?.user.package_plan === "Premium Plan" ||
    currentUser?.user.package_plan === "Ultimate Plan";

  const imageBaseUrls = [
    `${API}/uploads/`,
    "https://mobile.viwahaa.com/uploads/",
  ];
  const defaultImage =
    "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png";

  const getProfileImageUrl = (profileImg) => {
    if (!profileImg) return defaultImage;
    if (profileImg.includes("http")) return profileImg;
    return imageBaseUrls[0] + profileImg;
  };

  // Individual compatibility calculation functions
  const calculateAgeCompatibility = () => {
    if (!user || !currentUser || !currentUser.user || !user.age) return 86;

    const userAge = parseInt(user.age) || 0;
    const minAge = parseInt(currentUser.user.partner_minimum_age) || 0;
    const maxAge = parseInt(currentUser.user.partner_maximum_age) || 100;

    if (userAge >= minAge && userAge <= maxAge) {
      return 100;
    } else if (userAge > 0 && minAge > 0 && maxAge > 0) {
      const ageDiff = Math.min(
        Math.abs(userAge - minAge),
        Math.abs(userAge - maxAge)
      );
      return Math.max(30, 100 - ageDiff * 10);
    }
    return 86;
  };

  const calculateReligionCompatibility = () => {
    if (!user || !currentUser || !currentUser.user || !user.religion) return 88;

    if (currentUser.user.partner_religion) {
      const partnerReligion = String(
        currentUser.user.partner_religion
      ).toLowerCase();
      const userReligion = String(user.religion).toLowerCase();

      if (partnerReligion === "any" || partnerReligion === userReligion) {
        return 100;
      }
      return 50;
    }
    return 88;
  };

  const calculateLocationCompatibility = () => {
    if (!user || !currentUser || !currentUser.user || !user.country_of_resident)
      return 91;

    if (currentUser.user.partner_country_of_resident) {
      const partnerCountry = String(
        currentUser.user.partner_country_of_resident
      ).toLowerCase();
      const userCountry = String(user.country_of_resident).toLowerCase();

      if (partnerCountry === "any" || partnerCountry === userCountry) {
        return 100;
      }
      return 60;
    }
    return 91;
  };

  const calculateEducationCompatibility = () => {
    if (!user || !currentUser || !currentUser.user || !user.education)
      return 79;

    if (currentUser.user.partner_education) {
      const partnerEducation = String(
        currentUser.user.partner_education
      ).toLowerCase();
      const userEducation = String(user.education).toLowerCase();

      if (partnerEducation === "any" || partnerEducation === userEducation) {
        return 100;
      }
      return 65;
    }
    return 79;
  };

  const calculateLifestyleCompatibility = () => {
    if (!user || !currentUser || !currentUser.user) return 84;

    let lifestyleScore = 0;
    let lifestyleTotal = 0;

    // Eating habit match
    if (currentUser.user.partner_eating_habit && user.eating_habit) {
      lifestyleTotal += 1;
      if (
        currentUser.user.partner_eating_habit.toLowerCase() === "any" ||
        currentUser.user.partner_eating_habit.toLowerCase() ===
          user.eating_habit.toLowerCase()
      ) {
        lifestyleScore += 1;
      }
    }

    // Drinking habit match
    if (currentUser.user.partner_drinking_habit && user.drinking_habit) {
      lifestyleTotal += 1;
      if (
        currentUser.user.partner_drinking_habit.toLowerCase() === "any" ||
        currentUser.user.partner_drinking_habit.toLowerCase() ===
          user.drinking_habit.toLowerCase()
      ) {
        lifestyleScore += 1;
      }
    }

    // Smoking habit match
    if (currentUser.user.partner_smoking_habit && user.smoking_habit) {
      lifestyleTotal += 1;
      if (
        currentUser.user.partner_smoking_habit.toLowerCase() === "any" ||
        currentUser.user.partner_smoking_habit.toLowerCase() ===
          user.smoking_habit.toLowerCase()
      ) {
        lifestyleScore += 1;
      }
    }

    if (lifestyleTotal > 0) {
      return Math.round((lifestyleScore / lifestyleTotal) * 100);
    }

    return 84;
  };

  // Main compatibility calculation
  const calculateCompatibility = () => {
    if (!user || !currentUser || !currentUser.user) return 78;

    const ageScore = calculateAgeCompatibility();
    const religionScore = calculateReligionCompatibility();
    const locationScore = calculateLocationCompatibility();
    const educationScore = calculateEducationCompatibility();
    const lifestyleScore = calculateLifestyleCompatibility();

    // Weighted average calculation
    const weights = {
      age: 0.25,
      religion: 0.2,
      location: 0.2,
      education: 0.2,
      lifestyle: 0.15,
    };

    const totalScore =
      ageScore * weights.age +
      religionScore * weights.religion +
      locationScore * weights.location +
      educationScore * weights.education +
      lifestyleScore * weights.lifestyle;

    const finalScore = Math.round(totalScore);
    return isNaN(finalScore) ? 78 : finalScore;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/api/user/getuser/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!user || !currentUser || !currentUser.user) return;

    // Calculate compatibility score
    const score = calculateCompatibility();
    setCompatibilityScore(score);

    const imagesToResolve = [];
    if (user?.profile_img) imagesToResolve.push(user.profile_img);
    if (user?.img_1) imagesToResolve.push(user.img_1);
    if (user?.img_2) imagesToResolve.push(user.img_2);
    const resolvedUrls = imagesToResolve.map((img) => getProfileImageUrl(img));
    setResolvedImageUrls(resolvedUrls);

    setResolvedChartUrl(null);
    if (
      currentUser?.user.package_plan === "Premium Plan" ||
      currentUser?.user.package_plan === "Ultimate Plan"
    ) {
      if (
        user?.chart_img &&
        user.chart_img !== "null" &&
        user.chart_img !== "undefined" &&
        user.chart_img.trim() !== ""
      ) {
        setResolvedChartUrl(getProfileImageUrl(user.chart_img));
      }
    }
  }, [user, currentUser]);

  const showUpgradeAlert = (feature, planType = "Ultimate") => {
    if (confirm(`Upgrade to ${planType} account to ${feature}.`)) {
      navigate("/pricing");
    }
  };

  const handleViewChart = () => {
    if (isBasicUser) {
      showUpgradeAlert("view birth charts", "Standard");
      return;
    }
    setShowChartModal(true);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === resolvedImageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? resolvedImageUrls.length - 1 : prev - 1
    );
  };

  // Interested Profile state and handler
  const [isInterested, setIsInterested] = useState(false);
  const [interestedLoading, setInterestedLoading] = useState(false);

  useEffect(() => {
    // Fetch if this profile is already interested by current user
    const fetchInterested = async () => {
      if (!currentUser?.user?.id || !user?.id) return;
      try {
        const res = await fetch(
          `${API}/api/user/interested-profiles/${currentUser.user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          const ids = (data.profiles || []).map((p) => p.id);
          setIsInterested(ids.includes(user.id));
        }
      } catch {}
    };
    fetchInterested();
  }, [currentUser?.user?.id, user?.id]);

  const handleInterestedClick = async () => {
    if (!currentUser?.user?.id || !user?.id) return;
    setInterestedLoading(true);
    try {
      if (isInterested) {
        // Remove interested
        const res = await fetch(`${API}/api/user/remove-interested-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.user.id,
            profile_id: user.id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setIsInterested(false);
          toast.success(data.message || "Interest removed successfully");
        } else {
          toast.error(data.message || "Failed to remove interest");
        }
      } else {
        // Add interested
        const res = await fetch(`${API}/api/user/interested-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.user.id,
            profile_id: user.id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setIsInterested(true);
          toast.success(data.message || "Interest expressed successfully");
        } else {
          toast.error(data.message || "Failed to express interest");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setInterestedLoading(false);
  };

  // Enhanced Table Row Component with theme colors
  const TableRow = ({ icon: Icon, label, value, iconColor = "#8D1C21" }) => (
    <div className="flex items-center justify-between border-b border-[#ffd6d6] py-3 px-2 hover:bg-[#FFF5F5] transition-all duration-200 rounded-lg">
      <div className="flex items-center w-1/2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center mr-3 shadow-sm">
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <span className="text-gray-700 text-sm font-semibold">{label}</span>
      </div>
      <div className="w-1/2">
        <span className="text-gray-800 text-sm font-medium bg-gradient-to-r from-[#FFF5F5] to-[#ffeaea] px-3 py-1 rounded-lg border border-[#ffd6d6]">
          {value || "Not specified"}
        </span>
      </div>
    </div>
  );

  // Enhanced Compatibility Detail Component
  const CompatibilityDetail = ({ label, score }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div className="flex items-center">
        <div className="w-32 h-2.5 bg-[#ffeaea] rounded-full mr-3">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[#8D1C21] to-[#a00000]"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="text-gray-800 font-bold text-base w-12 text-right">
          {score}%
        </span>
      </div>
    </div>
  );

  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FCF8F3]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FCF8F3]">
        <div className="text-red-500">User not found.</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FCF8F3]"
      style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary mb-6 hover:text-primary/90 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center mr-2 group-hover:scale-105 transition-transform">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">Back to matches</span>
        </button>

        {/* Enhanced Profile Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl shadow-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full">
              <div className="relative mb-4 sm:mb-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  {isUltimate && resolvedImageUrls.length > 0 ? (
                    <img
                      src={resolvedImageUrls[0]}
                      alt={`${user.first_name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-primary rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg border-2 border-primary">
                  {user.age}
                </div>
              </div>
              <div className="text-white w-full">
                <div className="flex flex-col w-full text-center sm:text-left sm:items-start">
                  <div className="flex items-center gap-2 mb-2 flex-wrap justify-center sm:justify-start">
                    <Award className="w-5 h-5" />
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Member ID: {user.member_id}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                    {currentUser?.user?.package_plan && currentUser.user.package_plan !== "Basic Plan"
                      ? `${user.first_name} ${user.last_name}`
                      : user.member_id}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {user.city_of_resident}, {user.country_of_resident}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <BookOpen className="w-4 h-4" />
                      <span>{user.religion || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-end">
              {/* Basic Plan: No chat or shortlist */}
              {isBasicUser ? null : (
                <button
                  onClick={handleInterestedClick}
                  className={`bg-white text-primary py-2 px-4 sm:py-3 sm:px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold flex items-center gap-2 shadow-lg hover:shadow-xl ${
                    interestedLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={interestedLoading}
                >
                  {isInterested ? (
                    <Heart className="w-5 h-5 text-[#8D1C21] fill-current" />
                  ) : (
                    <Heart className="w-5 h-5 text-[#8D1C21]" />
                  )}
                  {isInterested ? "Interested" : "Mark Interested"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Image Gallery Section */}
        <div className="relative mb-8 rounded-2xl max-w-6xl mx-auto overflow-hidden bg-gradient-to-br from-[#FFF5F5] to-white shadow-xl border border-[#ffd6d6]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#8D1C21]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Photo Gallery
                  </h2>
                  <p className="text-gray-600 text-sm">
                    View all profile photos
                  </p>
                </div>
              </div>
            </div>

            {isUltimate ? (
              resolvedImageUrls.length > 0 ? (
                <>
                  <div className="relative w-full" style={{ height: "450px" }}>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={resolvedImageUrls[activeImageIndex]}
                        alt={`${user.first_name}'s profile`}
                        className="max-w-full max-h-full object-contain rounded-xl border-4 border-[#ffd6d6] shadow-lg cursor-zoom-in"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                        onClick={() =>
                          window.open(
                            resolvedImageUrls[activeImageIndex],
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      />
                      {/* Navigation Arrows */}
                      {resolvedImageUrls.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 text-[#8D1C21] p-3 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-[#ffd6d6]"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 text-[#8D1C21] p-3 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-[#ffd6d6]"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Image Indicators */}
                  {resolvedImageUrls.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {resolvedImageUrls.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-[#8D1C21] ${
                            activeImageIndex === index
                              ? "bg-[#8D1C21] scale-125"
                              : "bg-white"
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-80 rounded-xl bg-gradient-to-br from-[#FFF5F5] to-[#ffeaea] flex flex-col justify-center items-center p-8 border border-[#ffd6d6]">
                  <User className="w-24 h-24 text-[#8D1C21] mb-4" />
                  <p className="text-gray-600 text-center text-lg mb-4">
                    No photos available
                  </p>
                </div>
              )
            ) : (
              <div className="w-full h-80 rounded-xl bg-gradient-to-br from-[#FFF5F5] to-[#ffeaea] flex flex-col justify-center items-center p-8 border border-[#ffd6d6]">
                <Lock className="w-24 h-24 text-[#8D1C21] mb-4" />
                <p className="text-gray-600 text-center text-lg mb-4">
                  Upgrade to Ultimate Plan to view profile photos
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="bg-gradient-to-r from-primary to-primary/90 text-white py-3 px-6 rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Chart Button - Placed under Image Gallery */}
        {isStandardOrAbove && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleViewChart}
              className="bg-gradient-to-r from-primary to-primary/90 text-white py-3 px-8 rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <BarChart className="w-5 h-5" />
              </div>
              <span className="text-lg">View Birth Chart</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About Me */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <div
                className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 cursor-pointer"
                onClick={() => handleSectionToggle("about")}
              >
                <h2 className="text-xl font-serif flex items-center gap-2">
                  About Me
                </h2>
                <span className="font-bold">
                  {expandedSection === "about" ? "-" : "+"}
                </span>
              </div>
              {expandedSection === "about" && (
                <>
                  <p className="text-gray-700 mb-6 leading-relaxed bg-gradient-to-r from-[#FFF5F5] to-[#ffeaea] p-4 rounded-xl border border-[#ffd6d6]">
                    {user.education_details || "No bio available"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <TableRow icon={Cake} label="Age" value={user.age} />
                      <TableRow
                        icon={BookOpen}
                        label="Religion"
                        value={user.religion}
                      />
                      <TableRow
                        icon={Briefcase}
                        label="Occupation"
                        value={user.occupation || user.occupation_details}
                      />
                      <TableRow
                        icon={Globe}
                        label="Country"
                        value={user.country_of_resident}
                      />
                      <TableRow
                        icon={Ruler}
                        label="Height"
                        value={user.height}
                      />
                      <TableRow
                        icon={Palette}
                        label="Complexion"
                        value={user.complexion}
                      />
                    </div>
                    <div className="space-y-2">
                      <TableRow
                        icon={Home}
                        label="Family Type"
                        value={user.family_type}
                      />
                      <TableRow
                        icon={Heart}
                        label="Marital Status"
                        value={user.maritial_status}
                      />
                      <TableRow
                        icon={Utensils}
                        label="Diet"
                        value={user.eating_habit}
                      />
                      <TableRow
                        icon={Wine}
                        label="Drinking"
                        value={user.drinking_habit}
                      />
                      <TableRow
                        icon={Wine}
                        label="Smoking"
                        value={user.smoking_habit}
                      />
                      <TableRow icon={Ribbon} label="Caste" value={user.cast} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Family & Education - Only show for non-basic users */}
            {!isBasicUser && (
              <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <div
                  className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 cursor-pointer"
                  onClick={() => handleSectionToggle("family")}
                >
                  <h2 className="text-xl font-serif flex items-center gap-2">
                    Family & Education
                  </h2>
                  <span className="font-bold">
                    {expandedSection === "family" ? "-" : "+"}
                  </span>
                </div>
                {expandedSection === "family" && (
                  <>
                    <div className="space-y-2">
                      <TableRow
                        icon={School}
                        label="Education"
                        value={user.education || "Not specified"}
                      />
                      <TableRow
                        icon={BriefcaseBusiness}
                        label="Occupation"
                        value={user.occupation || "Not specified"}
                      />
                      <TableRow
                        icon={Users}
                        label="Family Values"
                        value={user.family_value || "Not specified"}
                      />
                      <TableRow
                        icon={Banknote}
                        label="Family Status"
                        value={user.family_status || "Not specified"}
                      />

                      {/* Additional family details for Ultimate Plan */}
                      {isUltimate && (
                        <>
                          <div className="mt-6 pt-4 border-t border-[#ffd6d6]">
                            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Father's Details
                            </h3>
                            <TableRow
                              icon={User}
                              label="Name"
                              value={user.fathers_name || "Not specified"}
                            />
                            <TableRow
                              icon={Briefcase}
                              label="Occupation"
                              value={user.fathers_occupation || "Not specified"}
                            />
                            <TableRow
                              icon={MapPin}
                              label="Native Place"
                              value={
                                user.fathers_native_place || "Not specified"
                              }
                            />
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#ffd6d6]">
                            <h3 className="text-lg font-bold text-[#8D1C21] mb-3 flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Mother's Details
                            </h3>
                            <TableRow
                              icon={User}
                              label="Name"
                              value={user.mothers_name || "Not specified"}
                            />
                            <TableRow
                              icon={Briefcase}
                              label="Occupation"
                              value={user.mothers_occupation || "Not specified"}
                            />
                            <TableRow
                              icon={MapPin}
                              label="Native Place"
                              value={
                                user.mothers_native_place || "Not specified"
                              }
                            />
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#ffd6d6]">
                            <h3 className="text-lg font-bold text-[#8D1C21] mb-3 flex items-center gap-2">
                              <UsersRound className="w-5 h-5" />
                              Siblings
                            </h3>
                            <TableRow
                              icon={User}
                              label="Brothers"
                              value={user.brothers || "Not specified"}
                            />
                            <TableRow
                              icon={User}
                              label="Married Brothers"
                              value={user.married_brothers || "Not specified"}
                            />
                            <TableRow
                              icon={User}
                              label="Sisters"
                              value={user.sisters || "Not specified"}
                            />
                            <TableRow
                              icon={User}
                              label="Married Sisters"
                              value={user.married_sisters || "Not specified"}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Partner Preferences */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <div
                className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4 cursor-pointer"
                onClick={() => handleSectionToggle("partner")}
              >
                <h2 className="text-xl font-serif flex items-center gap-2">
                  Partner Preferences
                </h2>
                <span className="font-bold">
                  {expandedSection === "partner" ? "-" : "+"}
                </span>
              </div>
              {expandedSection === "partner" && (
                <>
                  <div className="space-y-2">
                    <TableRow
                      icon={User}
                      label="Age Range"
                      value={`${user.partner_minimum_age} - ${user.partner_maximum_age}`}
                    />
                    <TableRow
                      icon={Ruler}
                      label="Height Range"
                      value={`${user.partner_minimum_height} - ${user.partner_maximum_height}cm`}
                    />
                    <TableRow
                      icon={BookOpen}
                      label="Religion"
                      value={user.partner_religion}
                    />
                    <TableRow
                      icon={Ribbon}
                      label="Caste"
                      value={user.partner_cast}
                    />
                    <TableRow
                      icon={Utensils}
                      label="Diet"
                      value={user.partner_eating_habit}
                    />
                    <TableRow
                      icon={Wine}
                      label="Drinking Habit"
                      value={user.partner_drinking_habit}
                    />
                    <TableRow
                      icon={Wine}
                      label="Smoking Habit"
                      value={user.partner_smoking_habit}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Compatibility Score */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#ffd6d6]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#8D1C21]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#8D1C21]">
                    Compatibility Score
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Based on your preferences
                  </p>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] mb-6">
                  <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                    <div className="text-5xl font-bold text-[#8D1C21]">
                      {compatibilityScore}%
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Match</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Based on your preferences and profile details
                </p>
              </div>

              {/* Compatibility Details */}
              <div className="space-y-4">
                <CompatibilityDetail
                  label="Age Compatibility"
                  score={calculateAgeCompatibility()}
                />
                <CompatibilityDetail
                  label="Religion Match"
                  score={calculateReligionCompatibility()}
                />
                <CompatibilityDetail
                  label="Location Match"
                  score={calculateLocationCompatibility()}
                />
                <CompatibilityDetail
                  label="Education Match"
                  score={calculateEducationCompatibility()}
                />
                <CompatibilityDetail
                  label="Lifestyle Match"
                  score={calculateLifestyleCompatibility()}
                />
              </div>

              {/* Match Description */}
              <div className="mt-8 pt-6 border-t border-[#ffd6d6]">
                <h4 className="text-lg font-bold text-[#8D1C21] mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Match Analysis:
                </h4>
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF5F5] to-[#ffeaea] border border-[#ffd6d6]">
                  <p className="text-sm font-medium text-[#8D1C21]">
                    {compatibilityScore >= 80
                      ? "Excellent match! Strong alignment across all major criteria."
                      : compatibilityScore >= 60
                      ? "Good match with solid compatibility in key areas."
                      : "Moderate match. Consider reviewing preferences for better alignment."}
                  </p>
                </div>
              </div>
            </div>

            {!isPremiumOrUltimate && (
              <div
                onClick={() => showUpgradeAlert("view birth charts", "Premium")}
                className="bg-gradient-to-r from-[#8D1C21] to-[#a00000] p-6 rounded-2xl cursor-pointer hover:from-[#a00000] hover:to-[#8D1C21] transition-all duration-300 shadow-xl hover:shadow-2xl opacity-90"
              >
                <div className="flex flex-col items-center text-center text-white">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-white/90 text-sm mb-4">
                    View birth charts and compatibility
                  </p>
                  <button className="bg-white text-[#8D1C21] py-2 px-6 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Modal */}
        {showChartModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-[#ffd6d6]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-[#8D1C21]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#8D1C21">
                      Birth Chart
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Astrological birth chart
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChartModal(false)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffeaea] to-[#ffd6d6] text-[#8D1C21] hover:text-[#a00000] flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              {resolvedChartUrl ? (
                <div className="bg-gradient-to-br from-[#FFF5F5] to-[#ffeaea] rounded-xl p-4 border border-[#ffd6d6] flex justify-center items-center">
                  <ChartImageNewTab src={resolvedChartUrl} alt="Birth chart" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <BarChart className="w-24 h-24 mb-6 text-[#ffeaea]" />
                  <p className="text-lg text-gray-600">Chart not uploaded</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Birth chart not uploaded yet
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowChartModal(false)}
                  className="bg-gradient-to-r from-[#8D1C21] to-[#a00000] text-white py-3 px-8 rounded-xl hover:from-[#a00000] hover:to-[#8D1C21] transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
                >
                  Close Chart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProfile;

// ZoomableGalleryImage component
const ZoomableGalleryImage = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const handleWheel = (e) => {
    e.preventDefault();
    let newScale = scale + (e.deltaY < 0 ? 0.2 : -0.2);
    newScale = Math.max(1, Math.min(newScale, 4));
    setScale(newScale);
  };
  const handleClick = () => {
    setScale((s) => (s < 2 ? 2 : 1));
  };
  return (
    <img
      src={src}
      alt={alt}
      style={{
        transform: `scale(${scale})`,
        transition: "transform 0.2s",
        maxWidth: "100%",
        maxHeight: "70vh",
        cursor: scale < 2 ? "zoom-in" : "zoom-out",
      }}
      onWheel={handleWheel}
      onClick={handleClick}
      draggable={false}
    />
  );
};

// ChartImageNewTab component
const ChartImageNewTab = ({ src, alt }) => {
  const handleImageClick = () => {
    // Ensure absolute URL for chart image
    let imageUrl = src;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl =
        `${API}/uploads/` + imageUrl.replace(/^\/+/, "");
    }
    const win = window.open(imageUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: "100%", maxHeight: "70vh", cursor: "zoom-in" }}
      onClick={handleImageClick}
      draggable={false}
    />
  );
};
