import { useEffect, useState } from "react";
import { useUploadUserProfileImageMutation } from "../../redux/api/userApi";

const CoverImage = () => {
  const [uploadUserProfileImage, { isLoading, error }] =
    useUploadUserProfileImageMutation();

  const [previewCoverUrl, setPreviewCoverUrl] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);

  // Handle file selection and preview
  const handleCoverImgChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Revoke previous URL to prevent memory leaks
    if (previewCoverUrl) {
      URL.revokeObjectURL(previewCoverUrl);
    }

    // Create new preview URL
    const newPreviewCoverUrl = URL.createObjectURL(file);
    setPreviewCoverUrl(newPreviewCoverUrl);
    setSelectedCoverFile(file);
  };

  // Handle file upload
  const handleProfileUpload = async () => {
    if (!selectedCoverFile) {
      alert("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("cover_img", selectedCoverFile);

      const response = await uploadUserProfileImage(formData).unwrap();

      if (response.status === 200) {
        alert("Profile image uploaded successfully!");
        setPreviewCoverUrl(response.data.filePath); // Update with server URL
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        "Failed to upload image: " + (err?.data?.message || "Unknown error")
      );
    }
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewCoverUrl) {
        URL.revokeObjectURL(previewCoverUrl);
      }
    };
  }, [previewCoverUrl]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <input
          type="file"
          name="cover_img"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleCoverImgChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />
        <button
          onClick={handleProfileUpload}
          disabled={isLoading || !selectedCoverFile}
          className={`px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          Error: {error?.data?.message || "Upload failed"}
        </p>
      )}

      {previewCoverUrl && (
        <div className="mt-4">
          <img
            src={previewCoverUrl}
            alt="Profile Preview"
            className="w-48 h-48 object-cover rounded-full border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default CoverImage;
