import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../utils/api";

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    inset: "auto",
    maxHeight: "90vh",
    margin: "0 auto",
    padding: "0",
    border: "none",
    borderRadius: "0.5rem",
    overflow: "hidden",
    width: "90%",
    maxWidth: "500px",
  },
};

const PackageUpgradeModal = ({
  isOpen,
  onClose,
  selectedPackage,
  isSubmitting,
  submitPackageRequest,
  imageFile,
  handleImageChange,
  renderImagePreview,
  paymentType,
  setPaymentType,
  installmentAmount,
  setInstallmentAmount,
  agreeToTerms,
  setAgreeToTerms,
  validationErrors,
  setValidationErrors,
}) => {
  const termsAndConditions = [
    "All payments are non-refundable once processed.",
    "Package upgrades are subject to admin approval.",
    "Premium Plan duration is 18 months from the date of approval.",
    "Ultimate Plan provides unlimited access until further notice.",
    "You agree to provide valid payment receipts for verification.",
    "The admin reserves the right to reject incomplete or suspicious submissions.",
    "Package benefits will be activated within 24-48 hours after approval.",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Package Upgrade Modal"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#8D1C21]">
              Upgrade to {selectedPackage}
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Payment Receipt Section */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Payment Receipt *
            </label>
            <input
              type="file"
              id="receipt-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="receipt-upload" className="cursor-pointer">
              {renderImagePreview()}
            </label>
            {validationErrors.receipt && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.receipt}
              </p>
            )}
          </div>

          {/* Payment Type Section */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Payment Type *</label>
            <div className="flex space-x-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  paymentType === "full"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => {
                  setPaymentType("full");
                  setInstallmentAmount("");
                }}
              >
                Full Payment
              </button>
              {selectedPackage === "Ultimate Plan" && (
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    paymentType === "installment"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setPaymentType("installment")}
                >
                  Installment
                </button>
              )}
            </div>

            {paymentType === "installment" &&
              selectedPackage === "Ultimate Plan" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Installment Plan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[30000, 45000, 60000, 90000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`p-2 border rounded-lg text-sm ${
                          parseInt(installmentAmount) === amount
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white hover:bg-gray-100 border-gray-300"
                        }`}
                        onClick={() => {
                          setInstallmentAmount(amount.toString());
                          setValidationErrors({
                            ...validationErrors,
                            installment: null,
                          });
                        }}
                      >
                        LKR {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  {validationErrors.installment && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.installment}
                    </p>
                  )}
                </div>
              )}
          </div>

          {/* Terms & Conditions */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Terms & Conditions
            </label>
            <ul className="text-sm list-disc pl-5 mb-3 max-h-[200px] overflow-y-auto">
              {termsAndConditions.map((term, i) => (
                <li key={i} className="mb-1">
                  {term}
                </li>
              ))}
            </ul>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeToTerms}
                onChange={() => {
                  setAgreeToTerms(!agreeToTerms);
                  setValidationErrors({ ...validationErrors, terms: null });
                }}
                className="mr-2"
              />
              <label htmlFor="agree-terms" className="text-sm">
                I agree to the terms and conditions *
              </label>
            </div>
            {validationErrors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.terms}
              </p>
            )}
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isSubmitting ? "bg-gray-400" : "bg-[#8D1C21] hover:bg-[#6e1519]"
              }`}
              onClick={submitPackageRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const CountdownTimer = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const diff = end - new Date();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="w-full mt-4 mb-1">
      <p className="text-xs font-bold text-rose-600 uppercase tracking-widest text-center mb-2 flex items-center justify-center gap-1">
        <span>🔥</span> Offer Ends In
      </p>
      <div className="flex items-center justify-center gap-1">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1">
            <div className="flex flex-col items-center bg-[#7C1625] text-white rounded-lg px-2 py-1.5 min-w-[42px] shadow">
              <span className="text-base font-extrabold leading-tight tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wide opacity-80">{unit.label}</span>
            </div>
            {i < 3 && (
              <span className="text-[#7C1625] font-extrabold text-lg leading-none">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BASE_PRICES = { "Premium Plan": 30000, "Ultimate Plan": 120000 };

const PricingTable = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [paymentType, setPaymentType] = useState("full");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [latestBooking, setLatestBooking] = useState(null);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (currentUser && location.state?.autoOpenModalFor) {
      openModal(location.state.autoOpenModalFor);
      window.history.replaceState({}, document.title);
    }
  }, [currentUser, location.state]);

  useEffect(() => {
    const fetchLatestBooking = async () => {
      const userId = currentUser?.id || currentUser?.user?.id;
      if (!userId) return;

      try {
        const res = await fetch(`${API}/api/user/user-pkg/${userId}`);
        const data = await res.json();
        if (data.success) {
          setLatestBooking(data.data);
        }
      } catch (error) {
        console.error("Error fetching latest booking:", error);
      }
    };

    fetchLatestBooking();
  }, [currentUser]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`${API}/api/discount-packages`);
        const data = await res.json();
        const now = new Date();
        const active = (Array.isArray(data) ? data : []).filter((d) => {
          if (d.status !== "active") return false;
          const start = new Date(d.start_date);
          const end = new Date(d.end_date);
          end.setHours(23, 59, 59, 999);
          return now >= start && now <= end;
        });
        setActiveDiscounts(active);
      } catch (err) {
        console.error("Error fetching discount packages:", err);
      }
    };
    fetchDiscounts();
  }, []);

  const getDiscount = (packageName) => {
    const pkgKey = packageName.toLowerCase().replace(" plan", "");
    return activeDiscounts.find(
      (d) => d.package === pkgKey || d.package === packageName
    );
  };

  const packages = [
    {
      name: "Basic Plan",
      price: "LKR 0",
      features: [
        "Member ID",
        "Name",
        "Age",
        "Occupation",
        "Country & Religion",
      ],
      isDefault: true,
    },
    {
      name: "Premium Plan",
      price: "LKR 30000",
      features: [
        "Basic Details",
        "View Chart",
        "Lifestyle",
        "Partially Family Details",
      ],
      duration: "1.5 Years",
    },
    {
      name: "Ultimate Plan",
      price: "LKR 120000",
      features: [
        "Basic Details",
        "View Chart",
        "Full Family Details",
        "View Photos",
        "Full Access",
      ],
      duration: "Unlimited",
    },
  ];

  const validateForm = () => {
    const errors = {};

    if (!selectedPackage) {
      errors.package = "Please select a package";
    }

    if (!imageFile) {
      errors.receipt = "Payment receipt is required";
    }

    if (!agreeToTerms) {
      errors.terms = "You must agree to the terms";
    }

    if (selectedPackage === "Premium Plan" && paymentType !== "full") {
      errors.payment = "Premium Plan only accepts full payment";
    }

    if (paymentType === "installment") {
      if (!installmentAmount) {
        errors.installment = "Please select an installment amount";
      } else if (isNaN(installmentAmount) || parseInt(installmentAmount) <= 0) {
        errors.installment = "Please select a valid installment amount";
      } else if (
        selectedPackage === "Ultimate Plan" &&
        ![30000, 45000, 60000, 90000].includes(parseInt(installmentAmount))
      ) {
        errors.installment =
          "Please select one of the available installment options";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPlanLevel = (planName) => {
    if (!planName) return 0;
    const name = planName.toLowerCase();
    if (name.includes("basic")) return 0;
    if (name.includes("standard") || name.includes("premium")) return 1;
    if (name.includes("ultimate")) return 2;
    return -1;
  };

  const isCurrentPlan = (packageName) => {
    const userPlan =
      currentUser?.package_plan || currentUser?.user?.package_plan;
    if (!userPlan) return false;

    if (packageName === "Premium Plan" && userPlan === "Standard Plan") {
      return true;
    }

    return userPlan === packageName;
  };

  const userPlanLevel = currentUser
    ? getPlanLevel(currentUser?.package_plan || currentUser?.user?.package_plan)
    : -1;

  const packagesWithStatus = packages.map((pkg) => {
    const isCurrent = isCurrentPlan(pkg.name);
    const pkgLevel = getPlanLevel(pkg.name);

    // Determine button text
    let btnText = "Upgrade";
    let isPending = false;

    if (!currentUser) {
      btnText = "Choose Plan";
    } else if (isCurrent) {
      btnText = "Current Plan";
    } else if (latestBooking?.package === pkg.name) {
      btnText = "Request Pending";
      isPending = true;
    } else if (pkg.isDefault) {
      btnText = "Default Plan";
    } else if (pkgLevel < userPlanLevel) {
      btnText = "Unavailable";
    }

    // Determine if disabled
    let disabled = false;
    if (currentUser) {
      disabled =
        isCurrent || pkg.isDefault || isPending || pkgLevel < userPlanLevel;
    }

    const discount = getDiscount(pkg.name);
    const basePrice = BASE_PRICES[pkg.name];
    let discountInfo = null;
    if (discount && basePrice) {
      const discountedPrice = parseInt(discount.amount);
      const savings = basePrice - discountedPrice;
      const percentage = Math.round((savings / basePrice) * 100);
      discountInfo = {
        originalPrice: basePrice,
        discountedPrice,
        savings,
        percentage,
        endDate: discount.end_date,
      };
    }

    return {
      ...pkg,
      isCurrentPlan: isCurrent,
      buttonText: btnText,
      disabled: disabled,
      canUpgrade: !disabled,
      discountInfo,
    };
  });

  const openModal = (packageName) => {
    if (!currentUser) {
      navigate("/sign-up", { state: { selectedPackage: packageName } });
      return;
    }

    if (isCurrentPlan(packageName)) {
      toast.info(`You're currently using the ${packageName}`);
      return;
    }

    setSelectedPackage(packageName);
    setImageFile(null);
    setPreviewUrl("");
    setAgreeToTerms(false);
    setPaymentType("full");
    setInstallmentAmount("");
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setImageFile(file);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setValidationErrors({ ...validationErrors, receipt: null });
  };

  const renderImagePreview = () => {
    if (!imageFile) {
      return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Click to upload payment receipt
          </p>
          <p className="text-xs text-gray-500">.jpg, .jpeg, .png, .gif, .webp, .bmp (Max 10MB)</p>
        </div>
      );
    }

    return (
      <div className="relative group">
        <img
          src={previewUrl}
          alt="Payment receipt"
          className="w-full h-48 object-contain rounded-lg border"
        />
        <button
          type="button"
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setImageFile(null);
            setPreviewUrl("");
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  const calculateExpirationDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split("T")[0];
  };

  const submitPackageRequest = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      let packageDetails = {};
      switch (selectedPackage) {
        case "Premium Plan":
          packageDetails = {
            amount: 30000,
            duration: "1.5 years",
            exp_date: calculateExpirationDate(18),
          };
          break;
        case "Ultimate Plan":
          packageDetails = {
            amount: 120000,
            duration: "unlimited",
            exp_date: null,
          };
          break;
        default:
          throw new Error("Invalid package selection");
      }

      const installAmount =
        paymentType === "installment" ? parseInt(installmentAmount) : 0;
      const balance =
        paymentType === "installment"
          ? packageDetails.amount - installAmount
          : 0;

      const formData = new FormData();
      formData.append("customer_id", currentUser?.id || currentUser?.user?.id);
      formData.append("package", selectedPackage);
      formData.append("pay_type", paymentType);
      formData.append("amount", packageDetails.amount.toString());
      formData.append("install_amount", installAmount.toString());
      formData.append("balance", balance.toString());
      formData.append("income", packageDetails.amount.toString());
      formData.append("exp_date", packageDetails.exp_date || "");
      formData.append("recipt_img", imageFile);

      const response = await fetch(`${API}/api/user/booked-packages`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      toast.success("Package upgrade request submitted successfully!");
      setIsModalOpen(false);
      // Refresh latest booking to show "Request Pending" immediately
      const userId = currentUser?.id || currentUser?.user?.id;
      if (userId) {
        const res = await fetch(`${API}/api/user/user-pkg/${userId}`);
        const data = await res.json();
        if (data.success) {
          setLatestBooking(data.data);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-semibold font-Sacremento text-[#8D1C21] tracking-tight text-center">
          Our Pricing
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 justify-center"
          style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
        >
          {packagesWithStatus.map((pkg, index) => {
            const d = pkg.discountInfo;
            return (
              <div
                key={index}
                className={`relative text-center rounded-lg shadow-lg p-8 flex flex-col items-center transform transition-all duration-300 ${
                  pkg.isCurrentPlan
                    ? "border-2 border-[#8D1C21]"
                    : d
                    ? "border-2 border-orange-400"
                    : "border border-gray-200"
                } bg-white hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8D1C21]/20 max-w-sm`}
              >
                {/* Top Colored Border / Sale Banner */}
                <div
                  className={`absolute top-0 left-0 w-full h-6 rounded-t-lg ${
                    d
                      ? "bg-gradient-to-r from-[#8D1C21] via-rose-600 to-orange-500"
                      : "bg-[#8D1C21]"
                  }`}
                ></div>

                {/* % OFF Badge */}
                {d && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-lg z-10 tracking-wide">
                    {d.percentage}% OFF
                  </div>
                )}

                {/* Price Circle */}
                <div
                  className={`absolute -top-8 text-white w-24 h-24 flex flex-col items-center justify-center rounded-full shadow-md ${
                    d
                      ? "bg-gradient-to-br from-[#8D1C21] to-orange-500"
                      : "bg-[#8D1C21]"
                  }`}
                >
                  {d ? (
                    <>
                      <span className="text-[9px] line-through opacity-70 leading-tight">
                        LKR {d.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-extrabold leading-tight px-1 text-center">
                        LKR {d.discountedPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">{pkg.price}</span>
                  )}
                </div>

                {/* Package Name */}
                <h3 className="mt-20 text-2xl font-extrabold text-[#8D1C21]">
                  {pkg.name}
                </h3>

                {/* Discount Price Block */}
                {d && (
                  <div className="mt-3 mb-2 w-full bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-200 rounded-xl px-4 py-3">
                    <p className="text-gray-400 line-through text-sm">
                      LKR {d.originalPrice.toLocaleString()}
                    </p>
                    <p className="text-3xl font-extrabold text-[#8D1C21] leading-tight">
                      LKR {d.discountedPrice.toLocaleString()}
                    </p>
                    <p className="text-green-600 text-xs font-bold mt-1 flex items-center justify-center gap-1">
                      <span>✓</span> You save LKR {d.savings.toLocaleString()}&nbsp;({d.percentage}% off)
                    </p>
                  </div>
                )}

                {/* Duration */}
                {pkg.duration && (
                  <p className="text-gray-500 text-base mb-4 mt-1">
                    Duration: {pkg.duration}
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-6 text-gray-600 text-lg font-medium leading-relaxed">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>

                {/* Countdown Timer */}
                {d && <CountdownTimer endDate={d.endDate} />}

                {/* Button */}
                <button
                  className={`mt-auto w-full py-3 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                    pkg.disabled
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : d
                      ? "bg-gradient-to-r from-[#8D1C21] to-orange-500 hover:from-[#6e1519] hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-[#8D1C21] hover:bg-[#6e1519] text-white shadow-lg"
                  }`}
                  onClick={() => openModal(pkg.name)}
                  disabled={pkg.disabled}
                >
                  {d && !pkg.disabled ? `🔥 ${pkg.buttonText}` : pkg.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <PackageUpgradeModal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        selectedPackage={selectedPackage}
        isSubmitting={isSubmitting}
        submitPackageRequest={submitPackageRequest}
        imageFile={imageFile}
        handleImageChange={handleImageChange}
        renderImagePreview={renderImagePreview}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        installmentAmount={installmentAmount}
        setInstallmentAmount={setInstallmentAmount}
        agreeToTerms={agreeToTerms}
        setAgreeToTerms={setAgreeToTerms}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
      />
    </div>
  );
};

export default PricingTable;
