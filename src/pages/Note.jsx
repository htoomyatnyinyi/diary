import React, { useState } from "react";
import {
  useSaveJobMutation,
  useJobApplicationMutation,
  useGetResumeQuery,
  useGetSavedJobsQuery,
  useGetApplicationsQuery,
} from "../../redux/api/userApi";
import coverImg from "../../assets/utils/B.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetails = ({ job, onBack }) => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const [saveJob, { isLoading: isSaving, error: saveError }] =
    useSaveJobMutation();
  const [jobApplication, { isLoading: isApplying, error: applyError }] =
    useJobApplicationMutation();
  const {
    data: resumes,
    isLoading: isResumesLoading,
    error: resumesError,
  } = useGetResumeQuery();
  const {
    data: savedJobs,
    isLoading: isSavedJobsLoading,
    error: savedJobsError,
  } = useGetSavedJobsQuery();
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    error: applicationsError,
  } = useGetApplicationsQuery();

  const isJobSaved = savedJobs?.data?.some(
    (saved) => saved.job_post_id === job?.id
  );

  const isJobApplied = applications?.data?.some(
    (app) => app.job_post_id === job?.id
  );

  const handleSaveJob = async () => {
    if (!job?.id) {
      toast.error("No job selected.");
      return;
    }
    if (isJobSaved) {
      toast.info("This job is already saved.");
      return;
    }
    try {
      await saveJob(job.id).unwrap();
      toast.success("Job saved successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save job.");
    }
  };

  const handleApplyJob = async () => {
    if (!job?.id) {
      toast.error("No job selected.");
      return;
    }
    if (isJobApplied) {
      toast.info("You have already applied to this job.");
      return;
    }
    if (!selectedResumeId) {
      toast.error("Please select a resume to apply.");
      return;
    }
    try {
      await jobApplication({
        jobId: job.id,
        resumeId: selectedResumeId,
      }).unwrap();
      toast.success("Application submitted successfully!");
      setIsResumeModalOpen(false);
      setSelectedResumeId(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to apply.");
    }
  };

  const openResumeModal = () => {
    if (isJobApplied) {
      toast.info("You have already applied to this job.");
      return;
    }
    if (!resumes?.data?.length) {
      toast.info("No resumes found. Please upload a resume first.");
      return;
    }
    setIsResumeModalOpen(true);
  };

  const closeResumeModal = () => {
    setIsResumeModalOpen(false);
    setSelectedResumeId(null);
  };

  if (isSavedJobsLoading || isApplicationsLoading || isResumesLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (
    savedJobsError ||
    applicationsError ||
    resumesError ||
    saveError ||
    applyError
  ) {
    console.log("Errors:", {
      savedJobsError,
      applicationsError,
      resumesError,
      saveError,
      applyError,
    });
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p className="text-lg text-red-600">
          Error loading data. Please try again.
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg text-white">
        <h2 className="text-xl font-semibold">Select a job to view details</h2>
        <p className="mt-2">Or create a new job using the button above!</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 text-white p-4">
      {/* Back Button for Mobile */}
      <div className="md:hidden mb-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
        >
          Back to Jobs
        </button>
      </div>

      {/* Job Image */}
      {job.post_image_url ? (
        <img
          src={job.post_image_url}
          alt={job.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      ) : (
        <img
          src={coverImg}
          alt="Default cover"
          className="w-full h-48 object-cover object-top rounded-md mb-4 dark:invert-100"
        />
      )}

      <div className="p-2">
        <h1 className="text-3xl font-bold p-2">{job.title}</h1>
        <p className="m-1 p-2">
          <strong>Location:</strong> {job.location || "N/A"}
        </p>
        {job.address && (
          <p className="m-1 p-2">
            <strong>Address:</strong> {job.address}
          </p>
        )}
        <p className="m-1 p-2">
          <strong>Type:</strong> {job.employment_type}
        </p>
        {(job.salary_min || job.salary_max) && (
          <p className="m-1 p-2">
            <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
            {job.salary_max || "N/A"}
          </p>
        )}
        {job.application_deadline && (
          <p className="text-xl m-1 p-2 text-red-600 mb-4">
            <strong>Apply by:</strong>{" "}
            {new Date(job.application_deadline).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 m-4 justify-around">
        <button
          onClick={handleSaveJob}
          disabled={isSaving || isJobSaved}
          className={`bg-blue-500 hover:bg-blue-700 w-1/2 text-white font-bold py-2 px-4 rounded ${
            isSaving || isJobSaved ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Saving..." : isJobSaved ? "Saved" : "Save Job"}
        </button>
        <button
          onClick={openResumeModal}
          disabled={isApplying || isJobApplied}
          className={`bg-cyan-500 hover:bg-cyan-700 w-1/2 text-white font-bold py-2 px-4 rounded ${
            isApplying || isJobApplied ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isApplying ? "Applying..." : isJobApplied ? "Applied" : "Apply Now"}
        </button>
      </div>

      <h2 className="text-xl font-semibold p-4 m-2 border-t">Description</h2>
      <p className="text-green-500 p-4 m-2 whitespace-pre-wrap">
        {job.description}
      </p>

      {job.requirements && job.requirements.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-4 mb-2 border-t pt-3">
            Requirements
          </h2>
          <ul className="list-disc list-inside space-y-4 p-4">
            {Array.isArray(job.requirements) ? (
              job.requirements.map((req, index) => (
                <li key={`req-${index}`}>{req}</li>
              ))
            ) : (
              <li>{job.requirements}</li>
            )}
          </ul>
        </>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
            Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-4 p-4">
            {Array.isArray(job.responsibilities) ? (
              job.responsibilities.map((resp, index) => (
                <li key={`resp-${index}`}>{resp}</li>
              ))
            ) : (
              <li>{job.responsibilities}</li>
            )}
          </ul>
        </>
      )}

      {/* Resume Selection Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Select a Resume</h2>
            {isResumesLoading ? (
              <p>Loading resumes...</p>
            ) : !resumes?.data?.length ? (
              <p>No resumes available. Please upload a resume first.</p>
            ) : (
              <div className="space-y-2">
                {resumes.data.map((resume) => (
                  <div key={resume.id} className="flex items-center">
                    <input
                      type="radio"
                      name="resume"
                      value={resume.id}
                      checked={selectedResumeId === resume.id}
                      onChange={() => setSelectedResumeId(resume.id)}
                      className="mr-2"
                    />
                    <label>{resume.file_name}</label>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeResumeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyJob}
                disabled={!selectedResumeId || isApplying}
                className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded ${
                  !selectedResumeId || isApplying
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
// import React, { useState } from "react";
// import {
//   useGetProfileQuery,
//   useGetResumeQuery,
//   useGetSavedJobsQuery,
//   useGetApplicationsQuery,
//   useCreateProfileMutation,
//   useUpdateProfileMutation,
//   useUploadProfileImageMutation,
// } from "../../redux/api/userApi";

// import Resume from "./Resume";
// import defaultCover from "../../assets/utils/A.png";
// import defaultProfile from "../../assets/utils/B.png";

// const UserProfile = () => {
//   const [formData, setFormData] = useState({});
//   const [editingField, setEditingField] = useState(null);
//   const [createFormData, setCreateFormData] = useState({
//     first_name: "",
//     last_name: "",
//     phone: "",
//     gender: "",
//     date_of_birth: "",
//     location: "",
//     bio: "",
//   });

//   const [uploadProfileImage, { isLoading: isUploadProfileImageLoading }] =
//     useUploadProfileImageMutation();
//   if (isUploadProfileImageLoading) return <p>Loading Upload Image Profile</p>;

//   const {
//     data: profile,
//     isLoading: isProfileLoading,
//     refetch,
//   } = useGetProfileQuery(null);

//   const [updateProfile, { isLoading: isUpdating, error: updateError }] =
//     useUpdateProfileMutation();

//   const [createProfile, { isLoading: isCreating, error: createError }] =
//     useCreateProfileMutation();

//   const handleCreateChange = (e) => {
//     const { name, value } = e.target;

//     setCreateFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createProfile(createFormData).unwrap();
//       setCreateFormData({
//         first_name: "",
//         last_name: "",
//         phone: "",
//         gender: "",
//         date_of_birth: "",
//         location: "",
//         bio: "",
//       });
//       refetch();
//     } catch (error) {
//       console.error("Failed to create profile:", error);
//     }
//   };

//   if (!profile) {
//     return (
//       <div className="max-w-2xl mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-6">Create New Profile</h1>
//         <form onSubmit={handleCreateSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="first_name" className="block text-sm font-medium">
//               First Name
//             </label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               value={createFormData.first_name}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="last_name" className="block text-sm font-medium">
//               Last Name
//             </label>
//             <input
//               type="text"
//               id="last_name"
//               name="last_name"
//               value={createFormData.last_name}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium">
//               Phone
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={createFormData.phone}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="gender" className="block text-sm font-medium">
//               Gender
//             </label>
//             <select
//               id="gender"
//               name="gender"
//               value={createFormData.gender}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//             >
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="date_of_birth"
//               className="block text-sm font-medium"
//             >
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               id="date_of_birth"
//               name="date_of_birth"
//               value={createFormData.date_of_birth}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="location" className="block text-sm font-medium">
//               Location
//             </label>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={createFormData.location}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="bio" className="block text-sm font-medium">
//               Bio
//             </label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={createFormData.bio}
//               onChange={handleCreateChange}
//               className="mt-1 p-2 w-full border rounded-md"
//               rows="4"
//             />
//           </div>

//           {createError && (
//             <p className="text-red-500">
//               {createError.data?.message || "Failed to create profile"}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={isCreating}
//             className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
//           >
//             {isCreating ? "Creating..." : "Create Profile"}
//           </button>
//         </form>
//       </div>
//     );
//   }

//   if (isProfileLoading) return <p>Loading Profile...</p>;

//   const handleEdit = (field) => {
//     setEditingField(field);
//     setFormData({ [field]: profile[field] });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ [name]: value });
//   };

//   const handleSave = async (field) => {
//     try {
//       const payload = { [field]: formData[field] };
//       await updateProfile(payload).unwrap();
//       setEditingField(null);
//       setFormData({});
//       refetch();
//     } catch (error) {
//       console.error(`Failed to update ${field}`, error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//     setFormData({});
//   };

//   const renderField = (label, field, value, type = "text") => {
//     if (editingField === field) {
//       return (
//         <div className="border border-gray-200 p-4 m-4 rounded-md">
//           <p className="p-2 m-1">
//             <strong className="bg-green-100 p-2 rounded">
//               {label} (Current):
//             </strong>{" "}
//             {value}
//           </p>
//           <div className="flex items-center space-x-2">
//             <input
//               type={type}
//               name={field}
//               value={formData[field] || ""}
//               onChange={handleChange}
//               className="p-2 border rounded-md flex-1"
//             />
//             <button
//               onClick={() => handleSave(field)}
//               className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancel}
//               className="p-2 bg-gray-300 rounded-md hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex-1 m-4">
//         <p className="p-2">
//           <strong>{label}: </strong>
//           <span>{value}</span>
//         </p>
//         <button
//           onClick={() => handleEdit(field)}
//           className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//         >
//           Edit
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <UserProfileWall
//         userName={profile?.data.first_name}
//         userBios={profile?.data.bio}
//       />
//       <div className="p-4 m-1 backdrop-blur-3xl shadow-2xl">
//         <div className="flex justify-evenly flex-wrap">
//           <div>
//             {renderField(
//               "First Name",
//               "first_name",
//               profile?.data.first_name || "N/A"
//             )}
//             {renderField(
//               "Last Name",
//               "last_name",
//               profile?.data.last_name || "N/A"
//             )}
//             {renderField("Phone", "phone", profile?.data.phone || "N/A")}
//           </div>
//           <div>
//             {renderField("Gender", "gender", profile?.data.gender || "N/A")}
//             {renderField(
//               "Date of Birth",
//               "date_of_birth",
//               profile?.data.date_of_birth || "N/A"
//             )}
//             {renderField(
//               "Location",
//               "location",
//               profile?.data.location || "N/A"
//             )}
//             {renderField("Bio", "bio", profile?.data.bio || "N/A")}
//           </div>
//         </div>
//         <div>
//           {updateError && (
//             <p className="text-red-500 mt-4">
//               {updateError.data?.message || "Update failed."}
//             </p>
//           )}
//         </div>
//       </div>
//       <Resume />
//     </div>
//   );
// };

// export default UserProfile;

// const UserProfileWall = ({
//   userName,
//   userBios,
//   coverImageUrl = defaultCover, // Use provided URL or default
//   profileImageUrl = defaultProfile, // Use provided URL or default
//   // location,
//   // industry,
// }) => {
//   return (
//     // Outer container for shadow, rounded corners, and max width
//     <div className=" mx-auto  shadow-lg rounded-lg overflow-hidden my-4">
//       {/* --- Cover Image Section --- */}
//       <div
//         className="h-96 bg-cover bg-center bg-gray-300" // Added placeholder bg color
//         style={{ backgroundImage: `url(${coverImageUrl})` }}
//         role="img" // Accessibility
//         aria-label={`${userName} cover image`}
//       >
//         <p className="text-sm ">Develop By Htoo Myat Nyi Nyi</p>
//         {/* Optionally add elements over the cover image here */}
//       </div>

//       {/* --- Profile Content Area --- */}
//       <div className="relative p-6 ">
//         {/* Relative positioning context for the profile image */}
//         {/* --- Profile Picture/Logo --- */}
//         {/* Positioned to overlap the bottom of the cover image */}
//         <div className="absolute left-16 mt-16 sm:-mt-20">
//           {/* Adjust negative margin as needed */}
//           <img
//             src={profileImageUrl}
//             alt={`${userName} profile`}
//             // Styling for the profile image: size, circle, border
//             className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-200 shadow-md" // Added placeholder bg and shadow
//           />
//         </div>
//         {/* --- Text Content --- */}
//         {/* Add padding/margin to the left to clear the profile picture */}
//         <div className="pt-8 sm:pt-4 pl-0 sm:pl-40 min-h-20 ">
//           {/* Adjust left padding (sm:pl-40) based on profile image size + spacing */}
//           <h1 className="text-2xl sm:text-3xl font-bold  mb-1">{userName}</h1>
//           {/* Optional: Add more details like location or industry */}
//           {/* {location && <p className="text-sm text-gray-500 mb-1">{location}</p>} */}
//           {/* {industry && <p className="text-sm text-gray-500 mb-3">{industry}</p>} */}
//           <p className="text-sm sm:text-base mt-2">{userBios}</p>
//         </div>
//         {/* --- Optional: Action Buttons or Links --- */}
//         {/* Example: Buttons positioned below the main text */}
//         <div className="mt-4 pl-0 sm:pl-40 flex flex-wrap gap-2">
//           <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
//             View Jobs
//           </button>
//           <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300">
//             Follow
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /*
//   // State for managing the sidebar visibility
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Functions to control sidebar
//   const openSidebar = () => setIsSidebarOpen(true);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   <CreateNewJob isOpen={isSidebarOpen} onClose={closeSidebar} />
// */

// /*
// import React, { useEffect } from "react";

// const CreateNewJob = ({ isOpen, onClose }) => {
//   // Reset form when sidebar closes or on successful submission
//   useEffect(() => {
//     if (!isOpen) {
//       // Optionally delay reset slightly for closing animation
//       console.log("Hi ");
//     }
//   }, [isOpen]);
//   return (
//     <div className="h-screen bg-slate-900">
//       {" "}

//       <div
//         className={`pt-16 fixed inset-0 backdrop-blur-xl z-50 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose} // Close sidebar when clicking overlay
//       ></div>

//       <div
//         className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5  shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } overflow-y-auto`} // Added overflow-y-auto
//       >
//         <h1 className="h-96 w-72 ">This is Testing Page</h1>
//       </div>
//     </div>
//   );
// };

// export default CreateNewJob;
// */
// import React, { useState, useEffect } from "react";
// import { useCreateNewJobMutation } from "../../../redux/api/jobApi";

// // Helper component for list input (Requirements/Responsibilities)
// const ListInput = ({ label, placeholder, items, setItems }) => {
//   const [currentItem, setCurrentItem] = useState("");

//   const handleAddItem = (e) => {
//     // Prevent adding if triggered by Enter key in the input itself if needed
//     if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
//       e.preventDefault(); // Prevent form submission if inside form
//       if (currentItem.trim()) {
//         setItems([...items, currentItem.trim()]);
//         setCurrentItem("");
//       }
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleAddItem(e);
//     }
//   };

//   const handleRemoveItem = (indexToRemove) => {
//     setItems(items.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label}
//       </label>
//       <div className="flex items-center space-x-2 mb-2">
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={currentItem}
//           onChange={(e) => setCurrentItem(e.target.value)}
//           onKeyDown={handleKeyDown} // Add item on Enter key
//           className="flex-grow p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//         />
//         <button
//           type="button" // Important: type="button" to prevent form submission
//           onClick={handleAddItem}
//           className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded text-sm"
//         >
//           Add
//         </button>
//       </div>
//       <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-4">
//         {items.map((item, index) => (
//           <li key={index} className="flex justify-between items-center group">
//             <span>{item}</span>
//             <button
//               type="button"
//               onClick={() => handleRemoveItem(index)}
//               className="text-red-500 hover:text-red-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//         {items.length === 0 && (
//           <li className="text-gray-400 italic">
//             No {label.toLowerCase()} added yet.
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

// // Main Sidebar Component
// const CreateNewJob = ({ isOpen, onClose }) => {
//   const [createNewJob] = useCreateNewJobMutation();

//   const initialFormData = {
//     title: "",
//     description: "",
//     salary_min: "",
//     salary_max: "",
//     location: "",
//     address: "",
//     employment_type: "",
//     category: "",
//     application_deadline: "",
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [requirements, setRequirements] = useState([]);
//   const [responsibilities, setResponsibilities] = useState([]);
//   const [postImage, setPostImage] = useState(null); // State for the file
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Reset form when sidebar closes or on successful submission
//   useEffect(() => {
//     if (!isOpen) {
//       // Optionally delay reset slightly for closing animation
//       setTimeout(() => {
//         setFormData(initialFormData);
//         setRequirements([]);
//         setResponsibilities([]);
//         setPostImage(null);
//         setError(null);
//         setSuccess(null);
//         setIsLoading(false);
//       }, 300); // Match transition duration
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setPostImage(e.target.files[0]);
//     } else {
//       setPostImage(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setSuccess(null);

//     // Create FormData object for multipart/form-data
//     const submissionData = new FormData();

//     // Append standard form fields
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== null && formData[key] !== "") {
//         // Avoid sending empty strings if not desired, or handle nulls explicitly
//         submissionData.append(key, formData[key]);
//       }
//     });

//     // Append requirements and responsibilities as JSON strings
//     submissionData.append("requirements", JSON.stringify(requirements));
//     submissionData.append("responsibilities", JSON.stringify(responsibilities));

//     // Append the file if selected
//     if (postImage) {
//       submissionData.append("post_image", postImage); // Key matches backend 'req.files?.post_image'
//     }
//     console.log(submissionData, "check at submit");
//     try {
//       createNewJob(submissionData);
//       // // Replace '/api/jobs' with your actual endpoint
//       // // Make sure to include authentication headers if needed
//       // const response = await fetch("/api/jobs", {
//       //   method: "POST",
//       //   body: submissionData,
//       //   // !! DO NOT set Content-Type header manually when using FormData !!
//       //   // The browser will set it correctly, including the boundary.
//       //   // headers: { 'Authorization': `Bearer ${yourAuthToken}` } // Example auth header
//       // });

//       // const result = await response.json();

//       // if (!response.ok || !result.success) {
//       //   // Use message from backend response if available
//       //   throw new Error(
//       //     result.message || `HTTP error! status: ${response.status}`
//       //   );
//       // }

//       // setSuccess(`Job created successfully! ID: ${result.id}`);
//       // // Optionally reset form fields here if you don't want to wait for close
//       // // setFormData(initialFormData); setRequirements([]); ...
//       // // Consider closing the sidebar automatically after success
//       // setTimeout(() => {
//       //   onClose(); // Close the sidebar via the prop function
//       // }, 1500); // Give user time to see success message
//     } catch (err) {
//       console.error("Submission error:", err);
//       setError(err.message || "An unexpected error occurred.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Define options for select dropdowns (example)
//   const employmentTypeOptions = [
//     "full_time",
//     "part_time",
//     "contract",
//     "internship",
//     "apprenticeship",
//   ];

//   const categoryOptions = [
//     "Technology",
//     "Marketing",
//     "Sales",
//     "Design",
//     "Human Resources",
//     "Finance",
//     "Customer Service",
//     "Other",
//   ];

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className={`pt-16 fixed inset-0 backdrop-blur-xl z-50 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose} // Close sidebar when clicking overlay
//       ></div>

//       {/* Sidebar Container */}
//       <div
//         className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5  shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } overflow-y-auto`} // Added overflow-y-auto
//       >
//         <div className="p-6">
//           {/* Header with Close Button */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Create New Job
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-800 text-2xl"
//               aria-label="Close sidebar"
//             >
//               &times; {/* Close icon */}
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Job Title */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Title *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 placeholder="e.g., Senior React Developer"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="4"
//                 placeholder="Provide a detailed description..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Requirements List Input */}
//             <ListInput
//               label="Requirements"
//               placeholder="Add a requirement..."
//               items={requirements}
//               setItems={setRequirements}
//             />

//             {/* Responsibilities List Input */}
//             <ListInput
//               label="Responsibilities"
//               placeholder="Add a responsibility..."
//               items={responsibilities}
//               setItems={setResponsibilities}
//             />

//             {/* Salary Range */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="salary_min"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Min Salary ($)
//                 </label>
//                 <input
//                   type="number"
//                   id="salary_min"
//                   name="salary_min"
//                   placeholder="e.g., 60000"
//                   value={formData.salary_min}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="salary_max"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Max Salary ($)
//                 </label>
//                 <input
//                   type="number"
//                   id="salary_max"
//                   name="salary_max"
//                   placeholder="e.g., 90000"
//                   value={formData.salary_max}
//                   onChange={handleChange}
//                   className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//                 />
//               </div>
//             </div>

//             {/* Location */}
//             <div>
//               <label
//                 htmlFor="location"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Location
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 placeholder="e.g., Remote, New York"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Address (Optional) */}
//             <div>
//               <label
//                 htmlFor="address"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Specific Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 placeholder="e.g., 123 Main St (Optional)"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Employment Type */}
//             <div>
//               <label
//                 htmlFor="employment_type"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Employment Type *
//               </label>
//               <select
//                 id="employment_type"
//                 name="employment_type"
//                 value={formData.employment_type}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
//               >
//                 <option value="" disabled>
//                   Select type...
//                 </option>
//                 {employmentTypeOptions.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Category */}
//             <div>
//               <label
//                 htmlFor="category"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Job Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
//               >
//                 <option value="" disabled>
//                   Select category...
//                 </option>
//                 {categoryOptions.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Application Deadline */}
//             <div>
//               <label
//                 htmlFor="application_deadline"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Application Deadline
//               </label>
//               <input
//                 type="date"
//                 id="application_deadline"
//                 name="application_deadline"
//                 value={formData.application_deadline}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
//               />
//             </div>

//             {/* Post Image Upload */}
//             <div>
//               <label
//                 htmlFor="post_image"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Featured Image (Optional)
//               </label>
//               <input
//                 type="file"
//                 id="post_image"
//                 name="post_image" // Name attribute matches backend
//                 onChange={handleFileChange}
//                 accept="image/*" // Accept only image files
//                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
//               />
//               {postImage && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   Selected: {postImage.name}
//                 </p>
//               )}
//             </div>

//             {/* Loading/Error/Success Messages */}
//             <div className="mt-4 space-y-2">
//               {isLoading && (
//                 <p className="text-center text-blue-600">Submitting...</p>
//               )}
//               {error && (
//                 <p className="text-center text-red-600 bg-red-100 p-2 rounded">
//                   Error: {error}
//                 </p>
//               )}
//               {success && (
//                 <p className="text-center text-green-600 bg-green-100 p-2 rounded">
//                   {success}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={isLoading} // Disable button while loading
//                 className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? "Creating..." : "Create Job Posting"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateNewJob;

// // import React, { useState } from "react";

// // const CreateNewJob = () => {
// //   // Initial state for the form fields
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     salary_min: "",
// //     salary_max: "",
// //     location: "",
// //     address: "",
// //     employment_type: "", // e.g., 'Full-time', 'Part-time', 'Contract'
// //     category: "", // e.g., 'Software Development', 'Marketing', 'Sales'
// //     requirements: "",
// //     responsibilities: "",
// //     application_deadline: "",
// //   });

// //   // Generic handler to update state for any form field
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prevState) => ({
// //       ...prevState,
// //       [name]: value,
// //     }));
// //   };

// //   // Handler for form submission
// //   const handleSubmit = (e) => {
// //     e.preventDefault(); // Prevent default browser form submission
// //     console.log("Form Submitted Data:", formData);
// //     // Here you would typically send the formData to your backend API
// //     // e.g., fetch('/api/jobs', { method: 'POST', body: JSON.stringify(formData), ... })
// //     alert("Job submitted! Check the console for the data.");
// //     // Optionally reset the form after submission
// //     // setFormData({ ...initial empty state... });
// //   };

// //   // Define options for select dropdowns (example)
// //   const employmentTypeOptions = [
// //     "Full-time",
// //     "Part-time",
// //     "Contract",
// //     "Internship",
// //     "Temporary",
// //   ];
// //   const categoryOptions = [
// //     "Technology",
// //     "Marketing",
// //     "Sales",
// //     "Design",
// //     "Human Resources",
// //     "Finance",
// //     "Customer Service",
// //     "Other",
// //   ];

// //   return (
// //     <div className="w-1/2">
// //       <div className="p-4 rounded backdrop-blur-3xl shadow">
// //         <h2 className="text-xl font-semibold mb-6 text-gray-800">
// //           Job Details
// //         </h2>
// //         {/* Form Element */}
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           {/* Job Title */}
// //           <div>
// //             <label
// //               htmlFor="title"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Job Title
// //             </label>
// //             <input
// //               type="text"
// //               id="title"
// //               name="title" // Name attribute links to formData key
// //               placeholder="e.g., Senior React Developer"
// //               value={formData.title} // Bind value to state
// //               onChange={handleChange} // Update state on change
// //               required // Example: Make field required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Description */}
// //           <div>
// //             <label
// //               htmlFor="description"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Job Description
// //             </label>
// //             <textarea
// //               id="description"
// //               name="description"
// //               rows="4"
// //               placeholder="Provide a detailed description of the job role..."
// //               value={formData.description}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Salary Range */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <label
// //                 htmlFor="salary_min"
// //                 className="block text-sm font-medium text-gray-700 mb-1"
// //               >
// //                 Minimum Salary ($)
// //               </label>
// //               <input
// //                 type="number"
// //                 id="salary_min"
// //                 name="salary_min"
// //                 placeholder="e.g., 60000"
// //                 value={formData.salary_min}
// //                 onChange={handleChange}
// //                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //               />
// //             </div>
// //             <div>
// //               <label
// //                 htmlFor="salary_max"
// //                 className="block text-sm font-medium text-gray-700 mb-1"
// //               >
// //                 Maximum Salary ($)
// //               </label>
// //               <input
// //                 type="number"
// //                 id="salary_max"
// //                 name="salary_max"
// //                 placeholder="e.g., 90000"
// //                 value={formData.salary_max}
// //                 onChange={handleChange}
// //                 className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //               />
// //             </div>
// //           </div>

// //           {/* Location */}
// //           <div>
// //             <label
// //               htmlFor="location"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Location
// //             </label>
// //             <input
// //               type="text"
// //               id="location"
// //               name="location"
// //               placeholder="e.g., Remote, New York, London"
// //               value={formData.location}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Address (Optional) */}
// //           <div>
// //             <label
// //               htmlFor="address"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Specific Address (Optional)
// //             </label>
// //             <input
// //               type="text"
// //               id="address"
// //               name="address"
// //               placeholder="e.g., 123 Main St, Suite 400"
// //               value={formData.address}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Employment Type */}
// //           <div>
// //             <label
// //               htmlFor="employment_type"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Employment Type
// //             </label>
// //             <select
// //               id="employment_type"
// //               name="employment_type"
// //               value={formData.employment_type}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
// //             >
// //               <option value="" disabled>
// //                 Select type...
// //               </option>
// //               {employmentTypeOptions.map((type) => (
// //                 <option key={type} value={type}>
// //                   {type}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Category */}
// //           <div>
// //             <label
// //               htmlFor="category"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Job Category
// //             </label>
// //             <select
// //               id="category"
// //               name="category"
// //               value={formData.category}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 bg-white"
// //             >
// //               <option value="" disabled>
// //                 Select category...
// //               </option>
// //               {categoryOptions.map((cat) => (
// //                 <option key={cat} value={cat}>
// //                   {cat}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Requirements */}
// //           <div>
// //             <label
// //               htmlFor="requirements"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Requirements
// //             </label>
// //             <textarea
// //               id="requirements"
// //               name="requirements"
// //               rows="4"
// //               placeholder="List the qualifications, skills, and experience required..."
// //               value={formData.requirements}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Responsibilities */}
// //           <div>
// //             <label
// //               htmlFor="responsibilities"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Responsibilities
// //             </label>
// //             <textarea
// //               id="responsibilities"
// //               name="responsibilities"
// //               rows="4"
// //               placeholder="List the key responsibilities and tasks for this role..."
// //               value={formData.responsibilities}
// //               onChange={handleChange}
// //               required
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Application Deadline */}
// //           <div>
// //             <label
// //               htmlFor="application_deadline"
// //               className="block text-sm font-medium text-gray-700 mb-1"
// //             >
// //               Application Deadline
// //             </label>
// //             <input
// //               type="date"
// //               id="application_deadline"
// //               name="application_deadline"
// //               value={formData.application_deadline}
// //               onChange={handleChange}
// //               className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
// //             />
// //           </div>

// //           {/* Submit Button */}
// //           <div className="pt-4">
// //             <button
// //               type="submit"
// //               className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
// //             >
// //               Create Job Posting
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateNewJob; // import React, { useState } from "react";
