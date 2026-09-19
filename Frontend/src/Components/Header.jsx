import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import homeTile from "../assets/images/homeTile.jpg";
import logo from "../assets/Logo/logowhite.png";
import service from "../assets/images/service.jpg";
import slide1 from "../assets/images/bg2.jpg";
import slide2 from "../assets/images/bg3.jpg";
import slide4 from "../assets/images/bg4.png";
import slide3 from "../assets/images/bg10.png";
import HeaderNav from "./HeaderNav";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  // Slideshow state
  const slideshowImages = [slide1, slide2, slide3, slide4];
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slideshow effect (run on all pages)
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/about":
        return "About Us";
      case "/services":
        return "Services";
      case "/pricing":
        return "Pricing Plans";
      case "/contact":
        return "Contact Us";
      case "/sign-in":
        return "Login";
      case "/customer-profile":
        return "Viwahaa Matrimony";
      case "/":
      case "/home":
        return "";
      default:
        return "Viwahaa Matrimony";
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/sign-in");
  };

  return (
    <>
      <HeaderNav
        scrolled={scrolled}
        currentUser={currentUser}
        toggleMenu={toggleMenu}
      />

      {/* Sidebar Menu (for mobile) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#f1d2d2] bg-opacity-75 z-50 flex justify-end md:hidden">
          <div className="w-4/5 sm:w-72 bg-[#FCF8F3] h-full px-4 sm:px-6 py-8 relative">
            <button
              onClick={toggleMenu}
              className="text-[#800000] absolute top-4 right-4 p-1 z-50"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <ul className="flex flex-col items-start space-y-6 mt-12 text-[#800000] font-semibold text-lg sm:text-xl">
              <Link to="/" onClick={toggleMenu} className="w-full">
                <li
                  className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                    location.pathname === "/" || location.pathname === "/home"
                      ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                      : ""
                  }`}
                >
                  HOME
                </li>
              </Link>
              <Link to="/about" onClick={toggleMenu} className="w-full">
                <li
                  className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                    location.pathname === "/about"
                      ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                      : ""
                  }`}
                >
                  ABOUT
                </li>
              </Link>
              <Link to="/services" onClick={toggleMenu} className="w-full">
                <li
                  className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                    location.pathname === "/services"
                      ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                      : ""
                  }`}
                >
                  SERVICES
                </li>
              </Link>
              <Link to="/pricing" onClick={toggleMenu} className="w-full">
                <li
                  className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                    location.pathname === "/pricing"
                      ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                      : ""
                  }`}
                >
                  PRICING
                </li>
              </Link>
              <Link to="/contact" onClick={toggleMenu} className="w-full">
                <li
                  className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                    location.pathname === "/contact"
                      ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                      : ""
                  }`}
                >
                  CONTACT
                </li>
              </Link>
              {currentUser?.user && (
                <Link
                  to="/notifications"
                  onClick={toggleMenu}
                  className="w-full"
                >
                  <li
                    className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                      location.pathname === "/notifications"
                        ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                        : ""
                    }`}
                  >
                    NOTIFICATIONS
                  </li>
                </Link>
              )}
              {currentUser?.user ? (
                <>
                  <Link
                    to="/customer-profile"
                    onClick={toggleMenu}
                    className="w-full"
                  >
                    <li
                      className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                        location.pathname === "/customer-profile"
                          ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                          : ""
                      }`}
                    >
                      PROFILE
                    </li>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="hover:bg-gray-800 w-full text-left px-4 py-2 rounded"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <Link to="/sign-in" onClick={toggleMenu} className="w-full">
                  <li
                    className={`hover:bg-gray-800 w-full px-4 py-2 rounded ${
                      location.pathname === "/sign-in"
                        ? "bg-[#fcba03] text-[#8D1C21] font-bold shadow"
                        : ""
                    }`}
                  >
                    LOGIN
                  </li>
                </Link>
              )}
            </ul>
          </div>
        </div>
      )}

      <header
        className={`relative w-full overflow-x-hidden h-[90vh] sm:h-[100vh] bg-cover bg-center transition-all duration-500 mt-[64px] sm:mt-[80px] md:mt-[96px] ${
          scrolled && location.pathname === "/old-home"
            ? "h-[70vh] sm:h-[100vh]"
            : ""
        } ${location.pathname === "/" ? "hidden" : ""}`}
        style={{
          backgroundImage: `url(${slideshowImages[slideIndex]})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          fontFamily: "DM Sans, Arial, sans-serif",
          width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 left-0 w-full h-full bg-black bg-opacity-20"></div>

        {/* Conditional Content for Home Page */}
        {location.pathname === "/" && (
          <div
            className={`absolute left-0 w-full z-10 text-center text-white px-4 sm:px-6 md:px-12 transition-all duration-500 pt-[70px] sm:pt-[90px] ${
              scrolled ? "bottom-1/2" : "bottom-10 sm:bottom-20"
            }`}
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[75px] font-normal font-Sacremento mb-3 sm:mb-4 transition-all duration-500 ${
                scrolled ? "text-2xl sm:text-3xl md:text-4xl mb-2" : ""
              }`}
            >
              This is where you meet your life partner
            </h2>
            <p
              className={`text-base sm:text-lg mb-4 sm:mb-6 font-workSans max-w-2xl mx-auto transition-all duration-500 ${
                scrolled ? "text-sm sm:text-base mb-3 opacity-90" : ""
              }`}
            >
              We verify every profile manually so that you know you are dealing
              with real people.
            </p>
            <div
              className={`flex flex-col gap-3 items-center justify-center md:flex-row md:gap-5 transition-all duration-500 ${
                scrolled ? "scale-90" : ""
              }`}
            >
              {!currentUser?.user ? (
                <>
                  <Link to="/sign-up" className="w-full sm:w-auto">
                    <button className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 font-workSans w-full sm:w-auto">
                      REGISTER
                    </button>
                  </Link>
                  <Link to="/sign-in" className="w-full sm:w-auto">
                    <button className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 rounded-full hover:bg-white hover:border-orange-600 hover:text-black font-workSans w-full sm:w-auto">
                      LOGIN
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/customer-profile" className="w-full sm:w-auto">
                    <button className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-orange-600 font-workSans w-full sm:w-auto">
                      Go to Profile
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 rounded-full hover:bg-white hover:border-orange-600 hover:text-black font-workSans w-full sm:w-auto"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Centered Title */}
        {location.pathname !== "/" && (
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full px-4 text-center transition-all duration-300 ${
              scrolled ? "top-1/3" : ""
            }`}
          >
            <h1
              className={`text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-Sacremento transition-all duration-300 ${
                scrolled ? "text-3xl sm:text-4xl md:text-5xl" : ""
              }`}
            >
              {getPageTitle(location.pathname)}
            </h1>
            {/* Member ID display for profile page */}
            {location.pathname === "/customer-profile" &&
              currentUser?.user?.member_id && (
                <p className="text-white text-lg sm:text-xl mt-2 font-workSans">
                  Member ID: {currentUser.user.member_id}
                </p>
              )}
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
