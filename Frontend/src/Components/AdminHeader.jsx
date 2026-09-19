import React, { useEffect, useState } from "react";
import { Search, Bell, Settings, LogOut, Maximize, Minimize } from "lucide-react";
import { motion } from "framer-motion";

function AdminHeader({ title = "Welcome back, Admin", subtitle = "Overview of Viwahaa Matrimony's performance today.", searchValue = "", onSearchChange }) {
  const [userName, setUserName] = useState("Admin");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkUserInfo = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.user_type_id === 3 ? "Staff" : "Admin");
        }
      } catch (error) {
        console.error("Error checking user info:", error);
      }
    };
    checkUserInfo();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-8 bg-white border-b border-slate-100">
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          {subtitle}
        </p>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7C1625] transition-colors" />
          <input
            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 w-full md:w-72 focus:ring-2 focus:ring-[#7C1625]/20 focus:border-[#7C1625] focus:bg-white transition-all text-sm font-medium outline-none"
            placeholder="Search profiles, IDs..."
            type="text"
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors hidden sm:flex"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
