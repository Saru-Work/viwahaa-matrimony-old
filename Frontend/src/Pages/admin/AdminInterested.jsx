import { Search } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaHome, FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/api";

function AdminInterested() {
  const [interests, setInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]); // Store all interests
  const [loading, setLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(interests.length / itemsPerPage);
  const paginatedInterests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return interests.slice(start, start + itemsPerPage);
  }, [interests, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [interests.length]);

  // Fetch interests data
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(`${API}/api/admin/interests`);
        if (!response.ok) {
          throw new Error("Failed to fetch interests");
        }
        const data = await response.json();
        setInterests(data);
        setAllInterests(data); // Store all interests
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // Search function
  const handleSearch = async () => {
    try {
      if (searchKey.trim() === "") {
        // If search is empty, show all interests
        setInterests(allInterests);
        return;
      }

      const response = await fetch(
        `${API}/api/admin/interests/search?search=${searchKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to search interests");
      }
      const data = await response.json();
      setInterests(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Reset to show all interests when search is cleared
  useEffect(() => {
    if (searchKey === "") {
      setInterests(allInterests);
    }
  }, [searchKey, allInterests]);

  // Delete functions
  const handleDeleteClick = (interest) => {
    setSelectedInterest(interest);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${API}/api/admin/interests/${selectedInterest.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete interest");
      }

      // Update both interests and allInterests
      const updatedInterests = interests.filter(
        (i) => i.id !== selectedInterest.id
      );
      const updatedAllInterests = allInterests.filter(
        (i) => i.id !== selectedInterest.id
      );

      setInterests(updatedInterests);
      setAllInterests(updatedAllInterests);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
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
      <div className="card bg-white shadow-sm rounded-lg mb-6">
        <div className="card-body p-4">
          <h5 className="text-xl font-semibold mb-3">Interested</h5>

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
                  / Interested
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </div>

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

      {/* Interests Table */}
      <div className="card bg-white shadow-sm rounded-lg mb-6">
        <div className="card-body p-4">
          <h5 className="text-xl font-semibold mb-3">Interested</h5>

          <div className="table-responsive mt-6">
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
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium font-workSans text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedInterests.map((interest, index) => (
                    <tr key={interest.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-4 py-3">{interest.name}</td>
                      <td className="px-4 py-3">{interest.email}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteClick(interest)}
                          className="px-2 py-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-bold text-gray-700">{Math.min(currentPage * itemsPerPage, interests.length)}</span> of{" "}
                <span className="font-bold text-gray-700">{interests.length}</span> entries
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
    </div>
  );
}

export default AdminInterested;
