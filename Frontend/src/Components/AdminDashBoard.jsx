
import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import DashSideBar from "./DashSideBar";
import AdminHeader from "./AdminHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { API } from "../utils/api";

// Lazy load components that still exist as separate files
const AdminProfiles = lazy(() => import("../Pages/admin/AdminProfiles"));
const AdminPackageBookings = lazy(() =>
  import("../Pages/admin/AdminPackageBookings")
);
const AdminDefaultImages = lazy(() => import("../Pages/admin/AdminDefaultImages"));
const AdminInterested = lazy(() => import("../Pages/admin/AdminInterested"));
const AdminProfileInterested = lazy(() =>
  import("../Pages/admin/AdminProfileInterested")
);
const AdminStaff = lazy(() => import("../Pages/admin/AdminStaff"));
const DiscountPackage = lazy(() => import("../Pages/admin/DiscountPackage"));
const AdminHeroImages = lazy(() => import("../Pages/admin/AdminHeroImages"));
const AdminSuccessStories = lazy(() => import("../Pages/admin/AdminSuccessStories"));
const AdminWeddingGallery = lazy(() => import("../Pages/admin/AdminWeddingGallery"));
const AdminDefaultPreferences = lazy(() => import("../Pages/admin/AdminDefaultPreferences"));
const AdminSettings = lazy(() => import("../Pages/admin/AdminSettings"));

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    profileCount: 0,
    bookingsCount: 0,
    intrestCount: 0,
    totalEarnings: 0,
    customers: [],
    allCustomers: [],
    loading: true,
    searchKey: "",
    currentPage: 1,
    itemsPerPage: 10,
  });

  const [activeSection, setActiveSection] = useState("dashboard");
  const [userType, setUserType] = useState(null);

  // ---------- Success Stories state ----------
  const [storyFormData, setStoryFormData] = useState({
    partner1Name: "",
    partner2Name: "",
    quote: "",
    marriageMonth: "",
    marriageYear: "",
    location: "",
  });
  const [storyPhotoPreview, setStoryPhotoPreview] = useState(null);
  const [storyPhotoFile, setStoryPhotoFile] = useState(null);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storySubmitting, setStorySubmitting] = useState(false);

  // ---------- Verifications filter state ----------
  const [verifSearchQuery, setVerifSearchQuery] = useState("");
  const [verificationTypeFilter, setVerificationTypeFilter] = useState("All Verification Types");
  const [verifStatusFilter, setVerifStatusFilter] = useState("Status: All");

  // ---------- User Management state ----------
  const [userMgmtSearch, setUserMgmtSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [genderFilter, setGenderFilter] = useState("Gender");
  const [religionFilter, setReligionFilter] = useState("Religion");
  const [userStatusFilter, setUserStatusFilter] = useState("Status");
  const [userMgmtPage, setUserMgmtPage] = useState(1);
  const userMgmtItemsPerPage = 10;
  const [userMgmtData, setUserMgmtData] = useState({
    allUsers: [],
    loading: true,
  });

  // ---------- Add User state ----------
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [religions, setReligions] = useState([]);
  const [addUserSubmitting, setAddUserSubmitting] = useState(false);
  const [addUserFormData, setAddUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    religion: "",
    cast: "",
    occupation: "",
    country_of_resident: "",
  });

  const casts = [
    "Mixed Jaffna Vellalar",
    "Vellalar",
    "Other Vellatar",
    "Viswakulam",
    "Mukkulanthor",
    "Koviyor",
    "Kurukulam",
    "Bhramin",
    "Kounder",
    "Veera Saiva Vellalar",
    "Kujavar",
    "Chettiar",
    "Devar",
    "Kaller",
    "Malayalee",
    "Mukkuwar",
    "Muthaliyar",
    "Naiyudu",
    "Nadar",
    "Pallar",
    "Parawar",
    "Senkunthar",
    "Siviyar",
    "Dadar",
    "Sayakkarar",
    "Nalavar",
    "Agamiliyar",
    "Dobi",
    "Other",
  ];

  const occupations = [
    "Student",
    "Teacher",
    "Engineer",
    "Doctor",
    "Nurse",
    "Programmer",
    "Artist",
    "Scientist",
    "Lawyer",
    "Chef",
    "Entrepreneur",
    "Accountant",
    "Writer",
    "Police Officer",
    "Firefighter",
    "Pilot",
    "Architect",
    "Pharmacist",
    "Salesperson",
    "Athlete",
    "Musician",
    "Journalist",
    "Psychologist",
    "Mechanic",
    "Designer",
    "Veterinarian",
    "Electrician",
    "Other",
  ];

  // ---------- User Management Action state ----------
  const [selectedMgmtUser, setSelectedMgmtUser] = useState(null);
  const [showMgmtViewModal, setShowMgmtViewModal] = useState(false);
  const [showMgmtDeleteModal, setShowMgmtDeleteModal] = useState(false);
  const [mgmtDeleting, setMgmtDeleting] = useState(false);
  const [showMgmtEditModal, setShowMgmtEditModal] = useState(false);
  const [editUserSubmitting, setEditUserSubmitting] = useState(false);
  const [editUserFormData, setEditUserFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    gender: "",
    religion: "",
    d_o_b: "",
    cast: "",
    occupation: "",
    country_of_resident: "",
  });

  // ---------- Dashboard revenue filter ----------
  const [revenueFilter, setRevenueFilter] = useState("Last 6 Months");

  // Check user type from localStorage
  useEffect(() => {
    const checkUserType = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserType(parsedUser.user_type_id);
        } else if (localStorage.getItem("isStaff") === "true") {
          setUserType(3); // Staff user_type_id
        } else if (localStorage.getItem("isAdmin") === "true") {
          setUserType(1); // Admin user_type_id
        } else {
          const userTypeId = localStorage.getItem("userTypeId");
          if (userTypeId) {
            setUserType(parseInt(userTypeId));
          }
        }
      } catch (error) {
        console.error("Error checking user type:", error);
      }
    };

    checkUserType();
  }, []);

  const isStaff = userType === 3;
  const isAdmin = userType === 1;

  // Format currency function
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    if (num >= 10000000) {
      return `Rs.${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `Rs.${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
      return `Rs.${(num / 1000).toFixed(1)}K`;
    }
    return `Rs.${num.toFixed(0)}`;
  };

  // Memoize formatted earnings
  const formattedEarnings = useMemo(
    () => formatCurrency(dashboardData.totalEarnings),
    [dashboardData.totalEarnings]
  );

  // Helper to safely parse JSON from a response
  const safeJsonParse = async (response) => {
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${response.url}`);
      return null;
    }
    try {
      return await response.json();
    } catch (e) {
      console.error(`Failed to parse JSON from ${response.url}:`, e);
      return null;
    }
  };

  // Fetch data only when needed
  useEffect(() => {
    if (activeSection === "dashboard") {
      const fetchData = async () => {
        try {
          setDashboardData((prev) => ({ ...prev, loading: true }));

          // For staff users, don't fetch earnings data
          const fetchPromises = [
            fetch(`${API}/api/admin/profiles`),
            fetch(`${API}/api/admin/bookings/count`),
            fetch(`${API}/api/admin/interests/count`),
          ];

          // Only admin users fetch earnings data
          if (isAdmin) {
            fetchPromises.push(fetch(`${API}/api/admin/earnings`));
          }

          const responses = await Promise.all(fetchPromises);
          const [profileRes, bookingsRes, intrestRes, earningsRes] = responses;

          const [profileData, bookingsData, intrestData] = await Promise.all([
            safeJsonParse(profileRes),
            safeJsonParse(bookingsRes),
            safeJsonParse(intrestRes),
          ]);

          let earningsData = { amount: 0 };
          if (isAdmin && earningsRes) {
            earningsData = (await safeJsonParse(earningsRes)) || { amount: 0 };
          }

          const profiles = Array.isArray(profileData) ? profileData : [];

          setDashboardData((prev) => ({
            ...prev,
            profileCount: profiles.length || 0,
            bookingsCount: bookingsData?.count || 0,
            intrestCount: intrestData?.count || 0,
            totalEarnings: earningsData?.amount || 0,
            customers: profiles,
            allCustomers: profiles,
            loading: false,
          }));
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          setDashboardData((prev) => ({ ...prev, loading: false }));
        }
      };
      fetchData();
    }
  }, [activeSection, isAdmin]);

  // Fetch users for User Management section
  const fetchUsers = async () => {
    try {
      setUserMgmtData((prev) => ({ ...prev, loading: true }));
      const res = await fetch(`${API}/api/admin/profiles`);
      const data = await res.json();
      setUserMgmtData({ allUsers: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUserMgmtData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (activeSection === "usermanagement") {
      fetchUsers();
    }
  }, [activeSection]);

  // Fetch religions for Add User form
  useEffect(() => {
    const fetchReligions = async () => {
      try {
        const response = await fetch(`${API}/api/religions`);
        const data = await response.json();
        if (data.success) {
          setReligions(data.data);
        }
      } catch (error) {
        console.error("Error fetching religions:", error);
      }
    };
    fetchReligions();
  }, []);

  // User Management: filtered + paginated users
  const filteredMgmtUsers = useMemo(() => {
    let list = userMgmtData.allUsers;
    if (userMgmtSearch.trim()) {
      const term = userMgmtSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.member_id?.toLowerCase().includes(term) ||
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.contact_no?.includes(userMgmtSearch)
      );
    }
    if (genderFilter !== "Gender") {
      list = list.filter((u) => u.gender?.toLowerCase() === genderFilter.toLowerCase());
    }
    if (religionFilter !== "Religion") {
      list = list.filter((u) => u.religion?.toLowerCase() === religionFilter.toLowerCase());
    }
    return list;
  }, [userMgmtData.allUsers, userMgmtSearch, genderFilter, religionFilter]);

  const userMgmtTotalPages = Math.ceil(filteredMgmtUsers.length / userMgmtItemsPerPage);

  const paginatedMgmtUsers = useMemo(() => {
    const start = (userMgmtPage - 1) * userMgmtItemsPerPage;
    return filteredMgmtUsers.slice(start, start + userMgmtItemsPerPage);
  }, [filteredMgmtUsers, userMgmtPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setUserMgmtPage(1);
  }, [userMgmtSearch, genderFilter, religionFilter, roleFilter, userStatusFilter]);

  const searchCustomers = useCallback(() => {
    const searchTerm = dashboardData.searchKey.toLowerCase();

    const filtered = dashboardData.allCustomers.filter(
      (customer) =>
        customer.member_id.toLowerCase().includes(searchTerm) ||
        `${customer.first_name} ${customer.last_name}`
          .toLowerCase()
          .includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.contact_no.includes(dashboardData.searchKey)
    );

    setDashboardData((prev) => ({
      ...prev,
      customers: filtered,
      currentPage: 1,
    }));
  }, [dashboardData.searchKey, dashboardData.allCustomers]);

  // Search optimization with debounce
  useEffect(() => {
    if (dashboardData.searchKey.trim() === "") {
      setDashboardData((prev) => ({
        ...prev,
        customers: [...prev.allCustomers],
        currentPage: 1,
      }));
      return;
    }

    const timer = setTimeout(() => {
      searchCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [dashboardData.searchKey, searchCustomers]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setDashboardData((prev) => ({ ...prev, searchKey: value }));
  };

  // Pagination logic
  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (dashboardData.currentPage - 1) * dashboardData.itemsPerPage;
    return dashboardData.customers.slice(
      startIndex,
      startIndex + dashboardData.itemsPerPage
    );
  }, [
    dashboardData.customers,
    dashboardData.currentPage,
    dashboardData.itemsPerPage,
  ]);

  const totalPages = Math.ceil(
    dashboardData.customers.length / dashboardData.itemsPerPage
  );

  const handlePageChange = (page) => {
    setDashboardData((prev) => ({ ...prev, currentPage: page }));
  };

  // Navigation
  const handleNavItemClick = (section) => {
    setActiveSection(section);
  };

  // ---------- Story handlers ----------
  const handleStoryChange = (e) => {
    const { name, value } = e.target;
    setStoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoryPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoryPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setStoryPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Fetch stories from API
  const fetchStories = async () => {
    try {
      setStoriesLoading(true);
      const res = await fetch(`${API}/api/success-stories/all`);
      if (!res.ok) {
        console.error(`Failed to fetch stories: ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        // Map backend field names to the format expected by the UI
        const mappedStories = (data.stories || []).map((story) => ({
          id: story.id,
          partner1_name: story.couple_name?.split(' & ')[0] || '',
          partner2_name: story.couple_name?.split(' & ')[1] || '',
          quote: story.feedback || '',
          marriage_month: story.wedding_date?.split(' ')[0] || '',
          marriage_year: story.wedding_date?.split(' ')[1] || '',
          location: story.location || '',
          photo: story.image_path || null,
          status: story.is_active ? 'Published' : 'Draft',
        }));
        setStories(mappedStories);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "stories" || activeSection === "dashboard") {
      fetchStories();
    }
  }, [activeSection]);

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    try {
      setStorySubmitting(true);
      const formData = new FormData();
      // Map frontend form fields to backend expected field names
      const coupleName = `${storyFormData.partner1Name} & ${storyFormData.partner2Name}`;
      const weddingDate = `${storyFormData.marriageMonth} ${storyFormData.marriageYear}`;
      formData.append("couple_name", coupleName);
      formData.append("feedback", storyFormData.quote);
      formData.append("wedding_date", weddingDate);
      formData.append("location", storyFormData.location);
      if (storyPhotoFile) formData.append("image", storyPhotoFile);

      const res = await fetch(`${API}/api/success-stories`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error(`Failed to add story: ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data.success) {
        await fetchStories();
        setStoryFormData({ partner1Name: "", partner2Name: "", quote: "", marriageMonth: "", marriageYear: "", location: "" });
        setStoryPhotoPreview(null);
        setStoryPhotoFile(null);
      }
    } catch (error) {
      console.error("Failed to add story:", error);
    } finally {
      setStorySubmitting(false);
    }
  };

  const handleStoryDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`${API}/api/success-stories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStories((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const storyMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const storyYears = Array.from({ length: 10 }, (_, i) => (2020 + i).toString());

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserSubmitting(true);
    try {
      const response = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addUserFormData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User added successfully!");
        setShowAddUserModal(false);
        setAddUserFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          dateOfBirth: "",
          gender: "",
          religion: "",
          cast: "",
          occupation: "",
          country_of_resident: "",
        });
        fetchUsers();
      } else {
        alert(data.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Something went wrong");
    } finally {
      setAddUserSubmitting(false);
    }
  };

  const handleMgmtEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMgmtEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMgmtUser) return;
    setEditUserSubmitting(true);
    try {
      const response = await fetch(`${API}/api/admin/profiles/${selectedMgmtUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editUserFormData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User updated successfully!");
        setShowMgmtEditModal(false);
        fetchUsers();
      } else {
        alert(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Something went wrong");
    } finally {
      setEditUserSubmitting(false);
    }
  };

  // Skeleton loading component
  const renderSkeleton = () => (
    <div className="p-4 md:p-8">
      <div className="mb-4">
        <Skeleton height={30} width={200} />
        <Skeleton height={20} width={150} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white dark:bg-zinc-900 rounded-xl p-6">
            <Skeleton height={80} />
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden">
        <div className="p-4 border-b"><Skeleton height={40} /></div>
        <Skeleton height={300} />
      </div>
    </div>
  );

  // =============== DASHBOARD SECTION (from adminDashboardNew) ===============
  const renderDashboardContent = () => {
    const metrics = [
      {
        icon: "group",
        label: "Total Users",
        value: dashboardData.profileCount.toLocaleString(),
        change: "+12%",
        badgeClass: "text-emerald-500 bg-emerald-50",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      },
      {
        icon: "card_membership",
        label: "Active Subscriptions",
        value: dashboardData.bookingsCount.toLocaleString(),
        change: "+5.2%",
        badgeClass: "text-emerald-500 bg-emerald-50",
        iconBg: "bg-[#d4af37]/10",
        iconColor: "text-[#d4af37]",
      },
      {
        icon: "pending_actions",
        label: "Pending Verifications",
        value: dashboardData.intrestCount.toLocaleString(),
        change: "Urgent",
        badgeClass: "text-amber-600 bg-amber-50",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
      },
      ...(isAdmin
        ? [
            {
              icon: "payments",
              label: "Total Revenue",
              value: formattedEarnings,
              change: "+18%",
              badgeClass: "text-emerald-500 bg-emerald-50",
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
            },
          ]
        : []),
    ];

    const revenueData = [
      { month: "Jan", height: "40%", value: "Rs.12L" },
      { month: "Feb", height: "60%", value: "Rs.14L" },
      { month: "Mar", height: "55%", value: "Rs.13.5L" },
      { month: "Apr", height: "75%", value: "Rs.16.2L" },
      { month: "May", height: "65%", value: "Rs.15L" },
      { month: "Jun", height: "90%", value: "Rs.18.4L", current: true },
    ];

    return (
      <>
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${metric.iconBg} flex items-center justify-center ${metric.iconColor}`}
                >
                  <span className="material-symbols-outlined">{metric.icon}</span>
                </div>
                <span
                  className={`${metric.badgeClass} text-xs font-bold px-2 py-1 rounded-full`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {metric.label}
              </p>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-1 truncate" style={{fontSize: metric.value.length > 10 ? '1.125rem' : '1.5rem'}}>
                {metric.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Recent Stories */}
        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-primary/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Revenue Overview
                </h4>
                <select
                  className="bg-slate-50 dark:bg-zinc-800 border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary/20"
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                >
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-[280px] w-full flex items-end gap-4 px-4 pb-8">
                {revenueData.map((bar, index) => (
                  <div
                    key={index}
                    className={`flex-1 ${
                      bar.current ? "bg-primary" : "bg-primary/10 hover:bg-primary"
                    } transition-all rounded-t-lg group relative`}
                    style={{ height: bar.height }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded transition-opacity">
                      {bar.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                {revenueData.map((bar, index) => (
                  <span key={index}>{bar.month}</span>
                ))}
              </div>
            </div>

            {/* Recent Success Stories */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-primary/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Recent Stories
                </h4>
                <button
                  onClick={() => setActiveSection("stories")}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-6">
                {stories.slice(0, 3).map((story) => (
                  <div key={story.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center bg-primary/10">
                      {story.photo ? (
                        <img src={`/uploads/${story.photo}`} alt="Couple" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-primary/30">photo_camera</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {story.partner1_name} & {story.partner2_name}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        &ldquo;{story.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-primary/5 flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Customer Profiles
            </h4>
            <p className="text-xs font-medium text-slate-500">
              {dashboardData.customers.length} total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-primary/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">No</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Member ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Number</th>
                  )}
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Current Plan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Expiry</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {paginatedCustomers.map((customer, index) => {
                  const isBasic = !customer.current_plan || customer.current_plan.trim() === "" || customer.current_plan === "Basic Plan";
                  const isExpired = customer.exp_date && new Date(customer.exp_date) < new Date();
                  return (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {(dashboardData.currentPage - 1) * dashboardData.itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {customer.member_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {customer.email}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {customer.contact_no}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {customer.current_plan && customer.current_plan.trim() !== "" ? customer.current_plan : "Basic Plan"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isBasic ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">Unpaid</span>
                      ) : customer.exp_date ? (
                        <span className={isExpired ? "text-red-600" : "text-slate-600 dark:text-slate-400"}>
                          {customer.exp_date.split("T")[0]}
                        </span>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isBasic ? (
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">Unpaid</span>
                      ) : !isExpired ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">Expired</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-between border-t border-primary/5">
              <p className="text-xs font-medium text-slate-500">
                Showing {((dashboardData.currentPage - 1) * dashboardData.itemsPerPage) + 1} to{" "}
                {Math.min(dashboardData.currentPage * dashboardData.itemsPerPage, dashboardData.customers.length)} of{" "}
                {dashboardData.customers.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, dashboardData.currentPage - 1))}
                  disabled={dashboardData.currentPage === 1}
                  className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-primary/5 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (dashboardData.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (dashboardData.currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = dashboardData.currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 text-xs font-bold rounded-lg border ${
                        dashboardData.currentPage === pageNum
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 hover:bg-primary/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, dashboardData.currentPage + 1))}
                  disabled={dashboardData.currentPage === totalPages}
                  className="px-3 py-1 text-xs font-bold rounded-lg border border-primary text-primary hover:bg-primary/5 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  // =============== VERIFICATIONS SECTION (from Newprofileverification) ===============
  const renderVerificationsContent = () => {
    const stats = [
      { icon: "pending_actions", label: "Pending Requests", value: "128", badge: "+14% vs lw", badgeColor: "text-blue-600", iconBg: "bg-blue-100 text-blue-600" },
      { icon: "visibility", label: "In Review", value: "42", badge: "8 In-process", badgeColor: "text-amber-600", iconBg: "bg-amber-100 text-amber-600" },
      { icon: "check_circle", label: "Approved Today", value: "1,482", badge: "45 Today", badgeColor: "text-emerald-600", iconBg: "bg-emerald-100 text-emerald-600" },
      { icon: "cancel", label: "Rejected Total", value: "89", badge: "-2% vs lw", badgeColor: "text-rose-600", iconBg: "bg-rose-100 text-rose-600" },
    ];

    const verifications = [
      { name: "Priya Sharma", email: "sharma.p@email.com", photo: null, initials: "PS", profileId: "VW-90281", verificationType: "ID Proof", verificationDetail: "Aadhar Card • Front & Back", submissionDate: "Oct 24, 2023, 11:45 AM", status: "Pending", statusClass: "bg-blue-100 text-blue-700", actions: ["view", "approve", "reject", "message"] },
      { name: "Arjun Verma", email: "arjun.v@corp.in", photo: null, initials: "AV", profileId: "VW-11042", verificationType: "Education", verificationDetail: "MBA Certificate • IIMB", submissionDate: "Oct 24, 2023, 10:20 AM", status: "In Review", statusClass: "bg-amber-100 text-amber-700", actions: ["view", "approve", "reject", "message"] },
      { name: "Sanya Malhotra", email: "malhotra.s@gmail.com", photo: null, initials: "SM", profileId: "VW-77401", verificationType: "Career Proof", verificationDetail: "Salary Slip • Aug 2023", submissionDate: "Oct 23, 2023, 04:55 PM", status: "Approved", statusClass: "bg-emerald-100 text-emerald-700", actions: ["view", "approved-disabled", "revoke", "message"] },
      { name: "Rohan Das", email: "rohan.das@outlook.com", photo: null, initials: "RD", profileId: "VW-33219", verificationType: "Photo", verificationDetail: "Live Verification Selfie", submissionDate: "Oct 23, 2023, 02:10 PM", status: "Rejected", statusClass: "bg-rose-100 text-rose-700", actions: ["view", "reevaluate", "rejected-disabled", "message"] },
    ];

    const renderVerifActions = (actions) =>
      actions.map((action, idx) => {
        const btnMap = {
          view: { cls: "bg-white border border-primary/20 text-primary hover:bg-primary/10", icon: "visibility", title: "View Documents" },
          approve: { cls: "bg-emerald-100 border border-emerald-200 text-emerald-700 hover:bg-emerald-200", icon: "check", title: "Approve" },
          reject: { cls: "bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-200", icon: "close", title: "Reject" },
          message: { cls: "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200", icon: "chat_bubble", title: "Message User" },
          "approved-disabled": { cls: "bg-emerald-100 border border-emerald-200 text-emerald-700 opacity-50 cursor-not-allowed", icon: "check", title: "Approved", disabled: true },
          revoke: { cls: "bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-200", icon: "history", title: "Revoke Approval" },
          reevaluate: { cls: "bg-emerald-100 border border-emerald-200 text-emerald-700 hover:bg-emerald-200", icon: "refresh", title: "Re-evaluate" },
          "rejected-disabled": { cls: "bg-rose-100 border border-rose-200 text-rose-700 opacity-50 cursor-not-allowed", icon: "close", title: "Rejected", disabled: true },
        };
        const b = btnMap[action];
        if (!b) return null;
        return (
          <button key={idx} className={`p-1.5 rounded-md transition-colors ${b.cls}`} title={b.title} disabled={b.disabled}>
            <span className="material-symbols-outlined text-lg">{b.icon}</span>
          </button>
        );
      });

    return (
      <>
        <div className="flex justify-end mb-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-background-dark border border-primary/20 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-all">
            <span className="material-symbols-outlined text-lg">download</span>
            Export PDF Report
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-background-dark p-6 rounded-xl border border-primary/10 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <span className={`text-xs font-bold ${stat.badgeColor}`}>{stat.badge}</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-extrabold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-background-dark p-4 rounded-xl border border-primary/10 shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div className="relative w-full md:flex-1 md:min-w-[300px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border-primary/10 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary"
              placeholder="Search by Member Name or Profile ID..."
              type="text"
              value={verifSearchQuery}
              onChange={(e) => setVerifSearchQuery(e.target.value)}
            />
          </div>
          <select className="w-full md:w-auto rounded-lg border-primary/10 bg-background-light dark:bg-background-dark text-sm font-medium focus:ring-primary" value={verificationTypeFilter} onChange={(e) => setVerificationTypeFilter(e.target.value)}>
            <option>All Verification Types</option>
            <option>ID Proof (Aadhar/Passport)</option>
            <option>Education (Degree/Cert)</option>
            <option>Career (Pay slips/ID)</option>
            <option>Photo (Selfie/Social)</option>
          </select>
          <select className="w-full md:w-auto rounded-lg border-primary/10 bg-background-light dark:bg-background-dark text-sm font-medium focus:ring-primary" value={verifStatusFilter} onChange={(e) => setVerifStatusFilter(e.target.value)}>
            <option>Status: All</option>
            <option>Status: Pending</option>
            <option>Status: In Review</option>
            <option>Status: Approved</option>
            <option>Status: Rejected</option>
          </select>
          <button className="w-full md:w-auto justify-center bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            Apply Filters
          </button>
        </div>

        {/* Verifications Table */}
        <div className="bg-white dark:bg-background-dark rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-primary/5 text-primary dark:text-accent-gold uppercase text-[11px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Member Info</th>
                  <th className="px-6 py-4">Profile ID</th>
                  <th className="px-6 py-4">Verification Type</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {verifications.map((item, index) => (
                  <tr key={index} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {item.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-slate-500 text-xs">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-medium">{item.profileId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{item.verificationType}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{item.verificationDetail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.submissionDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">{renderVerifActions(item.actions)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-primary/10">
            <p className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 128 results</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed" disabled>Previous</button>
              <button className="px-3 py-1 text-xs font-bold rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // =============== USER MANAGEMENT SECTION (from newuserManagement) ===============
  const renderUserManagementContent = () => {
    if (userMgmtData.loading) return renderSkeleton();

    const getInitials = (first, last) =>
      `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase();

    return (
      <>
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined">person_add</span>
            Add New User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-background-dark/50 p-4 rounded-xl border border-primary/10 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-full md:flex-1 md:min-w-[300px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full pl-10 pr-4 py-2.5 rounded-lg border-primary/10 focus:ring-primary focus:border-primary bg-background-light dark:bg-background-dark/30" placeholder="Search by name, ID or email..." type="text" value={userMgmtSearch} onChange={(e) => setUserMgmtSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              <select className="flex-1 md:flex-none min-w-[120px] rounded-lg border-primary/10 text-sm focus:ring-primary bg-background-light dark:bg-background-dark/30 py-2.5" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option>All Roles</option><option>Premium</option><option>Regular</option>
              </select>
              <select className="flex-1 md:flex-none min-w-[120px] rounded-lg border-primary/10 text-sm focus:ring-primary bg-background-light dark:bg-background-dark/30 py-2.5" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option>Gender</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
              <select className="flex-1 md:flex-none min-w-[120px] rounded-lg border-primary/10 text-sm focus:ring-primary bg-background-light dark:bg-background-dark/30 py-2.5" value={religionFilter} onChange={(e) => setReligionFilter(e.target.value)}>
                <option>Religion</option><option>Hindu</option><option>Muslim</option><option>Sikh</option><option>Christian</option><option>Buddhist</option><option>Jain</option>
              </select>
              <select className="flex-1 md:flex-none min-w-[120px] rounded-lg border-primary/10 text-sm focus:ring-primary bg-background-light dark:bg-background-dark/30 py-2.5" value={userStatusFilter} onChange={(e) => setUserStatusFilter(e.target.value)}>
                <option>Status</option><option>Active</option><option>Pending</option><option>Suspended</option>
              </select>
              <button className="p-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark/50 rounded-xl border border-primary/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-primary/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Name/Photo</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Profile ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Gender</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Religion</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {paginatedMgmtUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No users found.</td>
                  </tr>
                ) : (
                  paginatedMgmtUsers.map((user) => (
                    <tr key={user.id || user.member_id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.member_id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.gender || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.religion || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.contact_no || "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedMgmtUser(user);
                              setShowMgmtViewModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" 
                            title="View Profile"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMgmtUser(user);
                              setEditUserFormData({
                                first_name: user.first_name || "",
                                last_name: user.last_name || "",
                                email: user.email || "",
                                contact_no: user.contact_no || "",
                                gender: user.gender || "",
                                religion: user.religion || "",
                                d_o_b: user.d_o_b ? user.d_o_b.split("T")[0] : "",
                                cast: user.cast || "",
                                occupation: user.occupation || "",
                                country_of_resident: user.country_of_resident || "",
                              });
                              setShowMgmtEditModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" 
                            title="Edit User"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedMgmtUser(user);
                              setShowMgmtDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" 
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {userMgmtTotalPages > 0 && (
            <div className="px-6 py-4 bg-background-light/50 dark:bg-background-dark/80 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-primary">{((userMgmtPage - 1) * userMgmtItemsPerPage) + 1}</span> to{" "}
                <span className="font-bold text-primary">{Math.min(userMgmtPage * userMgmtItemsPerPage, filteredMgmtUsers.length)}</span> of{" "}
                <span className="font-bold text-primary">{filteredMgmtUsers.length}</span> users
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setUserMgmtPage((p) => Math.max(1, p - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/10 hover:bg-primary/5 disabled:opacity-50" disabled={userMgmtPage === 1}>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(5, userMgmtTotalPages) }, (_, i) => {
                  let pageNum;
                  if (userMgmtTotalPages <= 5) {
                    pageNum = i + 1;
                  } else if (userMgmtPage <= 3) {
                    pageNum = i + 1;
                  } else if (userMgmtPage >= userMgmtTotalPages - 2) {
                    pageNum = userMgmtTotalPages - 4 + i;
                  } else {
                    pageNum = userMgmtPage - 2 + i;
                  }
                  return (
                    <button key={pageNum} onClick={() => setUserMgmtPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${userMgmtPage === pageNum ? "bg-primary text-white shadow-sm" : "border border-primary/10 hover:bg-primary/5"}`}>
                      {pageNum}
                    </button>
                  );
                })}
                {userMgmtTotalPages > 5 && userMgmtPage < userMgmtTotalPages - 2 && (
                  <>
                    <span className="px-2 text-slate-400">...</span>
                    <button onClick={() => setUserMgmtPage(userMgmtTotalPages)} className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${userMgmtPage === userMgmtTotalPages ? "bg-primary text-white shadow-sm" : "border border-primary/10 hover:bg-primary/5"}`}>
                      {userMgmtTotalPages}
                    </button>
                  </>
                )}
                <button onClick={() => setUserMgmtPage((p) => Math.min(userMgmtTotalPages, p + 1))} className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/10 hover:bg-primary/5 disabled:opacity-50" disabled={userMgmtPage === userMgmtTotalPages}>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  // =============== SUCCESS STORIES SECTION (from AdminSuccessStory) ===============
  const renderSuccessStoriesContent = () => (
    <>
      <div className="mb-4"></div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-background-dark rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-primary/5 border-b border-primary/10">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Add New Story
              </h3>
            </div>
            <form onSubmit={handleStorySubmit} className="p-6 space-y-5">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Couple Photo</label>
                <div
                  className="relative w-full h-48 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
                  onClick={() => document.getElementById("story-photo-upload").click()}
                >
                  {storyPhotoPreview ? (
                    <>
                      <img src={storyPhotoPreview} alt="Couple preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl">edit</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary/40 text-4xl mb-2">add_a_photo</span>
                      <p className="text-xs text-slate-500 font-medium">Click to upload couple photo</p>
                      <p className="text-[10px] text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                    </>
                  )}
                  <input id="story-photo-upload" type="file" accept="image/*" className="hidden" onChange={handleStoryPhotoChange} />
                </div>
              </div>

              {/* Partner Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Partner 1 Name</label>
                  <input type="text" name="partner1Name" value={storyFormData.partner1Name} onChange={handleStoryChange} placeholder="e.g. Senthil" className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Partner 2 Name</label>
                  <input type="text" name="partner2Name" value={storyFormData.partner2Name} onChange={handleStoryChange} placeholder="e.g. Janani" className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm" required />
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Testimonial Quote</label>
                <textarea name="quote" value={storyFormData.quote} onChange={handleStoryChange} placeholder="Share the couple's love story..." rows={4} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm resize-none" required />
                <p className="text-[10px] text-slate-400 mt-1 text-right">{storyFormData.quote.length}/300 characters</p>
              </div>

              {/* Marriage Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Marriage Month</label>
                  <select name="marriageMonth" value={storyFormData.marriageMonth} onChange={handleStoryChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm" required>
                    <option value="">Select Month</option>
                    {storyMonths.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Marriage Year</label>
                  <select name="marriageYear" value={storyFormData.marriageYear} onChange={handleStoryChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm" required>
                    <option value="">Select Year</option>
                    {storyYears.map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">location_on</span>
                  <input type="text" name="location" value={storyFormData.location} onChange={handleStoryChange} placeholder="e.g. Chennai, Toronto" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-primary/10 bg-background-light dark:bg-background-dark/30 focus:ring-primary focus:border-primary text-sm" required />
                </div>
              </div>

              <button type="submit" disabled={storySubmitting} className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined text-lg">{storySubmitting ? "hourglass_empty" : "publish"}</span>
                {storySubmitting ? "Adding..." : "Add Success Story"}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Stories List */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-background-dark rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                Published Stories
              </h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {stories.length} Stories
              </span>
            </div>
            <div className="divide-y divide-primary/5">
              {storiesLoading ? (
                <div className="p-8 text-center text-slate-400">Loading stories...</div>
              ) : stories.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No success stories yet. Add one!</div>
              ) : stories.map((story) => (
                <div key={story.id} className="p-6 hover:bg-primary/5 transition-colors group">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                      {story.photo ? (
                        <img src={`/uploads/${story.photo}`} alt="Couple" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <span className="material-symbols-outlined text-primary/30 text-3xl">photo_camera</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-sm">{story.partner1_name} & {story.partner2_name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${story.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {story.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        Married {story.marriage_month} {story.marriage_year}, {story.location}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2">
                        &ldquo;{story.quote}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-start gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleStoryDelete(story.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderComingSoonContent = (section) => {
    const config = {
      revenue: {
        title: "Revenue Insights Coming Soon",
        subtitle: "Match growth with meaningful numbers",
        points: [
          "Monthly matchmaking revenue trends",
          "Package conversion journey for premium plans",
          "Regional analytics for wedding-ready markets",
        ],
      },
      settings: {
        title: "Smart Settings Coming Soon",
        subtitle: "Fine-tune your matrimony experience",
        points: [
          "Custom matchmaking preference rules",
          "Automated profile moderation controls",
          "Notification workflows for families and staff",
        ],
      },
    };

    const current = config[section] || config.settings;

    return (
      <div className="min-h-[65vh] flex items-center justify-center py-6">
        <div className="w-full max-w-4xl rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-orange-50 shadow-lg overflow-hidden">
          <div className="px-6 py-5 md:px-10 md:py-8 border-b border-rose-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500">Viwahaa Matrimony</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{current.title}</h3>
              <p className="text-slate-600 text-sm md:text-base mt-1">{current.subtitle}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/80 border border-rose-100 px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-rose-500">favorite</span>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Coming Soon</span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {current.points.map((point) => (
                <div key={point} className="rounded-2xl bg-white border border-rose-100 p-4 md:p-5 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-lg">diamond</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl bg-rose-900 text-white p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Building features with a matrimony-first approach.</p>
                <p className="text-xs text-rose-100 mt-1">Focused on trust, families, and meaningful matches.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 px-3 py-2 rounded-full w-fit">
                <span className="material-symbols-outlined text-base">celebration</span>
                Wedding-ready updates on the way
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (dashboardData.loading && activeSection === "dashboard") {
      return renderSkeleton();
    }

    return (
      <>
        <Suspense fallback={renderSkeleton()}>
          {activeSection === "profile" && <AdminProfiles />}
          {activeSection === "bookings" && <AdminPackageBookings />}
          {activeSection === "interested" && <AdminInterested />}
          {activeSection === "profileinterested" && <AdminProfileInterested />}
          {activeSection === "staff" && <AdminStaff />}
          {activeSection === "discountpackage" && <DiscountPackage />}
          {activeSection === "heroimages" && <AdminHeroImages />}
          {activeSection === "admin-success-stories" && <AdminSuccessStories />}
          {activeSection === "defaultimages" && <AdminDefaultImages />}
          {activeSection === "defaultpreferences" && <AdminDefaultPreferences />}
          {activeSection === "admin-wedding-gallery" && <AdminWeddingGallery />}
          {activeSection === "dashboard" && renderDashboardContent()}
          {activeSection === "verifications" && renderVerificationsContent()}
          {activeSection === "usermanagement" && renderUserManagementContent()}
          {activeSection === "stories" && renderSuccessStoriesContent()}
          {activeSection === "revenue" && renderComingSoonContent("revenue")}
          {activeSection === "settings" && <AdminSettings />}
        </Suspense>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary/5">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">person_add</span>
                  Register New User
                </h3>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 hover:bg-primary/10 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleAddUserSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">First Name *</label>
                    <input type="text" name="firstName" value={addUserFormData.firstName} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="First name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Last Name *</label>
                    <input type="text" name="lastName" value={addUserFormData.lastName} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Last name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                    <input type="email" name="email" value={addUserFormData.email} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Email address" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number *</label>
                    <input type="tel" name="phone" value={addUserFormData.phone} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Phone number" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password *</label>
                    <input type="password" name="password" value={addUserFormData.password} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Set password" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth *</label>
                    <input type="date" name="dateOfBirth" value={addUserFormData.dateOfBirth} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender *</label>
                    <select name="gender" value={addUserFormData.gender} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Religion *</label>
                    <select name="religion" value={addUserFormData.religion} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required>
                      <option value="">Select Religion</option>
                      {religions.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Caste *</label>
                    <select name="cast" value={addUserFormData.cast} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required>
                      <option value="">Select Caste</option>
                      {casts.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Occupation *</label>
                    <select name="occupation" value={addUserFormData.occupation} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required>
                      <option value="">Select Occupation</option>
                      {occupations.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Country of Residence *</label>
                    <input type="text" name="country_of_resident" value={addUserFormData.country_of_resident} onChange={handleAddUserChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Country of residence" required />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowAddUserModal(false)}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={addUserSubmitting}
                    className="px-8 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60"
                  >
                    {addUserSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">how_to_reg</span>
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {showMgmtViewModal && selectedMgmtUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary/5">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">person</span>
                  User Details
                </h3>
                <button onClick={() => setShowMgmtViewModal(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-y-6">
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p><p className="font-bold text-slate-900 dark:text-slate-100">{selectedMgmtUser.first_name} {selectedMgmtUser.last_name}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member ID</p><p className="font-bold text-primary">{selectedMgmtUser.member_id}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p><p className="text-sm font-medium">{selectedMgmtUser.email}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Number</p><p className="text-sm font-medium">{selectedMgmtUser.contact_no || "—"}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</p><p className="text-sm font-medium capitalize">{selectedMgmtUser.gender || "—"}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Religion</p><p className="text-sm font-medium">{selectedMgmtUser.religion || "—"}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Caste</p><p className="text-sm font-medium">{selectedMgmtUser.cast || "—"}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Occupation</p><p className="text-sm font-medium">{selectedMgmtUser.occupation || "—"}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Country of Residence</p><p className="text-sm font-medium">{selectedMgmtUser.country_of_resident || "—"}</p></div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-zinc-800/50 border-t border-primary/10 flex justify-end">
                <button onClick={() => setShowMgmtViewModal(false)} className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showMgmtEditModal && selectedMgmtUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-primary/5">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">edit</span>
                  Edit User: {selectedMgmtUser.member_id}
                </h3>
                <button onClick={() => setShowMgmtEditModal(false)} className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleMgmtEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                    <input type="text" name="first_name" value={editUserFormData.first_name} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                    <input type="text" name="last_name" value={editUserFormData.last_name} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={editUserFormData.email} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                    <input type="tel" name="contact_no" value={editUserFormData.contact_no} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date of Birth</label>
                    <input type="date" name="d_o_b" value={editUserFormData.d_o_b} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                    <select name="gender" value={editUserFormData.gender} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Religion</label>
                    <select name="religion" value={editUserFormData.religion} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm">
                      <option value="">Select Religion</option>
                      {religions.map((r) => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Caste</label>
                    <select name="cast" value={editUserFormData.cast} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm">
                      <option value="">Select Caste</option>
                      {casts.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Occupation</label>
                    <select name="occupation" value={editUserFormData.occupation} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm">
                      <option value="">Select Occupation</option>
                      {occupations.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Country of Residence</label>
                    <input type="text" name="country_of_resident" value={editUserFormData.country_of_resident} onChange={handleMgmtEditChange} className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-slate-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" placeholder="Country of residence" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setShowMgmtEditModal(false)} className="px-6 py-2.5 rounded-lg font-bold text-sm border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={editUserSubmitting} className="px-8 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60">
                    {editUserSubmitting ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showMgmtDeleteModal && selectedMgmtUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-rose-600 text-3xl">delete_forever</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Delete User?</h3>
                <p className="text-sm text-slate-500 mb-8">Are you sure you want to delete profile <span className="font-bold text-primary">{selectedMgmtUser.member_id}</span>? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowMgmtDeleteModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                  <button 
                    disabled={mgmtDeleting}
                    onClick={async () => {
                      setMgmtDeleting(true);
                      try {
                        const res = await fetch(`${API}/api/admin/profiles/${selectedMgmtUser.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        });
                        if (res.ok) {
                          setShowMgmtDeleteModal(false);
                          fetchUsers();
                        } else {
                          alert("Failed to delete user");
                        }
                      } catch {
                        alert("Error deleting user");
                      } finally {
                        setMgmtDeleting(false);
                      }
                    }} 
                    className="flex-1 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                  >
                    {mgmtDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
    return (
      <div className="bg-slate-50 dark:bg-zinc-950 font-display text-slate-900 dark:text-slate-100 antialiased h-screen overflow-hidden flex">
      <DashSideBar
        onNavItemClick={handleNavItemClick}
        activeSection={activeSection}
        pendingVerificationsCount={dashboardData.intrestCount}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader 
          title={
            activeSection === "dashboard" ? `Welcome back, ${isStaff ? "Staff" : "Admin"}` :
            activeSection === "usermanagement" ? "User Management" :
            activeSection === "verifications" ? "Profile Verifications" :
            activeSection === "admin-success-stories" ? "Success Stories" :
            activeSection === "stories" ? "Success Stories" :
            activeSection === "staff" ? "Staff Management" :
            activeSection === "profile" ? "User Management" :
            activeSection === "bookings" ? "Package Bookings" :
            activeSection === "discountpackage" ? "Discount Packages" :
            activeSection === "heroimages" ? "Hero Images" :
            activeSection === "interested" ? "Interested List" :
            activeSection === "profileinterested" ? "Profile Interested" :
            activeSection === "defaultimages" ? "Default Images" :
            activeSection === "defaultpreferences" ? "Default Partner Preferences" :
            activeSection === "admin-wedding-gallery" ? "Wedding Gallery" :
            activeSection === "revenue" ? "Revenue Overview" :
            activeSection === "settings" ? "Account Settings" :
            "Admin Panel"
          }
          subtitle={
            activeSection === "dashboard" ? "Overview of Viwaha Matrimony's performance today." :
            activeSection === "usermanagement" ? "Manage and monitor all matrimony profiles" :
            activeSection === "verifications" ? "Review and validate user-submitted documents" :
            activeSection === "admin-success-stories" ? "Manage happy couple success stories" :
            "Manage your matrimony platform settings and data."
          }
          searchValue={dashboardData.searchKey}
          onSearchChange={handleSearchChange}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
