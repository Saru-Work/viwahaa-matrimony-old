import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaImage, FaSave, FaTimes, FaCamera, FaHeart } from "react-icons/fa";
import { API } from "../../utils/api";

const AdminWeddingGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    couple_name: "",
    display_order: 0,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/wedding-gallery/all`);
      const data = await res.json();
      if (data.success) setImages(data.images);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

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
    if (!formData.image) return showMsg("Please select an image", "error");

    const data = new FormData();
    data.append("couple_name", formData.couple_name);
    data.append("display_order", formData.display_order);
    data.append("image", formData.image);

    try {
      const res = await fetch(`${API}/api/wedding-gallery`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.success) {
        showMsg("Wedding image added successfully!");
        setFormData({ couple_name: "", display_order: 0, image: null });
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setShowAddForm(false);
        fetchGallery();
      } else {
        showMsg(result.error, "error");
      }
    } catch (error) {
      showMsg("Upload failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image from gallery?")) return;
    try {
      const res = await fetch(`${API}/api/wedding-gallery/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        showMsg("Image removed");
        fetchGallery();
      }
    } catch (error) {
      showMsg("Delete failed", "error");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API}/api/wedding-gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const result = await res.json();
      if (result.success) {
        fetchGallery();
      }
    } catch (error) {
      showMsg("Update failed", "error");
    }
  };

  return (
    <div className="p-4 mt-16 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaHeart className="text-red-500" /> Wedding Gallery Management
          </h1>
          <p className="text-gray-600">Share recently celebrated weddings in a beautiful gallery</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-all font-bold"
        >
          {showAddForm ? <FaTimes /> : <FaPlus />} {showAddForm ? "Cancel" : "Add Wedding Photo"}
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <h2 className="text-lg font-bold mb-4 text-primary">Upload Wedding Celebration Photo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couple Name (Optional)</label>
                <input
                  type="text"
                  name="couple_name"
                  value={formData.couple_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Manoj & Shanti"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leave blank if you don't want to show name on hover</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="pt-4">
                 <button type="submit" className="w-full bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90">
                  <FaSave className="inline mr-2" /> Upload to Gallery
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 aspect-square">
              <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                <input type="file" onChange={handleFileChange} className="hidden" accept="image/jpeg,image/png,image/gif,image/webp,image/bmp" required />
                <div className="w-full max-w-[250px] aspect-square bg-white rounded-xl shadow-inner mb-2 flex items-center justify-center overflow-hidden border">
                   {imagePreview ? (
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                   ) : (
                     <div className="text-center p-4">
                        <FaCamera className="text-gray-300 text-5xl mx-auto mb-2" />
                        <p className="text-xs text-gray-400">Select square images for best look</p>
                     </div>
                   )}
                </div>
                <span className="text-sm text-gray-500 font-medium">Click to select wedding photo</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP, BMP (Max 10MB)</p>
              </label>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative">
              <div className="aspect-square">
                 <img 
                   src={`${API}/uploads/${img.image_path}`}
                   className={`w-full h-full object-cover ${!img.is_active ? 'grayscale opacity-50' : ''}`} 
                   alt={img.couple_name} 
                 />
              </div>
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white font-bold text-center mb-4">{img.couple_name || "Wedding Moment"}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(img.id, img.is_active)}
                      className={`p-2 rounded-lg ${img.is_active ? 'bg-yellow-500' : 'bg-green-500'} text-white text-sm`}
                      title={img.is_active ? "Hide from Home" : "Show on Home"}
                    >
                      {img.is_active ? "Hide" : "Show"}
                    </button>
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="p-2 rounded-lg bg-red-500 text-white text-sm"
                      title="Delete Permanently"
                    >
                      <FaTrash />
                    </button>
                  </div>
              </div>

              {img.display_order > 0 && (
                <div className="absolute top-2 left-2 bg-primary/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Order: {img.display_order}
                </div>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               <FaImage className="text-gray-300 text-5xl mx-auto mb-4" />
               <p className="text-gray-500">No wedding photos added yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWeddingGallery;
