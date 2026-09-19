import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaCamera, FaQuoteLeft, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { API } from "../../utils/api";

const AdminSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    couple_name: "",
    feedback: "",
    wedding_date: "",
    location: "",
    image: null,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/success-stories/all`);
      const data = await res.json();
      if (data.success) setStories(data.stories);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showMsg("File size must be less than 10MB", "error");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      const url = editingId ? `${API}/api/success-stories/${editingId}` : `${API}/api/success-stories`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (result.success) {
        showMsg(`Story ${editingId ? "updated" : "added"} successfully!`);
        setFormData({ couple_name: "", feedback: "", wedding_date: "", location: "", image: null });
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setEditingId(null);
        setShowAddForm(false);
        fetchStories();
      } else {
        showMsg(result.error, "error");
      }
    } catch (error) {
      showMsg("Operation failed", "error");
    }
  };

  const handleEdit = (story) => {
    setEditingId(story.id);
    setFormData({
      couple_name: story.couple_name,
      feedback: story.feedback,
      wedding_date: story.wedding_date || "",
      location: story.location || "",
      image: null,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (story) => {
    setStoryToDelete(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!storyToDelete) return;
    try {
      const res = await fetch(`${API}/api/success-stories/${storyToDelete.id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showMsg("Story deleted");
        fetchStories();
      } else {
        showMsg(result.error || "Delete failed", "error");
      }
    } catch (error) {
      showMsg("Delete failed", "error");
    } finally {
      setShowDeleteModal(false);
      setStoryToDelete(null);
    }
  };

  return (
    <div className="p-4 mt-16 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaQuoteLeft className="text-primary" /> Success Stories Management
          </h1>
          <p className="text-gray-600">Share the joy of couples who found love here</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) setEditingId(null);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all font-bold"
        >
          {showAddForm ? <FaTimes /> : <FaPlus />} {showAddForm ? "Cancel" : "Add New Story"}
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-primary">{editingId ? "Edit Success Story" : "Initialize New Success Story"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couple Name</label>
                <input
                  type="text"
                  name="couple_name"
                  value={formData.couple_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Senthil & Janani"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
                  <input
                    type="text"
                    name="wedding_date"
                    value={formData.wedding_date}
                    onChange={handleInputChange}
                    placeholder="e.g. Oct 2023"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Chennai"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Success Feedback</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              <label className="cursor-pointer text-center">
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp" />
                <div className="w-40 h-40 bg-white rounded-xl shadow-inner mb-2 flex items-center justify-center overflow-hidden border">
                   {imagePreview ? (
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                   ) : (
                     <FaCamera className="text-gray-300 text-4xl" />
                   )}
                </div>
                <span className="text-sm text-gray-500 font-medium">Click to upload couple photo</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP, BMP (Max 10MB)</p>
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-primary/90">
              <FaSave className="inline mr-2" /> {editingId ? "Save Changes" : "Post Story"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row p-5 gap-5">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border-2 border-gray-50 shadow-sm">
                  <img src={`${API}/uploads/${story.image_path}`} className="w-full h-full object-cover" alt={story.couple_name} onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{story.couple_name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(story)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"><FaEdit /></button>
                      <button onClick={() => handleDeleteClick(story)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><FaTrash /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {story.wedding_date && <span className="flex items-center gap-1"><FaCalendarAlt /> {story.wedding_date}</span>}
                    {story.location && <span className="flex items-center gap-1"><FaMapMarkerAlt /> {story.location}</span>}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 italic">&quot;{story.feedback}&quot;</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-red-600">
                    Warning!
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <p className="text-center font-bold text-gray-700">
                  Are you sure you want to delete the success story of &quot;{storyToDelete?.couple_name}&quot;?
                </p>
                <p className="text-center text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSuccessStories;
