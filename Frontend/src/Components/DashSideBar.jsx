import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Wallet, 
  Settings, 
  LogOut,
  User,
  Calendar,
  Image as ImageIcon,
  Heart
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import logo from "../assets/Logo/logo.jpg";

const DashSideBar = ({ onNavItemClick, activeSection, pendingVerificationsCount = 18 }) => {
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserType = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserType(parsedUser.user_type_id);
          setUserName(`${parsedUser.first_name || ""} ${parsedUser.last_name || ""}`.trim() || "Admin");
          setUserRole(parsedUser.user_type_id === 3 ? "Staff" : "Super Admin");
        } else if (localStorage.getItem("isStaff") === "true") {
          setUserType(3);
          setUserName("Staff User");
          setUserRole("Staff");
        } else if (localStorage.getItem("isAdmin") === "true") {
          setUserType(1);
          setUserName("Admin User");
          setUserRole("Super Admin");
        }
      } catch (error) {
        console.error("Error checking user type:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, []);

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/admin-sign-in");
  };

  const isStaff = userType === 3;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "User Management", icon: User },
    { id: "admin-success-stories", label: "Success Stories", icon: BookOpen },
  ];

  const moreItems = [
    { id: "staff", label: "Staff Management", icon: Users, hide: isStaff },
    { id: "bookings", label: "Package Bookings", icon: Calendar, hide: isStaff },
    { id: "discountpackage", label: "Discount Package", icon: Calendar, hide: isStaff },
    { id: "heroimages", label: "Hero Images", icon: ImageIcon, hide: isStaff },
    { id: "interested", label: "Interested", icon: Heart },
    { id: "profileinterested", label: "Profile Interested", icon: Heart },
    { id: "defaultpreferences", label: "Default Partner Pref", icon: Settings, hide: isStaff },
    { id: "defaultimages", label: "Default Images", icon: ImageIcon, hide: isStaff },
    { id: "admin-wedding-gallery", label: "Wedding Gallery", icon: Heart },
    { id: "settings", label: "Account Settings", icon: Settings, hide: isStaff },
  ];

  const upcomingItems = [
    { id: "revenue", label: "Revenue", icon: Wallet },
  ];

  if (loading) {
    return (
      <div className="w-64 h-full bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C1625]"></div>
      </div>
    );
  }

  return (
    <div className="w-64 h-full bg-white flex flex-col shadow-xl">
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#7C1625]/5 flex items-center justify-center overflow-hidden">
          <img
            src={logo}
            alt="Viwahaa Matrimony Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#7C1625] tracking-tight">Viwahaa Matrimony</h1>
          <p className="text-[10px] font-bold text-[#7C1625]/60 uppercase tracking-widest leading-none">Admin Panel</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavItemClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? "bg-[#7C1625] text-white shadow-lg shadow-[#7C1625]/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#7C1625]"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${activeSection === item.id ? "text-white" : "text-slate-400 group-hover:text-[#7C1625]"}`} />
                <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeSection === item.id 
                    ? "bg-white text-[#7C1625]" 
                    : "bg-[#FDF2F2] text-[#7E1617]"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 px-4">
          <div className="h-px bg-slate-100 w-full"></div>
        </div>

        {/* More Items (Optional/Secondary) */}
        <div className="space-y-1 mb-8">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Tools</p>
          {moreItems.filter(item => !item.hide).map((item) => (
            <button
              key={item.id}
              onClick={() => onNavItemClick(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? "bg-[#7C1625]/10 text-[#7C1625]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#7C1625]"
              }`}
            >
              <item.icon className={`w-4 h-4 mr-3 ${activeSection === item.id ? "text-[#7C1625]" : "text-slate-400 group-hover:text-[#7C1625]"}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="my-6 px-4">
          <div className="h-px bg-slate-100 w-full"></div>
        </div>

        <div className="space-y-1 mb-6">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Coming Soon</p>
          {upcomingItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavItemClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                activeSection === item.id
                  ? "bg-[#7C1625]/10 text-[#7C1625]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#7C1625]"
              }`}
            >
              <div className="flex items-center">
                <item.icon className={`w-4 h-4 mr-3 ${activeSection === item.id ? "text-[#7C1625]" : "text-slate-400 group-hover:text-[#7C1625]"}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">Soon</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7C1625]/10 flex items-center justify-center">
              <span className="text-[#7C1625] font-bold text-sm">
                {userName.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">{userRole}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-[#7C1625] hover:bg-white rounded-lg transition-all"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

DashSideBar.propTypes = {
  onNavItemClick: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  pendingVerificationsCount: PropTypes.number,
};

export default DashSideBar;
