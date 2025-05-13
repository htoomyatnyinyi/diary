import { useEffect, useState } from "react";
import { useUploadUserProfileImageMutation } from "../../redux/api/userApi";

const TestBackendProfile = () => {
  const [uploadUserProfileImage, { isLoading, error }] =
    useUploadUserProfileImageMutation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection and preview
  const handleProfileImgChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Revoke previous URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setSelectedFile(file);
  };

  // Handle file upload
  const handleProfileUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile_img", selectedFile);

      const response = await uploadUserProfileImage(formData).unwrap();

      if (response.status === 200) {
        alert("Profile image uploaded successfully!");
        setPreviewUrl(response.data.filePath); // Update with server URL
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <input
          type="file"
          name="profile_img"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleProfileImgChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />
        <button
          onClick={handleProfileUpload}
          disabled={isLoading || !selectedFile}
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

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-48 h-48 object-cover rounded-full border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default TestBackendProfile;
// import { useState } from "react";
// import axios from "axios"; // Use axios for API calls
// import { useUploadUserProfileImageMutation } from "../../redux/api/userApi";

// const TestBackendProfile = () => {
//   const [uploadUserProfileImage] = useUploadUserProfileImageMutation();

//   const [profileUpload, setProfileUpload] = useState(null); // Store preview URL or server URL
//   const [file, setFile] = useState(null); // Store the selected file for upload

//   // Handle file selection and preview
//   const handleProfileImgChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     // Create a temporary URL for previewing the image
//     const previewUrl = URL.createObjectURL(selectedFile);
//     setProfileUpload(previewUrl);
//     setFile(selectedFile);

//     // // Prepare FormData for upload
//     // const formData = new FormData();
//     // formData.append("profile_img", selectedFile);

//     // try {
//     //   // Make API call to backend
//     //   const response = await uploadUserProfileImage(formData).unwrap();

//     //   if (response.status === 200) {
//     //     alert("File uploaded successfully!");
//     //     // Update state with the file URL returned from the server
//     //     setProfileUpload(response.data.filePath); // Assuming backend returns filePath
//     //   } else {
//     //     alert("Error uploading file.");
//     //   }
//     // } catch (error) {
//     //   console.error("Error uploading file:", error);
//     //   alert("Error uploading file.");
//     // }
//   };

//   const handleProfileUpload = async () => {
//     // Prepare FormData for upload
//     const formData = new FormData();
//     formData.append("profile_img", file);
//     try {
//       const a = await useUploadUserProfileImageMutation(formData);
//       console.log(a, " return data upload");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <input
//           type="file"
//           name="profile_img" // Must match the multer field name
//           accept="image/jpeg,image/png,image/jpg" // Restrict to allowed image types
//           onChange={handleProfileImgChange}
//         />
//         <button onClick={handleProfileUpload} type="submit">
//           Submit
//         </button>
//       </div>
//       {profileUpload && (
//         <img
//           src={profileUpload}
//           alt="Profile Preview"
//           style={{ width: "200px", height: "200px" }}
//         />
//       )}
//     </div>
//   );
// };

// export default TestBackendProfile;
