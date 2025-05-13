import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useAuthMeQuery } from "../../redux/api/authApi";
import {
  useGetProfileQuery,
  useDeleteResumeMutation,
  useGetResumeQuery,
  usePreviewResumeQuery,
  useUploadResumeMutation,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} from "../../redux/api/userApi";
import {
  AiFillHome,
  AiFillPhone,
  AiTwotoneMail,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import TestBackendProfile from "./TestBackendProfile";
import CoverImage from "./CoverImage";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UserProfile = () => {
  // Profile Section State and Queries
  const { data: authMeResponse, isLoading: isAuthMeLoading } =
    useAuthMeQuery(null);
  const {
    data: userGetProfileResponse,
    isLoading: isUserGetProfileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();

  const image =
    import.meta.env.VITE_APP_API_URL +
    userGetProfileResponse?.data.profile_image_url;
  // console.log(
  //   image + userGetProfileResponse?.data.profile_image_url,
  //   "check at up"
  // );

  // Resume Section State and Queries
  const [resumeFile, setResumeFile] = useState(null);
  const [filenamePreview, setFilenamePreview] = useState(null);
  const [
    uploadResume,
    { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
  ] = useUploadResumeMutation();
  const {
    data: getResume,
    isLoading: isGetResumeLoading,
    refetch,
  } = useGetResumeQuery();
  const {
    data: fileURL,
    isLoading: isFileURLLoading,
    error: isFileURLError,
  } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });
  const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    bio: "",
  });

  // Update formData when profile data loads
  useEffect(() => {
    if (userGetProfileResponse && authMeResponse) {
      setFormData({
        first_name: userGetProfileResponse?.data.first_name || "",
        last_name: userGetProfileResponse?.data.last_name || "",
        location: userGetProfileResponse?.data.location || "",
        email: authMeResponse?.user.email || "",
        phone: userGetProfileResponse?.data.phone || "",
        gender: userGetProfileResponse?.data.gender || "",
        date_of_birth: userGetProfileResponse?.data.date_of_birth
          ? userGetProfileResponse.data.date_of_birth.split("T")[0]
          : "",
        bio: userGetProfileResponse?.data.bio || "",
      });
    } else if (authMeResponse) {
      setFormData((prev) => ({
        ...prev,
        email: authMeResponse?.user.email || "",
      }));
    }
  }, [userGetProfileResponse, authMeResponse]);

  // Use actual mutations
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Resume Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file || null);
    console.log("Selected resume file:", file);
  };

  const handleUpload = async () => {
    if (!resumeFile || !resumeFile.name) {
      console.log("No valid resume file selected for upload.");
      return;
    }
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await uploadResume(formData).unwrap();
      refetch();
      console.log("Resume upload success:", result);
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  // Sidebar Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!userGetProfileResponse?.data) {
        await createProfile(formData).unwrap();
      } else {
        const updatedFields = {};
        Object.keys(formData).forEach((key) => {
          if (
            formData[key] !==
            (userGetProfileResponse?.data[key] ||
              (key === "email" && authMeResponse?.user.email) ||
              "")
          ) {
            updatedFields[key] = formData[key];
          }
        });
        if (Object.keys(updatedFields).length > 0) {
          await updateProfile(updatedFields).unwrap();
        }
      }
      refetchProfile();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (isAuthMeLoading || isUserGetProfileLoading)
    return <p className="text-center text-gray-500">Loading...</p>;
  if (isFileURLError)
    return (
      <p className="text-center text-red-500">
        Error loading resume preview...
      </p>
    );

  return (
    <div className="min-h-screen p-4 sm:p-6 ">
      {/* Profile Section */}
      <div className="max-w-5xl mx-auto border rounded-xl shadow-lg p-4 sm:p-6 mb-6 ">
        <CoverImage />
        {/* Cover Image */}
        <div className="h-40 rounded-t-xl overflow-hidden">
          {userGetProfileResponse?.data.cover_image_url ? (
            <img
              src={
                import.meta.env.VITE_APP_API_URL +
                userGetProfileResponse.data.cover_image_url
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"></div>
          )}
        </div>
        <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {image ? (
                <dvi>
                  <img
                    src={image}
                    alt="Profile"
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  {/* <TestBackendProfile /> */}
                </dvi>
              ) : (
                <TestBackendProfile />
              )}
              {/* {userGetProfileResponse?.data.profile_image_url ? (
                <img
                  src={userGetProfileResponse.data.profile_image_url}
                  alt="Profile"
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <TestBackendProfile />
              )} */}
            </div>
            {/* Profile Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {userGetProfileResponse?.data.first_name || "First Name"}{" "}
                {userGetProfileResponse?.data.last_name || "Last Name"}
              </h1>
              <div className="flex pt-4 justify-center sm:justify-start items-center gap-2">
                <AiOutlineInfoCircle size={20} />
                <p>{userGetProfileResponse?.data.bio || "Bio not provided"}</p>
              </div>
              <div className="md:flex mt-2 sm:mt-4 space-y-5 space-x-5 text-sm sm:text-base">
                <div className="space-y-5">
                  <div className="flex justify-center sm:justify-start items-center gap-2">
                    <AiFillHome size={20} />
                    <p>
                      {userGetProfileResponse?.data.location ||
                        "Location not provided"}
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-start items-center gap-2">
                    <AiTwotoneMail size={20} />
                    <p>{authMeResponse?.user.email || "Email not provided"}</p>
                  </div>
                  <div className="flex justify-center sm:justify-start items-center gap-2">
                    <AiFillPhone size={20} />
                    <p>
                      {userGetProfileResponse?.data.phone ||
                        "Phone not provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-center sm:justify-start items-center gap-2">
                    <AiOutlineUser size={20} />
                    <p>
                      {userGetProfileResponse?.data.gender ||
                        "Gender not provided"}
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-start items-center gap-2">
                    <AiOutlineCalendar size={20} />
                    <p>
                      {userGetProfileResponse?.data.date_of_birth
                        ? new Date(
                            userGetProfileResponse.data.date_of_birth
                          ).toLocaleDateString()
                        : "Date of birth not provided"}
                    </p>
                  </div>
                </div>
                <div className="text-cyan-500 space-y-5 text-xs sm:text-sm">
                  <p>
                    Profile created:{" "}
                    {userGetProfileResponse?.data.created_at
                      ? new Date(
                          userGetProfileResponse?.data.created_at
                        ).toLocaleDateString()
                      : "Not created"}
                  </p>
                  <p>
                    Last updated:{" "}
                    {userGetProfileResponse?.data.updated_at
                      ? new Date(
                          userGetProfileResponse?.data.updated_at
                        ).toLocaleDateString()
                      : "Not updated"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="max-w-5xl mx-auto rounded-xl shadow-lg p-4 sm:p-6 border bg-white">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resume</h2>
        <div className="mb-6">
          {getResume?.data.length > 0 && (
            <h3 className="text-lg sm:text-xl font-medium mb-2">
              Uploaded Resumes
            </h3>
          )}
          {isGetResumeLoading ? (
            <p className="text-gray-500">Loading resumes...</p>
          ) : (
            <div className="space-y-4">
              {getResume?.data.map((resume) => (
                <div key={resume.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-medium">
                        {resume.file_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Uploaded on:{" "}
                        {new Date(resume.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setFilenamePreview(resume.file_name)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Preview
                      </button>
                      <a
                        href={`/api/user/resume/download/${resume.file_name}`}
                        download={resume.file_name}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this resume?"
                            )
                          ) {
                            deleteResume(resume.id).then(() => refetch());
                          }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  {filenamePreview === resume.file_name &&
                    (isFileURLLoading ? (
                      <p className="text-gray-500 mt-2">Loading preview...</p>
                    ) : (
                      <div className="mt-4 max-h-96 overflow-auto">
                        <Document
                          file={fileURL}
                          onLoadError={(error) =>
                            console.error("PDF load error:", error)
                          }
                        >
                          <Page pageNumber={1} width={600} />
                        </Document>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
            Upload New Resume
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              id="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="border rounded p-2 w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              disabled={isFileLoading || !resumeFile}
              className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                isFileLoading || !resumeFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 transition"
              }`}
            >
              {isFileLoading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
          {resumeFile && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Selected file size: {(resumeFile.size / 1024).toFixed(2)} KB
            </p>
          )}
          {isFileSuccess && (
            <p className="text-green-500 mt-2 text-sm">
              Resume Uploaded Successfully!
            </p>
          )}
          {errorFile && (
            <p className="text-red-500 mt-2 text-sm">
              Error: {errorFile.data?.message || "Upload failed"}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar for Editing Profile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="relative w-full max-w-xs sm:max-w-md bg-white shadow-lg p-4 sm:p-6 h-full overflow-y-auto transform transition-transform duration-300 translate-x-0">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
                  rows="3"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isCreating || isUpdating}
                className={`px-4 py-2 rounded text-white ${
                  isCreating || isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-800 hover:bg-cyan-900 transition"
                }`}
              >
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-gray-500">
              Stay safe: Do not include sensitive personal information such as
              identity documents, health, race, religion, or financial data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// import { useAuthMeQuery } from "../../redux/api/authApi";

// import {
//   useGetProfileQuery,
//   useDeleteResumeMutation,
//   useGetResumeQuery,
//   usePreviewResumeQuery,
//   useUploadResumeMutation,
//   useCreateProfileMutation,
//   useUpdateProfileMutation,
//   useUploadUserProfileImageMutation,
// } from "../../redux/api/userApi";

// import {
//   AiFillHome,
//   AiFillPhone,
//   AiTwotoneMail,
//   AiOutlineCalendar,
//   AiOutlineUser,
//   AiOutlineInfoCircle,
// } from "react-icons/ai";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// import pic_img from "../../assets/utils/A.png";
// import TestBackendProfile from "./TestBackendProfile";

// const UserProfile = () => {
//   // Profile Section State and Queries
//   const { data: authMeResponse, isLoading: isAuthMeLoading } =
//     useAuthMeQuery(null);

//   const {
//     data: userGetProfileResponse,
//     isLoading: isUserGetProfileLoading,
//     refetch: refetchProfile,
//   } = useGetProfileQuery();

//   // Resume Section State and Queries
//   const [resumeFile, setResumeFile] = useState();
//   const [filenamePreview, setFilenamePreview] = useState();
//   //
//   const [profileUplaod, setProfileUpload] = useState();
//   const [uploadUserProfileImage] = useUploadUserProfileImageMutation();

//   console.log(profileUplaod, "check file at up.");

//   //sueeport for image upload to statute
//   const handleProfileImgChange = async (event) => {
//     // setProfileUpload(event.target.files[0]);
//     const profileUploadFile = event.target.files[0];
//     if (!profileUploadFile) return;
//     // const blah = URL.createObjectURL(profileUploadFile);
//     // console.log(profileUploadFile, blah, "blah", "check shotcut");
//     setProfileUpload(URL.createObjectURL(profileUploadFile));

//     const formData = new FormData();

//     formData.append("profile_img", profileUploadFile);
//     console.log(formData, " check formdata");

//     try {
//       const response = await uploadUserProfileImage(formData).unwrap();

//       if (response.ok) {
//         alert("File uploaded successfully!");
//       } else {
//         alert("Error uploading file.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const [
//     uploadResume,
//     { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
//   ] = useUploadResumeMutation();

//   const {
//     data: getResume,
//     isLoading: isGetResumeLoading,
//     refetch,
//   } = useGetResumeQuery();

//   const {
//     data: fileURL,
//     isLoading: isFileURLLoading,
//     error: isFileURLError,
//   } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

//   const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

//   // Sidebar State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     location: "",
//     email: "",
//     phone: "",
//     gender: "",
//     date_of_birth: "",
//     bio: "",
//   });

//   // Update formData when profile data loads
//   useEffect(() => {
//     if (userGetProfileResponse && authMeResponse) {
//       setFormData({
//         first_name: userGetProfileResponse?.data.first_name || "",
//         last_name: userGetProfileResponse?.data.last_name || "",
//         location: userGetProfileResponse?.data.location || "",
//         email: authMeResponse?.user.email || "",
//         phone: userGetProfileResponse?.data.phone || "",
//         gender: userGetProfileResponse?.data.gender || "",
//         date_of_birth: userGetProfileResponse?.data.date_of_birth
//           ? userGetProfileResponse.data.date_of_birth.split("T")[0]
//           : "",
//         bio: userGetProfileResponse?.data.bio || "",
//       });
//     } else if (authMeResponse) {
//       // If no profile exists, initialize with email from auth
//       setFormData((prev) => ({
//         ...prev,
//         email: authMeResponse?.user.email || "",
//       }));
//     }
//   }, [userGetProfileResponse, authMeResponse]);

//   // Use actual mutations
//   const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
//   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

//   if (isAuthMeLoading || isUserGetProfileLoading)
//     return <p className="text-center text-gray-500">Loading...</p>;
//   if (isFileURLError)
//     return (
//       <p className="text-center text-red-500">
//         Error loading resume preview...
//       </p>
//     );

//   // Resume Handlers
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setResumeFile(file);
//       console.log("Selected file:", file);
//     } else {
//       setResumeFile(null);
//       console.log("No file selected");
//     }
//   };

//   const handleUpload = async () => {
//     if (!resumeFile || !resumeFile.name) {
//       console.log("No valid file selected for upload.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("resume", resumeFile);
//     try {
//       const result = await uploadResume(formData).unwrap();
//       refetch();
//       console.log("Upload success:", result);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   // Sidebar Handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       if (!userGetProfileResponse?.data) {
//         // Create new profile if none exists
//         await createProfile(formData).unwrap();
//       } else {
//         // Update existing profile with only changed fields
//         const updatedFields = {};
//         Object.keys(formData).forEach((key) => {
//           if (
//             formData[key] !==
//             (userGetProfileResponse?.data[key] ||
//               (key === "email" && authMeResponse?.user.email) ||
//               "")
//           ) {
//             updatedFields[key] = formData[key];
//           }
//         });
//         if (Object.keys(updatedFields).length > 0) {
//           await updateProfile(updatedFields).unwrap();
//         }
//       }
//       refetchProfile(); // Refresh profile data after create/update
//       setIsSidebarOpen(false);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 sm:p-6">
//       {/* Profile Section */}
//       <div className="max-w-full mx-auto border rounded-xl shadow-lg p-4 sm:p-6 mb-6">
//         {/* Cover Image */}
//         <div className="h-40  rounded-t-xl">
//           {userGetProfileResponse?.data.cover_image_url ? (
//             <img
//               src={userGetProfileResponse.data.cover_image_url}
//               alt="Cover"
//               className="w-full h-full object-cover rounded-xl"
//             />
//           ) : (
//             <div className="w-full h-full rounded-xl  flex items-center justify-center ">
//               <div className="text-center">
//                 <p>No Cover Image</p>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start  gap-4 sm:gap-6">
//             {/* Profile Image */}
//             <div className="flex-shrink-0">
//               {/* {userGetProfileResponse?.data.profile_image_url && <p>Hi</p>} */}
//               {userGetProfileResponse?.data.profile_image_url ? (
//                 <>
//                   <p>Hwllo World</p>
//                 </>
//               ) : (
//                 <>
//                   <input
//                     type="file"
//                     name="profile_img" // Must match the multer field name
//                     accept="image/jpeg,image/png,image/jpg" // Restrict to allowed image types
//                     onChange={handleProfileImgChange}
//                   />
//                 </>
//               )}
//               <img
//                 // src={
//                 //   userGetProfileResponse?.data.profile_image_url ||
//                 //   pic_img ||
//                 //   profileUplaod
//                 // }
//                 src={
//                   userGetProfileResponse?.data.profile_image_url ||
//                   profileUplaod
//                 }
//                 alt="profile"
//                 className="h-24 w-24  sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
//               />
//               {/* <img src={profileUplaod} alt="check" /> */}
//             </div>
//             {/* Profile Details */}
//             <div className="flex-1 pt-10 mt-10 text-center sm:text-left">
//               <h1 className="text-2xl sm:text-3xl font-bold ">
//                 {userGetProfileResponse?.data.first_name || "First Name"}{" "}
//                 {userGetProfileResponse?.data.last_name || "Last Name"}
//               </h1>
//               <div className="flex pt-4 justify-center sm:justify-start items-center gap-2 ">
//                 <AiOutlineInfoCircle size={20} />
//                 <p>{userGetProfileResponse?.data.bio || "Bio not provided"}</p>
//               </div>
//               <div
//                 className="
//              md:flex mt-2 sm:mt-4 space-y-5 space-x-5 text-sm sm:text-base"
//               >
//                 <div className="space-y-5">
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiFillHome size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.location ||
//                         "Location not provided"}
//                     </p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiTwotoneMail size={20} />
//                     <p>{authMeResponse?.user.email || "Email not provided"}</p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiFillPhone size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.phone ||
//                         "Phone not provided"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="space-y-5">
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiOutlineUser size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.gender ||
//                         "Gender not provided"}
//                     </p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiOutlineCalendar size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.date_of_birth
//                         ? new Date(
//                             userGetProfileResponse.data.date_of_birth
//                           ).toLocaleDateString()
//                         : "Date of birth not provided"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-cyan-500 space-y-5 text-xs sm:text-sm">
//                   <p>
//                     Profile created:{" "}
//                     {userGetProfileResponse?.data.created_at
//                       ? new Date(
//                           userGetProfileResponse?.data.created_at
//                         ).toLocaleDateString()
//                       : "Not created"}
//                   </p>
//                   <p>
//                     Last updated:{" "}
//                     {userGetProfileResponse?.data.updated_at
//                       ? new Date(
//                           userGetProfileResponse?.data.updated_at
//                         ).toLocaleDateString()
//                       : "Not updated"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <TestBackendProfile />
//       {/* Resume Section */}
//       <div className="max-w-full mx-auto  rounded-xl shadow-lg p-4 sm:p-6 border">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resume</h2>
//         <div className="mb-6">
//           {getResume?.data.length > 0 && (
//             <h3 className="text-lg sm:text-xl font-medium  mb-2">
//               Uploaded Resumes
//             </h3>
//           )}
//           {isGetResumeLoading ? (
//             <p className="text-gray-500">Loading resumes...</p>
//           ) : (
//             <div className="space-y-4">
//               {getResume?.data.map((resume) => (
//                 <div key={resume.id} className="border rounded-lg p-4 ">
//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
//                     <div>
//                       <h4 className="text-base sm:text-lg font-medium">
//                         {resume.file_name}
//                       </h4>
//                       <p className="text-xs sm:text-sm text-gray-500">
//                         Uploaded on: {resume.uploaded_at}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         onClick={() => setFilenamePreview(resume.file_name)}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
//                       >
//                         Preview
//                       </button>
//                       <a
//                         href={`/api/user/resume/download/${resume.file_name}`}
//                         download={resume.file_name}
//                         className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                       >
//                         Download
//                       </a>
//                       <button
//                         onClick={() => {
//                           if (
//                             confirm(
//                               "Are you sure you want to delete this resume?"
//                             )
//                           ) {
//                             deleteResume(resume.id).then(() => refetch());
//                           }
//                         }}
//                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                         disabled={isDeleting}
//                       >
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </button>
//                     </div>
//                   </div>
//                   {filenamePreview === resume.file_name &&
//                     (isFileURLLoading ? (
//                       <p className="text-gray-500 mt-2">Loading preview...</p>
//                     ) : (
//                       <div className="mt-4 max-h-96 overflow-auto">
//                         <Document
//                           file={fileURL}
//                           onLoadError={(error) =>
//                             console.error("PDF load error:", error)
//                           }
//                         >
//                           <Page pageNumber={1} width={600} />
//                         </Document>
//                       </div>
//                     ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div>
//           <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
//             Upload New Resume
//           </h3>
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <input
//               type="file"
//               id="resume"
//               onChange={handleFileChange}
//               accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//               className="border rounded p-2 w-full sm:w-auto"
//             />
//             <button
//               onClick={handleUpload}
//               disabled={isFileLoading || !resumeFile}
//               className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
//                 isFileLoading || !resumeFile
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-500 hover:bg-green-600 transition"
//               }`}
//             >
//               {isFileLoading ? "Uploading..." : "Upload Resume"}
//             </button>
//           </div>
//           {resumeFile && (
//             <p className="text-xs sm:text-sm text-gray-600 mt-2">
//               Selected file size: {(resumeFile.size / 1024).toFixed(2)} KB
//             </p>
//           )}
//           {isFileSuccess && (
//             <p className="text-green-500 mt-2 text-sm">
//               Resume Uploaded Successfully!
//             </p>
//           )}
//           {errorFile && (
//             <p className="text-red-500 mt-2 text-sm">
//               Error: {errorFile.data?.message || "Upload failed"}
//             </p>
//           )}
//         </div>
//       </div>
//       {/* Sidebar for Editing Profile */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 flex justify-end z-50">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 backdrop-blur-sm "
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>
//           {/* Sidebar */}
//           <div className="relative w-full max-w-xs sm:max-w-md backdrop-blur-lg shadow-lg p-4 sm:p-6 h-full overflow-y-auto transform transition-transform duration-300 translate-x-0">
//             <div className="flex justify-between items-center mb-4 sm:mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//                 Edit Profile
//               </h2>
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender || ""}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Date of Birth
//                 </label>
//                 <input
//                   type="date"
//                   name="date_of_birth"
//                   value={formData.date_of_birth}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Bio
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                   rows="3"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-2">
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isCreating || isUpdating}
//                 className={`px-4 py-2 rounded text-white ${
//                   isCreating || isUpdating
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-cyan-800 hover:bg-cyan-900 transition"
//                 }`}
//               >
//                 {isCreating || isUpdating ? "Saving..." : "Save"}
//               </button>
//             </div>
//             <p className="mt-4 text-xs sm:text-sm text-gray-500">
//               Stay safe: Do not include sensitive personal information such as
//               identity documents, health, race, religion, or financial data.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;

// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// import { useAuthMeQuery } from "../../redux/api/authApi";

// import {
//   useGetProfileQuery,
//   useDeleteResumeMutation,
//   useGetResumeQuery,
//   usePreviewResumeQuery,
//   useUploadResumeMutation,
//   useCreateProfileMutation,
//   useUpdateProfileMutation,
//   useUploadUserProfileImageMutation,
// } from "../../redux/api/userApi";

// import {
//   AiFillHome,
//   AiFillPhone,
//   AiTwotoneMail,
//   AiOutlineCalendar,
//   AiOutlineUser,
//   AiOutlineInfoCircle,
// } from "react-icons/ai";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// import pic_img from "../../assets/utils/A.png";

// const UserProfile = () => {
//   // Profile Section State and Queries
//   const { data: authMeResponse, isLoading: isAuthMeLoading } =
//     useAuthMeQuery(null);

//   const {
//     data: userGetProfileResponse,
//     isLoading: isUserGetProfileLoading,
//     refetch: refetchProfile,
//   } = useGetProfileQuery();

//   // Resume Section State and Queries
//   const [resumeFile, setResumeFile] = useState();
//   const [filenamePreview, setFilenamePreview] = useState();

//   const [
//     uploadResume,
//     { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
//   ] = useUploadResumeMutation();

