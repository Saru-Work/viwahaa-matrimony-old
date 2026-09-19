import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import heroImage from "../assets/images/unnamed.png";
import {  
  UserPlus,
  ShieldCheck,
  Search,
  MessageCircle,
  Users,
  PartyPopper,
  ArrowRight,
  Quote,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../utils/api";


const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function NewHome() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [successStories, setSuccessStories] = useState([]);
  const [weddingGallery, setWeddingGallery] = useState([]);
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSearchProfiles = () => {
    if (currentUser?.user) {
      navigate("/matching");
    } else {
      navigate("/guest-search");
    }
  };

  const handleInterest = async (profileId) => {
    if (!currentUser) {
      setShowLoginModal(true);
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

  // Array of country flags for the marquee
  const countryFlags = [
    { country: "Sri Lanka", code: "lk" },
    { country: "India", code: "in" },
    { country: "USA", code: "us" },
    { country: "UK", code: "gb" },
    { country: "Canada", code: "ca" },
    { country: "Australia", code: "au" },
    { country: "Singapore", code: "sg" },
    { country: "Malaysia", code: "my" },
    { country: "UAE", code: "ae" },
    { country: "France", code: "fr" },
    { country: "Germany", code: "de" },
    { country: "New Zealand", code: "nz" },
    { country: "Switzerland", code: "ch" },
  ];

  // Fetch all basic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch success stories
        const storiesRes = await fetch(`${API}/api/success-stories/active`);
        const storiesData = await storiesRes.json();
        if (storiesData.success) setSuccessStories(storiesData.stories);

        // Fetch wedding gallery
        const galleryRes = await fetch(`${API}/api/wedding-gallery/active`);
        const galleryData = await galleryRes.json();
        if (galleryData.success) setWeddingGallery(galleryData.images);

        // Fetch featured profiles
        const profilesRes = await fetch(`${API}/api/user/featured`);
        const profilesData = await profilesRes.json();
        if (profilesData.success) {
          setFeaturedProfiles(profilesData.profiles);
        }
      } catch (error) {
        console.error("Failed to fetch home page data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch hero images from the API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch(`${API}/api/hero-images/active`);
        const data = await res.json();
        if (data.success && data.images.length > 0) {
          setHeroImages(data.images);
        }
      } catch (error) {
        console.error("Failed to fetch hero images:", error);
      } finally {
        setIsHeroLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Determine the current image source
  const currentImageSrc =
    heroImages.length > 0
      ? `${API}/uploads/${heroImages[currentSlide]?.image_path}`
      : isHeroLoading
      ? null
      : heroImage;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen  ">
      {/* Hero Section */}
      <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[650px] lg:min-h-[750px] xl:min-h-[850px] w-full overflow-hidden flex items-center mt-[56px] sm:mt-[88px] md:mt-[84px] lg:mt-[68px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 hover:from-primary/65 via-primary/40 to-transparent z-10 transition-all duration-700"></div>
          <AnimatePresence mode="wait">
            {currentImageSrc && (
              <motion.img
                key={currentSlide}
                className="absolute inset-0 h-full w-full object-cover"
                alt="Beautiful Tamil wedding couple in traditional wedding attire"
                src={currentImageSrc}
                style={{
                  objectPosition: `center ${
                    heroImages.length > 0 && heroImages[currentSlide]
                      ? (heroImages[currentSlide].position_y ?? 50)
                      : 50
                  }%`,
                  transform: `scale(${
                    heroImages.length > 0 && heroImages[currentSlide]
                      ? (heroImages[currentSlide].zoom ?? 1.0)
                      : 1.0
                  })`,
                  transformOrigin: `center ${
                    heroImages.length > 0 && heroImages[currentSlide]
                      ? (heroImages[currentSlide].position_y ?? 50)
                      : 50
                  }%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 w-full py-8 sm:py-0">
          <div className="max-w-2xl">
            <span className="inline-block px-3 sm:px-4 py-1 rounded-full bg-accent/20 text-accent text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-accent/30 tracking-wider uppercase">
              The #1 Tamil Matrimony Site
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-4 sm:mb-6">
              Find Your Perfect <br />
              <span className="text-accent">Life Partner</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 sm:mb-10 max-w-lg leading-relaxed">
              Connecting hearts across the globe with tradition, trust, and
              premium matchmaking services tailored for the Tamil community.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/sign-up"
                className="bg-accent text-primary font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Register Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button 
                onClick={handleSearchProfiles}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/20 transition-all text-sm sm:text-base outline-none"
              >
                Search Profiles
              </button>
            </div>
            {/* Slide Indicators */}
            {heroImages.length > 1 && (
              <div className="flex gap-2 mt-8">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-accent"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Moving Country Flags Marquee at the bottom of Hero Section */}
      <div className="bg-primary py-4 sm:py-6 overflow-hidden flex items-center">
        <motion.div
          className="flex items-center gap-12 whitespace-nowrap pl-4"
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...countryFlags, ...countryFlags, ...countryFlags, ...countryFlags].map((flag, index) => (
            <div key={`${flag.code}-${index}`} className="flex items-center gap-2 group">
              <img
                src={`https://flagcdn.com/w40/${flag.code}.png`}
                srcSet={`https://flagcdn.com/w80/${flag.code}.png 2x`}
                width="28"
                alt={`${flag.country} flag`}
                className="rounded-[2px] shadow-sm opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-white/80 text-xs font-semibold tracking-wide uppercase group-hover:text-white transition-colors">
                {flag.country}
              </span>
            </div>
          ))}
        </motion.div>
      </div>



      {/* Featured Profiles */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background-light dark:bg-background-dark px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h3 className="text-accent font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
                Your Journey Starts Here
              </h3>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary dark:text-white">
                Discover Bride & Groom Profiles
              </h2>
            </div>
            <Link
              to={currentUser ? "/matching" : "/pricing"}
              className="text-primary font-bold flex items-center gap-1 group text-sm sm:text-base"
            >
              View All{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8">
            <motion.div
              className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8"
              animate={{ 
                x: [0, -280 * featuredProfiles.length], 
              }}
              transition={{
                duration: featuredProfiles.length * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ width: "max-content" }}
            >
              {featuredProfiles.length > 0 ? (
                // Duplicate the list to ensure seamless infinite scroll
                [...featuredProfiles, ...featuredProfiles, ...featuredProfiles].map((profile, idx) => (
                  <div key={`${profile.id}-${idx}`} className="w-[280px] sm:w-[320px] shrink-0 group relative rounded-2xl bg-white dark:bg-background-dark/50 overflow-hidden shadow-xl border border-primary/5 flex flex-col h-full">
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={`Tamil featured profile portrait`}
                        src={`${API}/uploads/${profile.default_image}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-white text-xs bg-accent/80 px-2 py-1 rounded">
                          Verified Member
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold mb-1 line-clamp-1">
                        {currentUser?.user?.package_plan && currentUser.user.package_plan !== "Basic Plan" 
                          ? profile.name 
                          : profile.member_id}, {profile.age}
                      </h4>
                      <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-2">
                        {profile.religion} • {profile.occupation} •{" "}
                        {profile.country_of_resident}
                      </p>
                      <div className="flex gap-2 mt-auto">
                        <Link to={currentUser ? `/single-profile/${profile.id}` : "/pricing"} className="flex-1">
                          <button className="w-full bg-primary/10 text-primary py-2 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-sm">
                              lock
                            </span>{" "}
                            Profile
                          </button>
                        </Link>
                        {currentUser?.user?.package_plan !== "Basic Plan" && (
                          <button 
                            onClick={() => handleInterest(profile.id)}
                            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-[10px] hover:bg-primary/90 transition-colors"
                          >
                            Interest
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full py-10 text-center text-gray-400">
                  Loading featured profiles...
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Process Timeline */}
      <section className="py-12 sm:py-16 lg:py-24 bg-primary text-white px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-accent font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">
              How it works
            </h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
              Your Journey to Success
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-accent mx-auto"></div>
          </div>
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-accent/20 -translate-y-1/2 hidden lg:block"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Register</h4>
                <p className="text-xs sm:text-sm text-white/60">
                  Create your detailed profile for free
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Verify</h4>
                <p className="text-xs sm:text-sm text-white/60">
                  Profile verification via official documents
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">
                  Search
                </h4>
                <p className="text-xs sm:text-sm text-white/60">
                  Filter by caste, location & occupation
                </p>
              </div>
              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Connect</h4>
                <p className="text-xs sm:text-sm text-white/60">
                  Communicate with matching profiles
                </p>
              </div>
              {/* Step 5 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Meet</h4>
                <p className="text-xs sm:text-sm text-white/60">
                  Initial family meeting and talks
                </p>
              </div>
              {/* Step 6 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-accent text-primary flex items-center justify-center mb-3 sm:mb-6 ring-4 sm:ring-8 ring-primary group-hover:scale-110 transition-transform">
                  <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Marriage</h4>
                <p className="text-xs sm:text-sm text-white/60">
                  A match made in heaven is finalized
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center mb-8 sm:mb-12 lg:mb-16 text-primary">
            Happy Success Stories
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {successStories.length > 0 ? (
              successStories.map((story) => (
                <div key={story.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 items-center bg-white dark:bg-background-dark/30 p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/5">
                  <div className="shrink-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-accent">
                    <img
                      className="w-full h-full object-cover"
                      alt={story.couple_name}
                      src={`${API}/uploads/${story.image_path}`}
                    />
                  </div>
                  <div>
                    <div className="text-accent mb-4">
                      <Quote className="w-8 h-8 rotate-180" />
                    </div>
                    <p className="italic text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                      &quot;{story.feedback}&quot;
                    </p>
                    <h5 className="font-bold text-primary">— {story.couple_name}</h5>
                    <p className="text-xs text-slate-400">
                      Married {story.wedding_date}
                      {story.location ? `, ${story.location}` : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback placeholder during load
              <div className="col-span-full py-10 text-center text-gray-400">
                Loading inspiring stories...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Weddings Gallery */}
      <section className="py-12 sm:py-16 lg:py-24 bg-background-light dark:bg-background-dark/50 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-6 sm:mb-8 lg:mb-12 flex items-center gap-2 sm:gap-4">
            Recent Wedding Celebrations{" "}
            <div className="flex-1 h-px bg-primary/10"></div>
          </h2>
          <div className="overflow-hidden py-4">
            <motion.div 
              className="flex gap-4 sm:gap-6"
              animate={{ 
                x: [0, -100 * weddingGallery.length],
              }}
              transition={{
                duration: weddingGallery.length * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...weddingGallery, ...weddingGallery].map((img, index) => (
                <div key={`${img.id}-${index}`} className="group relative w-64 sm:w-80 shrink-0 aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <img
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    alt={img.couple_name}
                    src={`${API}/uploads/${img.image_path}`}
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold">{img.couple_name}</span>
                  </div>
                </div>
              ))}
              {weddingGallery.length === 0 && (
                <p className="text-gray-400 text-center w-full py-10">Waiting for new celebrations...</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-background-dark p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center relative border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-primary dark:text-white mb-2">
                Sign In Required
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm sm:text-base">
                Please sign in to express your interest in this profile and
                connect with them.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate("/sign-in", {
                      state: {
                        fromInterest: true,
                        message:
                          "Please sign in to express interest in this profile",
                      },
                    });
                  }}
                  className="bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors w-full"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/sign-up"
                  onClick={() => setShowLoginModal(false)}
                  className="text-accent font-bold hover:underline"
                >
                  Register here
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
