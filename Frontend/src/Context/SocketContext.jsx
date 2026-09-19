import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { API } from "../utils/api";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:7000"); // Matches backend port
    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  useEffect(() => {
    if (socket && currentUser?.user) {
      socket.emit("user_connected", { userId: currentUser.user.id });

      // Fetch initial unread count
      const fetchUnreadCount = async () => {
        try {
          const res = await fetch(`${API}/api/user/unread-notifications-count/${currentUser.user.id}`);
          const data = await res.json();
          if (data.success) {
            setUnreadCount(data.count);
          }
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      };
      
      fetchUnreadCount();

      // Listen for new notifications to increment count
      socket.on("notification_received", () => {
        setUnreadCount(prev => prev + 1);
      });

      // Listen for removed interest to decrement count
      socket.on("interest_removed", () => {
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
      });

      return () => {
        socket.off("notification_received");
        socket.off("interest_removed");
      };
    }
  }, [socket, currentUser]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};