//   const {
//     data: getResume,
//     isLoading: isGetResumeLoading,
//     refetch,
//   } = useGetResumeQuery();

//   const {
//     data: fileURL,
//     isLoading: isFileURLLoading,
//     error: isFileURLError,
//   } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

//   const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

//   // Sidebar State
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     location: "",
//     email: "",
//     phone: "",
//     gender: "",
//     date_of_birth: "",
//     bio: "",
//   });

//   // Update formData when profile data loads
//   useEffect(() => {
//     if (userGetProfileResponse && authMeResponse) {
//       setFormData({
//         first_name: userGetProfileResponse?.data.first_name || "",
//         last_name: userGetProfileResponse?.data.last_name || "",
//         location: userGetProfileResponse?.data.location || "",
//         email: authMeResponse?.user.email || "",
//         phone: userGetProfileResponse?.data.phone || "",
//         gender: userGetProfileResponse?.data.gender || "",
//         date_of_birth: userGetProfileResponse?.data.date_of_birth
//           ? userGetProfileResponse.data.date_of_birth.split("T")[0]
//           : "",
//         bio: userGetProfileResponse?.data.bio || "",
//       });
//     } else if (authMeResponse) {
//       // If no profile exists, initialize with email from auth
//       setFormData((prev) => ({
//         ...prev,
//         email: authMeResponse?.user.email || "",
//       }));
//     }
//   }, [userGetProfileResponse, authMeResponse]);

