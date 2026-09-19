import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 20,
    aspect: 1,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imgRef.current,
          completedCrop,
          "cropped-profile.jpg"
        );
        onCropComplete(croppedImageBlob);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setCrop({
      unit: "%",
      width: 40,
      height: 40,
      x: 30,
      y: 20,
      aspect: 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999] p-4">
      <div className="relative bg-[#FCF8F3] rounded-2xl shadow-2xl border border-[#ffd6d6] max-w-3xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden"  style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-[#fff0f0] hover:bg-[#ffd6d6] text-[#a00000] rounded-full p-2 shadow transition z-10"
          onClick={onCancel}
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
        <div className="px-8 pt-8 pb-4 border-b border-[#ffd6d6]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center bg-[#ffeaea] rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"
                  fill="#a00000"
                />
              </svg>
            </span>
            <h3 className="text-xl font-bold text-[#a00000]">
              Crop Your Profile Image
            </h3>
          </div>
          <p className="text-sm mt-3 text-[#a00000] pl-14">
            Adjust the crop area to ensure your face is clearly visible and
            centered.
          </p>
        </div>

        {/* Image Container with Proper Scrolling */}
        <div className="flex-1 overflow-auto px-8 py-6 flex flex-col items-center bg-[#fff7f7]">
          {image && (
            <div className="relative mb-6 border border-[#ffd6d6] rounded-xl bg-[#fff0f0] shadow p-4 w-full max-w-2xl mx-auto">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              )}

              {/* Container that allows scrolling for large images */}
              <div className="overflow-auto max-h-[50vh] min-h-[300px]">
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  className="inline-block"
                >
                  <img
                    ref={imgRef}
                    src={image}
                    alt="Crop preview"
                    className="max-w-none" /* Remove max-width constraints */
                    onLoad={handleImageLoad}
                    style={{
                      display: isLoading ? "none" : "block",
                      minWidth:
                        "400px" /* Ensure minimum width for small images */,
                    }}
                  />
                </ReactCrop>
              </div>
            </div>
          )}

          {/* Tip Box */}
          <div className="bg-[#ffeaea] rounded-lg p-4 mb-6 w-full max-w-2xl mx-auto flex items-start gap-3 border border-[#ffd6d6]">
            <span className="inline-flex items-center justify-center bg-[#fff0f0] rounded-full p-2 flex-shrink-0">
              <svg
                className="h-5 w-5 text-[#a00000]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="text-sm text-[#a00000]">
              <strong>Tip:</strong> Position the crop area to include your head
              and shoulders for the best results. You can scroll if your image
              is larger than the container.
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 px-8 py-6 border-t border-[#ffd6d6] flex-shrink-0 bg-[#FCF8F3]">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-[#ffd6d6] rounded-lg text-[#a00000] bg-white hover:bg-[#ffeaea] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-6 py-2 bg-[#a00000] text-white rounded-lg hover:bg-[#8D1C21] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!completedCrop || isLoading}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
