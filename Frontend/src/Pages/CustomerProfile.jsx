import React, { useState, useRef, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit,
  BarChart,
  Search,
  UserPlus,
  LogOut,
  Award,
  Camera,
  User,
  Crown,
  Star,
  Ribbon,
} from "lucide-react";
import { Users } from "lucide-react";
import ImageCropper from "../Components/ImageCropper";
import { API } from "../utils/api";

const CustomerProfile = () => {
  // Collapsible state for main profile sections
  const [expandedProfileSection, setExpandedProfileSection] = useState("basic");
  const handleProfileSectionToggle = (section) => {
    setExpandedProfileSection(
      expandedProfileSection === section ? null : section
    );
  };
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileImgName, setProfileImgName] = useState("");
  const [img1Name, setImg1Name] = useState("");
  const [img2Name, setImg2Name] = useState("");
  const [chartImgName, setChartImgName] = useState("");
  // Modal states
  const [showChartModal, setShowChartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showImg1Modal, setShowImg1Modal] = useState(false);
  const [showImg2Modal, setShowImg2Modal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Image cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppingFor, setCroppingFor] = useState("");
  const [matchingCount, setMatchingCount] = useState(0);

  const fileInputRef = useRef(null);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    minAge: "",
    maxAge: "",
    eatingHabit: "",
    starSign: "",
    religion: "",
    cast: "",
  });

  const [expandedSection, setExpandedSection] = useState("basic");
  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getImageUrl = (path) => {
    if (!path) return "/default-profile.jpg";

    const urls = [
      `${API}/uploads/${path}`,
      `https://mobile.viwahaa.com/uploads/${path}`,
    ];

    return urls[0];
  };

  console.log(currentUser);
  const formattedDOB = currentUser?.user.d_o_b
    ? new Date(currentUser.user.d_o_b).toISOString().split("T")[0]
    : "";

  const [formData, setFormData] = useState({
    first_name: currentUser?.user.first_name || "",
    last_name: currentUser?.user.last_name || "",
    email: currentUser?.user.email || "",
    d_o_b: formattedDOB,
    age:
      currentUser?.user.age && currentUser?.user.age !== "00"
        ? currentUser.user.age
        : currentUser?.user.age === "00" && currentUser?.user.d_o_b
        ? (() => {
            const today = new Date();
            const dob = new Date(currentUser.user.d_o_b);
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
              age--;
            }
            return age;
          })()
        : "",
    gender: currentUser?.user.gender || "",
    contact_no: currentUser?.user.contact_no || "",
    address: currentUser?.user.address || "",
    whatsapp_no: currentUser?.user.whatsapp_no || "",
    birth_place: currentUser?.user.birth_place || "",
    birth_time: currentUser?.user.birth_time || "",
    height: currentUser?.user.height || "",
    weight: currentUser?.user.weight || "",
    complexion: currentUser?.user.complexion || "",
    maritial_status: currentUser?.user.maritial_status || "",
    physical_status: currentUser?.user.physical_status || "",
    religion: currentUser?.user.religion || "",
    cast: currentUser?.user.cast || "",
    star_sign: currentUser?.user.star_sign || "",
    rasi: currentUser?.user.rasi || "",
    country_of_birth: currentUser?.user.country_of_birth || "",
    city_of_birth: currentUser?.user.city_of_birth || "",
    country_of_resident: currentUser?.user.country_of_resident || "",
    city_of_resident: currentUser?.user.city_of_resident || "",
    country_of_citizenship: currentUser?.user.country_of_citizenship || "",
    eating_habit: currentUser?.user.eating_habit || "",
    smoking_habit: currentUser?.user.smoking_habit || "",
    drinking_habit: currentUser?.user.drinking_habit || "",
    primary_school: currentUser?.user.primary_school || "",
    secondary_school: currentUser?.user.secondary_school || "",
    education: currentUser?.user.education || "",
    education_details: currentUser?.user.education_details || "",
    occupation: currentUser?.user.occupation || "",
    occupation_details: currentUser?.user.occupation_details || "",
    employed_in: currentUser?.user.employed_in || "",
    annual_income: currentUser?.user.annual_income || "",
    family_value: currentUser?.user.family_value || "",
    family_type: currentUser?.user.family_type || "",
    family_status: currentUser?.user.family_status || "",
    fathers_name: currentUser?.user.fathers_name || "",
    fathers_occupation: currentUser?.user.fathers_occupation || "",
    fathers_native_place: currentUser?.user.fathers_native_place || "",
    mothers_name: currentUser?.user.mothers_name || "",
    mothers_occupation: currentUser?.user.mothers_occupation || "",
    mothers_native_place: currentUser?.user.mothers_native_place || "",
    brothers: currentUser?.user.brothers || "",
    married_brothers: currentUser?.user.married_brothers || "",
    sisters: currentUser?.user.sisters || "",
    married_sisters: currentUser?.user.married_sisters || "",
    more_family: currentUser?.user.more_family || "",
    partner_country_of_resident:
      currentUser?.user.partner_country_of_resident || "",
    partner_resident_status: currentUser?.user.partner_resident_status || "",
    partner_education: currentUser?.user.partner_education || "",
    partner_occupation: currentUser?.user.partner_occupation || "",
    partner_annual_income: currentUser?.user.partner_annual_income || "",
    partner_marital_status: currentUser?.user.partner_marital_status || "",
    partner_minimum_age: currentUser?.user.partner_minimum_age || "",
    partner_maximum_age: currentUser?.user.partner_maximum_age || "",
    partner_minimum_height: currentUser?.user.partner_minimum_height || "",
    partner_maximum_height: currentUser?.user.partner_maximum_height || "",
    partner_physical_status: currentUser?.user.partner_physical_status || "",
    partner_mother_tongue: currentUser?.user.partner_mother_tongue || "",
    partner_religion: currentUser?.user.partner_religion || "",
    partner_star_sign: currentUser?.user.partner_star_sign || "",
    partner_cast: currentUser?.user.partner_cast || "",
    partner_eating_habit: currentUser?.user.partner_eating_habit || "",
    partner_smoking_habit: currentUser?.user.partner_smoking_habit || "",
    partner_drinking_habit: currentUser?.user.partner_drinking_habit || "",
    profile_img: currentUser?.user.profile_img || "",
    img_1: currentUser?.user.img_1 || "",
    img_2: currentUser?.user.img_2 || "",
    chart_img: currentUser?.user.chart_img || "",
    package_plan: currentUser?.user.package_plan || "",
    sevvay_thoosam: currentUser?.user.sevvay_thoosam || "",
    sevvay_thoosam_position: currentUser?.user.sevvay_thoosam_position || "",
  });

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/sign-in");
  };

  // Fetch matching count using the exact same logic as the Matching page
  useEffect(() => {
    const fetchMatchingCount = async () => {
      if (!currentUser?.user?.id) return;

      const targetGender =
        currentUser?.user?.gender === "male" ? "female" : "male";

      const cu = currentUser.user;

      // Build preferences exactly as Matching.jsx formData does
      const pref = {
        caste:
          cu.partner_cast && cu.partner_cast !== "Any" && cu.partner_cast !== "any"
            ? cu.partner_cast
            : "",
        starSign:
          cu.partner_star_sign && cu.partner_star_sign !== "Any" && cu.partner_star_sign !== "any"
            ? cu.partner_star_sign
            : "",
        eatingHabit:
          cu.partner_eating_habit && cu.partner_eating_habit !== "Any" && cu.partner_eating_habit !== "any"
            ? cu.partner_eating_habit
            : "",
        maritalStatus:
          cu.partner_marital_status && cu.partner_marital_status !== "Any" && cu.partner_marital_status !== "any"
            ? cu.partner_marital_status
            : "",
        religion:
          cu.partner_religion && cu.partner_religion !== "Any" && cu.partner_religion !== "any"
            ? cu.partner_religion
            : "",
        minAge: cu.partner_minimum_age ? String(cu.partner_minimum_age) : "",
        maxAge: cu.partner_maximum_age ? String(cu.partner_maximum_age) : "",
        countryOfResidence:
          cu.partner_country_of_resident && cu.partner_country_of_resident !== "Any" && cu.partner_country_of_resident !== "any"
            ? cu.partner_country_of_resident
            : "",
      };

      try {
        const params = new URLSearchParams({
          userId: cu.id,
          gender: targetGender,
        });

        const response = await fetch(
          `/api/user/matchingusers?${params.toString()}`
        );

        if (!response.ok) {
          setMatchingCount(0);
          return;
        }

        const data = await response.json();
        const allMatches = Array.isArray(data) ? data : data.data || [];

        // Apply the exact same client-side filters as Matching.jsx filteredProfiles
        const filtered = allMatches.filter((profile) => {
          if (pref.starSign && pref.starSign.toLowerCase() !== "any" && profile.starSign !== pref.starSign) return false;
          if (pref.religion && pref.religion.toLowerCase() !== "any" && profile.religion !== pref.religion) return false;
          if (pref.caste && pref.caste.toLowerCase() !== "any" && profile.caste !== pref.caste) return false;
          if (pref.eatingHabit && pref.eatingHabit.toLowerCase() !== "any" && profile.eatingHabit !== pref.eatingHabit) return false;
          if (pref.maritalStatus && pref.maritalStatus.toLowerCase() !== "any" && profile.maritalStatus !== pref.maritalStatus) return false;
          if (pref.minAge && profile.age < parseInt(pref.minAge)) return false;
          if (pref.maxAge && profile.age > parseInt(pref.maxAge)) return false;
          if (pref.countryOfResidence && !profile.countryOfResidence?.toLowerCase().includes(pref.countryOfResidence.toLowerCase())) return false;
          return true;
        });

        setMatchingCount(filtered.length);
      } catch (error) {
        console.error("Error fetching matching count:", error);
        setMatchingCount(0);
      }
    };

    fetchMatchingCount();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // Check if it's an image file that should be cropped
      // Only crop profile_img, not img_1 or img_2
      if (name === "profile_img" && file.type.startsWith("image/")) {
        // Show cropper only for profile_img
        const imageUrl = URL.createObjectURL(file);
        setImageToCrop(imageUrl);
        setCroppingFor(name);
        setShowCropper(true);
      } else {
        // For non-image files, chart_img, img_1, and img_2 - set directly without cropping
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
      }
    }
  };

  const handleCropComplete = (croppedImageBlob) => {
    // Create a file from the cropped blob
    const croppedFile = new File(
      [croppedImageBlob],
      `cropped-${croppingFor}.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );

    // Update form data with the cropped image
    setFormData((prev) => ({
      ...prev,
      [croppingFor]: croppedFile,
    }));

    // Clean up
    setShowCropper(false);
    setImageToCrop(null);
    setCroppingFor("");

    // Revoke the object URL to avoid memory leaks
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setCroppingFor("");

    // Revoke the object URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Interested profiles count state
  const [interestedCount, setInterestedCount] = useState(0);

  // Fetch interested profiles count
  useEffect(() => {
    const fetchInterestedCount = async () => {
      if (!currentUser?.user?.id) return;
      try {
        const res = await fetch(
          `/api/user/interested-profiles/${currentUser.user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setInterestedCount((data.profiles || []).length);
        }
      } catch (err) {
        setInterestedCount(0);
      }
    };
    fetchInterestedCount();
  }, [currentUser?.user?.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Append all non-file fields
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (["profile_img", "img_1", "img_2", "chart_img"].includes(key)) {
            // Files will be handled separately
            continue;
          }
          formDataObj.append(key, formData[key]);
        }
      }
      // Always append sevvay_thoosam explicitly (for safety)
      formDataObj.set("sevvay_thoosam", formData.sevvay_thoosam || "");

      // Append files if they exist
      if (formData.profile_img instanceof File) {
        formDataObj.append("profile_img", formData.profile_img);
      }
      if (formData.img_1 instanceof File) {
        formDataObj.append("img_1", formData.img_1);
      }
      if (formData.img_2 instanceof File) {
        formDataObj.append("img_2", formData.img_2);
      }
      if (formData.chart_img instanceof File) {
        formDataObj.append("chart_img", formData.chart_img);
      }

      // Dispatch update start action
      dispatch(updateUserStart());

      // Send all data in one request
      const response = await fetch(`${API}/api/user/update/${currentUser.user.id}`, {
        method: "PUT",
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      console.log("Update successful:", data);

      // Refresh user data
      dispatch(updateUserSuccess(data.user));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch(updateUserFailure(error.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const ProfileImageSection = () => (
    <div className="bg-[#800000] rounded-xl p-6 flex flex-col items-center">
      <div className="relative inline-block group mb-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowProfileModal(true);
          }}
          className="block"
        >
          <img
            src={getImageUrl(currentUser?.user.profile_img)}
            className="w-36 h-36 rounded-full mx-auto border-4 border-[#FFD700] object-cover object-center"
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              if (currentUser?.user.profile_img) {
                e.target.src = `https://mobile.viwahaa.com/uploads/${currentUser.user.profile_img}`;
              } else {
                e.target.src = "/default-profile.jpg";
              }
            }}
          />
        </a>
        <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg transition-opacity duration-200">
          <Camera size={16} className="text-gray-700" />
        </div>
      </div>
      <div className=" rounded-lg px-4 py-3 w-full text-center mt-2">
        <h2 className="text-xl font-bold text-white">
          {currentUser.user.last_name || "-"}
        </h2>
        <p className="text-base text-white">{currentUser.user.email || "-"}</p>
        <p className="text-base text-white">
          Born: {formattedDOB || "-"} &nbsp; | &nbsp; Age:{" "}
          {currentUser.user.age || "-"}
        </p>
        {currentUser.user.sevvay_thoosam === "yes" && (
          <p className="text-base text-white font-semibold mt-2">
            Sevvay Thoosam (செவ்வாய் தோசம்)
            {currentUser.user.sevvay_thoosam_position && (
              <span className="ml-2 text-yellow-300">
                (Position: {currentUser.user.sevvay_thoosam_position})
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );

  const FileInputsSection = () => (
    <>
      <div className="md:col-span-2">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Profile Image<span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            name="profile_img"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FCF8F3] file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500">
            Recommended: Square image with clear face view. Image will be
            cropped to fit perfectly.
          </p>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Image 1<span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="img_1"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Image 2<span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="img_2"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FCF8F3] file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chart Image<span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="chart_img"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FCF8F3] file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </>
  );

  if (!currentUser) {
    return (
      <div className="container text-center py-5">
        <h1>Welcome Guest</h1>
        <p>Please log in to see your profile.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FCF8F3]"
      style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Profile Content */}
        {/* <div className="container mt-0 sm:pt-7 mx-auto px-2 sm:px-4 md:px-10 lg:px-20"> */}
        <div className="flex flex-col lg:flex-row gap-6  items-start">
          {/* Left Sidebar */}
          <div className="block w-full lg:w-[340px] flex-shrink-0 mt-6 mb-6 lg:mt-0 lg:mb-0">
            <div className="bg-[#800000] rounded-xl flex flex-col items-center py-8 px-4 w-full">
              <ProfileImageSection />
              {/* <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white"> {currentUser.user.last_name}</h2>
                <p className="text-base text-white">{currentUser.user.email}</p>
                <p className="text-base text-white">Born: {formattedDOB} &nbsp; | &nbsp; Age: {currentUser.user.age}</p>
              </div> */}
              <div className="flex flex-col w-full mt-6 gap-2">
                <button
                  className="w-full flex items-center gap-3 text-white bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition shadow-sm text-sm sm:text-base"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit size={20} />{" "}
                  <span className="text-base">Edit Profile</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 text-white bg-transparent hover:bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition text-sm sm:text-base"
                  onClick={() => setShowChartModal(true)}
                >
                  <BarChart size={20} />{" "}
                  <span className="text-base">View Chart</span>
                </button>
                <Link
                  to={currentUser.user.status === "single" ? "/matching" : "#"}
                  className="w-full"
                >
                  <button
                    className={`w-full flex items-center gap-3 text-white bg-transparent hover:bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition text-sm sm:text-base ${
                      currentUser.user.status !== "single"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentUser.user.status !== "single"}
                    title={
                      currentUser.user.status !== "single"
                        ? "Only available for single users"
                        : "Find matching profiles"
                    }
                  >
                    <Search size={20} />{" "}
                    <span className="text-base flex items-center justify-between w-full">
                      Find Matching
                      {/* Always show count */}
                      <span className="bg-[#FFD700] text-[#8D1C21] rounded-full px-2 py-0.5 text-xs font-bold ml-auto min-w-[2em] text-center">
                        {String(matchingCount).padStart(2, "0")}
                      </span>
                    </span>
                  </button>
                </Link>
                {currentUser.user.package_plan !== "Basic Plan" && (
                  <Link to="/interested-profiles" className="w-full">
                    <button className="w-full flex items-center gap-3 text-white bg-transparent hover:bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition text-sm sm:text-base">
                      <UserPlus size={20} />{" "}
                      <span className="text-base flex items-center justify-between w-full">
                        Interested Profile
                        <span className="bg-[#FFD700] text-[#8D1C21] rounded-full px-2 py-0.5 text-xs font-bold ml-auto min-w-[2em] text-right">
                          {String(interestedCount).padStart(2, "0")}
                        </span>
                      </span>
                    </button>
                  </Link>
                )}

                {currentUser.user.package_plan !== "Ultimate Plan" && (
                  <Link to="/pricing" className="w-full">
                    <button className="w-full flex items-center gap-3 text-white bg-transparent hover:bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition text-sm sm:text-base">
                      <Crown size={20} />{" "}
                      <span className="text-base">Upgrade Package</span>
                    </button>
                  </Link>
                )}
                <button
                  className="w-full flex items-center gap-3 text-white bg-transparent hover:bg-[#b1001a] rounded-lg py-2 sm:py-3 px-2 sm:px-4 font-semibold transition mt-6 text-sm sm:text-base"
                  onClick={handleLogout}
                >
                  <LogOut size={20} /> <span className="text-base">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">
            <div className="bg-[#800000] rounded-xl p-2 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {currentUser.user.package_plan === "Basic Plan" && (
                  <Ribbon className="text-white" />
                )}
                {currentUser.user.package_plan === "Premium Plan" && (
                  <Star className="text-white" />
                )}
                {currentUser.user.package_plan === "Ultimate Plan" && (
                  <Crown className="text-white" />
                )}

                <span className="text-white text-xl font-bold italic">
                  {currentUser.user.package_plan}
                </span>
              </div>
              {/* Show only one Upgrade Now button if not Ultimate Plan */}
              {currentUser.user.package_plan !== "Ultimate Plan" && (
                <Link to="/pricing">
                  <button
                    className="bg-[#FFD700] hover:bg-[#FFC300] text-[#8D1C21] font-bold py-2 px-5 rounded-md text-base border-none"
                    style={{ boxShadow: "none" }}
                  >
                    Upgrade Now
                  </button>
                </Link>
              )}
            </div>
            <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
              <h2 className="text-xl font-bold text-[#8D1C21] mb-6 flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 28, minHeight: 28 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      fill="#8D1C21"
                    />
                  </svg>
                </span>
                Basic Details
              </h2>
              {/* Mobile & Tablet: Single Table */}
              <div className="block md:hidden">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Mobile Number:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.contact_no || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Birth Place:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.birth_place || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Birth Time:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.birth_time || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Height:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.height || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Complexion:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.complexion || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Caste:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.cast || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Star Sign:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.star_sign || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Whatsapp No:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.whatsapp_no || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Address:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        <span
                          className="block max-w-xs truncate cursor-pointer"
                          title={currentUser.user.address || "-"}
                        >
                          {(() => {
                            const address = currentUser.user.address || "-";
                            if (address === "-") return address;
                            return address.length > 33
                              ? address.slice(0, 33) + "..."
                              : address;
                          })()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Marital Status:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.maritial_status || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Weight:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.weight || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Physical Status:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.physical_status || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Religion:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.religion || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Rasi:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.rasi || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Desktop: Two Tables Side by Side */}
              <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                <table className="w-full  border-[#8d8d8d]">
                  <tbody>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Mobile Number:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.contact_no || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Birth Place:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.birth_place || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Birth Time:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.birth_time || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Height:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.height || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Complexion:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.complexion || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Caste:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.cast || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Star Sign:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.star_sign || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Whatsapp No:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.whatsapp_no || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Address:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        <span
                          className="block max-w-xs truncate cursor-pointer"
                          title={currentUser.user.address || "-"}
                        >
                          {(() => {
                            const address = currentUser.user.address || "-";
                            if (address === "-") return address;
                            return address.length > 33
                              ? address.slice(0, 33) + "..."
                              : address;
                          })()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Marital Status:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.maritial_status || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Weight:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.weight || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Physical Status:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.physical_status || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Religion:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.religion || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                        Rasi:
                      </td>
                      <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                        {currentUser.user.rasi || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Location */}
            <div className="mb-4 border rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white  focus:outline-none ${
                  expandedProfileSection === "location" ? "" : "opacity-100"
                }`}
                onClick={() => handleProfileSectionToggle("location")}
              >
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 28, minHeight: 28 }}
                >
                  {/* Map Pin icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                      fill="#8D1C21"
                    />
                  </svg>
                </span>
                <span className="text-xl font-bold text-[#8D1C21]">
                  Location Details
                </span>
              </button>
              {expandedProfileSection === "location" && (
                <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
                  {/* Mobile & Tablet: Single Table */}
                  <div className="block md:hidden">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Birth:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_birth || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_resident || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Citizenship:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_citizenship || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            City of Birth:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.city_of_birth || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            City of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.city_of_resident || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Desktop: Two Tables Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                    <table className="w-full border-[#1C6D8D]">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Birth:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_birth || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_resident || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Citizenship:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.country_of_citizenship || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            City of Birth:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.city_of_birth || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            City of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.city_of_resident || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Lifestyle */}
            <div className="mb-4 border rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white focus:outline-none ${
                  expandedProfileSection === "lifestyle" ? "" : "opacity-100"
                }`}
                onClick={() => handleProfileSectionToggle("lifestyle")}
              >
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 28, minHeight: 28 }}
                >
                  {/* Leaf icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"
                      fill="#8D1C21"
                    />
                  </svg>
                </span>
                <span className="text-xl font-bold text-[#8D1C21]">
                  Lifestyle Details
                </span>
              </button>
              {expandedProfileSection === "lifestyle" && (
                <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
                  {/* Mobile & Tablet: Single Table */}
                  <div className="block md:hidden">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Eating Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.eating_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Smoking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.smoking_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Drinking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.drinking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Desktop: Two Tables Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                    <table className="w-full ">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Eating Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.eating_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Smoking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.smoking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Drinking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.drinking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Education & Professional */}
            <div className="mb-4 border rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#fff8f8] transition-colors ${
                  expandedProfileSection === "education" ? "" : "opacity-100"
                }`}
                onClick={() => handleProfileSectionToggle("education")}
              >
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 28, minHeight: 28 }}
                >
                  {/* Graduation Cap icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 3L2 9l10 6 10-6-10-6zm0 13c-4.418 0-8-1.79-8-4V9l8 5 8-5v3c0 2.21-3.582 4-8 4z"
                      fill="#8D1C21"
                    />
                  </svg>
                </span>
                <span className="text-xl font-bold text-[#8D1C21]">
                  Education Details
                </span>
              </button>
              {expandedProfileSection === "education" && (
                <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
                  {/* Mobile & Tablet: Single Table */}
                  <div className="block md:hidden">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Primary School:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.primary_school || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.education || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Employed In:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.employed_in || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Secondary School:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.secondary_school || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education Details:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            <span
                              className="block max-w-xs truncate cursor-pointer"
                              title={currentUser.user.education_details || "-"}
                            >
                              {(() => {
                                const edu =
                                  currentUser.user.education_details || "-";
                                if (edu === "-") return edu;
                                return edu.length > 33
                                  ? edu.slice(0, 33) + "..."
                                  : edu;
                              })()}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Annual Income:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.annual_income || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Desktop: Two Tables Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                    <table className="w-full ">
                      <tbody>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Primary School:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.primary_school || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.education || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Employed In:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.employed_in || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Secondary School:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.secondary_school || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education Details:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            <span
                              className="block max-w-xs truncate cursor-pointer"
                              title={currentUser.user.education_details || "-"}
                            >
                              {(() => {
                                const edu =
                                  currentUser.user.education_details || "-";
                                if (edu === "-") return edu;
                                return edu.length > 33
                                  ? edu.slice(0, 33) + "..."
                                  : edu;
                              })()}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#5f5e5e] font-medium py-2 border-b border-[#e5e7eb]">
                            Annual Income:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.annual_income || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Family Details */}
            <div className="mb-4 border rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white focus:outline-none ${
                  expandedProfileSection === "family" ? "" : "opacity-100"
                }`}
                onClick={() => handleProfileSectionToggle("family")}
              >
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 28, minHeight: 28 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="32"
                    height="32"
                  >
                    <g fill="#8D1C21">
                      <circle cx="14" cy="14" r="6" />
                      <path d="M14 22c-4.42 0-8 3.58-8 8v4h16v-4c0-4.42-3.58-8-8-8z" />

                      <circle cx="34" cy="14" r="6" />
                      <path d="M34 22c-4.42 0-8 3.58-8 8v4h16v-4c0-4.42-3.58-8-8-8z" />

                      <circle cx="24" cy="10" r="4" />
                      <path d="M24 16c-3.31 0-6 2.69-6 6v3h12v-3c0-3.31-2.69-6-6-6z" />

                      <circle cx="20" cy="8" r="3" />
                      <path d="M20 13c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4z" />

                      <path
                        d="M20 14L24 18M24 18L28 14"
                        stroke="#8D1C21"
                        stroke-width="1.5"
                        fill="none"
                      />
                      <path
                        d="M14 18L18 14M34 18L30 14"
                        stroke="#8D1C21"
                        stroke-width="1.5"
                        fill="none"
                      />
                    </g>
                  </svg>
                </span>
                <span className="text-xl font-bold text-[#8D1C21]">
                  Family Details
                </span>
              </button>
              {expandedProfileSection === "family" && (
                <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
                  {/* Mobile & Tablet: Single Table */}
                  <div className="block md:hidden">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Value:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_value || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Type:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_type || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Name:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_name || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Native Place:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_native_place || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            More Family:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.more_family || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Name:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_name || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Native Place:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_native_place || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Brothers:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.brothers || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Married Brothers:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.married_brothers || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Sisters:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.sisters || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Married Sisters:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.married_sisters || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Desktop: Two Tables Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                    <table className="w-full ">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Value:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_value || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Type:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_type || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Family Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.family_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Name:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_name || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Father Native Place:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.fathers_native_place || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            More Family:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.more_family || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Name:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_name || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Native Place:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.mothers_native_place || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Brothers:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.brothers || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Married Brothers:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.married_brothers || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Sisters:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.sisters || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Married Sisters:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.married_sisters || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Partner Preference */}
            <div className="mb-4 border rounded-xl shadow-lg overflow-hidden">
              <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 bg-white focus:outline-none ${
                  expandedProfileSection === "partner" ? "" : "opacity-100"
                }`}
                onClick={() => handleProfileSectionToggle("partner")}
              >
                <span
                  className="inline-flex items-center justify-center mr-2"
                  style={{ minWidth: 32, minHeight: 32 }}
                >
                  {/* Heart with two users icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M16 28s-8.5-7.36-11.5-11.09C2.13 14.13 2 11.5  2 11.5A7.5 7.5 0 0116 7.5a7.5 7.5 0 0114 4c0 0-.13 2.63-2.5 5.41C24.5 20.64 16 28 16 28z"
                      fill="#8D1C21"
                    />
                    <circle cx="12" cy="14" r="2" fill="#fff" />
                    <circle cx="20" cy="14" r="2" fill="#fff" />
                    <path
                      d="M10.5 18c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v1.5c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5V18z"
                      fill="#fff"
                    />
                    <path
                      d="M18.5 18c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v1.5c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5V18z"
                      fill="#fff"
                    />
                  </svg>
                </span>
                <span className="text-xl font-bold text-[#8D1C21]">
                  Partner Preference
                </span>
              </button>
              {expandedProfileSection === "partner" && (
                <div className="bg-white rounded-lg p-2 sm:p-6 md:p-8 shadow-lg">
                  {/* Mobile & Tablet: Single Table */}
                  <div className="block md:hidden">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_country_of_resident ||
                              "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_education || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Annual Income:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_annual_income || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Minimum Age:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_minimum_age || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Minimum Height:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_minimum_height || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Physical Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_physical_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Religion:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_religion || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Caste:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_cast || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Drinking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_drinking_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Resident Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_resident_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Marital Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_marital_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Maximum Age:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_maximum_age || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Maximum Height:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_maximum_height || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Tongue:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_mother_tongue || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Star Sign:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_star_sign || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Eating Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_eating_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Smoking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_smoking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Desktop: Two Tables Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                    <table className="w-full ">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Country of Resident:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_country_of_resident ||
                              "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Education:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_education || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Annual Income:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_annual_income || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Minimum Age:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_minimum_age || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Minimum Height:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_minimum_height || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Physical Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_physical_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Religion:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_religion || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Caste:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_cast || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Drinking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_drinking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Resident Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_resident_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Occupation:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_occupation || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Marital Status:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_marital_status || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Maximum Age:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_maximum_age || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Maximum Height:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_maximum_height || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Mother Tongue:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_mother_tongue || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Star Sign:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_star_sign || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Eating Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_eating_habit || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-[#8f8e8e] font-medium py-2 border-b border-[#e5e7eb]">
                            Smoking Habits:
                          </td>
                          <td className="text-[#222] font-bold py-2 border-b border-[#e5e7eb]">
                            {currentUser.user.partner_smoking_habit || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9998] p-4">
          <div className="relative bg-[#FCF8F3] rounded-2xl shadow-2xl border border-gray-200 max-w-5xl w-full mx-auto max-h-[95vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-[#fff0f0] hover:bg-[#ffd6d6] text-[#a00000] rounded-full p-2 shadow transition z-10"
              onClick={() => setShowChartModal(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#8D1C21"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
            {/* Title */}
            <div className="flex items-center gap-2 px-8 pt-8 pb-4 border-b border-gray-200">
              <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                    fill="#8D1C21"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-[#8D1C21]">Chart Image</h3>
            </div>
            {/* Chart Image - scrollable container for large images */}
            <div className="flex-1 overflow-auto bg-[#faf7f7]">
              <div className="flex items-center justify-center min-h-full p-4">
                {currentUser?.user.chart_img &&
                currentUser.user.chart_img !== "null" &&
                currentUser.user.chart_img !== "undefined" &&
                currentUser.user.chart_img.trim() !== "" ? (
                  <img
                    src={getImageUrl(currentUser?.user.chart_img)}
                    className="max-w-full max-h-[80vh] object-contain"
                    alt="Chart"
                    onError={(e) => {
                      e.target.onerror = null;
                      if (currentUser?.user.chart_img) {
                        e.target.src = `https://mobile.viwahaa.com/uploads/${currentUser.user.chart_img}`;
                      } else {
                        e.target.src = "/default-profile.jpg";
                      }
                    }}
                  />
                ) : (
                  <div className="text-center py-20">
                    <BarChart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-xl font-semibold text-gray-500">
                      Chart not uploaded
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Optional: Add a close button at the bottom */}
            <div className="border-t border-gray-200 p-4 flex justify-end bg-[#FCF8F3]">
              <button
                className="px-6 py-2 bg-[#8D1C21] text-white rounded-lg hover:bg-[#a00000] transition-colors duration-200"
                onClick={() => setShowChartModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal - Highest z-index */}
      {showCropper && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Profile Image Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9998] p-4">
          <div className="relative bg-[#FCF8F3] rounded-2xl shadow-2xl border border-[#ffd6d6] max-w-3xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-[#fff0f0] hover:bg-[#ffd6d6] text-[#a00000] rounded-full p-2 shadow transition z-10"
              onClick={() => setShowProfileModal(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#a00000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
            {/* Title */}
            <div className="flex items-center gap-2 px-8 pt-8 pb-4 border-b border-[#ffd6d6]">
              <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                    fill="#a00000"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-[#a00000]">
                Profile Image
              </h3>
            </div>
            {/* Profile Image */}
            <div className="flex-1 overflow-auto px-8 py-8 flex items-center justify-center bg-[#fff7f7]">
              <img
                src={getImageUrl(currentUser?.user.profile_img)}
                className="max-w-full max-h-[60vh] object-contain border border-[#ffd6d6] rounded-xl shadow"
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  if (currentUser?.user.profile_img) {
                    e.target.src = `https://mobile.viwahaa.com/uploads/${currentUser.user.profile_img}`;
                  } else {
                    e.target.src = "/default-profile.jpg";
                  }
                }}
              />
            </div>
            <div className="flex justify-end px-8 py-6 border-t border-[#ffd6d6] flex-shrink-0 bg-[#fff0f0]">
              <button
                className="px-6 py-2 bg-[#a00000] text-white rounded-lg hover:bg-[#8D1C21] transition-colors duration-200"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 overflow-y-auto p-4">
          <div className="relative bg-[#FCF8F3] rounded-3xl shadow-2xl border border-[#ffd6d6] w-full max-w-7xl max-h-screen overflow-y-auto mt-40 mb-10 custom-scrollbar-hide">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-[#fff0f0] hover:bg-[#ffd6d6] text-[#a00000] rounded-full p-2 shadow transition z-10"
              onClick={() => setShowEditModal(false)}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#a00000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
            {/* Header */}
            <div className="flex items-center gap-2 px-8 pt-8 pb-4 border-b border-[#ffd6d6]">
              <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="#a00000"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-[#a00000]">
                Update Your Current Information
              </h3>
            </div>

            <div className="modal-body py-4 px-8">
              <form onSubmit={handleSave}>
                {/* Collapsible Sections Container */}
                <div className="space-y-4">
                  {/* Basic Details Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("basic")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            fill="#a00000"
                          />
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Basic Details
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "basic" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "basic" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div>
                            <label className="block mb-1">
                              First Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="First Name"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Last Name<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Last Name"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Email<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                              placeholder="Email"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Date of Birth
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="d_o_b"
                              value={formData.d_o_b}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                              placeholder="Date of Birth"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Age<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="age"
                              value={formData.age}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                              placeholder="Age"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Gender<span className="text-red-500">*</span>
                            </label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              {/* <option value="other">Other</option> */}
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Contact No<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="contact_no"
                              value={formData.contact_no}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                              placeholder="Contact No"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Whatsapp No<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="whatsapp_no"
                              value={formData.whatsapp_no}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Whatsapp No"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-1">
                              Address<span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Address"
                              rows="3"
                            ></textarea>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Birth Place<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="birth_place"
                              value={formData.birth_place}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Birth Place"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Birth Time<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              name="birth_time"
                              value={formData.birth_time}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Birth Time"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Height<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="height"
                              value={formData.height}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Height"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Weight<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="weight"
                              value={formData.weight}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Weight"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Complexion</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="complexion"
                              value={formData.complexion}
                              onChange={handleInputChange}
                            >
                              <option value="">Complexion</option>
                              <option value="fair">Fair</option>
                              <option value="medium">Medium</option>
                              <option value="olive">Olive</option>
                              <option value="dark">Dark</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Marital Status</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="maritial_status"
                              value={formData.maritial_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Marital Status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                              <option value="separated">Separated</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Physical Status
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="physical_status"
                              value={formData.physical_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Physical Status</option>
                              <option value="single">Single</option>
                              <option value="normal">Normal</option>
                              <option value="disabled">Disabled</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Religion</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="religion"
                              value={formData.religion}
                              onChange={handleInputChange}
                            >
                              <option value="">Religion</option>
                              <option value="hindu">Hindu</option>
                              <option value="christian">Christian</option>
                              <option value="muslim">Muslim</option>
                              <option value="buddhist">Buddhist</option>
                              <option value="sikh">Sikh</option>
                              <option value="jewish">Jewish</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Caste</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="cast"
                              value={formData.cast}
                              onChange={handleInputChange}
                            >
                              <option value="">Caste</option>
                              <option value="Mixed Jaffna Vellalar">
                                Mixed Jaffna Vellalar
                              </option>
                              <option value="Vellalar">Vellalar</option>
                              <option value="Other Vellatar">
                                Other Vellatar
                              </option>
                              <option value="Viswakulam">Viswakulam</option>
                              <option value="Mukkulanthor">Mukkulanthor</option>
                              <option value="Koviyor">Koviyor</option>
                              <option value="Kurukulam">Kurukulam</option>
                              <option value="Bhramin">Bhramin</option>
                              <option value="Kounder">Kounder</option>
                              <option value="Veera Saiva Vellalar">
                                Veera Saiva Vellalar
                              </option>
                              <option value="Kujavar">Kujavar</option>
                              <option value="Chettiar">Chettiar</option>
                              <option value="Devar">Devar</option>
                              <option value="Kaller">Kaller</option>
                              <option value="Malayalee">Malayalee</option>
                              <option value="Mukkuwar">Mukkuwar</option>
                              <option value="Muthaliyar">Muthaliyar</option>
                              <option value="Naiyudu">Naiyudu</option>
                              <option value="Nadar">Nadar</option>
                              <option value="Pallar">Pallar</option>
                              <option value="Parawar">Parawar</option>
                              <option value="Senkunthar">Senkunthar</option>
                              <option value="Siviyar">Siviyar</option>
                              <option value="Dadar">Dadar</option>
                              <option value="Sayakkarar">Sayakkarar</option>
                              <option value="Nalavar">Nalavar</option>
                              <option value="Agamiliyar">Agamiliyar</option>
                              <option value="Dobi">Dobi</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Star Sign</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="star_sign"
                              value={formData.star_sign}
                              onChange={handleInputChange}
                            >
                              <option value="">Star Sign</option>
                              <option value="அச்வினி (Aswini)">
                                அச்வினி (Aswini)
                              </option>
                              <option value="பரணி (Bharani)">
                                பரணி (Bharani)
                              </option>
                              <option value="கார்த்திகை (Karthigai)">
                                கார்த்திகை (Karthigai)
                              </option>
                              <option value="ரோகிணி (Rohini)">
                                ரோகிணி (Rohini)
                              </option>
                              <option value="மிருகசீரிடம் (Mrigasiridam)">
                                மிருகசீரிடம் (Mrigasiridam)
                              </option>
                              <option value="திருவாதிரை (Thiruvathirai)">
                                திருவாதிரை (Thiruvathirai)
                              </option>
                              <option value="புனர்பூசம் (Punarpoosam)">
                                புனர்பூசம் (Punarpoosam)
                              </option>
                              <option value="பூசம் (Poosam)">
                                பூசம் (Poosam)
                              </option>
                              <option value="ஆயில்யம் (Ayilyam)">
                                ஆயில்யம் (Ayilyam)
                              </option>
                              <option value="மகம் (Magam)">மகம் (Magam)</option>
                              <option value="பூரம் (Pooram)">
                                பூரம் (Pooram)
                              </option>
                              <option value="உத்திரம் (Uthiram)">
                                உத்திரம் (Uthiram)
                              </option>
                              <option value="ஹஸ்தம் (Hastham)">
                                ஹஸ்தம் (Hastham)
                              </option>
                              <option value="சித்திரை (Chithirai)">
                                சித்திரை (Chithirai)
                              </option>
                              <option value="சுவாதி (Swathi)">
                                சுவாதி (Swathi)
                              </option>
                              <option value="விசாகம் (Visakam)">
                                விசாகம் (Visakam)
                              </option>
                              <option value="அனுஷம் (Anusham)">
                                அனுஷம் (Anusham)
                              </option>
                              <option value="கேட்டை (Kettai)">
                                கேட்டை (Kettai)
                              </option>
                              <option value="மூலம் (Moolam)">
                                மூலம் (Moolam)
                              </option>
                              <option value="பூராடம் (Pooradam)">
                                பூராடம் (Pooradam)
                              </option>
                              <option value="உத்திராடம் (Uthiradam)">
                                உத்திராடம் (Uthiradam)
                              </option>
                              <option value="திரைகடகம் (Thiruvonam)">
                                திரைகடகம் (Thiruvonam)
                              </option>
                              <option value="அவிட்டம் (Avittam)">
                                அவிட்டம் (Avittam)
                              </option>
                              <option value="சதயம் (Sathayam)">
                                சதயம் (Sathayam)
                              </option>
                              <option value="பூரட்டாதி (Purattadhi)">
                                பூரட்டாதி (Purattadhi)
                              </option>
                              <option value="உத்திரட்டாதி (Uthiraadhi)">
                                உத்திரட்டாதி (Uthiraadhi)
                              </option>
                              <option value="ரேவதி (Revadhi)">
                                ரேவதி (Revadhi)
                              </option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Rasi<span className="text-red-500">*</span>
                            </label>
                            <select
                              name="rasi"
                              value={formData.rasi}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              required
                            >
                              <option value="">Select Rasi</option>
                              <option value="மேஷம் (Mesham)">
                                மேஷம் (Mesham)
                              </option>
                              <option value="ரிஷபம் (Rishabam)">
                                ரிஷபம் (Rishabam)
                              </option>
                              <option value="மிதுனம் (Mithunam)">
                                மிதுனம் (Mithunam)
                              </option>
                              <option value="கடகம் (Kadagam)">
                                கடகம் (Kadagam)
                              </option>
                              <option value="சிம்மம் (Simmam)">
                                சிம்மம் (Simmam)
                              </option>
                              <option value="கன்னி (Kanni)">
                                கன்னி (Kanni)
                              </option>
                              <option value="துலாம் (Thulam)">
                                துலாம் (Thulam)
                              </option>
                              <option value="விருச்சிகம் (Viruchigam)">
                                விருச்சிகம் (Viruchigam)
                              </option>
                              <option value="தனுசு (Dhanusu)">
                                தனுசு (Dhanusu)
                              </option>
                              <option value="மகரம் (Magaram)">
                                மகரம் (Magaram)
                              </option>
                              <option value="கும்பம் (Kumbam)">
                                கும்பம் (Kumbam)
                              </option>
                              <option value="மீனம் (Meenam)">
                                மீனம் (Meenam)
                              </option>
                            </select>
                          </div>

                          <div className="mt-2 flex gap-4 items-end">
                            <div className="flex-1">
                              <label className="block mb-1 text-nowrap">
                                Sevvay Thoosam (செவ்வாய் தோசம்)
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="sevvay_thoosam"
                                value={formData.sevvay_thoosam || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>
                            {formData.sevvay_thoosam === "yes" && (
                              <div className="flex-1">
                                <label className="block mb-1 text-nowrap">
                                  Sevvay Thoosam Position
                                  <span className="text-red-500">*</span>
                                </label>
                                <select
                                  name="sevvay_thoosam_position"
                                  value={formData.sevvay_thoosam_position || ""}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                  <option value="">Select Position</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="4">4</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="12">12</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* File Inputs Section */}
                        <div className="w-full mt-8">
                          <div className="flex flex-col md:flex-row items-start gap-6 w-full justify-center">
                            {/* Profile Image */}
                            <div className="flex-1 min-w-[200px]">
                              <label className="block mb-1">
                                Profile Image
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative w-full flex items-center gap-2">
                                <label
                                  className="inline-block bg-[#800000] text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-200 hover:bg-[#a00000]"
                                  htmlFor="profile_img_input"
                                >
                                  Choose File
                                </label>
                                <span
                                  className="text-gray-500 text-base"
                                  id="profile_img_placeholder"
                                >
                                  {profileImgName || "No file chosen"}
                                </span>
                                <input
                                  id="profile_img_input"
                                  type="file"
                                  name="profile_img"
                                  onChange={(e) => {
                                    handleFileChange(e);
                                    setProfileImgName(
                                      e.target.files[0]?.name || ""
                                    );
                                  }}
                                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                            {/* Image 1 */}
                            <div className="flex-1 min-w-[200px]">
                              <label className="block mb-1">
                                Image 1<span className="text-red-500">*</span>
                              </label>
                              <div className="relative w-full flex items-center gap-2">
                                <label
                                  className="inline-block bg-[#800000] text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-200 hover:bg-[#a00000]"
                                  htmlFor="img_1_input"
                                >
                                  Choose File
                                </label>
                                <span
                                  className="text-gray-500 text-base"
                                  id="img_1_placeholder"
                                >
                                  {img1Name || "No file chosen"}
                                </span>
                                <input
                                  id="img_1_input"
                                  type="file"
                                  name="img_1"
                                  onChange={(e) => {
                                    handleFileChange(e);
                                    setImg1Name(e.target.files[0]?.name || "");
                                  }}
                                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                            {/* Image 2 */}
                            <div className="flex-1 min-w-[200px]">
                              <label className="block mb-1">
                                Image 2<span className="text-red-500">*</span>
                              </label>
                              <div className="relative w-full flex items-center gap-2">
                                <label
                                  className="inline-block bg-[#800000] text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-200 hover:bg-[#a00000]"
                                  htmlFor="img_2_input"
                                >
                                  Choose File
                                </label>
                                <span
                                  className="text-gray-500 text-base"
                                  id="img_2_placeholder"
                                >
                                  {img2Name || "No file chosen"}
                                </span>
                                <input
                                  id="img_2_input"
                                  type="file"
                                  name="img_2"
                                  onChange={(e) => {
                                    handleFileChange(e);
                                    setImg2Name(e.target.files[0]?.name || "");
                                  }}
                                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                            {/* Chart Image */}
                            <div className="flex-1 min-w-[200px]">
                              <label className="block mb-1">
                                Chart Image
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="relative w-full flex items-center gap-2">
                                <label
                                  className="inline-block bg-[#800000] text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-200 hover:bg-[#a00000]"
                                  htmlFor="chart_img_input"
                                >
                                  Choose File
                                </label>
                                <span
                                  className="text-gray-500 text-base"
                                  id="chart_img_placeholder"
                                >
                                  {chartImgName || "No file chosen"}
                                </span>
                                <input
                                  id="chart_img_input"
                                  type="file"
                                  name="chart_img"
                                  onChange={(e) => {
                                    handleFileChange(e);
                                    setChartImgName(
                                      e.target.files[0]?.name || ""
                                    );
                                  }}
                                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("location")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                            fill="#a00000"
                          />
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Location
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "location" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "location" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div>
                            <label className="block mb-1">
                              Country Of Birth
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="country_of_birth"
                              value={formData.country_of_birth}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Country Of Birth"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              City Of Birth
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="city_of_birth"
                              value={formData.city_of_birth}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="City Of Birth"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Country Of Resident
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="country_of_resident"
                              value={formData.country_of_resident}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Country Of Resident"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              City Of Resident
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="city_of_resident"
                              value={formData.city_of_resident}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="City Of Resident"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Country Of Citizenship
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="country_of_citizenship"
                              value={formData.country_of_citizenship}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Country Of Citizenship"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lifestyle Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("lifestyle")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"
                            fill="#8D1C21"
                          />
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Lifestyle
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "lifestyle" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "lifestyle" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          <div>
                            <label className="block mb-1">Eating Habits</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="eating_habit"
                              value={formData.eating_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Eating Habits</option>
                              <option value="vegetarian">Vegetarian</option>
                              <option value="vegan">Vegan</option>
                              <option value="nonVegetarian">
                                Non-Vegetarian
                              </option>
                              <option value="pescatarian">Pescatarian</option>
                              <option value="flexitarian">Flexitarian</option>
                              <option value="rawFood">Raw Food</option>
                              <option value="glutenFree">Gluten-Free</option>
                              <option value="lactoseFree">Lactose-Free</option>
                              <option value="organic">Organic</option>
                              <option value="halal">Halal</option>
                              <option value="kosher">Kosher</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Smoking Habits</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="smoking_habit"
                              value={formData.smoking_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Smoking Habits</option>
                              <option value="nonSmoker">Non-Smoker</option>
                              <option value="occasionalSmoker">
                                Occasional Smoker
                              </option>
                              <option value="regularSmoker">
                                Regular Smoker
                              </option>
                              <option value="quitSmoking">
                                Former Smoker (Quit)
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Drinking Habits
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="drinking_habit"
                              value={formData.drinking_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Drinking Habits</option>
                              <option value="nonDrinker">Non-Drinker</option>
                              <option value="occasionalDrinker">
                                Occasional Drinker
                              </option>
                              <option value="socialDrinker">
                                Social Drinker
                              </option>
                              <option value="regularDrinker">
                                Regular Drinker
                              </option>
                              <option value="quitDrinking">
                                Former Drinker (Quit)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Education & Professional Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("education")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 3L2 9l10 6 10-6-10-6zm0 13c-4.418 0-8-1.79-8-4V9l8 5 8-5v3c0 2.21-3.582 4-8 4z"
                            fill="#8D1C21"
                          />
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Education & Professional
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "education" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "education" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div>
                            <label className="block mb-1">
                              Primary School
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="primary_school"
                              value={formData.primary_school}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Primary School"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Secondary School
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="secondary_school"
                              value={formData.secondary_school}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Secondary School"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Education</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="education"
                              value={formData.education}
                              onChange={handleInputChange}
                            >
                              <option value="">Education</option>
                              <option value="Primary">Primary Education</option>
                              <option value="Kinder garten">
                                Kindergarten/Preschool
                              </option>
                              <option value="Grade 1 to 5">
                                Grade 1 to Grade 5
                              </option>
                              <option value="Middle School">
                                Middle School/Junior High School
                              </option>
                              <option value="Grade 6 to 8">
                                Grade 6/7 to Grade 8/9
                              </option>
                              <option value="High School">
                                High School/Senior High School
                              </option>
                              <option value="Grade 9 to 12">
                                Grade 9/10 to Grade 12
                              </option>
                              <option value="Higher Secondary">
                                Higher Secondary Education
                              </option>
                              <option value="Vocational Training">
                                Vocational Training
                              </option>
                              <option value="Diploma Programs">
                                Diploma Programs
                              </option>
                              <option value="Associates Degree">
                                Associate's Degree
                              </option>
                              <option value="Undergraduate">
                                Undergraduate Education
                              </option>
                              <option value="Bachelors Degree">
                                Bachelor's Degree
                              </option>
                              <option value="Graduate">
                                Graduate Education
                              </option>
                              <option value="Masters Degree">
                                Master's Degree
                              </option>
                              <option value="Doctoral Degree">
                                Doctoral Degree (Ph.D. or equivalent)
                              </option>
                              <option value="Post Doc Research">
                                Post-Doctoral Research
                              </option>
                              <option value="Professional Education">
                                Professional Education
                              </option>
                              <option value="Certifications">
                                Professional Certifications
                              </option>
                              <option value="Specialized Training">
                                Specialized Training
                              </option>
                              <option value="Continuing Education">
                                Continuing Education
                              </option>
                              <option value="Online Distance Education">
                                Online and Distance Education
                              </option>
                              <option value="Lifelong Learning">
                                Lifelong Learning
                              </option>
                              <option value="any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Education Details
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="education_details"
                              value={formData.education_details}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Education Details"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Occupation</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                            >
                              <option value="">Occupation</option>
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="engineer">Engineer</option>
                              <option value="doctor">Doctor</option>
                              <option value="nurse">Nurse</option>
                              <option value="programmer">Programmer</option>
                              <option value="artist">Artist</option>
                              <option value="scientist">Scientist</option>
                              <option value="lawyer">Lawyer</option>
                              <option value="chef">Chef</option>
                              <option value="entrepreneur">Entrepreneur</option>
                              <option value="accountant">Accountant</option>
                              <option value="writer">Writer</option>
                              <option value="police Officer">
                                Police Officer
                              </option>
                              <option value="firefighter">Firefighter</option>
                              <option value="pilot">Pilot</option>
                              <option value="architect">Architect</option>
                              <option value="pharmacist">Pharmacist</option>
                              <option value="salesperson">Salesperson</option>
                              <option value="athlete">Athlete</option>
                              <option value="musician">Musician</option>
                              <option value="journalist">Journalist</option>
                              <option value="psychologist">Psychologist</option>
                              <option value="chef">Chef</option>
                              <option value="mechanic">Mechanic</option>
                              <option value="designer">Designer</option>
                              <option value="veterinarian">Veterinarian</option>
                              <option value="electrician">Electrician</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Occupation Details
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="occupation_details"
                              value={formData.occupation_details}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Occupation Details"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Employed In</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="employed_in"
                              value={formData.employed_in}
                              onChange={handleInputChange}
                            >
                              <option value="">Employed In</option>
                              <option value="Government">Government</option>
                              <option value="Private Sector">
                                Private Sector
                              </option>
                              <option value="Non Profit">
                                Non-Profit Organization
                              </option>
                              <option value="Education">Education</option>
                              <option value="Healthcare">Healthcare</option>
                              <option value="Technology">Technology/IT</option>
                              <option value="Finance">Finance/Banking</option>
                              <option value="Manufacturing">
                                Manufacturing
                              </option>
                              <option value="Retail">Retail</option>
                              <option value="Hospitality">Hospitality</option>
                              <option value="Construction">Construction</option>
                              <option value="Media">Media/Entertainment</option>
                              <option value="Transportation">
                                Transportation/Logistics
                              </option>
                              <option value="Real Estate">Real Estate</option>
                              <option value="Agriculture">Agriculture</option>
                              <option value="Arts">Arts/Culture</option>
                              <option value="Consulting">Consulting</option>
                              <option value="Telecommunications">
                                Telecommunications
                              </option>
                              <option value="Energy">Energy</option>
                              <option value="Environment">
                                Environmental Services
                              </option>
                              <option value="Legal">Legal Services</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Annual Income
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="annual_income"
                              value={formData.annual_income}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Annual Income"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Family Details Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("family")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                          width="32"
                          height="32"
                        >
                          <g fill="#8D1C21">
                            <circle cx="14" cy="14" r="6" />
                            <path d="M14 22c-4.42 0-8 3.58-8 8v4h16v-4c0-4.42-3.58-8-8-8z" />

                            <circle cx="34" cy="14" r="6" />
                            <path d="M34 22c-4.42 0-8 3.58-8 8v4h16v-4c0-4.42-3.58-8-8-8z" />

                            <circle cx="24" cy="10" r="4" />
                            <path d="M24 16c-3.31 0-6 2.69-6 6v3h12v-3c0-3.31-2.69-6-6-6z" />

                            <circle cx="20" cy="8" r="3" />
                            <path d="M20 13c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4z" />

                            <path
                              d="M20 14L24 18M24 18L28 14"
                              stroke="#8D1C21"
                              stroke-width="1.5"
                              fill="none"
                            />
                            <path
                              d="M14 18L18 14M34 18L30 14"
                              stroke="#8D1C21"
                              stroke-width="1.5"
                              fill="none"
                            />
                          </g>
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Family Details
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "family" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "family" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div>
                            <label className="block mb-1">Family Value</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="family_value"
                              value={formData.family_value}
                              onChange={handleInputChange}
                            >
                              <option value="">Family Value</option>
                              <option value="conservative">Conservative</option>
                              <option value="moderate">Moderate</option>
                              <option value="modern">Modern</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Family Type</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="family_type"
                              value={formData.family_type}
                              onChange={handleInputChange}
                            >
                              <option value="">Family Type</option>
                              <option value="joint">Joint Family</option>
                              <option value="nuclear">Nuclear Family</option>
                              <option value="others">Others</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Family Status</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="family_status"
                              value={formData.family_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Family Status</option>
                              <option value="low">Lower Class</option>
                              <option value="lowerMiddle">
                                Lower Middle Class
                              </option>
                              <option value="middle">Middle Class</option>
                              <option value="upperMiddle">
                                Upper Middle Class
                              </option>
                              <option value="upper">Upper Class</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Fathers Name
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fathers_name"
                              value={formData.fathers_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Fathers Name"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Fathers Occupation
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fathers_occupation"
                              value={formData.fathers_occupation}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Fathers Occupation"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Fathers Native Place
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fathers_native_place"
                              value={formData.fathers_native_place}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Fathers Native Place"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Mothers Name
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="mothers_name"
                              value={formData.mothers_name}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Mothers Name"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Mothers Occupation
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="mothers_occupation"
                              value={formData.mothers_occupation}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Mothers Occupation"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Mothers Native Place
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="mothers_native_place"
                              value={formData.mothers_native_place}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Mothers Native Place"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Brothers<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="brothers"
                              value={formData.brothers}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Brothers"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">
                              Married Brothers
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="married_brothers"
                              value={formData.married_brothers}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Married Brothers"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Sisters<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="sisters"
                              value={formData.sisters}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Sisters"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Married Sisters
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="married_sisters"
                              value={formData.married_sisters}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Married Sisters"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              More Family Info
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="more_family"
                              value={formData.more_family}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Additional family information"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Partner Preferences Section - Collapsible */}
                  <div className="border border-[#ffd6d6] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-6 py-4 bg-white hover:bg-[#fff8f8] transition-colors"
                      onClick={() => handleSectionToggle("partner")}
                    >
                      <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M16 28s-8.5-7.36-11.5-11.09C2.13 14.13 2 11.5 2 11.5A7.5 7.5 0 0116 7.5a7.5 7.5 0 0114 4c0 0-.13 2.63-2.5 5.41C24.5 20.64 16 28 16 28z"
                            fill="#8D1C21"
                          />
                          <circle cx="12" cy="14" r="2" fill="#fff" />
                          <circle cx="20" cy="14" r="2" fill="#fff" />
                          <path
                            d="M10.5 18c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v1.5c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5V18z"
                            fill="#fff"
                          />
                          <path
                            d="M18.5 18c0-1.1.9-2 2-2h1c1.1 0 2 .9 2 2v1.5c0 .28-.22.5-.5.5h-4c-.28 0-.5-.22-.5-.5V18z"
                            fill="#fff"
                          />
                        </svg>
                      </span>
                      <h6 className="font-bold text-xl text-[#a00000]">
                        Edit Partner Preferences
                      </h6>
                      <span className="ml-auto">
                        {expandedSection === "partner" ? "−" : "+"}
                      </span>
                    </button>

                    {expandedSection === "partner" && (
                      <div className="px-6 pb-6">
                        <hr className="mb-6 border-[#ffd6d6]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div>
                            <label className="block mb-1">
                              Country of Resident
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_country_of_resident"
                              value={formData.partner_country_of_resident}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Country of Resident"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Resident Status
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_resident_status"
                              value={formData.partner_resident_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Resident Status</option>
                              <option value="citizen">Citizen</option>
                              <option value="permanent_resident">
                                Permanent Resident
                              </option>
                              <option value="temporary_resident">
                                Temporary Resident
                              </option>
                              <option value="visitor">Visitor</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Education</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_education"
                              value={formData.partner_education}
                              onChange={handleInputChange}
                            >
                              <option value="">Education</option>
                              <option value="Primary">Primary Education</option>
                              <option value="Kinder garten">
                                Kindergarten/Preschool
                              </option>
                              <option value="Grade 1 to 5">
                                Grade 1 to Grade 5
                              </option>
                              <option value="Middle School">
                                Middle School/Junior High School
                              </option>
                              <option value="Grade 6 to 8">
                                Grade 6/7 to Grade 8/9
                              </option>
                              <option value="High School">
                                High School/Senior High School
                              </option>
                              <option value="Grade 9 to 12">
                                Grade 9/10 to Grade 12
                              </option>
                              <option value="Higher Secondary">
                                Higher Secondary Education
                              </option>
                              <option value="Vocational Training">
                                Vocational Training
                              </option>
                              <option value="Diploma Programs">
                                Diploma Programs
                              </option>
                              <option value="Associates Degree">
                                Associate's Degree
                              </option>
                              <option value="Undergraduate">
                                Undergraduate Education
                              </option>
                              <option value="Bachelors Degree">
                                Bachelor's Degree
                              </option>
                              <option value="Graduate">
                                Graduate Education
                              </option>
                              <option value="Masters Degree">
                                Master's Degree
                              </option>
                              <option value="Doctoral Degree">
                                Doctoral Degree (Ph.D. or equivalent)
                              </option>
                              <option value="Post Doc Research">
                                Post-Doctoral Research
                              </option>
                              <option value="Professional Education">
                                Professional Education
                              </option>
                              <option value="Certifications">
                                Professional Certifications
                              </option>
                              <option value="Specialized Training">
                                Specialized Training
                              </option>
                              <option value="Continuing Education">
                                Continuing Education
                              </option>
                              <option value="Online Distance Education">
                                Online and Distance Education
                              </option>
                              <option value="Lifelong Learning">
                                Lifelong Learning
                              </option>
                              <option value="any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Occupation</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_occupation"
                              value={formData.partner_occupation}
                              onChange={handleInputChange}
                            >
                              <option value="">Occupation</option>
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="engineer">Engineer</option>
                              <option value="doctor">Doctor</option>
                              <option value="nurse">Nurse</option>
                              <option value="programmer">Programmer</option>
                              <option value="artist">Artist</option>
                              <option value="scientist">Scientist</option>
                              <option value="lawyer">Lawyer</option>
                              <option value="chef">Chef</option>
                              <option value="entrepreneur">Entrepreneur</option>
                              <option value="accountant">Accountant</option>
                              <option value="writer">Writer</option>
                              <option value="police Officer">
                                Police Officer
                              </option>
                              <option value="firefighter">Firefighter</option>
                              <option value="pilot">Pilot</option>
                              <option value="architect">Architect</option>
                              <option value="pharmacist">Pharmacist</option>
                              <option value="salesperson">Salesperson</option>
                              <option value="athlete">Athlete</option>
                              <option value="musician">Musician</option>
                              <option value="journalist">Journalist</option>
                              <option value="psychologist">Psychologist</option>
                              <option value="mechanic">Mechanic</option>
                              <option value="designer">Designer</option>
                              <option value="veterinarian">Veterinarian</option>
                              <option value="electrician">Electrician</option>
                              <option value="Other">Other</option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Annual Income
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_annual_income"
                              value={formData.partner_annual_income}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Annual Income"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Marital Status</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_marital_status"
                              value={formData.partner_marital_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Marital Status</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                              <option value="divorced">Divorced</option>
                              <option value="widowed">Widowed</option>
                              <option value="separated">Separated</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Minimum Age<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_minimum_age"
                              value={formData.partner_minimum_age}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Minimum Age"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Maximum Age<span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_maximum_age"
                              value={formData.partner_maximum_age}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Maximum Age"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Minimum Height
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_minimum_height"
                              value={formData.partner_minimum_height}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Minimum Height"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Maximum Height
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="partner_maximum_height"
                              value={formData.partner_maximum_height}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              placeholder="Maximum Height"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">
                              Physical Status
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_physical_status"
                              value={formData.partner_physical_status}
                              onChange={handleInputChange}
                            >
                              <option value="">Physical Status</option>
                              <option value="single">Single</option>
                              <option value="normal">Normal</option>
                              <option value="disabled">Disabled</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Mother Tongue</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_mother_tongue"
                              value={formData.partner_mother_tongue}
                              onChange={handleInputChange}
                            >
                              <option value="">Mother Tongue</option>
                              <option value="tamil">Tamil</option>
                              <option value="sinhala">Sinhala</option>
                              <option value="english">English</option>
                              <option value="other">Other</option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Religion</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_religion"
                              value={formData.partner_religion}
                              onChange={handleInputChange}
                            >
                              <option value="">Religion</option>
                              <option value="hindu">Hindu</option>
                              <option value="christian">Christian</option>
                              <option value="muslim">Muslim</option>
                              <option value="buddhist">Buddhist</option>
                              <option value="sikh">Sikh</option>
                              <option value="jewish">Jewish</option>
                              <option value="other">Other</option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Star Sign</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_star_sign"
                              value={formData.partner_star_sign}
                              onChange={handleInputChange}
                            >
                              <option value="">Star Sign</option>
                              <option value="அச்வினி (Aswini)">
                                அச்வினி (Aswini)
                              </option>
                              <option value="பரணி (Bharani)">
                                பரணி (Bharani)
                              </option>
                              <option value="கார்த்திகை (Karthigai)">
                                கார்த்திகை (Karthigai)
                              </option>
                              <option value="ரோகிணி (Rohini)">
                                ரோகிணி (Rohini)
                              </option>
                              <option value="மிருகசீரிடம் (Mrigasiridam)">
                                மிருகசீரிடம் (Mrigasiridam)
                              </option>
                              <option value="திருவாதிரை (Thiruvathirai)">
                                திருவாதிரை (Thiruvathirai)
                              </option>
                              <option value="புனர்பூசம் (Punarpoosam)">
                                புனர்பூசம் (Punarpoosam)
                              </option>
                              <option value="பூசம் (Poosam)">
                                பூசம் (Poosam)
                              </option>
                              <option value="ஆயில்யம் (Ayilyam)">
                                ஆயில்யம் (Ayilyam)
                              </option>
                              <option value="மகம் (Magam)">மகம் (Magam)</option>
                              <option value="பூரம் (Pooram)">
                                பூரம் (Pooram)
                              </option>
                              <option value="உத்திரம் (Uthiram)">
                                உத்திரம் (Uthiram)
                              </option>
                              <option value="ஹஸ்தம் (Hastham)">
                                ஹஸ்தம் (Hastham)
                              </option>
                              <option value="சித்திரை (Chithirai)">
                                சித்திரை (Chithirai)
                              </option>
                              <option value="சுவாதி (Swathi)">
                                சுவாதி (Swathi)
                              </option>
                              <option value="விசாகம் (Visakam)">
                                விசாகம் (Visakam)
                              </option>
                              <option value="அனுஷம் (Anusham)">
                                அனுஷம் (Anusham)
                              </option>
                              <option value="கேட்டை (Kettai)">
                                கேட்டை (Kettai)
                              </option>
                              <option value="மூலம் (Moolam)">
                                மூலம் (Moolam)
                              </option>
                              <option value="பூராடம் (Pooradam)">
                                பூராடம் (Pooradam)
                              </option>
                              <option value="உத்திராடம் (Uthiradam)">
                                உத்திராடம் (Uthiradam)
                              </option>
                              <option value="திரைகடகம் (Thiruvonam)">
                                திரைகடகம் (Thiruvonam)
                              </option>
                              <option value="அவிட்டம் (Avittam)">
                                அவிட்டம் (Avittam)
                              </option>
                              <option value="சதயம் (Sathayam)">
                                சதயம் (Sathayam)
                              </option>
                              <option value="பூரட்டாதி (Purattadhi)">
                                பூரட்டாதி (Purattadhi)
                              </option>
                              <option value="உத்திரட்டாதி (Uthiraadhi)">
                                உத்திரட்டாதி (Uthiraadhi)
                              </option>
                              <option value="ரேவதி (Revadhi)">
                                ரேவதி (Revadhi)
                              </option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Caste<span className="text-red-500">*</span>
                            </label>
                            <select
                              name="partner_cast"
                              value={formData.partner_cast}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">Select Caste</option>
                              <option value="Mixed Jaffna Vellalar">
                                Mixed Jaffna Vellalar
                              </option>
                              <option value="Vellalar">Vellalar</option>
                              <option value="Other Vellatar">
                                Other Vellatar
                              </option>
                              <option value="Viswakulam">Viswakulam</option>
                              <option value="Mukkulanthor">Mukkulanthor</option>
                              <option value="Koviyor">Koviyor</option>
                              <option value="Kurukulam">Kurukulam</option>
                              <option value="Bhramin">Bhramin</option>
                              <option value="Kounder">Kounder</option>
                              <option value="Veera Saiva Vellalar">
                                Veera Saiva Vellalar
                              </option>
                              <option value="Kujavar">Kujavar</option>
                              <option value="Chettiar">Chettiar</option>
                              <option value="Devar">Devar</option>
                              <option value="Kaller">Kaller</option>
                              <option value="Malayalee">Malayalee</option>
                              <option value="Mukkuwar">Mukkuwar</option>
                              <option value="Muthaliyar">Muthaliyar</option>
                              <option value="Naiyudu">Naiyudu</option>
                              <option value="Nadar">Nadar</option>
                              <option value="Pallar">Pallar</option>
                              <option value="Parawar">Parawar</option>
                              <option value="Senkunthar">Senkunthar</option>
                              <option value="Siviyar">Siviyar</option>
                              <option value="Dadar">Dadar</option>
                              <option value="Sayakkarar">Sayakkarar</option>
                              <option value="Nalavar">Nalavar</option>
                              <option value="Agamiliyar">Agamiliyar</option>
                              <option value="Dobi">Dobi</option>
                              <option value="Other">Other</option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Eating Habits</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_eating_habit"
                              value={formData.partner_eating_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Eating Habits</option>
                              <option value="vegetarian">Vegetarian</option>
                              <option value="vegan">Vegan</option>
                              <option value="nonVegetarian">
                                Non-Vegetarian
                              </option>
                              <option value="pescatarian">Pescatarian</option>
                              <option value="flexitarian">Flexitarian</option>
                              <option value="rawFood">Raw Food</option>
                              <option value="glutenFree">Gluten-Free</option>
                              <option value="lactoseFree">Lactose-Free</option>
                              <option value="organic">Organic</option>
                              <option value="halal">Halal</option>
                              <option value="kosher">Kosher</option>
                              <option value="Any">Any</option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">Smoking Habits</label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_smoking_habit"
                              value={formData.partner_smoking_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Smoking Habits</option>
                              <option value="nonSmoker">Non-Smoker</option>
                              <option value="occasionalSmoker">
                                Occasional Smoker
                              </option>
                              <option value="regularSmoker">
                                Regular Smoker
                              </option>
                              <option value="quitSmoking">
                                Former Smoker (Quit)
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block mb-1">
                              Drinking Habits
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              name="partner_drinking_habit"
                              value={formData.partner_drinking_habit}
                              onChange={handleInputChange}
                            >
                              <option value="">Drinking Habits</option>
                              <option value="nonDrinker">Non-Drinker</option>
                              <option value="occasionalDrinker">
                                Occasional Drinker
                              </option>
                              <option value="socialDrinker">
                                Social Drinker
                              </option>
                              <option value="regularDrinker">
                                Regular Drinker
                              </option>
                              <option value="quitDrinking">
                                Former Drinker (Quit)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 border-t pt-4 border-[#ffd6d6] bg-[#fff0f0] rounded-b-2xl">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-[#ffd6d6] rounded-lg text-[#a00000] bg-white hover:bg-[#ffeaea] transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#a00000] text-white rounded-lg hover:bg-[#8D1C21] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
