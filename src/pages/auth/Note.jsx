import React, { useState } from "react";
import CreateNewJobSidebar from "./CreateNewJob";
import {
  useGetAppliedJobsQuery,
  useGetAppliedUserProfileByIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../../redux/api/employerApi";

const JobDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Job Management</h1>
        <button
          onClick={openSidebar}
          className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4"
        >
          Create New Job Posting
        </button>
        <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>
      <JobUpdateStatus />
    </div>
  );
};

export default JobDashboard;

const JobUpdateStatus = () => {
  const {
    data: getAppliedJobs,
    isLoading: isGetAppliedJobLoading,
    isError: isGetAppliedJobError,
  } = useGetAppliedJobsQuery(null);

  const [
    updateApplicationStatus,
    {
      isLoading: isUpdateApplicationStatusLoading,
      isError: isUpdateApplicationStatusError,
      error: errorUpdateApplicationStatus,
    },
  ] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus({
        id: applicationId,
        statusData: { status: newStatus },
      }).unwrap();
      console.log("Update successful for application:", applicationId);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="p-2 m-1">
      {isGetAppliedJobError ? (
        <div>
          <h1>Error at Get AppliedJob</h1>
        </div>
      ) : isGetAppliedJobLoading ? (
        <div>
          <h1>Loading ...</h1>
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-semibold mb-2">
            This is Get Applied Job List
          </h1>
          {getAppliedJobs.data.map((job) => (
            <div key={job.id} className="m-1 p-4 outline">
              <div className="text-green-500">
                <p className="text-2xl underline">{job.title}</p>
                <p>{job.description}</p>
                <p>
                  Salary: {job.salary_min} - {job.salary_max}
                </p>
                <p>
                  {job.category} | {job.employment_type}
                </p>
                <p>{job.location}</p>
                <div className="mt-2 text-pink-500">
                  <strong>Total Applications: </strong>
                  {job.application_count ?? 0}
                </div>
                <div className="text-red-600">
                  <strong>Deadline: </strong>
                  {job.application_deadline
                    ? new Date(job.application_deadline).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Applications Received:
                </h4>

                {job.applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    handleStatusChange={handleStatusChange}
                    isLoading={isUpdateApplicationStatusLoading}
                    error={errorUpdateApplicationStatus}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ApplicationCard = ({
  application,
  handleStatusChange,
  isLoading,
  error,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetAppliedUserProfileByIdQuery(application.user_id, {
    skip: !showProfile,
  });

  return (
    <div className="bg-white text-cyan-900 dark:bg-cyan-900 dark:text-white p-2 m-1">
      <div>
        <p>
          <strong>Application ID: </strong> {application.id}
        </p>
        <p>
          <strong>User ID: </strong> {application.user_id || "NULL"}
        </p>
        <p>
          <strong>Applied At: </strong> {application.applied_at}
        </p>
        <p>
          <strong>Resume ID: </strong> {application.resume_id}
        </p>
        <p>
          <strong>Status: </strong> {application.status}
        </p>
        <p>
          <strong>Status Updated At: </strong> {application.updated_at}
        </p>

        <div className="my-2">
          <label className="block">Change Job Application Status:</label>
          <select
            value={application.status || ""}
            onChange={(e) => handleStatusChange(application.id, e.target.value)}
            disabled={isLoading}
            className="bg-white text-black p-2 mt-1"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interviewed">Interview</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          {error && (
            <p className="text-red-500 text-sm mt-1">
              Failed to update status. Please try again.
            </p>
          )}
        </div>

        <button
          onClick={() => setShowProfile((prev) => !prev)}
          className="bg-yellow-500 p-2 mt-2 hover:bg-yellow-700"
        >
          {showProfile ? "Hide Profile" : "View Profile"}
        </button>

        {showProfile && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {isProfileLoading ? (
              <p>Loading profile...</p>
            ) : isProfileError ? (
              <p className="text-red-500">Error fetching profile</p>
            ) : userProfile ? (
              <div>
                <p>
                  <strong>First Name: </strong>
                  {userProfile.data.first_name}
                </p>
                <p>
                  <strong>Last Name: </strong>
                  {userProfile.data.last_name}
                </p>
                <p>
                  <strong>Email: </strong>
                  {userProfile.data.email}
                </p>
                {/* Add more fields as needed */}
              </div>
            ) : (
              <p>No profile data found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// import React from "react";

// import {
//   useGetAppliedJobsQuery,
//   useUpdateApplicationStatusMutation,
// } from "../../../redux/api/employerApi"; // Assuming correct path
// const JobDashboard = () => {
//   return (
//     <div>
//       <JobUpdateStatus />
//     </div>
//   );
// };

// export default JobDashboard;

// // --- JobDashboard component remains the same ---
// // const JobDashboard = () => {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// //   const openSidebar = () => setIsSidebarOpen(true);
// //   const closeSidebar = () => setIsSidebarOpen(false);

// //   return (
// //     <div>
// //       <div className="p-6">
// //         <h1 className="text-3xl font-bold mb-6">Job Management</h1>
// //         {/* Add other dashboard content here, like a list of existing jobs */}
// //         <button
// //           onClick={openSidebar}
// //           className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded text-white" // Added rounded, text-white
// //         >
// //           Create New Job Posting
// //         </button>
// //         {/* Make sure CreateNewJobSidebar component exists and path is correct */}
// //         {/* <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} /> */}
// //       </div>
// //       <JobUpdateStatus />
// //     </div>
// //   );
// // };
// // export default JobDashboard;
// // --- End JobDashboard ---

// const JobUpdateStatus = () => {
//   const {
//     data: getAppliedJobsResponse, // Renamed for clarity to avoid conflict with inner 'data' property
//     isLoading: isGetAppliedJobLoading,
//     isError: isGetAppliedJobError,
//     // You might want to add 'refetch' if you want to refresh the list after an update
//     // refetch: refetchAppliedJobs,
//   } = useGetAppliedJobsQuery();

//   const [
//     updateApplicationStatus,
//     {
//       isLoading: isUpdateApplicationStatusLoading,
//       isError: isUpdateApplicationStatusError,
//       error: errorUpdateApplicationStatus,
//       // You might want 'reset' to clear error states manually
//       // reset: resetUpdateStatus,
//     },
//   ] = useUpdateApplicationStatusMutation();

//   // --- Handler function for status change ---
//   const handleStatusChange = async (applicationId, newStatus) => {
//     console.log(`Updating application ${applicationId} to status ${newStatus}`);
//     try {
//       // Call the mutation provided by RTK Query
//       await updateApplicationStatus({
//         id: applicationId, // This matches the 'id' expected in the RTK query definition
//         statusData: { status: newStatus }, // This matches the 'statusData' and the backend's req.body expectation
//       }).unwrap(); // .unwrap() gives you a promise that rejects on error, making try/catch easier

//       console.log("Update successful for application:", applicationId);
//       // Optional: Show a success message (e.g., using a toast library)
//       // Optional: Refetch the list to confirm the update visually
//       // refetchAppliedJobs();
//     } catch (err) {
//       console.error("Failed to update status:", err);
//       // Optional: Show an error message (e.g., using a toast library)
//       // You can access specific error details from 'err' or 'errorUpdateApplicationStatus'
//     }
//   };

//   // --- Render Logic ---

//   if (isGetAppliedJobError) {
//     // Consider showing a more specific error if available
//     return (
//       <div>
//         <h1>Error loading applied job data.</h1>
//       </div>
//     );
//   }

//   if (isGetAppliedJobLoading) {
//     return (
//       <div>
//         <h1>Loading Applied Jobs...</h1>
//       </div>
//     );
//   }

//   // Check if the response structure is as expected before mapping
//   if (!getAppliedJobsResponse || !Array.isArray(getAppliedJobsResponse.data)) {
//     console.error(
//       "Unexpected data structure for applied jobs:",
//       getAppliedJobsResponse
//     );
//     return (
//       <div>
//         <h1>Could not load job data or no jobs found.</h1>
//       </div>
//     );
//   }

//   if (getAppliedJobsResponse.data.length === 0) {
//     return (
//       <div>
//         <h1>No one has applied to your posted jobs yet.</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 m-2 border rounded-lg shadow-md">
//       {" "}
//       {/* Added container styling */}
//       <h2 className="text-2xl font-semibold mb-4">
//         Manage Job Applications
//       </h2>{" "}
//       {/* Added title */}
//       {getAppliedJobsResponse.data.map(
//         (
//           job // Renamed 'e' to 'job' for clarity
//         ) => (
//           <div
//             key={job.id}
//             className="m-1 p-4 border rounded mb-6 bg-gray-50 dark:bg-gray-800"
//           >
//             {" "}
//             {/* Improved job card styling */}
//             {/* --- Job Details --- */}
//             <div className="mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
//               <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 underline">
//                 {job.title}
//               </h3>
//               <p className="text-gray-700 dark:text-gray-300">
//                 {job.description}
//               </p>
//               <p>
//                 <span className="font-semibold">Salary Range:</span> $
//                 {job.salary_min} - ${job.salary_max}
//               </p>
//               <p>
//                 <span className="font-semibold">Category:</span> {job.category}
//               </p>
//               <p>
//                 <span className="font-semibold">Type:</span>{" "}
//                 {job.employment_type}
//               </p>
//               <p>
//                 <span className="font-semibold">Location:</span> {job.location}
//               </p>
//               <div className="mt-2">
//                 <div className="text-pink-600 dark:text-pink-400">
//                   <strong>Total Applications: </strong>
//                   {job.application_count ?? 0} {/* Use nullish coalescing */}
//                 </div>
//                 <p className="text-red-600 dark:text-red-400">
//                   <strong>Deadline: </strong>
//                   {/* Format date for better readability */}
//                   {job.application_deadline
//                     ? new Date(job.application_deadline).toLocaleDateString()
//                     : "N/A"}
//                 </p>
//               </div>
//             </div>
//             {/* --- Applications List for this Job --- */}
//             <div className="mt-4">
//               <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
//                 Applications Received:
//               </h4>
//               {/* Check if applications array exists and is not empty */}
//               {job.applications && job.applications.length > 0 ? (
//                 job.applications.map(
//                   (
//                     application // Renamed 'a' to 'application'
//                   ) => (
//                     <div
//                       key={application.id}
//                       className="bg-white text-cyan-900 dark:bg-gray-700 dark:text-white p-3 m-2 border rounded shadow-sm" // Slightly adjusted styling
//                     >
//                       {/* --- Application Details --- */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
//                         {" "}
//                         {/* Use grid for layout */}
//                         <p>
//                           <strong className="font-semibold">App ID:</strong>{" "}
//                           {application.id}
//                         </p>
//                         <p>
//                           <strong className="font-semibold">
//                             Applicant ID:
//                           </strong>{" "}
//                           {application.user_id}
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Applied:</strong>{" "}
//                           {application.applied_at
//                             ? new Date(application.applied_at).toLocaleString()
//                             : "N/A"}
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Resume ID:</strong>{" "}
//                           {application.resume_id || "N/A"}
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Status:</strong>{" "}
//                           <span className="font-bold">
//                             {application.status}
//                           </span>
//                         </p>
//                         <p>
//                           <strong className="font-semibold">Updated:</strong>{" "}
//                           {application.updated_at
//                             ? new Date(application.updated_at).toLocaleString()
//                             : "N/A"}
//                         </p>
//                       </div>

//                       {/* --- Action Buttons/Links --- */}
//                       <div className="flex flex-wrap items-center gap-4 mb-3">
//                         <div>
//                           {/* Add actual profile viewing logic here */}
//                           <button
//                             onClick={() =>
//                               console.log(
//                                 "View Profile For User ID:",
//                                 application.user_id
//                               )
//                             }
//                             className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
//                           >
//                             View Profile
//                           </button>
//                         </div>
//                         {/* Add resume download link/button if possible */}
//                         {application.resume_id && (
//                           <div>
//                             <button
//                               onClick={() =>
//                                 console.log(
//                                   "Download Resume ID:",
//                                   application.resume_id
//                                 )
//                               }
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
//                             >
//                               View Resume
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {/* --- Status Update Dropdown --- */}
//                       <div className="mt-2 flex items-center gap-2">
//                         <label
//                           htmlFor={`status-select-${application.id}`}
//                           className="font-semibold text-sm"
//                         >
//                           Change Status:
//                         </label>
//                         <select
//                           id={`status-select-${application.id}`} // Add unique ID for accessibility
//                           className="bg-gray-100 dark:bg-gray-600 dark:text-white hover:bg-gray-200 text-black p-2 border rounded" // Adjusted styling
//                           value={application.status} // Set current value - Controlled component
//                           onChange={(e) =>
//                             handleStatusChange(application.id, e.target.value)
//                           } // Call handler on change
//                           // Disable the select element while ANY update is loading (simplification)
//                           // For per-item loading indication, more complex state management would be needed
//                           disabled={isUpdateApplicationStatusLoading}
//                         >
//                           {/* Ensure these values match EXACTLY what the backend expects */}
//                           <option value="pending">Pending</option>
//                           <option value="reviewed">Reviewed</option>
//                           <option value="interviewed">Interviewed</option>
//                           <option value="offered">Offered</option>
//                           <option value="rejected">Rejected</option>
//                           <option value="withdrawn">Withdrawn</option>
//                         </select>
//                         {/* Simple loading indicator next to the dropdown */}
//                         {isUpdateApplicationStatusLoading && (
//                           <span className="text-sm italic">Updating...</span>
//                         )}
//                       </div>

//                       {/* Display specific error for this update if needed */}
//                       {isUpdateApplicationStatusError &&
//                         errorUpdateApplicationStatus && (
//                           <p className="text-red-500 text-sm mt-1">
//                             Update Error:{" "}
//                             {errorUpdateApplicationStatus?.data?.message ||
//                               "An error occurred"}
//                           </p>
//                         )}
//                     </div>
//                   )
//                 )
//               ) : (
//                 <p className="text-gray-600 dark:text-gray-400 italic">
//                   No applications received for this job yet.
//                 </p>
//               )}
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };// import React, { useState } from "react";

// // const steps = ["Account", "Company", "Contact", "Description", "Review"];

// // export default function Register() {
// //   const [step, setStep] = useState(1);
// //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
// //   const [userId, setUserId] = useState(null); // To store the user ID after initial registration
// //   const [profileCompleted, setProfileCompleted] = useState(false); // To track profile completion

// //   const [formData, setFormData] = useState({
// //     username: "", // Added username field
// //     companyEmail: "",
// //     password: "",
// //     confirmPassword: "",
// //     companyName: "",
// //     contactPhone: "", // Changed from companyRegisterationNumber and phone to match employer_profiles
// //     addressLine: "", // Renamed for clarity
// //     city: "", // Added for address details
// //     state: "", // Added for address details
// //     postalCode: "", // Added for address details
// //     country: "", // Added for address details
// //     websiteUrl: "", // Renamed for consistency
// //     industry: ["IT", "Finence", "Logistic", "Engineering", "Medical", "Chief"],
// //     companyDescription: "", // Renamed for consistency
// //     logoUrl: null, // Assuming you'll handle the URL after upload
// //   });

// //   const renderStep = () => {
// //     switch (step) {
// //       case 1:
// //         return <Step1 formData={formData} setFormData={setFormData} />;
// //       case 2:
// //         return <Step2 formData={formData} setFormData={setFormData} />;
// //       case 3:
// //         return <Step3 formData={formData} setFormData={setFormData} />;
// //       case 4:
// //         return <Step4 formData={formData} setFormData={setFormData} />;
// //       case 5:
// //         return (
// //           <Step5
// //             formData={formData}
// //             onSubmit={handleSubmit} // Pass the submit handler
// //           />
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     // --- Step 1: Register User (Send username, email, password to back-end) ---
// //     try {
// //       const userRegistrationResponse = await fetch("/api/register", {
// //         // Replace with your API endpoint
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           username: formData.username,
// //           email: formData.companyEmail,
// //           password: formData.password,
// //           confirmPassword: formData.confirmPassword,
// //           role: "employer", // Set the role to employer
// //         }),
// //       });

// //       if (userRegistrationResponse.ok) {
// //         const userData = await userRegistrationResponse.json();
// //         setUserId(userData.userId); // Assuming the back-end returns the new user ID
// //         setRegistrationSuccess(true);
// //         setStep(2); // Move to the next step after successful registration

// //         // --- Step 2: Save Employer Profile (Send profile data to back-end) ---
// //         try {
// //           const profileData = {
// //             user_id: userData.userId,
// //             company_name: formData.companyName,
// //             contact_phone: formData.contactPhone,
// //             address_line: formData.addressLine,
// //             city: formData.city,
// //             state: formData.state,
// //             postal_code: formData.postalCode,
// //             country: formData.country,
// //             website_url: formData.websiteUrl,
// //             industry: formData.industry,
// //             company_description: formData.companyDescription,
// //             logo_url: formData.logoUrl, // Handle logo upload separately if needed
// //           };

// //           const profileSaveResponse = await fetch("/api/employer/profile", {
// //             // Replace with your API endpoint
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(profileData),
// //           });

// //           if (profileSaveResponse.ok) {
// //             setProfileCompleted(true);
// //             alert("Registration and profile completed successfully!");
// //             // Redirect to the main application page
// //             window.location.href = "/dashboard"; // Replace with your dashboard URL
// //           } else {
// //             console.error(
// //               "Error saving employer profile:",
// //               await profileSaveResponse.text()
// //             );
// //             alert("Error saving employer profile.");
// //             // Optionally handle rollback or allow the user to retry
// //           }
// //         } catch (error) {
// //           console.error("Error saving employer profile:", error);
// //           alert("Error saving employer profile.");
// //         }
// //       } else {
// //         console.error(
// //           "Error during user registration:",
// //           await userRegistrationResponse.text()
// //         );
// //         alert("Error during user registration.");
// //       }
// //     } catch (error) {
// //       console.error("Error during user registration:", error);
// //       alert("Error during user registration.");
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-6">
// //       {/* Progress Bar */}
// //       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
// //         <div
// //           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
// //           style={{ width: `${(step / steps.length) * 100}%` }}
// //         />
// //       </div>
// //       <div className="text-center font-semibold mb-4">
// //         Step {step} of {steps.length}: {steps[step - 1]}
// //       </div>

// //       {renderStep()}

// //       {/* Navigation Buttons */}
// //       <div className="flex justify-between mt-6">
// //         {step > 1 && (
// //           <button
// //             onClick={() => setStep(step - 1)}
// //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //           >
// //             Back
// //           </button>
// //         )}
// //         {step < 5 ? (
// //           <button
// //             onClick={() => setStep(step + 1)}
// //             className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-blue-700 ml-auto"
// //           >
// //             Next
// //           </button>
// //         ) : null}
// //         {/* Hide Next button on the last step */}
// //       </div>
// //     </div>
// //   );
// // }

// // const Step1 = ({ formData, setFormData }) => {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Username"
// //         className="w-full border p-2 rounded"
// //         value={formData.username}
// //         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="email"
// //         placeholder="example@mail.com"
// //         className="w-full border p-2 rounded"
// //         value={formData.companyEmail}
// //         onChange={(e) =>
// //           setFormData({ ...formData, companyEmail: e.target.value })
// //         }
// //         required
// //       />
// //       <input
// //         type="password"
// //         placeholder="Password"
// //         className="w-full border p-2 rounded"
// //         value={formData.password}
// //         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="password"
// //         placeholder="confirmPassword"
// //         className="w-full border p-2 rounded"
// //         value={formData.confirmPassword}
// //         onChange={(e) =>
// //           setFormData({ ...formData, confirmPassword: e.target.value })
// //         }
// //         required
// //       />
// //     </div>
// //   );
// // };

// // const Step2 = ({ formData, setFormData }) => {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Company Name"
// //         className="w-full border p-2 rounded"
// //         value={formData.companyName}
// //         onChange={(e) =>
// //           setFormData({ ...formData, companyName: e.target.value })
// //         }
// //         required
// //       />
// //       <input
// //         type="tel"
// //         placeholder="Contact Phone"
// //         className="w-full border p-2 rounded"
// //         value={formData.contactPhone}
// //         onChange={(e) =>
// //           setFormData({ ...formData, contactPhone: e.target.value })
// //         }
// //         required
// //       />
// //       <input
// //         type="url"
// //         placeholder="Website (https://example@hmnn.com)"
// //         className="w-full border p-2 rounded"
// //         value={formData.websiteUrl}
// //         onChange={(e) =>
// //           setFormData({ ...formData, websiteUrl: e.target.value })
// //         }
// //       />
// //       {/* <input
// //         type="text"
// //         placeholder="Industry (e.g. Tech, Healthcare)"
// //         className="w-full border p-2 rounded"
// //         value={formData.industry}
// //         onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
// //         required
// //       /> */}
// //       <select
// //         className="w-full border p-2 rounded"
// //         value={formData.industry}
// //         onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
// //       >
// //         <option>It</option>
// //         <option>Finence</option>
// //         <option>Engineering</option>
// //         <option>Chief</option>
// //       </select>
// //     </div>
// //   );
// // };

// // function Step3({ formData, setFormData }) {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Office Address Line"
// //         className="w-full border p-2 rounded"
// //         value={formData.addressLine}
// //         onChange={(e) =>
// //           setFormData({ ...formData, addressLine: e.target.value })
// //         }
// //       />
// //       <input
// //         type="text"
// //         placeholder="City"
// //         className="w-full border p-2 rounded"
// //         value={formData.city}
// //         onChange={(e) => setFormData({ ...formData, city: e.target.value })}
// //       />
// //       <input
// //         type="text"
// //         placeholder="State/Province"
// //         className="w-full border p-2 rounded"
// //         value={formData.state}
// //         onChange={(e) => setFormData({ ...formData, state: e.target.value })}
// //       />
// //       <input
// //         type="text"
// //         placeholder="Postal Code"
// //         className="w-full border p-2 rounded"
// //         value={formData.postalCode}
// //         onChange={(e) =>
// //           setFormData({ ...formData, postalCode: e.target.value })
// //         }
// //       />
// //       <input
// //         type="text"
// //         placeholder="Country"
// //         className="w-full border p-2 rounded"
// //         value={formData.country}
// //         onChange={(e) => setFormData({ ...formData, country: e.target.value })}
// //       />
// //     </div>
// //   );
// // }

// // function Step4({ formData, setFormData }) {
// //   const handleFileChange = (e) => {
// //     // In a real application, you would likely upload the logo to a server here
// //     // and store the URL in formData.logoUrl
// //     setFormData({
// //       ...formData,
// //       logoUrl: URL.createObjectURL(e.target.files[0]),
// //     });
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <textarea
// //         placeholder="Company Description"
// //         rows="5"
// //         className="w-full border p-2 rounded"
// //         value={formData.companyDescription}
// //         onChange={(e) =>
// //           setFormData({ ...formData, companyDescription: e.target.value })
// //         }
// //         required
// //       />

// //       <input
// //         type="file"
// //         accept="image/*"
// //         className="w-full"
// //         onChange={handleFileChange}
// //       />

// //       {formData.logoUrl && (
// //         <div className="mt-2">
// //           <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function Step5({ formData, onSubmit }) {
// //   return (
// //     <div className="space-y-2 text-sm text-gray-700">
// //       <div>
// //         <strong>Username:</strong> {formData.username}
// //       </div>
// //       <div>
// //         <strong>Email:</strong> {formData.companyEmail}
// //       </div>
// //       <div>
// //         <strong>Company Name:</strong> {formData.companyName}
// //       </div>
// //       <div>
// //         <strong>Contact Phone:</strong> {formData.contactPhone}
// //       </div>
// //       <div>
// //         <strong>Website:</strong> {formData.websiteUrl}
// //       </div>
// //       <div>
// //         <strong>Industry:</strong> {formData.industry}
// //       </div>
// //       <div>
// //         <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
// //         {formData.state}, {formData.postalCode}, {formData.country}
// //       </div>
// //       <div>
// //         <strong>Description:</strong> {formData.companyDescription}
// //       </div>
// //       <div>
// //         <strong>Logo:</strong>{" "}
// //         {formData.logoUrl ? "Uploaded" : "No file selected"}
// //       </div>
// //       <button
// //         onClick={onSubmit}
// //         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
// //       >
// //         Submit
// //       </button>
// //     </div>
// //   );
// // }
// // import React, { useState } from "react";

// // const steps = ["Account", "Company", "Contact", "Description", "Review"];

// // export default function Register() {
// //   const [step, setStep] = useState(1);
// //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
// //   const [userId, setUserId] = useState(null); // To store the user ID after initial registration
// //   const [profileCompleted, setProfileCompleted] = useState(false); // To track profile completion

// //   const [formData, setFormData] = useState({
// //     username: "", // Added username field
// //     companyEmail: "",
// //     password: "",
// //     companyName: "",
// //     contactPhone: "", // Changed from companyRegisterationNumber and phone to match employer_profiles
// //     addressLine: "", // Renamed for clarity
// //     city: "", // Added for address details
// //     state: "", // Added for address details
// //     postalCode: "", // Added for address details
// //     country: "", // Added for address details
// //     websiteUrl: "", // Renamed for consistency
// //     industry: "",
// //     companyDescription: "", // Renamed for consistency
// //     logoUrl: null, // Assuming you'll handle the URL after upload
// //   });

// //   const renderStep = () => {
// //     switch (step) {
// //       case 1:
// //         return <Step1 formData={formData} setFormData={setFormData} />;
// //       case 2:
// //         return <Step2 formData={formData} setFormData={setFormData} />;
// //       case 3:
// //         return <Step3 formData={formData} setFormData={setFormData} />;
// //       case 4:
// //         return <Step4 formData={formData} setFormData={setFormData} />;
// //       case 5:
// //         return (
// //           <Step5
// //             formData={formData}
// //             onSubmit={handleSubmit} // Pass the submit handler
// //           />
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     // --- Step 1: Register User (Send username, email, password to back-end) ---
// //     try {
// //       const userRegistrationResponse = await fetch("/api/register", {
// //         // Replace with your API endpoint
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           username: formData.username,
// //           email: formData.email,
// //           password: formData.password,
// //           role: "employer", // Set the role to employer
// //         }),
// //       });

// //       if (userRegistrationResponse.ok) {
// //         const userData = await userRegistrationResponse.json();
// //         setUserId(userData.userId); // Assuming the back-end returns the new user ID
// //         setRegistrationSuccess(true);
// //         setStep(2); // Move to the next step after successful registration

// //         // --- Step 2: Save Employer Profile (Send profile data to back-end) ---
// //         try {
// //           const profileData = {
// //             user_id: userData.userId,
// //             company_name: formData.companyName,
// //             contact_phone: formData.contactPhone,
// //             address_line: formData.addressLine,
// //             city: formData.city,
// //             state: formData.state,
// //             postal_code: formData.postalCode,
// //             country: formData.country,
// //             website_url: formData.websiteUrl,
// //             industry: formData.industry,
// //             company_description: formData.companyDescription,
// //             logo_url: formData.logoUrl, // Handle logo upload separately if needed
// //           };

// //           const profileSaveResponse = await fetch("/api/employer/profile", {
// //             // Replace with your API endpoint
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify(profileData),
// //           });

// //           if (profileSaveResponse.ok) {
// //             setProfileCompleted(true);
// //             alert("Registration and profile completed successfully!");
// //             // Redirect to the main application page
// //             window.location.href = "/dashboard"; // Replace with your dashboard URL
// //           } else {
// //             console.error(
// //               "Error saving employer profile:",
// //               await profileSaveResponse.text()
// //             );
// //             alert("Error saving employer profile.");
// //             // Optionally handle rollback or allow the user to retry
// //           }
// //         } catch (error) {
// //           console.error("Error saving employer profile:", error);
// //           alert("Error saving employer profile.");
// //         }
// //       } else {
// //         console.error(
// //           "Error during user registration:",
// //           await userRegistrationResponse.text()
// //         );
// //         alert("Error during user registration.");
// //       }
// //     } catch (error) {
// //       console.error("Error during user registration:", error);
// //       alert("Error during user registration.");
// //     }
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto p-6">
// //       {/* Progress Bar */}
// //       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
// //         <div
// //           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
// //           style={{ width: `${(step / steps.length) * 100}%` }}
// //         />
// //       </div>
// //       <div className="text-center font-semibold mb-4">
// //         Step {step} of {steps.length}: {steps[step - 1]}
// //       </div>

// //       {renderStep()}

// //       {/* Navigation Buttons */}
// //       <div className="flex justify-between mt-6">
// //         {step > 1 && (
// //           <button
// //             onClick={() => setStep(step - 1)}
// //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// //           >
// //             Back
// //           </button>
// //         )}
// //         {step < 5 ? (
// //           <button
// //             onClick={() => setStep(step + 1)}
// //             className="px-4 py-2 bg-cyan-900 text-white rounded hover:bg-blue-700 ml-auto"
// //           >
// //             Next
// //           </button>
// //         ) : null}
// //         {/* Hide Next button on the last step */}
// //       </div>
// //     </div>
// //   );
// // }

// // const Step1 = ({ formData, setFormData }) => {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Username"
// //         className="w-full border p-2 rounded"
// //         value={formData.username}
// //         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="email"
// //         placeholder="Email"
// //         className="w-full border p-2 rounded"
// //         value={formData.email}
// //         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="password"
// //         placeholder="Password"
// //         className="w-full border p-2 rounded"
// //         value={formData.password}
// //         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //         required
// //       />
// //     </div>
// //   );
// // };

// // const Step2 = ({ formData, setFormData }) => {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Company Name"
// //         className="w-full border p-2 rounded"
// //         value={formData.companyName}
// //         onChange={(e) =>
// //           setFormData({ ...formData, companyName: e.target.value })
// //         }
// //         required
// //       />
// //       <input
// //         type="tel"
// //         placeholder="Contact Phone"
// //         className="w-full border p-2 rounded"
// //         value={formData.contactPhone}
// //         onChange={(e) =>
// //           setFormData({ ...formData, contactPhone: e.target.value })
// //         }
// //         required
// //       />
// //       <input
// //         type="url"
// //         placeholder="Website (https://)"
// //         className="w-full border p-2 rounded"
// //         value={formData.websiteUrl}
// //         onChange={(e) =>
// //           setFormData({ ...formData, websiteUrl: e.target.value })
// //         }
// //       />
// //       <input
// //         type="text"
// //         placeholder="Industry (e.g. Tech, Healthcare)"
// //         className="w-full border p-2 rounded"
// //         value={formData.industry}
// //         onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
// //         required
// //       />
// //     </div>
// //   );
// // };

// // function Step3({ formData, setFormData }) {
// //   return (
// //     <div className="space-y-4">
// //       <input
// //         type="text"
// //         placeholder="Office Address Line"
// //         className="w-full border p-2 rounded"
// //         value={formData.addressLine}
// //         onChange={(e) =>
// //           setFormData({ ...formData, addressLine: e.target.value })
// //         }
// //       />
// //       <input
// //         type="text"
// //         placeholder="City"
// //         className="w-full border p-2 rounded"
// //         value={formData.city}
// //         onChange={(e) => setFormData({ ...formData, city: e.target.value })}
// //       />
// //       <input
// //         type="text"
// //         placeholder="State/Province"
// //         className="w-full border p-2 rounded"
// //         value={formData.state}
// //         onChange={(e) => setFormData({ ...formData, state: e.target.value })}
// //       />
// //       <input
// //         type="text"
// //         placeholder="Postal Code"
// //         className="w-full border p-2 rounded"
// //         value={formData.postalCode}
// //         onChange={(e) =>
// //           setFormData({ ...formData, postalCode: e.target.value })
// //         }
// //       />
// //       <input
// //         type="text"
// //         placeholder="Country"
// //         className="w-full border p-2 rounded"
// //         value={formData.country}
// //         onChange={(e) => setFormData({ ...formData, country: e.target.value })}
// //       />
// //     </div>
// //   );
// // }

// // function Step4({ formData, setFormData }) {
// //   const handleFileChange = (e) => {
// //     // In a real application, you would likely upload the logo to a server here
// //     // and store the URL in formData.logoUrl
// //     setFormData({
// //       ...formData,
// //       logoUrl: URL.createObjectURL(e.target.files[0]),
// //     });
// //   };

// //   return (
// //     <div className="space-y-4">
// //       <textarea
// //         placeholder="Company Description"
// //         rows="5"
// //         className="w-full border p-2 rounded"
// //         value={formData.companyDescription}
// //         onChange={(e) =>
// //           setFormData({ ...formData, companyDescription: e.target.value })
// //         }
// //         required
// //       />

// //       <input
// //         type="file"
// //         accept="image/*"
// //         className="w-full"
// //         onChange={handleFileChange}
// //       />

// //       {formData.logoUrl && (
// //         <div className="mt-2">
// //           <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function Step5({ formData, onSubmit }) {
// //   return (
// //     <div className="space-y-2 text-sm text-gray-700">
// //       <div>
// //         <strong>Username:</strong> {formData.username}
// //       </div>
// //       <div>
// //         <strong>Email:</strong> {formData.email}
// //       </div>
// //       <div>
// //         <strong>Company Name:</strong> {formData.companyName}
// //       </div>
// //       <div>
// //         <strong>Contact Phone:</strong> {formData.contactPhone}
// //       </div>
// //       <div>
// //         <strong>Website:</strong> {formData.websiteUrl}
// //       </div>
// //       <div>
// //         <strong>Industry:</strong> {formData.industry}
// //       </div>
// //       <div>
// //         <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
// //         {formData.state}, {formData.postalCode}, {formData.country}
// //       </div>
// //       <div>
// //         <strong>Description:</strong> {formData.companyDescription}
// //       </div>
// //       <div>
// //         <strong>Logo:</strong>{" "}
// //         {formData.logoUrl ? "Uploaded" : "No file selected"}
// //       </div>
// //       <button
// //         onClick={onSubmit}
// //         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
// //       >
// //         Submit
// //       </button>
// //     </div>
// //   );
// // }
// // // import React from "react";
// // // import { useSelector, useDispatch } from "react-redux";
// // // import { setStep, updateFormData } from "../../redux/slice/registerationSlice";
// // // import {
// // //   useRegisterCompanyMutation, // useRegisterUserMutation
// // //   useLoginCompanyMutation,
// // //   useCreateEmployerProfileMutation,
// // // } from "../../redux/api/registerApi";

// // // const steps = ["Account", "Company", "Contact", "Description", "Review"];

// // // export default function Register() {
// // //   const dispatch = useDispatch();
// // //   const { step, formData } = useSelector((state) => state.registration);

// // //   const [registerUser, { isLoading: isRegistering }] =
// // //     useRegisterCompanyMutation();
// // //   const [createEmployerProfile, { isLoading: isCreatingProfile }] =
// // //     useCreateEmployerProfileMutation();

// // //   const renderStep = () => {
// // //     switch (step) {
// // //       case 1:
// // //         return <Step1 />;
// // //       case 2:
// // //         return <Step2 />;
// // //       case 3:
// // //         return <Step3 />;
// // //       case 4:
// // //         return <Step4 />;
// // //       case 5:
// // //         return <Step5 onSubmit={handleSubmit} />;
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   const handleSubmit = async () => {
// // //     try {
// // //       // Step 1: Register User
// // //       const userData = {
// // //         username: formData.username,
// // //         email: formData.email,
// // //         password: formData.password,
// // //         role: "employer",
// // //       };
// // //       const userResponse = await registerUser(userData).unwrap(); // unwrap() throws error if request fails
// // //       const userId = userResponse.userId;

// // //       // Step 2: Create Employer Profile
// // //       const profileData = {
// // //         user_id: userId,
// // //         company_name: formData.companyName,
// // //         contact_phone: formData.contactPhone,
// // //         address_line: formData.addressLine,
// // //         city: formData.city,
// // //         state: formData.state,
// // //         postal_code: formData.postalCode,
// // //         country: formData.country,
// // //         website_url: formData.websiteUrl,
// // //         industry: formData.industry,
// // //         company_description: formData.companyDescription,
// // //         logo_url: formData.logoUrl,
// // //       };
// // //       await createEmployerProfile(profileData).unwrap();

// // //       alert("Registration and profile completed successfully!");
// // //       window.location.href = "/dashboard"; // Redirect to dashboard
// // //     } catch (error) {
// // //       console.error("Submission error:", error);
// // //       alert("Error during registration or profile creation.");
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-2xl mx-auto p-6">
// // //       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
// // //         <div
// // //           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
// // //           style={{ width: `${(step / steps.length) * 100}%` }}
// // //         />
// // //       </div>
// // //       <div className="text-center font-semibold mb-4">
// // //         Step {step} of {steps.length}: {steps[step - 1]}
// // //       </div>

// // //       {renderStep()}

// // //       <div className="flex justify-between mt-6">
// // //         {step > 1 && (
// // //           <button
// // //             onClick={() => dispatch(setStep(step - 1))}
// // //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// // //           >
// // //             Back
// // //           </button>
// // //         )}
// // //         {step < 5 ? (
// // //           <button
// // //             onClick={() => dispatch(setStep(step + 1))}
// // //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
// // //             disabled={isRegistering || isCreatingProfile}
// // //           >
// // //             Next
// // //           </button>
// // //         ) : null}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // const Step1 = () => {
// // //   const dispatch = useDispatch();
// // //   const { formData } = useSelector((state) => state.registration);

// // //   return (
// // //     <div className="space-y-4">
// // //       <input
// // //         type="text"
// // //         placeholder="Username"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.username}
// // //         onChange={(e) => dispatch(updateFormData({ username: e.target.value }))}
// // //         required
// // //       />
// // //       <input
// // //         type="email"
// // //         placeholder="Email"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.email}
// // //         onChange={(e) => dispatch(updateFormData({ email: e.target.value }))}
// // //         required
// // //       />
// // //       <input
// // //         type="password"
// // //         placeholder="Password"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.password}
// // //         onChange={(e) => dispatch(updateFormData({ password: e.target.value }))}
// // //         required
// // //       />
// // //     </div>
// // //   );
// // // };

// // // const Step2 = () => {
// // //   const dispatch = useDispatch();
// // //   const { formData } = useSelector((state) => state.registration);

// // //   return (
// // //     <div className="space-y-4">
// // //       refractor
// // //       <input
// // //         type="text"
// // //         placeholder="Company Name"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.companyName}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ companyName: e.target.value }))
// // //         }
// // //         required
// // //       />
// // //       <input
// // //         type="tel"
// // //         placeholder="Contact Phone"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.contactPhone}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ contactPhone: e.target.value }))
// // //         }
// // //         required
// // //       />
// // //       <input
// // //         type="url"
// // //         placeholder="Website (https://)"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.websiteUrl}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ websiteUrl: e.target.value }))
// // //         }
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Industry (e.g. Tech, Healthcare)"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.industry}
// // //         onChange={(e) => dispatch(updateFormData({ industry: e.target.value }))}
// // //         required
// // //       />
// // //     </div>
// // //   );
// // // };

// // // const Step3 = () => {
// // //   const dispatch = useDispatch();
// // //   const { formData } = useSelector((state) => state.registration);

// // //   return (
// // //     <div className="space-y-4">
// // //       <input
// // //         type="text"
// // //         placeholder="Office Address Line"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.addressLine}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ addressLine: e.target.value }))
// // //         }
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="City"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.city}
// // //         onChange={(e) => dispatch(updateFormData({ city: e.target.value }))}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="State/Province"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.state}
// // //         onChange={(e) => dispatch(updateFormData({ state: e.target.value }))}
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Postal Code"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.postalCode}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ postalCode: e.target.value }))
// // //         }
// // //       />
// // //       <input
// // //         type="text"
// // //         placeholder="Country"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.country}
// // //         onChange={(e) => dispatch(updateFormData({ country: e.target.value }))}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // const Step4 = () => {
// // //   const dispatch = useDispatch();
// // //   const { formData } = useSelector((state) => state.registration);

// // //   const handleFileChange = (e) => {
// // //     dispatch(
// // //       updateFormData({ logoUrl: URL.createObjectURL(e.target.files[0]) })
// // //     );
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       <textarea
// // //         placeholder="Company Description"
// // //         rows="5"
// // //         className="w-full border p-2 rounded"
// // //         value={formData.companyDescription}
// // //         onChange={(e) =>
// // //           dispatch(updateFormData({ companyDescription: e.target.value }))
// // //         }
// // //         required
// // //       />
// // //       <input
// // //         type="file"
// // //         accept="image/*"
// // //         className="w-full"
// // //         onChange={handleFileChange}
// // //       />
// // //       {formData.logoUrl && (
// // //         <div className="mt-2">
// // //           <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const Step5 = ({ onSubmit }) => {
// // //   const { formData } = useSelector((state) => state.registration);
// // //   const [registerUser, { isLoading: isRegistering }] =
// // //     useRegisterUserMutation();
// // //   const [createEmployerProfile, { isLoading: isCreatingProfile }] =
// // //     useCreateEmployerProfileMutation();

// // //   return (
// // //     <div className="space-y-2 text-sm text-gray-700">
// // //       <div>
// // //         <strong>Username:</strong> {formData.username}
// // //       </div>
// // //       <div>
// // //         <strong>Email:</strong> {formData.email}
// // //       </div>
// // //       <div>
// // //         <strong>Company Name:</strong> {formData.companyName}
// // //       </div>
// // //       <div>
// // //         <strong>Contact Phone:</strong> {formData.contactPhone}
// // //       </div>
// // //       <div>
// // //         <strong>Website:</strong> {formData.websiteUrl}
// // //       </div>
// // //       <div>
// // //         <strong>Industry:</strong> {formData.industry}
// // //       </div>
// // //       <div>
// // //         <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
// // //         {formData.state}, {formData.postalCode}, {formData.country}
// // //       </div>
// // //       <div>
// // //         <strong>Description:</strong> {formData.companyDescription}
// // //       </div>
// // //       <div>
// // //         <strong>Logo:</strong>{" "}
// // //         {formData.logoUrl ? "Uploaded" : "No file selected"}
// // //       </div>
// // //       <button
// // //         onClick={onSubmit}
// // //         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
// // //         disabled={isRegistering || isCreatingProfile}
// // //       >
// // //         {isRegistering || isCreatingProfile ? "Submitting..." : "Submit"}
// // //       </button>
// // //     </div>
// // //   );
// // // };

// // // // import React, { useState } from "react";

// // // // const steps = ["Account", "Company", "Contact", "Description", "Review"];

// // // // export default function Register() {
// // // //   const [step, setStep] = useState(1);
// // // //   const [registrationSuccess, setRegistrationSuccess] = useState(false);
// // // //   const [userId, setUserId] = useState(null); // To store the user ID after initial registration
// // // //   const [profileCompleted, setProfileCompleted] = useState(false); // To track profile completion

// // // //   const [formData, setFormData] = useState({
// // // //     username: "", // Added username field
// // // //     email: "",
// // // //     password: "",
// // // //     companyName: "",
// // // //     contactPhone: "", // Changed from companyRegisterationNumber and phone to match employer_profiles
// // // //     addressLine: "", // Renamed for clarity
// // // //     city: "", // Added for address details
// // // //     state: "", // Added for address details
// // // //     postalCode: "", // Added for address details
// // // //     country: "", // Added for address details
// // // //     websiteUrl: "", // Renamed for consistency
// // // //     industry: "",
// // // //     companyDescription: "", // Renamed for consistency
// // // //     logoUrl: null, // Assuming you'll handle the URL after upload
// // // //   });

// // // //   const renderStep = () => {
// // // //     switch (step) {
// // // //       case 1:
// // // //         return <Step1 formData={formData} setFormData={setFormData} />;
// // // //       case 2:
// // // //         return <Step2 formData={formData} setFormData={setFormData} />;
// // // //       case 3:
// // // //         return <Step3 formData={formData} setFormData={setFormData} />;
// // // //       case 4:
// // // //         return <Step4 formData={formData} setFormData={setFormData} />;
// // // //       case 5:
// // // //         return (
// // // //           <Step5
// // // //             formData={formData}
// // // //             onSubmit={handleSubmit} // Pass the submit handler
// // // //           />
// // // //         );
// // // //       default:
// // // //         return null;
// // // //     }
// // // //   };

// // // //   const handleSubmit = async () => {
// // // //     // --- Step 1: Register User (Send username, email, password to back-end) ---
// // // //     try {
// // // //       const userRegistrationResponse = await fetch("/api/register", {
// // // //         // Replace with your API endpoint
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({
// // // //           username: formData.username,
// // // //           email: formData.email,
// // // //           password: formData.password,
// // // //           role: "employer", // Set the role to employer
// // // //         }),
// // // //       });

// // // //       if (userRegistrationResponse.ok) {
// // // //         const userData = await userRegistrationResponse.json();
// // // //         setUserId(userData.userId); // Assuming the back-end returns the new user ID
// // // //         setRegistrationSuccess(true);
// // // //         setStep(2); // Move to the next step after successful registration

// // // //         // --- Step 2: Save Employer Profile (Send profile data to back-end) ---
// // // //         try {
// // // //           const profileData = {
// // // //             user_id: userData.userId,
// // // //             company_name: formData.companyName,
// // // //             contact_phone: formData.contactPhone,
// // // //             address_line: formData.addressLine,
// // // //             city: formData.city,
// // // //             state: formData.state,
// // // //             postal_code: formData.postalCode,
// // // //             country: formData.country,
// // // //             website_url: formData.websiteUrl,
// // // //             industry: formData.industry,
// // // //             company_description: formData.companyDescription,
// // // //             logo_url: formData.logoUrl, // Handle logo upload separately if needed
// // // //           };

// // // //           const profileSaveResponse = await fetch("/api/employer/profile", {
// // // //             // Replace with your API endpoint
// // // //             method: "POST",
// // // //             headers: {
// // // //               "Content-Type": "application/json",
// // // //             },
// // // //             body: JSON.stringify(profileData),
// // // //           });

// // // //           if (profileSaveResponse.ok) {
// // // //             setProfileCompleted(true);
// // // //             alert("Registration and profile completed successfully!");
// // // //             // Redirect to the main application page
// // // //             window.location.href = "/dashboard"; // Replace with your dashboard URL
// // // //           } else {
// // // //             console.error(
// // // //               "Error saving employer profile:",
// // // //               await profileSaveResponse.text()
// // // //             );
// // // //             alert("Error saving employer profile.");
// // // //             // Optionally handle rollback or allow the user to retry
// // // //           }
// // // //         } catch (error) {
// // // //           console.error("Error saving employer profile:", error);
// // // //           alert("Error saving employer profile.");
// // // //         }
// // // //       } else {
// // // //         console.error(
// // // //           "Error during user registration:",
// // // //           await userRegistrationResponse.text()
// // // //         );
// // // //         alert("Error during user registration.");
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error during user registration:", error);
// // // //       alert("Error during user registration.");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="max-w-2xl mx-auto p-6">
// // // //       {/* Progress Bar */}
// // // //       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
// // // //         <div
// // // //           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
// // // //           style={{ width: `${(step / steps.length) * 100}%` }}
// // // //         />
// // // //       </div>
// // // //       <div className="text-center font-semibold mb-4">
// // // //         Step {step} of {steps.length}: {steps[step - 1]}
// // // //       </div>

// // // //       {renderStep()}

// // // //       {/* Navigation Buttons */}
// // // //       <div className="flex justify-between mt-6">
// // // //         {step > 1 && (
// // // //           <button
// // // //             onClick={() => setStep(step - 1)}
// // // //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// // // //           >
// // // //             Back
// // // //           </button>
// // // //         )}
// // // //         {step < 5 ? (
// // // //           <button
// // // //             onClick={() => setStep(step + 1)}
// // // //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
// // // //           >
// // // //             Next
// // // //           </button>
// // // //         ) : null}{" "}
// // // //         {/* Hide Next button on the last step */}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // const Step1 = ({ formData, setFormData }) => {
// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Username"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.username}
// // // //         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
// // // //         required
// // // //       />
// // // //       <input
// // // //         type="email"
// // // //         placeholder="Email"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.email}
// // // //         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // // //         required
// // // //       />
// // // //       <input
// // // //         type="password"
// // // //         placeholder="Password"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.password}
// // // //         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // // //         required
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // const Step2 = ({ formData, setFormData }) => {
// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Company Name"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.companyName}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, companyName: e.target.value })
// // // //         }
// // // //         required
// // // //       />
// // // //       <input
// // // //         type="tel"
// // // //         placeholder="Contact Phone"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.contactPhone}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, contactPhone: e.target.value })
// // // //         }
// // // //         required
// // // //       />
// // // //       <input
// // // //         type="url"
// // // //         placeholder="Website (https://)"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.websiteUrl}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, websiteUrl: e.target.value })
// // // //         }
// // // //       />
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Industry (e.g. Tech, Healthcare)"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.industry}
// // // //         onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
// // // //         required
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // function Step3({ formData, setFormData }) {
// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Office Address Line"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.addressLine}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, addressLine: e.target.value })
// // // //         }
// // // //       />
// // // //       <input
// // // //         type="text"
// // // //         placeholder="City"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.city}
// // // //         onChange={(e) => setFormData({ ...formData, city: e.target.value })}
// // // //       />
// // // //       <input
// // // //         type="text"
// // // //         placeholder="State/Province"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.state}
// // // //         onChange={(e) => setFormData({ ...formData, state: e.target.value })}
// // // //       />
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Postal Code"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.postalCode}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, postalCode: e.target.value })
// // // //         }
// // // //       />
// // // //       <input
// // // //         type="text"
// // // //         placeholder="Country"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.country}
// // // //         onChange={(e) => setFormData({ ...formData, country: e.target.value })}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }

// // // // function Step4({ formData, setFormData }) {
// // // //   const handleFileChange = (e) => {
// // // //     // In a real application, you would likely upload the logo to a server here
// // // //     // and store the URL in formData.logoUrl
// // // //     setFormData({
// // // //       ...formData,
// // // //       logoUrl: URL.createObjectURL(e.target.files[0]),
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <textarea
// // // //         placeholder="Company Description"
// // // //         rows="5"
// // // //         className="w-full border p-2 rounded"
// // // //         value={formData.companyDescription}
// // // //         onChange={(e) =>
// // // //           setFormData({ ...formData, companyDescription: e.target.value })
// // // //         }
// // // //         required
// // // //       />

// // // //       <input
// // // //         type="file"
// // // //         accept="image/*"
// // // //         className="w-full"
// // // //         onChange={handleFileChange}
// // // //       />

// // // //       {formData.logoUrl && (
// // // //         <div className="mt-2">
// // // //           <img src={formData.logoUrl} alt="Logo Preview" className="max-h-40" />
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // function Step5({ formData, onSubmit }) {
// // // //   return (
// // // //     <div className="space-y-2 text-sm text-gray-700">
// // // //       <div>
// // // //         <strong>Username:</strong> {formData.username}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Email:</strong> {formData.email}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Company Name:</strong> {formData.companyName}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Contact Phone:</strong> {formData.contactPhone}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Website:</strong> {formData.websiteUrl}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Industry:</strong> {formData.industry}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Address:</strong> {formData.addressLine}, {formData.city},{" "}
// // // //         {formData.state}, {formData.postalCode}, {formData.country}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Description:</strong> {formData.companyDescription}
// // // //       </div>
// // // //       <div>
// // // //         <strong>Logo:</strong>{" "}
// // // //         {formData.logoUrl ? "Uploaded" : "No file selected"}
// // // //       </div>
// // // //       <button
// // // //         onClick={onSubmit}
// // // //         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
// // // //       >
// // // //         Submit
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // }

// // // // // import React, { useState } from "react";

// // // // // const steps = ["Account", "Company", "Contact", "Description", "Review"];

// // // // // export default function Register() {
// // // // //   const [step, setStep] = useState(1);

// // // // //   const [formData, setFormData] = useState({
// // // // //     email: "",
// // // // //     password: "",
// // // // //     confirmPassword: "",
// // // // //     companyName: "",
// // // // //     companyRegisterationNumber: null,
// // // // //     industry: "",
// // // // //     website: "",
// // // // //     address: "",
// // // // //     phone: "",
// // // // //     description: "",
// // // // //     logo: null,
// // // // //   });

// // // // //   const renderStep = () => {
// // // // //     switch (step) {
// // // // //       case 1:
// // // // //         return <Step1 formData={formData} setFormData={setFormData} />;
// // // // //       case 2:
// // // // //         return <Step2 formData={formData} setFormData={setFormData} />;
// // // // //       case 3:
// // // // //         return <Step3 formData={formData} setFormData={setFormData} />;
// // // // //       case 4:
// // // // //         return <Step4 formData={formData} setFormData={setFormData} />;
// // // // //       case 5:
// // // // //         return <Step5 formData={formData} />;
// // // // //       default:
// // // // //         return null;
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="max-w-2xl mx-auto p-6">
// // // // //       {/* Progress Bar */}
// // // // //       <div className="w-full bg-cyan-100 h-2 rounded-full mb-6">
// // // // //         <div
// // // // //           className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
// // // // //           style={{ width: `${(step / steps.length) * 100}%` }}
// // // // //         />
// // // // //       </div>
// // // // //       <div className="text-center font-semibold mb-4">
// // // // //         Step {step} of {steps.length}: {steps[step - 1]}
// // // // //       </div>

// // // // //       {renderStep()}

// // // // //       {/* Navigation Buttons */}
// // // // //       <div className="flex justify-between mt-6">
// // // // //         {step > 1 && (
// // // // //           <button
// // // // //             onClick={() => setStep(step - 1)}
// // // // //             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
// // // // //           >
// // // // //             Back
// // // // //           </button>
// // // // //         )}
// // // // //         {step < 5 ? (
// // // // //           <button
// // // // //             onClick={() => setStep(step + 1)}
// // // // //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
// // // // //           >
// // // // //             Next
// // // // //           </button>
// // // // //         ) : (
// // // // //           <button
// // // // //             onClick={() => alert("Submitted!")} // Replace with your submit logic
// // // // //             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
// // // // //           >
// // // // //             Submit
// // // // //           </button>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // const Step1 = ({ formData, setFormData }) => {
// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <input
// // // // //         type="email"
// // // // //         placeholder="Email"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.email}
// // // // //         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // // // //       />
// // // // //       <input
// // // // //         type="password"
// // // // //         placeholder="Password"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.password}
// // // // //         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const Step2 = ({ formData, setFormData }) => {
// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <input
// // // // //         type="text"
// // // // //         placeholder="Company Name"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.companyName}
// // // // //         onChange={(e) =>
// // // // //           setFormData({ ...formData, companyName: e.target.value })
// // // // //         }
// // // // //       />
// // // // //       <input
// // // // //         type="text"
// // // // //         placeholder="Company Registeration Number"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.companyRegisterationNumber}
// // // // //         onChange={(e) =>
// // // // //           setFormData({
// // // // //             ...formData,
// // // // //             companyRegisterationNumber: e.target.value,
// // // // //           })
// // // // //         }
// // // // //       />
// // // // //       <input
// // // // //         type="text"
// // // // //         placeholder="Industry (e.g. Tech, Healthcare)"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.industry}
// // // // //         onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
// // // // //       />
// // // // //       <input
// // // // //         type="url"
// // // // //         placeholder="Website (https://)"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.website}
// // // // //         onChange={(e) => setFormData({ ...formData, website: e.target.value })}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // function Step3({ formData, setFormData }) {
// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <input
// // // // //         type="text"
// // // // //         placeholder="Office Address"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.address}
// // // // //         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
// // // // //       />
// // // // //       <input
// // // // //         type="tel"
// // // // //         placeholder="Contact Phone"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.phone}
// // // // //         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // function Step4({ formData, setFormData }) {
// // // // //   const handleFileChange = (e) => {
// // // // //     setFormData({ ...formData, logo: e.target.files[0] });
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <textarea
// // // // //         placeholder="Company Description"
// // // // //         rows="5"
// // // // //         className="w-full border p-2 rounded"
// // // // //         value={formData.description}
// // // // //         onChange={(e) =>
// // // // //           setFormData({ ...formData, description: e.target.value })
// // // // //         }
// // // // //       />

// // // // //       <input
// // // // //         type="file"
// // // // //         accept="image/*"
// // // // //         className="w-full"
// // // // //         onChange={handleFileChange}
// // // // //       />

// // // // //       {formData.logo && (
// // // // //         <div className="mt-2 text-sm text-gray-600">
// // // // //           Selected: {formData.logo.name}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // function Step5({ formData }) {
// // // // //   return (
// // // // //     <div className="space-y-2 text-sm text-white">
// // // // //       <div>
// // // // //         <strong>Email:</strong> {formData.email}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Company Name:</strong> {formData.companyName}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Company Registeration Number:</strong>
// // // // //         {formData.companyRegisterationNumber}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Industry:</strong> {formData.industry}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Website:</strong> {formData.website}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Address:</strong> {formData.address}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Phone:</strong> {formData.phone}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Description:</strong> {formData.description}
// // // // //       </div>
// // // // //       <div>
// // // // //         <strong>Logo:</strong> {formData.logo?.name || "No file selected"}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // import React, { useState } from "react";

// // // // // // const EmployerRegisterForm = () => {
// // // // // //   const [step, setStep] = useState(1);
// // // // // //   const [formData, setFormData] = useState({
// // // // // //     email: "",
// // // // // //     password: "",
// // // // // //     companyName: "",
// // // // // //     industry: "",
// // // // // //     website: "",
// // // // // //     address: "",
// // // // // //     phone: "",
// // // // // //     description: "",
// // // // // //     logo: null,
// // // // // //   });

// // // // // //   const handleSubmit = async () => {
// // // // // //     const form = new FormData();
// // // // // //     for (let key in formData) {
// // // // // //       form.append(key, formData[key]);
// // // // // //     }

// // // // // //     await axios.post("/api/employer/register", form, {
// // // // // //       headers: { "Content-Type": "multipart/form-data" },
// // // // // //     });

// // // // // //     // Show success or navigate
// // // // // //   };

// // // // // //   return (
// // // // // //     <div>
// // // // // //       return (
// // // // // //       <div className="p-6 max-w-xl mx-auto">
// // // // // //         {step === 1 && (
// // // // // //           <Step1_AccountInfo formData={formData} setFormData={setFormData} />
// // // // // //         )}
// // // // // //         {step === 2 && (
// // // // // //           <Step2_CompanyDetails formData={formData} setFormData={setFormData} />
// // // // // //         )}
// // // // // //         {step === 3 && (
// // // // // //           <Step3_ContactInfo formData={formData} setFormData={setFormData} />
// // // // // //         )}
// // // // // //         {step === 4 && (
// // // // // //           <Step4_DescriptionLogo
// // // // // //             formData={formData}
// // // // // //             setFormData={setFormData}
// // // // // //           />
// // // // // //         )}
// // // // // //         {step === 5 && <Step5_ReviewSubmit formData={formData} />}

// // // // // //         <div className="flex justify-between mt-6">
// // // // // //           {step > 1 && <button onClick={() => setStep(step - 1)}>Back</button>}
// // // // // //           {step < 5 && <button onClick={() => setStep(step + 1)}>Next</button>}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //       );
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default EmployerRegisterForm;

// // // // // // const Step1_AccountInfo = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Account Information</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="username" className="block text-sm font-medium">
// // // // // //             Username
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="username"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="email" className="block text-sm font-medium">
// // // // // //             Email
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="email"
// // // // // //             id="email"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="password" className="block text-sm font-medium">
// // // // // //             Password
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="password"
// // // // // //             id="password"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step2_CompanyInfo = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Information</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="company-name" className="block text-sm font-medium">
// // // // // //             Company Name
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="company-name"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="company-email" className="block text-sm font-medium">
// // // // // //             Company Email
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="email"
// // // // // //             id="company-email"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step3_CompanyAddress = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Address</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="address" className="block text-sm font-medium">
// // // // // //             Address
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="address"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="city" className="block text-sm font-medium">
// // // // // //             City
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="city"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step4_CompanyLogo = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Logo</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="logo" className="block text-sm font-medium">
// // // // // //             Upload Company Logo
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="file"
// // // // // //             id="logo"
// // // // // //             accept="image/*"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step5_CompanyDescription = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Description</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="description" className="block text-sm font-medium">
// // // // // //             Description
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             id="description"
// // // // // //             rows="4"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           ></textarea>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step6_CompanyWebsite = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Website</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="website" className="block text-sm font-medium">
// // // // // //             Website URL
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="url"
// // // // // //             id="website"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step7_CompanySocialMedia = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Social Media</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="social-media" className="block text-sm font-medium">
// // // // // //             Social Media Links
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="url"
// // // // // //             id="social-media"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step8_CompanyPhone = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Phone Number</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="phone" className="block text-sm font-medium">
// // // // // //             Phone Number
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="tel"
// // // // // //             id="phone"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step9_CompanyIndustry = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Industry</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="industry" className="block text-sm font-medium">
// // // // // //             Industry
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="industry"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step10_CompanySize = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Size</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="size" className="block text-sm font-medium">
// // // // // //             Size
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="number"
// // // // // //             id="size"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step11_CompanyType = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Type</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="type" className="block text-sm font-medium">
// // // // // //             Type
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="type"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step12_CompanyTaxID = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Tax ID</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="tax-id" className="block text-sm font-medium">
// // // // // //             Tax ID
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="tax-id"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step13_CompanyRegistrationNumber = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Registration Number</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label
// // // // // //             htmlFor="registration-number"
// // // // // //             className="block text-sm font-medium"
// // // // // //           >
// // // // // //             Registration Number
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="registration-number"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step14_CompanyBankDetails = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Bank Details</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="bank-details" className="block text-sm font-medium">
// // // // // //             Bank Details
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="text"
// // // // // //             id="bank-details"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step15_CompanyPrivacyPolicy = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Privacy Policy</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="privacy-policy" className="block text-sm font-medium">
// // // // // //             Privacy Policy
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             id="privacy-policy"
// // // // // //             rows="4"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           ></textarea>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step16_CompanyTermsConditions = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Terms & Conditions</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label
// // // // // //             htmlFor="terms-conditions"
// // // // // //             className="block text-sm font-medium"
// // // // // //           >
// // // // // //             Terms & Conditions
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             id="terms-conditions"
// // // // // //             rows="4"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           ></textarea>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step17_CompanyVerificationDocuments = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Verification Documents</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label
// // // // // //             htmlFor="verification-documents"
// // // // // //             className="block text-sm font-medium"
// // // // // //           >
// // // // // //             Upload Verification Documents
// // // // // //           </label>
// // // // // //           <input
// // // // // //             type="file"
// // // // // //             id="verification-documents"
// // // // // //             accept=".pdf,.doc,.docx"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           />
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step18_CompanyReferences = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company References</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label htmlFor="references" className="block text-sm font-medium">
// // // // // //             References
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             id="references"
// // // // // //             rows="4"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           ></textarea>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step19_CompanyAdditionalInfo = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Additional Information</h2>
// // // // // //       <form>
// // // // // //         <div className="mb-4">
// // // // // //           <label
// // // // // //             htmlFor="additional-info"
// // // // // //             className="block text-sm font-medium"
// // // // // //           >
// // // // // //             Additional Information
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             id="additional-info"
// // // // // //             rows="4"
// // // // // //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
// // // // // //           ></textarea>
// // // // // //         </div>
// // // // // //       </form>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step20_CompanySubmit = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Submit Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Submit
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step21_CompanyCancel = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Cancel Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
// // // // // //         Cancel
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step22_CompanyBack = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Back to Previous Step</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">
// // // // // //         Back
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step23_CompanyNext = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Next Step</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Next
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step24_CompanyFinish = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Finish Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
// // // // // //         Finish
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step25_CompanySave = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Save Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">
// // // // // //         Save
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step26_CompanyPreview = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Preview Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md">
// // // // // //         Preview
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step27_CompanyEdit = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Edit Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Edit
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step28_CompanyDelete = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Delete Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
// // // // // //         Delete
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step29_CompanyUpdate = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Update Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Update
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step30_CompanyRefresh = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Refresh Registration</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Refresh
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step31_CompanySettings = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Settings</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Settings
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step32_CompanyHelp = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Help</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Help
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step33_CompanySupport = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Support</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Support
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step34_CompanyFeedback = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Feedback</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Feedback
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step35_CompanyLogout = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Logout</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
// // // // // //         Logout
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step36_CompanyLogin = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Login</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Login
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step37_CompanyRegister = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Register</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Register
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step38_CompanyForgotPassword = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Forgot Password</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Forgot Password
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step39_CompanyResetPassword = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Reset Password</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Reset Password
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step40_CompanyChangePassword = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Change Password</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Change Password
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step41_CompanyUpdateProfile = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Update Profile</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Update Profile
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step42_CompanyViewProfile = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company View Profile</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         View Profile
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step43_CompanyDeleteProfile = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Delete Profile</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
// // // // // //         Delete Profile
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step44_CompanyDeactivateProfile = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Deactivate Profile</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">
// // // // // //         Deactivate Profile
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step45_CompanyActivateProfile = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Activate Profile</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">
// // // // // //         Activate Profile
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };
// // // // // // const Step46_CompanyEnableTwoFactorAuth = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2 className="text-lg font-semibold">Company Enable Two-Factor Auth</h2>
// // // // // //       <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
// // // // // //         Enable Two-Factor Auth
// // // // // //       </button>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // import React from "react";
// // // // import { useForm } from "react-hook-form";

// // // // const Register = () => {
// // // //   const {
// // // //     register,
// // // //     handleSubmit,
// // // //     formState: { errors },
// // // //   } = useForm();

// // // //   return (
// // // //     <div>
// // // //       <h1>Hi using react-hook-form</h1>
// // // //       <form onSubmit={handleSubmit((data) => console.log(data))}>
// // // //         <input {...register("username")} />
// // // //         <input {...register("email", { required: true })} />
// // // //         {errors.email && <p>Please Enter Valid Email Address</p>}
// // // //         <input {...register("password", { required: true })} />

// // // //         <input {...register("confirmPassword", { required: true })} />
// // // //         {errors.confirmPassword && <p>Please Enter Password</p>}
// // // //         <input type="submit" />
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Register;
// // // // import React, { useRef } from "react";
// // // // import useClickOutside from "../../hooks/useClickOutside";
// // // // import OpenMenu from "./OpenMenu";

// // // // const SignIn = () => {
// // // //   const menuRef = useRef(null);
// // // //   const [open, setOpen] = useClickOutside(false); // Use the custom hook

// // // //   return (
// // // //     <div>
// // // //       <h1>Sign In Page</h1>
// // // //       <p>Please enter your credentials to sign in.</p>
// // // //       {open ? <p>True {open}</p> : <p>False {open}</p>}
// // // //       {open && <OpenMenu ref={menuRef} />}
// // // //       <button onClick={() => setOpen(!open)} className="bg-amber-50 p-2">
// // // //         Click
// // // //       </button>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SignIn;

// // // // // const Menu = forwardRef((props, ref) => {
// // // // //   const usernameRef = useRef(null);
// // // // //   const emailRef = useRef(null);
// // // // //   const passwordRef = useRef(null);
// // // // //   const confirmPasswordRef = useRef(null);
// // // // //   const handleSubmit = () => {
// // // // //     console.log("click");
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       ref={ref}
// // // // //       className="absolute right-10 shadow-2xl w-72 h-96 p-4 bg-green-400 overflow-y-auto backdrop-blur-3xl"
// // // // //     >
// // // // //       <h1>This is testing Menu</h1>
// // // // //       <input type="text" ref={usernameRef} placeholder="test ..." />
// // // // //       <input type="text" ref={emailRef} placeholder="test ..." />
// // // // //       <input type="text" ref={passwordRef} placeholder="test ..." />
// // // // //       <input type="text" ref={confirmPasswordRef} placeholder="test ..." />
// // // // //       <select>
// // // // //         <option>Hi</option>
// // // // //         <option>Hello</option>
// // // // //       </select>
// // // // //       <button onClick={handleSubmit}>Submit</button>
// // // // //     </div>
// // // // //   );
// // // // // });

// // // // // const Menu = forwardRef((props, ref) => {
// // // // //   // 1. Create the refs:
// // // // //   //    - useRef(null) initializes a ref object with { current: null }
// // // // //   //    - This object persists for the lifetime of the component.
// // // // //   const usernameRef = useRef(null);
// // // // //   const emailRef = useRef(null);
// // // // //   const passwordRef = useRef(null);
// // // // //   const confirmPasswordRef = useRef(null);

// // // // //   const handleSubmit = () => {
// // // // //     // 3. Access the current value of the DOM elements:
// // // // //     //    - After the component mounts and the input elements are rendered,
// // // // //     //      React sets the `.current` property of each ref to the corresponding DOM node.
// // // // //     //    - You can then access standard DOM properties like `.value`.
// // // // //     const username = usernameRef.current ? usernameRef.current.value : "";
// // // // //     const email = emailRef.current ? emailRef.current.value : "";
// // // // //     const password = passwordRef.current ? passwordRef.current.value : "";
// // // // //     const confirmPassword = confirmPasswordRef.current
// // // // //       ? confirmPasswordRef.current.value
// // // // //       : "";

// // // // //     console.log("Submit clicked!");
// // // // //     console.log("Username:", username);
// // // // //     console.log("Email:", email);
// // // // //     console.log("Password:", password); // Be cautious logging passwords in real apps!
// // // // //     console.log("Confirm Password:", confirmPassword);

// // // // //     // Add your form validation or submission logic here
// // // // //     if (password !== confirmPassword) {
// // // // //       alert("Passwords do not match!");
// // // // //       return; // Stop submission
// // // // //     }

// // // // //     // Example: Prepare data for submission (replace with your actual logic)
// // // // //     const formData = {
// // // // //       username,
// // // // //       email,
// // // // //       password, // Again, handle passwords securely
// // // // //     };
// // // // //     console.log("Form Data:", formData);
// // // // //     // fetch('/api/register', { method: 'POST', body: JSON.stringify(formData), ... })
// // // // //     //  .then(...)
// // // // //     //  .catch(...)
// // // // //   };

// // // // //   return (
// // // // //     // The `ref` passed from the parent component is attached here (via forwardRef)
// // // // //     <div
// // // // //       ref={ref}
// // // // //       className="absolute right-10 shadow-2xl w-72 h-96 p-4 bg-green-400 overflow-y-auto backdrop-blur-3xl"
// // // // //     >
// // // // //       <h1>This is testing Menu</h1>
// // // // //       {/* 2. Attach the refs:
// // // // //           - The `ref` prop on the input elements tells React to associate
// // // // //             the DOM node of this input with the `.current` property of the respective ref object.
// // // // //       */}
// // // // //       <input type="text" ref={usernameRef} placeholder="Username..." />
// // // // //       <input type="email" ref={emailRef} placeholder="Email..." />{" "}
// // // // //       {/* Use type="email" */}
// // // // //       <input type="password" ref={passwordRef} placeholder="Password..." />{" "}
// // // // //       {/* Use type="password" */}
// // // // //       <input
// // // // //         type="password"
// // // // //         ref={confirmPasswordRef}
// // // // //         placeholder="Confirm Password..."
// // // // //       />
// // // // //       {/* Use type="password" */}
// // // // //       {/* Select doesn't typically need a ref unless you specifically need to manipulate the select element itself */}
// // // // //       <select>
// // // // //         <option>Hi</option>
// // // // //         <option>Hello</option>
// // // // //       </select>
// // // // //       <button onClick={handleSubmit}>Submit</button>
// // // // //     </div>
// // // // //   );
// // // // // });

// // // // // import React, { forwardRef, useEffect, useRef, useState } from "react";

// // // // // const SignIn = () => {
// // // // //   const [open, setOpen] = useState(false);
// // // // //   const menuRef = useRef(null);

// // // // //   useEffect(() => {
// // // // //     const handleClickOutside = (e) => {
// // // // //       // console.log(e.target, " click outside ");
// // // // //       if (open && menuRef.current && !menuRef.current.contains(e.target)) {
// // // // //         console.log("click outside");
// // // // //         setOpen(false);
// // // // //       }
// // // // //     };
// // // // //     if (open) {
// // // // //       document.addEventListener("mousedown", handleClickOutside);
// // // // //     }
// // // // //     return () => {
// // // // //       document.removeEventListener("mousedown", handleClickOutside);
// // // // //     };
// // // // //   }, [open]);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>Sign In Page</h1>
// // // // //       <p>Please enter your credentials to sign in.</p>
// // // // //       {/* Add your sign-in form here */}
// // // // //       {/* <p className="bg-green-200">{open} : info</p> */}
// // // // //       {open ? <p>True {open}</p> : <p>False {open}</p>}
// // // // //       {open && <Menu ref={menuRef} />}
// // // // //       <button onClick={() => setOpen(!open)} className="bg-amber-50 p-2">
// // // // //         Click
// // // // //       </button>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SignIn;

// // // // // const Menu = forwardRef((props, ref) => {
// // // // //   return (
// // // // //     <div
// // // // //       ref={ref}
// // // // //       className="absolute right-10 shadow-2xl w-72 h-96 p-4 overflow-y-auto backdrop-blur-3xl"
// // // // //     >
// // // // //       <h1>This is testing Menu</h1>
// // // // //       <p>Let See Menu Can be open or not.</p>
// // // // //     </div>
// // // // //   );
// // // // // });

// // // // // import React, { useEffect, useState } from "react";

// // // // // const SignIn = () => {
// // // // //   const [open, setOpen] = useState(false);
// // // // //   const [menuElement, setMenuElement] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const handleClickOutside = (e) => {
// // // // //       // Check if menu is open and click is outside of menu
// // // // //       if (open && menuElement && !menuElement.contains(e.target)) {
// // // // //         console.log("Click outside detected");
// // // // //         setOpen(false);
// // // // //       }
// // // // //     };

// // // // //     if (open) {
// // // // //       document.addEventListener("mousedown", handleClickOutside);
// // // // //     }

// // // // //     return () => {
// // // // //       document.removeEventListener("mousedown", handleClickOutside);
// // // // //     };
// // // // //   }, [open, menuElement]);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>Sign In Page</h1>
// // // // //       <p>Please enter your credentials to sign in.</p>
// // // // //       {open ? <p>True {open}</p> : <p>False {open}</p>}
// // // // //       {open && <Menu setMenuElement={setMenuElement} />}
// // // // //       <button onClick={() => setOpen(!open)} className="bg-amber-50 p-2">
// // // // //         Click
// // // // //       </button>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SignIn;

// // // // // const Menu = ({ setMenuElement }) => {
// // // // //   return (
// // // // //     <div
// // // // //       ref={setMenuElement}
// // // // //       className="absolute right-10 shadow-stone-400 w-72 h-96 backdrop-blur-3xl overflow-y-auto p-2"
// // // // //     >
// // // // //       <h1>This is menu testing</h1>
// // // // //       <input type="text" placeholder="text" />
// // // // //       <input type="text" placeholder="text" />
// // // // //     </div>
// // // // //   );
// // // // // };