//   // Use actual mutations
//   const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
//   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

//   if (isAuthMeLoading || isUserGetProfileLoading)
//     return <p className="text-center text-gray-500">Loading...</p>;
//   if (isFileURLError)
//     return (
//       <p className="text-center text-red-500">
//         Error loading resume preview...
//       </p>
//     );

//   // Resume Handlers
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setResumeFile(file);
//       console.log("Selected file:", file);
//     } else {
//       setResumeFile(null);
//       console.log("No file selected");
//     }
//   };

//   const handleUpload = async () => {
//     if (!resumeFile || !resumeFile.name) {
//       console.log("No valid file selected for upload.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("resume", resumeFile);
//     try {
//       const result = await uploadResume(formData).unwrap();
//       refetch();
//       console.log("Upload success:", result);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   // Sidebar Handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       if (!userGetProfileResponse?.data) {
//         // Create new profile if none exists
//         await createProfile(formData).unwrap();
//       } else {
//         // Update existing profile with only changed fields
//         const updatedFields = {};
//         Object.keys(formData).forEach((key) => {
//           if (
//             formData[key] !==
//             (userGetProfileResponse?.data[key] ||
//               (key === "email" && authMeResponse?.user.email) ||
//               "")
//           ) {
//             updatedFields[key] = formData[key];
//           }
//         });
//         if (Object.keys(updatedFields).length > 0) {
//           await updateProfile(updatedFields).unwrap();
//         }
//       }
//       refetchProfile(); // Refresh profile data after create/update
//       setIsSidebarOpen(false);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 sm:p-6">
//       {/* Profile Section */}
//       <div className="max-w-full mx-auto border rounded-xl shadow-lg p-4 sm:p-6 mb-6">
//         {/* Cover Image */}
//         <div className="h-40  rounded-t-xl">
//           {userGetProfileResponse?.data.cover_image_url ? (
//             <img
//               src={userGetProfileResponse.data.cover_image_url}
//               alt="Cover"
//               className="w-full h-full object-cover rounded-xl"
//             />
//           ) : (
//             <div className="w-full h-full rounded-xl  flex items-center justify-center ">
//               <div className="text-center">
//                 <p>No Cover Image</p>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start  gap-4 sm:gap-6">
//             {/* Profile Image */}
//             <div className="flex-shrink-0">
//               {/* {userGetProfileResponse?.data.profile_image_url && <p>Hi</p>} */}
//               {userGetProfileResponse?.data.profile_image_url ? (
//                 <>
//                   <p>Hwllo World</p>
//                 </>
//               ) : (
//                 <></>
//               )}
//               <img
//                 // src={
//                 //   userGetProfileResponse?.data.profile_image_url ||
//                 //   pic_img ||
//                 //   profileUplaod
//                 // }
//                 src={userGetProfileResponse?.data.profile_image_url}
//                 alt="profile"
//                 className="h-24 w-24  sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
//               />
//               {/* <img src={profileUplaod} alt="check" /> */}
//             </div>
//             {/* Profile Details */}
//             <div className="flex-1 pt-10 mt-10 text-center sm:text-left">
//               <h1 className="text-2xl sm:text-3xl font-bold ">
//                 {userGetProfileResponse?.data.first_name || "First Name"}{" "}
//                 {userGetProfileResponse?.data.last_name || "Last Name"}
//               </h1>
//               <div className="flex pt-4 justify-center sm:justify-start items-center gap-2 ">
//                 <AiOutlineInfoCircle size={20} />
//                 <p>{userGetProfileResponse?.data.bio || "Bio not provided"}</p>
//               </div>
//               <div
//                 className="
//              md:flex mt-2 sm:mt-4 space-y-5 space-x-5 text-sm sm:text-base"
//               >
//                 <div className="space-y-5">
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiFillHome size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.location ||
//                         "Location not provided"}
//                     </p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiTwotoneMail size={20} />
//                     <p>{authMeResponse?.user.email || "Email not provided"}</p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiFillPhone size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.phone ||
//                         "Phone not provided"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="space-y-5">
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiOutlineUser size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.gender ||
//                         "Gender not provided"}
//                     </p>
//                   </div>
//                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
//                     <AiOutlineCalendar size={20} />
//                     <p>
//                       {userGetProfileResponse?.data.date_of_birth
//                         ? new Date(
//                             userGetProfileResponse.data.date_of_birth
//                           ).toLocaleDateString()
//                         : "Date of birth not provided"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-cyan-500 space-y-5 text-xs sm:text-sm">
//                   <p>
//                     Profile created:{" "}
//                     {userGetProfileResponse?.data.created_at
//                       ? new Date(
//                           userGetProfileResponse?.data.created_at
//                         ).toLocaleDateString()
//                       : "Not created"}
//                   </p>
//                   <p>
//                     Last updated:{" "}
//                     {userGetProfileResponse?.data.updated_at
//                       ? new Date(
//                           userGetProfileResponse?.data.updated_at
//                         ).toLocaleDateString()
//                       : "Not updated"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Resume Section */}
//       <div className="max-w-full mx-auto  rounded-xl shadow-lg p-4 sm:p-6 border">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resume</h2>
//         <div className="mb-6">
//           {getResume?.data.length > 0 && (
//             <h3 className="text-lg sm:text-xl font-medium  mb-2">
//               Uploaded Resumes
//             </h3>
//           )}
//           {isGetResumeLoading ? (
//             <p className="text-gray-500">Loading resumes...</p>
//           ) : (
//             <div className="space-y-4">
//               {getResume?.data.map((resume) => (
//                 <div key={resume.id} className="border rounded-lg p-4 ">
//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
//                     <div>
//                       <h4 className="text-base sm:text-lg font-medium">
//                         {resume.file_name}
//                       </h4>
//                       <p className="text-xs sm:text-sm text-gray-500">
//                         Uploaded on: {resume.uploaded_at}
//                       </p>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         onClick={() => setFilenamePreview(resume.file_name)}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
//                       >
//                         Preview
//                       </button>
//                       <a
//                         href={`/api/user/resume/download/${resume.file_name}`}
//                         download={resume.file_name}
//                         className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                       >
//                         Download
//                       </a>
//                       <button
//                         onClick={() => {
//                           if (
//                             confirm(
//                               "Are you sure you want to delete this resume?"
//                             )
//                           ) {
//                             deleteResume(resume.id).then(() => refetch());
//                           }
//                         }}
//                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                         disabled={isDeleting}
//                       >
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </button>
//                     </div>
//                   </div>
//                   {filenamePreview === resume.file_name &&
//                     (isFileURLLoading ? (
//                       <p className="text-gray-500 mt-2">Loading preview...</p>
//                     ) : (
//                       <div className="mt-4 max-h-96 overflow-auto">
//                         <Document
//                           file={fileURL}
//                           onLoadError={(error) =>
//                             console.error("PDF load error:", error)
//                           }
//                         >
//                           <Page pageNumber={1} width={600} />
//                         </Document>
//                       </div>
//                     ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div>
//           <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
//             Upload New Resume
//           </h3>
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <input
//               type="file"
//               id="resume"
//               onChange={handleFileChange}
//               accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//               className="border rounded p-2 w-full sm:w-auto"
//             />
//             <button
//               onClick={handleUpload}
//               disabled={isFileLoading || !resumeFile}
//               className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
//                 isFileLoading || !resumeFile
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-500 hover:bg-green-600 transition"
//               }`}
//             >
//               {isFileLoading ? "Uploading..." : "Upload Resume"}
//             </button>
//           </div>
//           {resumeFile && (
//             <p className="text-xs sm:text-sm text-gray-600 mt-2">
//               Selected file size: {(resumeFile.size / 1024).toFixed(2)} KB
//             </p>
//           )}
//           {isFileSuccess && (
//             <p className="text-green-500 mt-2 text-sm">
//               Resume Uploaded Successfully!
//             </p>
//           )}
//           {errorFile && (
//             <p className="text-red-500 mt-2 text-sm">
//               Error: {errorFile.data?.message || "Upload failed"}
//             </p>
//           )}
//         </div>
//       </div>
//       {/* Sidebar for Editing Profile */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 flex justify-end z-50">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 backdrop-blur-sm "
//             onClick={() => setIsSidebarOpen(false)}
//           ></div>
//           {/* Sidebar */}
//           <div className="relative w-full max-w-xs sm:max-w-md backdrop-blur-lg shadow-lg p-4 sm:p-6 h-full overflow-y-auto transform transition-transform duration-300 translate-x-0">
//             <div className="flex justify-between items-center mb-4 sm:mb-6">
//               <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//                 Edit Profile
//               </h2>
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender || ""}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Date of Birth
//                 </label>
//                 <input
//                   type="date"
//                   name="date_of_birth"
//                   value={formData.date_of_birth}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Bio
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
//                   rows="3"
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-2">
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isCreating || isUpdating}
//                 className={`px-4 py-2 rounded text-white ${
//                   isCreating || isUpdating
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-cyan-800 hover:bg-cyan-900 transition"
//                 }`}
//               >
//                 {isCreating || isUpdating ? "Saving..." : "Save"}
//               </button>
//             </div>
//             <p className="mt-4 text-xs sm:text-sm text-gray-500">
//               Stay safe: Do not include sensitive personal information such as
//               identity documents, health, race, religion, or financial data.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;

