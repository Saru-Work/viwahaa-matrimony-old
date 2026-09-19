import React, { useState, useEffect } from "react";

import { FaEdit, FaTrash, FaSearch, FaHome } from "react-icons/fa";
import { API } from "../../utils/api";

const initialForm = {
  package: "",
  amount: "",
  startDate: "",
  endDate: "",
  status: "active",
};

const packageOptions = [
 
  { value: "premium", label: "Premium Plan" },
  { value: "ultimate", label: "Ultimate Plan" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

function DiscountPackage() {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [activeSection, setActiveSection] = useState("discountpackage");
  const [searchKey, setSearchKey] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch discounts from backend
  useEffect(() => {
    fetch(`${API}/api/discount-packages`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data))
      .catch(() => setDiscounts([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // If status is changed to draft and was not draft before, set draft_date
      if (name === "status" && value === "draft" && prev.status !== "draft") {
        return {
          ...prev,
          [name]: value,
          draft_date: new Date().toISOString().slice(0, 10),
        };
      }
      // If status is changed from draft to active, clear draft_date
      if (name === "status" && value !== "draft" && prev.status === "draft") {
        const updated = { ...prev, [name]: value };
        delete updated.draft_date;
        return updated;
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Always send dates in YYYY-MM-DD format
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      // Handles both ISO and YYYY-MM-DD
      return dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
    };
    const payload = {
      ...form,
      startDate: formatDate(form.startDate),
      endDate: formatDate(form.endDate),
      draft_date: form.draft_date || undefined,
    };
    if (editId) {
      // Update
      await fetch(`${API}/api/discount-packages/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // Create
      await fetch(`${API}/api/discount-packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    // Refresh list
    fetch(`${API}/api/discount-packages`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data));
    setShowForm(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleEdit = (id) => {
    const discount = discounts.find((d) => d.id === id);
    // Always use backend fields for editing, format for input
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
    };
    setForm({
      package: discount.package,
      amount: discount.amount,
      startDate: formatDate(discount.start_date),
      endDate: formatDate(discount.end_date),
      status: discount.status,
      draft_date: discount.draft_date || "",
    });
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`${API}/api/discount-packages/${deleteId}`, { method: "DELETE" });
    fetch(`${API}/api/discount-packages`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleSearch = async () => {
    if (!searchKey.trim()) {
      fetch(`${API}/api/discount-packages`)
        .then((res) => res.json())
        .then((data) => setDiscounts(data));
      return;
    }
    const term = searchKey.toLowerCase();
    fetch(`${API}/api/discount-packages`)
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(
          data.filter(
            (d) =>
              packageOptions
                .find((p) => p.value === d.package)
                ?.label.toLowerCase()
                .includes(term) ||
              d.amount.toString().includes(term) ||
              d.start_date.includes(term) ||
              d.end_date.includes(term) ||
              statusOptions
                .find((s) => s.value === d.status)
                ?.label.toLowerCase()
                .includes(term)
          )
        );
      });
  };

  const handleClearSearch = () => {
    setSearchKey("");
    fetch(`${API}/api/discount-packages`)
      .then((res) => res.json())
      .then((data) => setDiscounts(data));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar and header are assumed to be handled by parent layout */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 mt-12">
          {/* Breadcrumb Card */}
          <div className="card bg-white shadow-sm rounded-lg mb-6">
            <div className="card-body p-4">
              <h5 className="text-xl font-semibold mb-3">Discount Package</h5>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb flex items-center space-x-3 text-sm text-gray-600">
                  <li className="breadcrumb-item flex items-center">
                    <a
                      href="/"
                      className="hover:text-blue-600 flex items-center"
                    >
                      <FaHome className="mr-2 text-lg" />
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="hover:text-blue-600">
                      / Discount Package
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* Main card for discount management */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Discount Package
                </h1>
                <p className="text-gray-500 text-sm">
                  Manage package discount offers for special occasions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <input
                    type="text"
                    className="border px-3 py-2 rounded-lg text-sm w-full pr-10"
                    placeholder="Search discount..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"
                    onClick={handleSearch}
                    tabIndex={-1}
                  >
                    <FaSearch />
                  </button>
                </div>
                <button
                  className="bg-gray-200 text-gray-700 px-2 py-2 rounded-lg"
                  onClick={handleClearSearch}
                >
                  Clear
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 ml-2"
                  onClick={() => {
                    setShowForm(true);
                    setForm(initialForm);
                    setEditId(null);
                  }}
                >
                  Add New Discount
                </button>
              </div>
            </div>
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={() => {
                      setShowForm(false);
                      setForm(initialForm);
                      setEditId(null);
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold mb-4">
                      {editId ? "Edit Discount" : "Add New Discount"}
                    </h3>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Package</label>
                      <select
                        name="package"
                        value={form.package}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        <option value="">Select Package</option>
                        {packageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">
                        Discount Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                        min="0"
                      />
                    </div>
                    <div className="mb-4 flex gap-4">
                      <div className="flex-1">
                        <label className="block mb-1 font-medium">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={form.startDate}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-1 font-medium">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={form.endDate}
                          onChange={handleChange}
                          className="w-full border px-3 py-2 rounded"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 font-medium">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => {
                          setShowForm(false);
                          setForm(initialForm);
                          setEditId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        {editId ? "Update Discount" : "Create Discount"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Package
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Draft Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {discounts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No discounts available.
                      </td>
                    </tr>
                  ) : (
                    discounts.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {packageOptions.find((p) => p.value === d.package)
                            ?.label || d.package}
                        </td>
                        <td className="px-4 py-3 text-gray-500">₹{d.amount}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {d.start_date ? d.start_date.slice(0, 10) : ""}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {d.end_date ? d.end_date.slice(0, 10) : ""}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {d.draft_date
                            ? d.draft_date.slice(0, 10)
                            : d.status === "draft"
                            ? d.end_date
                              ? d.end_date.slice(0, 10)
                              : "-"
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              d.status === "active" &&
                              new Date() <= new Date(d.end_date)
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {d.status === "draft"
                              ? "Draft"
                              : new Date() > new Date(d.end_date)
                              ? "Expired"
                              : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <button
                            className="text-blue-600 hover:underline mr-2"
                            onClick={() => handleEdit(d.id)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => {
                              setDeleteId(d.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FaTrash />
                          </button>
                          {/* Delete Confirmation Modal */}
                          {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                              <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                                  onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteId(null);
                                  }}
                                  aria-label="Close"
                                >
                                  &times;
                                </button>
                                <h3 className="text-lg font-semibold mb-4">
                                  Confirm Delete
                                </h3>
                                <p className="mb-6">
                                  Are you sure you want to delete this discount
                                  package?
                                </p>
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded"
                                    onClick={() => {
                                      setShowDeleteModal(false);
                                      setDeleteId(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                    onClick={handleDelete}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DiscountPackage;
