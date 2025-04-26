// import React, { useState } from "react";
// import axios from "axios";

// const UploadForm = () => {
//   const [resumeFile, setResumeFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleResumeChange = (e) => setResumeFile(e.target.files[0]);
//   const handleImageChange = (e) => setImageFile(e.target.files[0]);

//   const handleUpload = async () => {
//     if (!resumeFile || !imageFile) {
//       setMessage("Please select both resume and profile image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", resumeFile);
//     formData.append("image", imageFile);

//     try {
//       setUploading(true);
//       setMessage("");

//       const response = await axios.post(
//         "http://localhost:8080/api/upload", // Change this to your actual endpoint
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );

//       setMessage(response.data.message || "Upload successful!");
//     } catch (error) {
//       console.error(error);
//       setMessage(error.response?.data?.message || "Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
//       <h2 className="text-xl font-semibold text-center mb-4">
//         Upload Resume & Image
//       </h2>

//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={handleResumeChange}
//         className="mb-2 block w-full"
//       />
//       <input
//         type="file"
//         accept="image/png,image/jpeg"
//         onChange={handleImageChange}
//         className="mb-4 block w-full"
//       />

//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         className={`w-full p-2 rounded ${
//           uploading
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-600 hover:bg-blue-700 text-white"
//         }`}
//       >
//         {uploading ? "Uploading..." : "Upload Files"}
//       </button>

//       {message && <p className="mt-4 text-center text-sm">{message}</p>}
//     </div>
//   );
// };

// export default UploadForm;
