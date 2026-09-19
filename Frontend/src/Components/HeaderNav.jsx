import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, User } from "lucide-react";
import logo from "../assets/Logo/logowhite.png";
import { useSocket } from "../Context/SocketContext";

function HeaderNav({ scrolled, currentUser, toggleMenu }) {
  const location = useLocation();
  const { unreadCount } = useSocket();
  const activeClass = " text-[#FFD700] border-b-2 border-[#FFD700] font-bold";

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full px-4 sm:px-6 md:px-8 py-2 md:py-3 flex items-center justify-between z-40 bg-[#8D1C21] shadow-lg transition-all duration-300 ${scrolled ? "py-1 shadow-xl" : ""}`}>
      {/* Left: Logo Section */}
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 transition-all duration-300 ${
              scrolled ? "h-8 w-8 sm:h-10 sm:w-10" : ""
            }`}
          />
          <h1
            className={`font-Sacremento text-xl sm:text-2xl md:text-3xl font-normal text-white transition-all duration-300 ${
              scrolled ? "text-lg sm:text-xl" : ""
            }`}
          >
            Viwahaa
          </h1>
        </Link>
      </div>

      {/* Center: Main Nav Links (for large screens) */}
      <div className="hidden md:flex items-center justify-center flex-grow px-4">
        <ul className="flex items-center space-x-6 lg:space-x-10 text-white font-medium text-sm md:text-[15px] tracking-widest uppercase">
          <li>
            <Link 
              to="/" 
              className={`hover:text-[#fcba03] transition-colors py-1 ${
                location.pathname === "/" || location.pathname === "/home" ? activeClass : ""
              }`}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`hover:text-[#fcba03] transition-colors py-1 ${
                location.pathname === "/about" ? activeClass : ""
              }`}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link 
              to="/services" 
              className={`hover:text-[#fcba03] transition-colors py-1 ${
                location.pathname === "/services" ? activeClass : ""
              }`}
            >
              SERVICES
            </Link>
          </li>
          <li>
            <Link 
              to="/pricing" 
              className={`hover:text-[#fcba03] transition-colors py-1 ${
                location.pathname === "/pricing" ? activeClass : ""
              }`}
            >
              PRICING
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={`hover:text-[#fcba03] transition-colors py-1 ${
                location.pathname === "/contact" ? activeClass : ""
              }`}
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: User Actions / Icons */}
      <div className="flex-shrink-0 flex items-center gap-4 sm:gap-6">
        {currentUser?.user && (
          <Link to="/notifications" className="relative group">
            <div
              className={`p-2 rounded-full transition-all duration-300 hover:bg-white/10 ${
                location.pathname === "/notifications" ? "text-[#FFD700] scale-110" : "text-white"
              }`}
              title="Notifications"
            >
              <Bell size={22} className="group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px] border-2 border-[#8D1C21]">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        )}
        
        {currentUser?.user ? (
          <Link to="/customer-profile" className="group">
            <div
              className={`p-2 rounded-full transition-all duration-300 hover:bg-white/10 ${
                location.pathname === "/customer-profile" ? "text-[#FFD700] scale-110" : "text-white"
              }`}
              title="Profile"
            >
              <User size={22} />
            </div>
          </Link>
        ) : (
          <Link to="/sign-in">
            <button className="bg-[#FFD700] hover:bg-[#fcba03] text-[#8D1C21] font-bold py-2 px-4 rounded-full text-xs sm:text-sm tracking-widest transition-all active:scale-95 shadow-lg">
              LOGIN
            </button>
          </Link>
        )}

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </div>
    </nav>
  );
}

export default HeaderNav;
