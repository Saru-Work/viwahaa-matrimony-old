import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  MapPin,
  Briefcase,
  ChevronRight,
  User,
  Heart,
  Clock,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useSocket } from "../Context/SocketContext";
import { API } from "../utils/api";

const Notifications = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { setUnreadCount, socket } = useSocket();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!currentUser?.user?.id) return;
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch(`${API}/api/user/notifications/${currentUser.user.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        
        // Mark as read after fetching
        if (data.notifications.some(n => n.is_read === 0)) {
          await fetch(`${API}/api/user/mark-notifications-read/${currentUser.user.id}`, {
            method: 'PUT'
          });
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [currentUser?.user?.id, setUnreadCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time incoming and removed interests
  useEffect(() => {
    if (socket) {
      const handleNewNotification = () => {
        fetchNotifications(true); // Fetch silently in background
      };

      const handleInterestRemoved = (data) => {
        setNotifications((prevNotifications) => 
          prevNotifications.filter(
            (notification) => notification.id !== data.senderUserId
          )
        );
      };

      socket.on("notification_received", handleNewNotification);
      socket.on("interest_removed", handleInterestRemoved);

      return () => {
        socket.off("notification_received", handleNewNotification);
        socket.off("interest_removed", handleInterestRemoved);
      };
    }
  }, [socket, fetchNotifications]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100">
      
      {/* Header Section */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-20 px-4">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Bell size={32} className="text-accent" />
            </div>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter mb-4">
            User <span className="text-accent">Notifications</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">
            Stay updated with people who are interested in your profile.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] h-32 animate-pulse shadow-sm border border-slate-100 dark:border-slate-800"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Bell size={40} />
            </div>
            <h3 className="text-2xl font-black mb-3">No notifications yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">When someone expresses interest in your profile, you&apos;ll see it here.</p>
            <button 
              onClick={() => navigate("/featured-profiles")}
              className="h-14 px-10 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Discover Profiles
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification, idx) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 cursor-pointer"
                onClick={() => navigate(`/single-profile/${notification.id}`)}
              >
                {/* Profile Image */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-50 dark:border-slate-800">
                    <img
                      src={notification.profile_img ? `/uploads/${notification.profile_img}` : "https://via.placeholder.com/150"}
                      alt={notification.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=User"; }}
                    />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${notification.notification_type === 'preference_match' ? 'bg-amber-500' : 'bg-accent'} text-white rounded-lg flex items-center justify-center shadow-lg transform rotate-12`}>
                    {notification.notification_type === 'preference_match' ? (
                      <Sparkles size={16} fill="currentColor" />
                    ) : (
                      <Heart size={16} fill="currentColor" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-grow text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                      {notification.name}
                    </h4>
                    <span className="hidden sm:inline w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                    <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">
                      Member ID: {notification.member_id}
                    </span>
                    {notification.notification_type === 'preference_match' && (
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-tighter">
                        Preference Match
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-slate-300" />
                      {notification.age} Yrs • {notification.gender}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-slate-300" />
                      {notification.occupation || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-300" />
                      {notification.country_of_resident}
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    {formatDate(notification.notified_at)}
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black text-primary hover:text-accent transition-colors uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Profile
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
