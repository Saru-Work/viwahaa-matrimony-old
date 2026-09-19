import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import NewHome from "./Pages/NewHome";
import FeaturedProfiles from "./Pages/FeaturedProfiles";
import InterestedProfilesPage from "./Pages/InterestedProfilesPage";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import PrivateRoute from "./Components/PrivateRoute";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";
import Header from "./Components/Header";
import FloatingAction from "./Components/FloatingAction";
import Footer from "./Components/Footer";
import CustomerProfile from "./Pages/CustomerProfile";
import AboutUs from "./Pages/AboutUs";
import PricingTable from "./Components/Pricing";
import ContactSection from "./Pages/Contact";
import Services from "./Pages/Services";
import Matching from "./Pages/Matching";
import SingleProfile from "./Pages/SingleProfile";
import AdminSignIn from "./Pages/AdminSignIn";
import AdminDashboard from "./Components/AdminDashBoard";
import ProfileView from "./Pages/ProfileView";
import Notifications from "./Pages/Notifications";
import GuestSearch from "./Pages/GuestSearch";


import { SocketProvider, useSocket } from "./Context/SocketContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const { socket } = useSocket();
  const isDashboardRoute = location.pathname === "/dashboard";
  const isAdminSignInRoute = location.pathname === "/admin-sign-in";
  const isNewHomeRoute = location.pathname === "/";
  const isProfileViewRoute = location.pathname === "/profile-view";

  useEffect(() => {
    if (socket) {
      socket.on("notification_received", (data) => {
        toast.info(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      return () => {
        socket.off("notification_received");
      };
    }
  }, [socket]);

  return (
    <>
      <ToastContainer />
      {!isDashboardRoute && !isAdminSignInRoute && !isProfileViewRoute && (
        <Header />
      )}
      <Routes>
        <Route path="/old-home" element={<Home />} />
        <Route path="/" element={<NewHome />} />
        <Route path="/featured-profiles" element={<FeaturedProfiles />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/admin-sign-in" element={<AdminSignIn />} />

        <Route element={<PrivateRoute />}>
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="single-profile/:id" element={<SingleProfile />} />
          <Route
            path="/interested-profiles"
            element={<InterestedProfilesPage />}
          />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile-view" element={<ProfileView />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<PricingTable />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/guest-search" element={<GuestSearch />} />

      </Routes>
      {!isDashboardRoute && !isNewHomeRoute && !isProfileViewRoute && (
        <FloatingAction />
      )}
      {!isDashboardRoute &&
        !isAdminSignInRoute &&
        !isNewHomeRoute &&
        !isProfileViewRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </BrowserRouter>
  );
}
