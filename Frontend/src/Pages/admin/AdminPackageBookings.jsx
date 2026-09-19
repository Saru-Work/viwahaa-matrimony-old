import { Search } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHome, FaSearch, FaTrash, FaEdit, FaMoneyBill } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/api";

function AdminPackageBookings() {
  const [bookings, setBookings] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return bookings.slice(start, start + itemsPerPage);
  }, [bookings, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [bookings.length]);

  // Fetch bookings and discounts data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API}/api/admin/bookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const response = await fetch(`${API}/api/discount-packages`);
        if (!response.ok) {
          throw new Error("Failed to fetch discount packages");
        }
        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        // Optionally handle error
      }
    };

    fetchBookings();
    fetchDiscounts();
  }, []);

  // Search function
  const handleSearch = () => {
    const searchTerm = searchKey.trim().toLowerCase();

    if (!searchTerm) {
      // If search is empty, fetch all bookings again
      setLoading(true);
      fetch(`${API}/api/admin/bookings`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch bookings");
          }
          return response.json();
        })
        .then((data) => {
          const bookingsWithDefaultPlan = data.map((booking) => ({
            ...booking,
            package_plan: booking.package || "No Plan",
          }));
          setBookings(bookingsWithDefaultPlan);
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // Filter locally by name (first_name + last_name)
    const filtered = bookings.filter(
      (booking) =>
        (booking.first_name &&
          booking.first_name.toLowerCase().includes(searchTerm)) ||
        (booking.last_name &&
          booking.last_name.toLowerCase().includes(searchTerm)) ||
        `${booking.first_name} ${booking.last_name}`
          .toLowerCase()
          .includes(searchTerm)
    );

    setBookings(filtered);
  };

  // Delete functions
  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${selectedBooking.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      setShowDeleteModal(false);
      setSuccessMessage("Booking deleted successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Pay functions
  const handlePayClick = (booking) => {
    setSelectedBooking(booking);
    setShowPayModal(true);
  };

  const confirmPayment = async () => {
    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${selectedBooking.id}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ fullPayment: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const updatedBookings = bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, balance: "0" } : b
      );
      setBookings(updatedBookings);
      setShowPayModal(false);
      setSuccessMessage("Payment processed successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Status change functions
  const handleStatusClick = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const saveStatusChange = async () => {
    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${selectedBooking.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      // Update both the booking package and the customer's package_plan in the UI
      const updatedBookings = bookings.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              package: newStatus, // Update the booked package
              package_plan: newStatus, // Update the customer's current plan
            }
          : b
      );

      setBookings(updatedBookings);
      setShowStatusModal(false);
      setSuccessMessage("Package plan updated successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.message);
    }
  };

  // Image modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Date edit functions
  const handleDateEditClick = (booking) => {
    setSelectedBooking(booking);
    setEditExpiryDate(booking.exp_date);
    setShowDateModal(true);
  };

  const updateExpiryDate = async () => {
    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${selectedBooking.id}/expiry`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ exp_date: editExpiryDate }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expiry date");
      }

      const updatedBookings = bookings.map((b) =>
        b.id === selectedBooking.id ? { ...b, exp_date: editExpiryDate } : b
      );
      setBookings(updatedBookings);
      setShowDateModal(false);
      setSuccessMessage("Expiry date updated successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-4"><Skeleton height={30} width={200} /><Skeleton height={20} width={150} /></div>
        <div className="bg-white rounded-xl overflow-hidden shadow"><div className="p-4 border-b"><Skeleton height={40} /></div><Skeleton height={400} /></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Breadcrumb Card */}
      <div className="card bg-white shadow-sm rounded-lg mb-6 ">
        <div className="card-body p-4">
          <h5 className="text-xl font-semibold mb-3">Package Booking</h5>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex items-center space-x-3 text-sm text-gray-600">
              <li className="breadcrumb-item flex items-center">
                <a href="/" className="hover:text-blue-600 flex items-center">
                  <FaHome className="mr-2 text-lg" />
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="#" className="hover:text-blue-600">
                  / Package Booking
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="alert alert-success mb-4">
          <div className="flex-1">
            <label className="text-sm">{successMessage}</label>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-error mb-4">
          <div className="flex-1">
            <label className="text-sm">{errorMessage}</label>
          </div>
        </div>
      )}

      {/* Search Row */}
      <div className="flex justify-center mb-4 w-full">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyUp={handleSearch}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="card-header p-4">
          <h4>Package Booking</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      WhatsApp
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Request Package
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Pay Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Package Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Install Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Created Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Receipt
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Current Package
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Pay
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedBookings.map((booking, index) => {
                    // Find discount for this booking
                    let displayAmount = `₹${booking.amount}`;
                    if (
                      discounts &&
                      discounts.length > 0 &&
                      booking.created_at
                    ) {
                      // Helper to get YYYY-MM-DD from any date string
                      const toDateStr = (dt) => {
                        if (!dt) return "";
                        const d = new Date(dt);
                        return d.toISOString().slice(0, 10);
                      };
                      const bookingDateStr = toDateStr(booking.created_at);
                      const found = discounts.find((d) => {
                        const discountName = (d.package || d.package_plan || "")
                          .trim()
                          .toLowerCase();
                        const bookingPlan = (booking.package_plan || "")
                          .trim()
                          .toLowerCase();
                        const bookingPkg = (booking.package || "")
                          .trim()
                          .toLowerCase();
                        return (
                          discountName === bookingPlan ||
                          discountName === bookingPkg ||
                          (discountName === "premium" &&
                            (bookingPlan === "premium plan" ||
                              bookingPkg === "premium plan"))
                        );
                      });
                      if (!found) {
                        console.log(
                          "No discount found for booking:",
                          bookingDateStr,
                          booking
                        );
                      } else {
                        // Debug output
                        console.log(
                          "Booking:",
                          bookingDateStr,
                          "Start:",
                          found.start_date,
                          "End:",
                          found.end_date,
                          "Draft:",
                          found.draft_date,
                          "Discount:",
                          found
                        );
                        if (
                          (found.status === "active" ||
                            found.status === "draft") &&
                          bookingDateStr >= found.start_date &&
                          bookingDateStr <= found.end_date &&
                          (!found.draft_date ||
                            bookingDateStr < found.draft_date)
                        ) {
                          displayAmount = `₹${found.amount}`;
                          console.log(
                            "Discount applied:",
                            displayAmount,
                            "Booking:",
                            booking,
                            "Discount:",
                            found
                          );
                        } else {
                          console.log(
                            "Original amount:",
                            displayAmount,
                            "Booking:",
                            booking,
                            "Discount:",
                            found
                          );
                        }
                      }
                    }
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-3">
                          {booking.first_name} {booking.last_name}
                        </td>
                        <td className="px-4 py-3">{booking.contact_no}</td>
                        <td className="px-4 py-3">{booking.whatsapp_no}</td>
                        <td className="px-4 py-3">{booking.package}</td>
                        <td className="px-4 py-3">{booking.pay_type}</td>
                        <td className="px-4 py-3">
                          {displayAmount}
                          {(() => {
                            // Show (Discount) label if discount is actually applied
                            if (
                              discounts &&
                              discounts.length > 0 &&
                              booking.created_at
                            ) {
                              const toDateStr = (dt) => {
                                if (!dt) return "";
                                const d = new Date(dt);
                                return d.toISOString().slice(0, 10);
                              };
                              const bookingDateStr = toDateStr(
                                booking.created_at
                              );
                              const found = discounts.find((d) => {
                                const discountName = (
                                  d.package ||
                                  d.package_plan ||
                                  ""
                                )
                                  .trim()
                                  .toLowerCase();
                                const bookingPlan = (booking.package_plan || "")
                                  .trim()
                                  .toLowerCase();
                                const bookingPkg = (booking.package || "")
                                  .trim()
                                  .toLowerCase();
                                return (
                                  discountName === bookingPlan ||
                                  discountName === bookingPkg ||
                                  (discountName === "premium" &&
                                    (bookingPlan === "premium plan" ||
                                      bookingPkg === "premium plan"))
                                );
                              });
                              if (
                                found &&
                                (found.status === "active" ||
                                  found.status === "draft") &&
                                bookingDateStr >= found.start_date &&
                                bookingDateStr <= found.end_date &&
                                (!found.draft_date ||
                                  bookingDateStr < found.draft_date)
                              ) {
                                return (
                                  <span className="ml-2 text-green-600 font-semibold">
                                    (Discount)
                                  </span>
                                );
                              }
                            }
                            return null;
                          })()}
                        </td>
                        <td className="px-4 py-3">{booking.install_amount}</td>
                        <td className="px-4 py-3">{booking.balance}</td>
                        <td className="px-4 py-3">
                          {booking.created_at
                            ? new Date(booking.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {booking.recipt_img ? (
                            <img
                              src={`${API}/uploads/receipts/${booking.recipt_img}`}
                              className="rounded-full w-10 h-10 cursor-pointer"
                              onClick={() =>
                                handleImageClick(booking.recipt_img)
                              }
                              alt="Receipt"
                              onError={(e) => {
                                const img = e.target;
                                // Fallback 1: try mobile.viwahaa.com
                                if (!img.src.includes("mobile.viwahaa.com")) {
                                  img.src = img.src.replace(
                                    "api.viwahaa.com",
                                    "mobile.viwahaa.com"
                                  );
                                } else if (!img.src.includes("/uploads/")) {
                                  // Fallback 2: try /uploads/ path
                                  img.src = `${API}/uploads/${booking.recipt_img}`;
                                } else {
                                  // Final fallback: default image
                                  img.src = "/default-receipt.png";
                                  img.onerror = null;
                                }
                              }}
                            />
                          ) : (
                            <span className="text-gray-400">No Receipt</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{booking.exp_date}</td>
                        <td className="px-4 py-3">
                          <button
                            className={`px-4 py-1 text-white rounded-full ${
                              booking.package_plan === "Basic Plan"
                                ? "bg-green-500"
                                : booking.package_plan === "Standard Plan"
                                ? "bg-blue-500"
                                : booking.package_plan === "Premium Plan"
                                ? "bg-purple-500"
                                : "bg-red-500"
                            }`}
                            onClick={() => handleStatusClick(booking)}
                          >
                            {booking.package_plan}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="px-4 py-1 text-white font-workSans bg-orange-400 rounded-lg"
                            onClick={() => handlePayClick(booking)}
                          >
                            Pay Full Balance
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDateEditClick(booking)}
                              className="px-2 py-1 text-white bg-yellow-400 rounded-full"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(booking)}
                              className="px-2 py-1 text-white bg-red-600 rounded-full"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-bold text-gray-700">{Math.min(currentPage * itemsPerPage, bookings.length)}</span> of{" "}
                <span className="font-bold text-gray-700">{bookings.length}</span> bookings
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 text-sm font-bold rounded-lg border ${currentPage === pageNum ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-100"}`}>{pageNum}</button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && <><span className="text-gray-400">...</span><button onClick={() => setCurrentPage(totalPages)} className={`w-8 h-8 text-sm font-bold rounded-lg border ${currentPage === totalPages ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-100"}`}>{totalPages}</button></>}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-red-600">
                      Warning!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        If you want to remove this data, <b>you can't undo</b>,
                        It will affect the relevant records!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay Confirmation Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium">
                      Confirm Payment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to pay the full balance? This will
                        add the balance amount to the installment amount and
                        zero out the balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmPayment}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-red-600">
                      Change Package
                    </h3>
                    <div className="mt-4">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Plan
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="">Select Plan</option>
                          <option value="Basic Plan">Basic Plan</option>
                          <option value="Standard Plan">Standard Plan</option>
                          <option value="Premium Plan">Premium Plan</option>
                          <option value="Ultimate Plan">Ultimate Plan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={saveStatusChange}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-center">
                      <img
                        src={`${API}/uploads/receipts/${selectedImage}`}
                        alt="Receipt"
                        className="max-w-full h-auto"
                        onError={(e) => {
                          // First try the alternative path without /receipts/
                          if (e.target.src.includes("/receipts/")) {
                            e.target.src = `${API}/uploads/${selectedImage}`;
                          }

                          // If that also fails, use a default image
                          else {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = `https://mobile.viwahaa.com/uploads/receipts/${selectedImage}`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Edit Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium">
                      Edit Expiry Date
                    </h3>
                    <div className="mt-4">
                      <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                          value={editExpiryDate}
                          onChange={(e) => setEditExpiryDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={updateExpiryDate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowDateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPackageBookings;
