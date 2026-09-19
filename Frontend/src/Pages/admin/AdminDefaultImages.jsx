import React, { useState, useEffect, useCallback } from "react";
import { FaUpload, FaTrash, FaImage, FaVenusMars, FaMosque } from "react-icons/fa";
import { API } from "../../utils/api";

const AdminDefaultImages = () => {
  const [images, setImages] = useState([]);
  const [religions, setReligions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [formData, setFormData] = useState({
    religion_id: "",
    gender: "male",
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchReligions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/religions`);
      const data = await res.json();
      if (data.success) {
        setReligions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch religions:", error);
    }
  }, []);

  const fetchDefaultImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/default-profile-images`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch default images:", error);
      showMessage("Failed to fetch images", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReligions();
    fetchDefaultImages();
  }, [fetchReligions, fetchDefaultImages]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showMessage("File size must be less than 10MB", "error");
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.image || !formData.religion_id || !formData.gender) {
      showMessage("Please fill all fields and select an image", "error");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("image", formData.image);
    data.append("religion_id", formData.religion_id);
    data.append("gender", formData.gender);

    try {
      const res = await fetch(`${API}/api/default-profile-images`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        showMessage("Default image saved successfully!");
        setFormData({ religion_id: "", gender: "male", image: null });
        setPreviewUrl(null);
        fetchDefaultImages();
      } else {
        showMessage(result.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this default profile image?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/default-profile-images/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showMessage("Image deleted successfully!");
        fetchDefaultImages();
      } else {
        showMessage(data.message || "Delete failed", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Failed to delete image", "error");
    }
  };

  return (
    <div className="p-4 mt-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaImage className="text-blue-500" /> Default Profile Images
        </h1>
        <p className="text-gray-600 mt-1">
          Set default profile pictures based on user's gender and religion
        </p>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          message.type === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add/Update Default Image</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaMosque className="text-gray-400" /> Religion
              </label>
              <select
                value={formData.religion_id}
                onChange={(e) => setFormData(prev => ({ ...prev, religion_id: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Religion</option>
                {religions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaVenusMars className="text-gray-400" /> Gender
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/bmp"
                onChange={handleFileSelect}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP, BMP (Max 10MB)</p>
            </div>
            <button
              type="submit"
              disabled={uploading || !formData.image}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <FaUpload /> {uploading ? "Saving..." : "Save Default Image"}
            </button>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-md shadow-sm" />
            ) : (
              <div className="text-center text-gray-400">
                <FaImage className="text-4xl mx-auto mb-2" />
                <p>Preview will appear here</p>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Current Default Images</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : images.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No default images set yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {images.map((img) => (
              <div key={img.id} className="border rounded-lg overflow-hidden flex flex-col bg-gray-50">
                <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={`${API}/uploads/${img.image_path}`}
                    alt={`${img.gender} ${img.religion_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/placeholder-avatar.png"; }}
                  />
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 capitalize">{img.religion_name}</h3>
                      <p className="text-xs text-blue-600 font-semibold capitalize bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1">
                        {img.gender}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDefaultImages;