// // import React, { useState, useEffect } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";
// // import "react-pdf/dist/Page/AnnotationLayer.css";
// // import "react-pdf/dist/Page/TextLayer.css";

// // import { useAuthMeQuery } from "../../redux/api/authApi";

// // import {
// //   useGetProfileQuery,
// //   useDeleteResumeMutation,
// //   useGetResumeQuery,
// //   usePreviewResumeQuery,
// //   useUploadResumeMutation,
// //   useCreateProfileMutation,
// //   useUpdateProfileMutation,
// //   useUploadUserProfileImageMutation,
// // } from "../../redux/api/userApi";

// // import {
// //   AiFillHome,
// //   AiFillPhone,
// //   AiTwotoneMail,
// //   AiOutlineCalendar,
// //   AiOutlineUser,
// //   AiOutlineInfoCircle,
// // } from "react-icons/ai";

// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // import pic_img from "../../assets/utils/A.png";
// // import TestBackendProfile from "./TestBackendProfile";

// // const UserProfile = () => {
// //   // Profile Section State and Queries
// //   const { data: authMeResponse, isLoading: isAuthMeLoading } =
// //     useAuthMeQuery(null);

// //   const {
// //     data: userGetProfileResponse,
// //     isLoading: isUserGetProfileLoading,
// //     refetch: refetchProfile,
// //   } = useGetProfileQuery();

