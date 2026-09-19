import React, { useState, useEffect, useCallback } from "react";
import { API } from "../../utils/api";
import PropTypes from "prop-types";
import {
  FaUpload,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaImage,
  FaArrowsAltV,
  FaSearchPlus,
} from "react-icons/fa";

const AdminHeroImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [positionY, setPositionY] = useState(50);
  const [zoom, setZoom] = useState(1.0);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/hero-images`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Failed to fetch hero images:", error);
      showMessage("Failed to fetch images", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPositionY(50); // Reset position for new image
      setZoom(1.0); // Reset zoom for new image
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage("Please select an image first", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("position_y", positionY);
    formData.append("zoom", zoom);

    try {
      const res = await fetch(`${API}/api/hero-images`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        showMessage("Image uploaded successfully!");
        setSelectedFile(null);
        setPreviewUrl(null);
        setPositionY(50);
        setZoom(1.0);
        fetchImages();
      } else {
        showMessage(data.error || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero image?")) {
      return;
    }

    try {
      const res = await fetch(`${API}/api/hero-images/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showMessage("Image deleted successfully!");
        fetchImages();
      } else {
        showMessage(data.error || "Delete failed", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Failed to delete image", "error");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await fetch(`${API}/api/hero-images/${id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        showMessage(
          `Image ${!currentStatus ? "activated" : "deactivated"} successfully!`,
        );
        fetchImages();
      }
    } catch (error) {
      console.error("Toggle error:", error);
      showMessage("Failed to update status", "error");
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newImages.length) return;

    // Swap display_order values
    const tempOrder = newImages[index].display_order;
    newImages[index].display_order = newImages[swapIndex].display_order;
    newImages[swapIndex].display_order = tempOrder;

    // Swap positions in array
    [newImages[index], newImages[swapIndex]] = [
      newImages[swapIndex],
      newImages[index],
    ];

    setImages(newImages);

    try {
      await fetch(`${API}/api/hero-images/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newImages.map((img, i) => ({
            id: img.id,
            display_order: i + 1,
          })),
        }),
      });
    } catch (error) {
      console.error("Order update error:", error);
      showMessage("Failed to update order", "error");
      fetchImages(); // Revert on error
    }
  };

  // Update vertical position for an existing image
  const handleUpdatePositionY = async (id, newPosY) => {
    // Optimistically update local state
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, position_y: newPosY } : img,
      ),
    );

    try {
      await fetch(`${API}/api/hero-images/${id}/position`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position_y: newPosY }),
      });
    } catch (error) {
      console.error("Position update error:", error);
      showMessage("Failed to update position", "error");
      fetchImages();
    }
  };

  // Update zoom level for an existing image
  const handleUpdateZoom = async (id, newZoom) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, zoom: newZoom } : img)),
    );

    try {
      await fetch(`${API}/api/hero-images/${id}/zoom`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoom: newZoom }),
      });
    } catch (error) {
      console.error("Zoom update error:", error);
      showMessage("Failed to update zoom", "error");
      fetchImages();
    }
  };

  return (
    <div className="p-4 mt-16">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaImage className="text-purple-500" /> Hero Images Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage slideshow images for the homepage hero section
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-green-100 text-green-700 border border-green-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Upload New Hero Image</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* File Input */}
          <div className="flex-1">
            <label htmlFor="hero-image-input" className="block cursor-pointer">
              {previewUrl ? (
                <div
                  className="relative w-full overflow-hidden rounded-lg border border-gray-200"
                  style={{ aspectRatio: "16 / 7" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-900/40 to-transparent z-10"></div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: `center ${positionY}%`,
                      transform: `scale(${zoom})`,
                      transformOrigin: `center ${positionY}%`,
                    }}
                  />
                  <div className="relative z-20 flex items-center h-full p-6">
                    <div>
                      <div className="inline-block px-3 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold mb-2 border border-yellow-400/30">
                        PREVIEW
                      </div>
                      <p className="text-white font-bold text-lg leading-tight">
                        Find Your Perfect
                        <br />
                        <span className="text-yellow-400">Life Partner</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  style={{ aspectRatio: "16 / 7" }}
                >
                  <FaUpload className="text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, WebP (Max 10MB)
                  </p>
                </div>
              )}
              <input
                id="hero-image-input"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
              />
            </label>

            {/* Vertical Position Slider - shown when image is selected */}
            {previewUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaArrowsAltV className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Adjust Vertical Position
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {positionY === 0
                      ? "Top"
                      : positionY === 50
                        ? "Center"
                        : positionY === 100
                          ? "Bottom"
                          : `${positionY}%`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">Top</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={positionY}
                    onChange={(e) => setPositionY(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 ${positionY}%, #e5e7eb ${positionY}%)`,
                    }}
                  />
                  <span className="text-xs text-gray-400 w-12">Bottom</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Drag the slider to show the desired part of the image in the
                  hero banner
                </p>
              </div>
            )}

            {/* Zoom Slider - shown when image is selected */}
            {previewUrl && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaSearchPlus className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Adjust Zoom Level
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {zoom === 1.0 ? "No Zoom" : `${zoom.toFixed(1)}x`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8">1x</span>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={Math.round(zoom * 100)}
                    onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 ${((zoom - 1) / 2) * 100}%, #e5e7eb ${((zoom - 1) / 2) * 100}%)`,
                    }}
                  />
                  <span className="text-xs text-gray-400 w-12">3x</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Zoom into the image to focus on a specific area
                </p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <FaUpload />
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setPositionY(50);
                  setZoom(1.0);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Images List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Hero Images ({images.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaImage className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No hero images uploaded yet.</p>
            <p className="text-sm">
              Upload images above to create a homepage slideshow.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {images.map((image, index) => (
              <ImageRow
                key={image.id}
                image={image}
                index={index}
                totalImages={images.length}
                onMoveOrder={handleMoveOrder}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdatePositionY={handleUpdatePositionY}
                onUpdateZoom={handleUpdateZoom}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for each image row with inline position editing
const ImageRow = ({
  image,
  index,
  totalImages,
  onMoveOrder,
  onToggle,
  onDelete,
  onUpdatePositionY,
  onUpdateZoom,
}) => {
  const [showPositionEditor, setShowPositionEditor] = useState(false);
  const [localPosY, setLocalPosY] = useState(image.position_y ?? 50);
  const [localZoom, setLocalZoom] = useState(image.zoom ?? 1.0);
  const posDebounceRef = React.useRef(null);
  const zoomDebounceRef = React.useRef(null);

  const handlePosYChange = (val) => {
    setLocalPosY(val);
    if (posDebounceRef.current) clearTimeout(posDebounceRef.current);
    posDebounceRef.current = setTimeout(() => {
      onUpdatePositionY(image.id, val);
    }, 300);
  };

  const handleZoomChange = (val) => {
    setLocalZoom(val);
    if (zoomDebounceRef.current) clearTimeout(zoomDebounceRef.current);
    zoomDebounceRef.current = setTimeout(() => {
      onUpdateZoom(image.id, val);
    }, 300);
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        !image.is_active ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Order Number */}
        <div className="text-lg font-bold text-gray-400 w-8 text-center">
          {index + 1}
        </div>

        {/* Preview */}
        <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={`${API}/uploads/${image.image_path}`}
            alt={`Hero ${index + 1}`}
            className="w-full h-full object-cover"
            style={{
              objectPosition: `center ${image.position_y ?? 50}%`,
              transform: `scale(${image.zoom ?? 1.0})`,
              transformOrigin: `center ${image.position_y ?? 50}%`,
            }}
            onError={(e) => {
              e.target.src = "";
              e.target.alt = "Image not found";
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">
            {image.image_path}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {image.is_active ? (
              <span className="text-green-600 font-medium">● Active</span>
            ) : (
              <span className="text-red-500 font-medium">● Inactive</span>
            )}
            {" · "}
            {new Date(image.created_at).toLocaleDateString()}
            {" · "}
            <span className="text-blue-500">
              Position: {image.position_y ?? 50}% · Zoom:{" "}
              {(image.zoom ?? 1.0).toFixed
                ? (image.zoom ?? 1.0).toFixed(1)
                : (image.zoom ?? 1.0)}
              x
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Adjust Position & Zoom */}
          <button
            onClick={() => setShowPositionEditor(!showPositionEditor)}
            className={`p-2 rounded-lg transition-colors ${
              showPositionEditor
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-blue-100 text-blue-500"
            }`}
            title="Adjust position & zoom"
          >
            <FaArrowsAltV />
          </button>

          {/* Move Up */}
          <button
            onClick={() => onMoveOrder(index, "up")}
            disabled={index === 0}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <FaArrowUp className="text-gray-600" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMoveOrder(index, "down")}
            disabled={index === totalImages - 1}
            className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <FaArrowDown className="text-gray-600" />
          </button>

          {/* Toggle Active */}
          <button
            onClick={() => onToggle(image.id, image.is_active)}
            className={`p-2 rounded-lg transition-colors ${
              image.is_active
                ? "hover:bg-yellow-100 text-green-600"
                : "hover:bg-green-100 text-gray-400"
            }`}
            title={image.is_active ? "Deactivate" : "Activate"}
          >
            {image.is_active ? <FaEye /> : <FaEyeSlash />}
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(image.id)}
            className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Position & Zoom Editor Panel */}
      {showPositionEditor && (
        <div className="mt-3 ml-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex gap-4 items-start">
            {/* Live Preview with current position & zoom */}
            <div
              className="w-64 rounded-lg overflow-hidden border border-blue-200 flex-shrink-0 relative"
              style={{ aspectRatio: "16 / 7" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-900/40 to-transparent z-10"></div>
              <img
                src={`${API}/uploads/${image.image_path}`}
                alt="Position preview"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: `center ${localPosY}%`,
                  transform: `scale(${localZoom})`,
                  transformOrigin: `center ${localPosY}%`,
                }}
              />
            </div>

            {/* Slider Controls */}
            <div className="flex-1">
              {/* Position Slider */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaArrowsAltV className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Vertical Position
                  </span>
                  <span className="text-xs font-medium text-blue-600 ml-auto bg-blue-100 px-2 py-0.5 rounded-full">
                    {localPosY === 0
                      ? "Top"
                      : localPosY === 50
                        ? "Center"
                        : localPosY === 100
                          ? "Bottom"
                          : `${localPosY}%`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">Top</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localPosY}
                    onChange={(e) => handlePosYChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 ${localPosY}%, #e5e7eb ${localPosY}%)`,
                    }}
                  />
                  <span className="text-xs text-gray-500 w-12">Bottom</span>
                </div>
              </div>

              {/* Zoom Slider */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaSearchPlus className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Zoom Level
                  </span>
                  <span className="text-xs font-medium text-blue-600 ml-auto bg-blue-100 px-2 py-0.5 rounded-full">
                    {localZoom === 1.0 ? "No Zoom" : `${localZoom.toFixed(1)}x`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-8">1x</span>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={Math.round(localZoom * 100)}
                    onChange={(e) =>
                      handleZoomChange(parseInt(e.target.value) / 100)
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 ${((localZoom - 1) / 2) * 100}%, #e5e7eb ${((localZoom - 1) / 2) * 100}%)`,
                    }}
                  />
                  <span className="text-xs text-gray-500 w-12">3x</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Adjust position and zoom to frame the image perfectly in the
                hero banner. Changes are saved automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ImageRow.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number,
    image_path: PropTypes.string,
    is_active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    position_y: PropTypes.number,
    zoom: PropTypes.number,
    created_at: PropTypes.string,
    display_order: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  totalImages: PropTypes.number.isRequired,
  onMoveOrder: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdatePositionY: PropTypes.func.isRequired,
  onUpdateZoom: PropTypes.func.isRequired,
};

export default AdminHeroImages;