// //   // Resume Section State and Queries
// //   const [resumeFile, setResumeFile] = useState();
// //   const [filenamePreview, setFilenamePreview] = useState();

// //   const [
// //     uploadResume,
// //     { isLoading: isFileLoading, isSuccess: isFileSuccess, error: errorFile },
// //   ] = useUploadResumeMutation();

// //   const {
// //     data: getResume,
// //     isLoading: isGetResumeLoading,
// //     refetch,
// //   } = useGetResumeQuery();

// //   const {
// //     data: fileURL,
// //     isLoading: isFileURLLoading,
// //     error: isFileURLError,
// //   } = usePreviewResumeQuery(filenamePreview, { skip: !filenamePreview });

// //   const [deleteResume, { isLoading: isDeleting }] = useDeleteResumeMutation();

// //   // Sidebar State
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //   const [formData, setFormData] = useState({
// //     first_name: "",
// //     last_name: "",
// //     location: "",
// //     email: "",
// //     phone: "",
// //     gender: "",
// //     date_of_birth: "",
// //     bio: "",
// //   });

// //   // Update formData when profile data loads
// //   useEffect(() => {
// //     if (userGetProfileResponse && authMeResponse) {
// //       setFormData({
// //         first_name: userGetProfileResponse?.data.first_name || "",
// //         last_name: userGetProfileResponse?.data.last_name || "",
// //         location: userGetProfileResponse?.data.location || "",
// //         email: authMeResponse?.user.email || "",
// //         phone: userGetProfileResponse?.data.phone || "",
// //         gender: userGetProfileResponse?.data.gender || "",
// //         date_of_birth: userGetProfileResponse?.data.date_of_birth
// //           ? userGetProfileResponse.data.date_of_birth.split("T")[0]
// //           : "",
// //         bio: userGetProfileResponse?.data.bio || "",
// //       });
// //     } else if (authMeResponse) {
// //       // If no profile exists, initialize with email from auth
// //       setFormData((prev) => ({
// //         ...prev,
// //         email: authMeResponse?.user.email || "",
// //       }));
// //     }
// //   }, [userGetProfileResponse, authMeResponse]);

// //   // Use actual mutations
// //   const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
// //   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

// //   if (isAuthMeLoading || isUserGetProfileLoading)
// //     return <p className="text-center text-gray-500">Loading...</p>;
// //   if (isFileURLError)
// //     return (
// //       <p className="text-center text-red-500">
// //         Error loading resume preview...
// //       </p>
// //     );

// //   // Resume Handlers
// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setResumeFile(file);
// //       console.log("Selected file:", file);
// //     } else {
// //       setResumeFile(null);
// //       console.log("No file selected");
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!resumeFile || !resumeFile.name) {
// //       console.log("No valid file selected for upload.");
// //       return;
// //     }
// //     const formData = new FormData();
// //     formData.append("resume", resumeFile);
// //     try {
// //       const result = await uploadResume(formData).unwrap();
// //       refetch();
// //       console.log("Upload success:", result);
// //     } catch (error) {
// //       console.error("Error uploading file:", error);
// //     }
// //   };

// //   // Sidebar Handlers
// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSave = async () => {
// //     try {
// //       if (!userGetProfileResponse?.data) {
// //         // Create new profile if none exists
// //         await createProfile(formData).unwrap();
// //       } else {
// //         // Update existing profile with only changed fields
// //         const updatedFields = {};
// //         Object.keys(formData).forEach((key) => {
// //           if (
// //             formData[key] !==
// //             (userGetProfileResponse?.data[key] ||
// //               (key === "email" && authMeResponse?.user.email) ||
// //               "")
// //           ) {
// //             updatedFields[key] = formData[key];
// //           }
// //         });
// //         if (Object.keys(updatedFields).length > 0) {
// //           await updateProfile(updatedFields).unwrap();
// //         }
// //       }
// //       refetchProfile(); // Refresh profile data after create/update
// //       setIsSidebarOpen(false);
// //     } catch (error) {
// //       console.error("Error saving profile:", error);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen p-4 sm:p-6">
// //       {/* Profile Section */}
// //       <div className="max-w-full mx-auto border rounded-xl shadow-lg p-4 sm:p-6 mb-6">
// //         {/* Cover Image */}
// //         <div className="h-40  rounded-t-xl">
// //           {userGetProfileResponse?.data.cover_image_url ? (
// //             <img
// //               src={userGetProfileResponse.data.cover_image_url}
// //               alt="Cover"
// //               className="w-full h-full object-cover rounded-xl"
// //             />
// //           ) : (
// //             <div className="w-full h-full rounded-xl  flex items-center justify-center ">
// //               <div className="text-center">
// //                 <p>No Cover Image</p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //         <div className="relative -mt-16 sm:-mt-20 px-4 sm:px-6">
// //           <div className="flex flex-col sm:flex-row items-center sm:items-start  gap-4 sm:gap-6">
// //             {/* Profile Image */}
// //             <div className="flex-shrink-0">
// //               {/* {userGetProfileResponse?.data.profile_image_url && <p>Hi</p>} */}
// //               {userGetProfileResponse?.data.profile_image_url ? (
// //                 <>
// //                   <p>Hwllo World</p>
// //                 </>
// //               ) : (
// //                 <></>
// //               )}
// //               <img
// //                 // src={
// //                 //   userGetProfileResponse?.data.profile_image_url ||
// //                 //   pic_img ||
// //                 //   profileUplaod
// //                 // }
// //                 src={userGetProfileResponse?.data.profile_image_url}
// //                 alt="profile"
// //                 className="h-24 w-24  sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-md"
// //               />
// //               {/* <img src={profileUplaod} alt="check" /> */}
// //             </div>
// //             {/* Profile Details */}
// //             <div className="flex-1 pt-10 mt-10 text-center sm:text-left">
// //               <h1 className="text-2xl sm:text-3xl font-bold ">
// //                 {userGetProfileResponse?.data.first_name || "First Name"}{" "}
// //                 {userGetProfileResponse?.data.last_name || "Last Name"}
// //               </h1>
// //               <div className="flex pt-4 justify-center sm:justify-start items-center gap-2 ">
// //                 <AiOutlineInfoCircle size={20} />
// //                 <p>{userGetProfileResponse?.data.bio || "Bio not provided"}</p>
// //               </div>
// //               <div
// //                 className="
// //              md:flex mt-2 sm:mt-4 space-y-5 space-x-5 text-sm sm:text-base"
// //               >
// //                 <div className="space-y-5">
// //                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
// //                     <AiFillHome size={20} />
// //                     <p>
// //                       {userGetProfileResponse?.data.location ||
// //                         "Location not provided"}
// //                     </p>
// //                   </div>
// //                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
// //                     <AiTwotoneMail size={20} />
// //                     <p>{authMeResponse?.user.email || "Email not provided"}</p>
// //                   </div>
// //                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
// //                     <AiFillPhone size={20} />
// //                     <p>
// //                       {userGetProfileResponse?.data.phone ||
// //                         "Phone not provided"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="space-y-5">
// //                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
// //                     <AiOutlineUser size={20} />
// //                     <p>
// //                       {userGetProfileResponse?.data.gender ||
// //                         "Gender not provided"}
// //                     </p>
// //                   </div>
// //                   <div className="flex justify-center sm:justify-start items-center gap-2 ">
// //                     <AiOutlineCalendar size={20} />
// //                     <p>
// //                       {userGetProfileResponse?.data.date_of_birth
// //                         ? new Date(
// //                             userGetProfileResponse.data.date_of_birth
// //                           ).toLocaleDateString()
// //                         : "Date of birth not provided"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="text-cyan-500 space-y-5 text-xs sm:text-sm">
// //                   <p>
// //                     Profile created:{" "}
// //                     {userGetProfileResponse?.data.created_at
// //                       ? new Date(
// //                           userGetProfileResponse?.data.created_at
// //                         ).toLocaleDateString()
// //                       : "Not created"}
// //                   </p>
// //                   <p>
// //                     Last updated:{" "}
// //                     {userGetProfileResponse?.data.updated_at
// //                       ? new Date(
// //                           userGetProfileResponse?.data.updated_at
// //                         ).toLocaleDateString()
// //                       : "Not updated"}
// //                   </p>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={() => setIsSidebarOpen(true)}
// //                 className="mt-4 px-4 py-2 bg-cyan-800 text-white rounded-lg hover:bg-cyan-900 transition"
// //               >
// //                 Edit Profile
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <TestBackendProfile />
// //       {/* Resume Section */}
// //       <div className="max-w-full mx-auto  rounded-xl shadow-lg p-4 sm:p-6 border">
// //         <h2 className="text-xl sm:text-2xl font-semibold mb-4">Resume</h2>
// //         <div className="mb-6">
// //           {getResume?.data.length > 0 && (
// //             <h3 className="text-lg sm:text-xl font-medium  mb-2">
// //               Uploaded Resumes
// //             </h3>
// //           )}
// //           {isGetResumeLoading ? (
// //             <p className="text-gray-500">Loading resumes...</p>
// //           ) : (
// //             <div className="space-y-4">
// //               {getResume?.data.map((resume) => (
// //                 <div key={resume.id} className="border rounded-lg p-4 ">
// //                   <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
// //                     <div>
// //                       <h4 className="text-base sm:text-lg font-medium">
// //                         {resume.file_name}
// //                       </h4>
// //                       <p className="text-xs sm:text-sm text-gray-500">
// //                         Uploaded on: {resume.uploaded_at}
// //                       </p>
// //                     </div>
// //                     <div className="flex flex-wrap gap-2">
// //                       <button
// //                         onClick={() => setFilenamePreview(resume.file_name)}
// //                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
// //                       >
// //                         Preview
// //                       </button>
// //                       <a
// //                         href={`/api/user/resume/download/${resume.file_name}`}
// //                         download={resume.file_name}
// //                         className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
// //                       >
// //                         Download
// //                       </a>
// //                       <button
// //                         onClick={() => {
// //                           if (
// //                             confirm(
// //                               "Are you sure you want to delete this resume?"
// //                             )
// //                           ) {
// //                             deleteResume(resume.id).then(() => refetch());
// //                           }
// //                         }}
// //                         className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
// //                         disabled={isDeleting}
// //                       >
// //                         {isDeleting ? "Deleting..." : "Delete"}
// //                       </button>
// //                     </div>
// //                   </div>
// //                   {filenamePreview === resume.file_name &&
// //                     (isFileURLLoading ? (
// //                       <p className="text-gray-500 mt-2">Loading preview...</p>
// //                     ) : (
// //                       <div className="mt-4 max-h-96 overflow-auto">
// //                         <Document
// //                           file={fileURL}
// //                           onLoadError={(error) =>
// //                             console.error("PDF load error:", error)
// //                           }
// //                         >
// //                           <Page pageNumber={1} width={600} />
// //                         </Document>
// //                       </div>
// //                     ))}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //         <div>
// //           <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
// //             Upload New Resume
// //           </h3>
// //           <div className="flex flex-col sm:flex-row items-center gap-4">
// //             <input
// //               type="file"
// //               id="resume"
// //               onChange={handleFileChange}
// //               accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
// //               className="border rounded p-2 w-full sm:w-auto"
// //             />
// //             <button
// //               onClick={handleUpload}
// //               disabled={isFileLoading || !resumeFile}
// //               className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
// //                 isFileLoading || !resumeFile
// //                   ? "bg-gray-400 cursor-not-allowed"
// //                   : "bg-green-500 hover:bg-green-600 transition"
// //               }`}
// //             >
// //               {isFileLoading ? "Uploading..." : "Upload Resume"}
// //             </button>
// //           </div>
// //           {resumeFile && (
// //             <p className="text-xs sm:text-sm text-gray-600 mt-2">
// //               Selected file size: {(resumeFile.size / 1024).toFixed(2)} KB
// //             </p>
// //           )}
// //           {isFileSuccess && (
// //             <p className="text-green-500 mt-2 text-sm">
// //               Resume Uploaded Successfully!
// //             </p>
// //           )}
// //           {errorFile && (
// //             <p className="text-red-500 mt-2 text-sm">
// //               Error: {errorFile.data?.message || "Upload failed"}
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //       {/* Sidebar for Editing Profile */}
// //       {isSidebarOpen && (
// //         <div className="fixed inset-0 flex justify-end z-50">
// //           {/* Overlay */}
// //           <div
// //             className="fixed inset-0 backdrop-blur-sm "
// //             onClick={() => setIsSidebarOpen(false)}
// //           ></div>
// //           {/* Sidebar */}
// //           <div className="relative w-full max-w-xs sm:max-w-md backdrop-blur-lg shadow-lg p-4 sm:p-6 h-full overflow-y-auto transform transition-transform duration-300 translate-x-0">
// //             <div className="flex justify-between items-center mb-4 sm:mb-6">
// //               <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
// //                 Edit Profile
// //               </h2>
// //               <button
// //                 onClick={() => setIsSidebarOpen(false)}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   First Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="first_name"
// //                   value={formData.first_name}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Last Name
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="last_name"
// //                   value={formData.last_name}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Location
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="location"
// //                   value={formData.location}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Email
// //                 </label>
// //                 <input
// //                   type="email"
// //                   name="email"
// //                   value={formData.email}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Phone
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="phone"
// //                   value={formData.phone}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Gender
// //                 </label>
// //                 <select
// //                   name="gender"
// //                   value={formData.gender || ""}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 >
// //                   <option value="">Select Gender</option>
// //                   <option value="Male">Male</option>
// //                   <option value="Female">Female</option>
// //                   <option value="Other">Other</option>
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Date of Birth
// //                 </label>
// //                 <input
// //                   type="date"
// //                   name="date_of_birth"
// //                   value={formData.date_of_birth}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                 />
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Bio
// //                 </label>
// //                 <textarea
// //                   name="bio"
// //                   value={formData.bio}
// //                   onChange={handleInputChange}
// //                   className="mt-1 block w-full border rounded-lg p-2 focus:ring-cyan-800 focus:border-cyan-800"
// //                   rows="3"
// //                 />
// //               </div>
// //             </div>
// //             <div className="mt-6 flex justify-end gap-2">
// //               <button
// //                 onClick={() => setIsSidebarOpen(false)}
// //                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSave}
// //                 disabled={isCreating || isUpdating}
// //                 className={`px-4 py-2 rounded text-white ${
// //                   isCreating || isUpdating
// //                     ? "bg-gray-400 cursor-not-allowed"
// //                     : "bg-cyan-800 hover:bg-cyan-900 transition"
// //                 }`}
// //               >
// //                 {isCreating || isUpdating ? "Saving..." : "Save"}
// //               </button>
// //             </div>
// //             <p className="mt-4 text-xs sm:text-sm text-gray-500">
// //               Stay safe: Do not include sensitive personal information such as
// //               identity documents, health, race, religion, or financial data.
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default UserProfile;
