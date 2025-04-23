// import React, { useState } from "react";
// import {
//   useSaveJobMutation,
//   useJobApplicationMutation,
//   useGetResumeQuery,
//   useGetSavedJobsQuery,
//   useGetApplicationsQuery,
// } from "../../redux/api/userApi";
// import coverImg from "../../assets/utils/B.png";
// import { toast } from "react-toastify";

// const JobDetails = ({ job }) => {
//   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
//   const [selectedResumeId, setSelectedResumeId] = useState(null);

//   // RTK Query hooks
//   const [saveJob, { isLoading: isSaving, error: saveError }] =
//     useSaveJobMutation();
//   const [jobApplication, { isLoading: isApplying, error: applyError }] =
//     useJobApplicationMutation();
//   const {
//     data: resumes,
//     isLoading: isResumesLoading,
//     error: resumesError,
//   } = useGetResumeQuery();
//   const {
//     data: savedJobs,
//     isLoading: isSavedJobsLoading,
//     error: savedJobsError,
//   } = useGetSavedJobsQuery();
//   const {
//     data: applications,
//     isLoading: isApplicationsLoading,
//     error: applicationsError,
//   } = useGetApplicationsQuery();

//   // Debug data structures
//   console.log("Job ID:", job?.id);
//   console.log("Saved Jobs:", savedJobs?.data);
//   console.log("Applications:", applications?.data);

//   // Check if the job is saved (use job_post_id based on userApi)
//   const isJobSaved = savedJobs?.data?.some((saved) => {
//     const match = saved.job_post_id === job?.id;
//     console.log(
//       `Comparing saved.job_post_id: ${saved.job_post_id} with job.id: ${job?.id} -> ${match}`
//     );
//     return match;
//   });

//   // Check if the job is applied
//   const isJobApplied = applications?.data?.some((app) => {
//     const match = app.jobId === job?.id;
//     console.log(
//       `Comparing app.jobId: ${app.jobId} with job.id: ${job?.id} -> ${match}`
//     );
//     return match;
//   });

//   // Handle Save Job
//   const handleSaveJob = async () => {
//     if (!job?.id) {
//       toast.error("No job selected.");
//       return;
//     }
//     if (isJobSaved) {
//       toast.info("This job is already saved.");
//       return;
//     }
//     try {
//       await saveJob(job.id).unwrap();
//       toast.success("Job saved successfully!");
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to save job.");
//     }
//   };

//   // Handle Apply Job
//   const handleApplyJob = async () => {
//     if (!job?.id) {
//       toast.error("No job selected.");
//       return;
//     }
//     if (isJobApplied) {
//       toast.info("You have already applied to this job.");
//       return;
//     }
//     if (!selectedResumeId) {
//       toast.error("Please select a resume to apply.");
//       return;
//     }
//     try {
//       await jobApplication({
//         jobId: job.id,
//         resumeId: selectedResumeId,
//       }).unwrap();
//       toast.success("Application submitted successfully!");
//       setIsResumeModalOpen(false);
//       setSelectedResumeId(null);
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to apply.");
//     }
//   };

//   // Open/Close Resume Modal
//   const openResumeModal = () => {
//     if (isJobApplied) {
//       toast.info("You have already applied to this job.");
//       return;
//     }
//     if (!resumes?.data?.length) {
//       toast.info("No resumes found. Please upload a resume first.");
//       return;
//     }
//     setIsResumeModalOpen(true);
//   };
//   const closeResumeModal = () => {
//     setIsResumeModalOpen(false);
//     setSelectedResumeId(null);
//   };

//   // Loading state
//   if (isSavedJobsLoading || isApplicationsLoading || isResumesLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-lg font-semibold">Loading...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (
//     savedJobsError ||
//     applicationsError ||
//     resumesError ||
//     saveError ||
//     applyError
//   ) {
//     console.log("Errors:", {
//       savedJobsError,
//       applicationsError,
//       resumesError,
//       saveError,
//       applyError,
//     });
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-lg text-red-600">
//           Error loading data. Please try again.
//         </p>
//       </div>
//     );
//   }

//   // Initial state when no job is selected
//   if (!job) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
//         <h2 className="text-xl font-semibold">Select a job to view details</h2>
//         <p className="mt-2 text-gray-500">
//           Or create a new job using the button above!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 m-2 rounded-lg shadow overflow-y-auto h-screen">
//       {/* Job Image */}
//       {job.post_image_url ? (
//         <img
//           src={job.post_image_url}
//           alt={job.title}
//           className="w-full h-48 object-cover rounded-md mb-4"
//         />
//       ) : (
//         <img
//           src={coverImg}
//           alt="Default cover"
//           className="w-full h-48 object-cover object-top rounded-md mb-4 dark:invert-100"
//         />
//       )}

//       <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
//       <p className="text-sm mb-1">
//         <strong>Location:</strong> {job.location || "N/A"}
//       </p>
//       {job.address && (
//         <p className="text-sm mb-1">
//           <strong>Address:</strong> {job.address}
//         </p>
//       )}
//       <p className="text-sm mb-1">
//         <strong>Type:</strong> {job.employment_type}
//       </p>
//       {(job.salary_min || job.salary_max) && (
//         <p className="text-sm mb-1">
//           <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
//           {job.salary_max || "N/A"}
//         </p>
//       )}
//       {job.application_deadline && (
//         <p className="text-sm text-red-600 mb-4">
//           <strong>Apply by:</strong>{" "}
//           {new Date(job.application_deadline).toLocaleDateString()}
//         </p>
//       )}

//       {/* Action Buttons */}
//       <div className="flex space-x-4 mb-4">
//         <button
//           onClick={handleSaveJob}
//           disabled={isSaving || isJobSaved}
//           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
//             isSaving || isJobSaved ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isSaving ? "Saving..." : isJobSaved ? "Saved" : "Save Job"}
//         </button>
//         <button
//           onClick={openResumeModal}
//           disabled={isApplying || isJobApplied}
//           className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${
//             isApplying || isJobApplied ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isApplying ? "Applying..." : isJobApplied ? "Applied" : "Apply Now"}
//         </button>
//       </div>

//       <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
//         Description
//       </h2>
//       <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

//       {/* Requirements */}
//       {job.requirements && job.requirements.length > 0 && (
//         <>
//           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
//             Requirements
//           </h2>
//           <ul className="list-disc list-inside space-y-1 pl-4">
//             {Array.isArray(job.requirements) ? (
//               job.requirements.map((req, index) => (
//                 <li key={`req-${index}`}>{req}</li>
//               ))
//             ) : (
//               <li>{job.requirements}</li>
//             )}
//           </ul>
//         </>
//       )}

//       {/* Responsibilities */}
//       {job.responsibilities && job.responsibilities.length > 0 && (
//         <>
//           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
//             Responsibilities
//           </h2>
//           <ul className="list-disc list-inside space-y-1 pl-4">
//             {Array.isArray(job.responsibilities) ? (
//               job.responsibilities.map((resp, index) => (
//                 <li key={`resp-${index}`}>{resp}</li>
//               ))
//             ) : (
//               <li>{job.responsibilities}</li>
//             )}
//           </ul>
//         </>
//       )}

//       {/* Resume Selection Modal */}
//       {isResumeModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-4">Select a Resume</h2>
//             {isResumesLoading ? (
//               <p>Loading resumes...</p>
//             ) : !resumes?.data?.length ? (
//               <p>No resumes available. Please upload a resume first.</p>
//             ) : (
//               <div className="space-y-2">
//                 {resumes.data.map((resume) => (
//                   <div key={resume.id} className="flex items-center">
//                     <input
//                       type="radio"
//                       name="resume"
//                       value={resume.id}
//                       checked={selectedResumeId === resume.id}
//                       onChange={() => setSelectedResumeId(resume.id)}
//                       className="mr-2"
//                     />
//                     <label>{resume.file_name}</label>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div className="flex justify-end space-x-4 mt-6">
//               <button
//                 onClick={closeResumeModal}
//                 className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApplyJob}
//                 disabled={!selectedResumeId || isApplying}
//                 className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded ${
//                   !selectedResumeId || isApplying
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//               >
//                 {isApplying ? "Submitting..." : "Submit Application"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobDetails;

// // THIS VERSION SI RESUME IS WORKING BUT APPLY AND SAVE JOB NOT AFTER APPLY STILL CAN APPLY. NEED TO EDIT HE LOGIC.

// // import React, { useState } from "react";
// // import {
// //   useSaveJobMutation,
// //   useJobApplicationMutation,
// //   useGetResumeQuery,
// //   useGetSavedJobsQuery, // Correct hook
// // } from "../../redux/api/userApi";
// // import coverImg from "../../assets/utils/B.png";
// // import { toast } from "react-toastify";

// // const JobDetails = ({ job }) => {
// //   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
// //   const [selectedResumeId, setSelectedResumeId] = useState(null);

// //   // RTK Query hooks
// //   const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
// //   const [jobApplication, { isLoading: isApplying }] =
// //     useJobApplicationMutation();

// //   const { data: resumes, isLoading: isResumesLoading } = useGetResumeQuery(); // Correct hook

// //   // Handle Save Job
// //   const handleSaveJob = async () => {
// //     if (!job?.id) return;
// //     try {
// //       await saveJob(job.id).unwrap();
// //       toast.success("Job saved successfully!");
// //     } catch (error) {
// //       toast.error(error?.data?.message || "Failed to save job.");
// //     }
// //   };

// //   // Handle Apply Job
// //   const handleApplyJob = async () => {
// //     if (!job?.id) return;
// //     if (!selectedResumeId) {
// //       toast.error("Please select a resume to apply.");
// //       return;
// //     }
// //     try {
// //       await jobApplication({
// //         jobId: job.id,
// //         resumeId: selectedResumeId,
// //       }).unwrap();
// //       toast.success("Application submitted successfully!");
// //       setIsResumeModalOpen(false);
// //       setSelectedResumeId(null);
// //     } catch (error) {
// //       toast.error(error?.data?.message || "Failed to apply.");
// //     }
// //   };

// //   // Open/Close Resume Modal
// //   const openResumeModal = () => {
// //     if (resumes.data.length === 0) {
// //       toast.info("No resumes found. Please upload a resume first.");
// //       return;
// //     }
// //     setIsResumeModalOpen(true);
// //   };
// //   const closeResumeModal = () => {
// //     setIsResumeModalOpen(false);
// //     setSelectedResumeId(null);
// //   };

// //   // Initial state when no job is selected
// //   if (!job) {
// //     return (
// //       <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
// //         <h2 className="text-xl font-semibold">Select a job to view details</h2>
// //         <p className="mt-2 text-gray-500">
// //           Or create a new job using the button above!
// //         </p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 m-2 rounded-lg shadow overflow-y-auto h-screen">
// //       {/* Job Image */}
// //       {job.post_image_url ? (
// //         <img
// //           src={job.post_image_url}
// //           alt={job.title}
// //           className="w-full h-48 object-cover rounded-md mb-4"
// //         />
// //       ) : (
// //         <img
// //           src={coverImg}
// //           alt="Default cover"
// //           className="w-full h-48 object-cover object-top rounded-md mb-4 dark:invert-100"
// //         />
// //       )}

// //       <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
// //       <p className="text-sm mb-1">
// //         <strong>Location:</strong> {job.location || "N/A"}
// //       </p>
// //       {job.address && (
// //         <p className="text-sm mb-1">
// //           <strong>Address:</strong> {job.address}
// //         </p>
// //       )}
// //       <p className="text-sm mb-1">
// //         <strong>Type:</strong> {job.employment_type}
// //       </p>
// //       {(job.salary_min || job.salary_max) && (
// //         <p className="text-sm mb-1">
// //           <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
// //           {job.salary_max || "N/A"}
// //         </p>
// //       )}
// //       {job.application_deadline && (
// //         <p className="text-sm text-red-600 mb-4">
// //           <strong>Apply by:</strong>{" "}
// //           {new Date(job.application_deadline).toLocaleDateString()}
// //         </p>
// //       )}

// //       {/* Action Buttons */}
// //       <div className="flex space-x-4 mb-4">
// //         <button
// //           onClick={handleSaveJob}
// //           disabled={isSaving}
// //           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
// //             isSaving ? "opacity-50 cursor-not-allowed" : ""
// //           }`}
// //         >
// //           {isSaving ? "Saving..." : "Save Job"}
// //         </button>
// //         <button
// //           onClick={openResumeModal}
// //           disabled={isApplying}
// //           className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${
// //             isApplying ? "opacity-50 cursor-not-allowed" : ""
// //           }`}
// //         >
// //           {isApplying ? "Applying..." : "Apply Now"}
// //         </button>
// //       </div>

// //       <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// //         Description
// //       </h2>
// //       <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

// //       {/* Requirements */}
// //       {job.requirements && job.requirements.length > 0 && (
// //         <>
// //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// //             Requirements
// //           </h2>
// //           <ul className="list-disc list-inside space-y-1 pl-4">
// //             {Array.isArray(job.requirements) ? (
// //               job.requirements.map((req, index) => (
// //                 <li key={`req-${index}`}>{req}</li>
// //               ))
// //             ) : (
// //               <li>{job.requirements}</li>
// //             )}
// //           </ul>
// //         </>
// //       )}

// //       {/* Responsibilities */}
// //       {job.responsibilities && job.responsibilities.length > 0 && (
// //         <>
// //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// //             Responsibilities
// //           </h2>
// //           <ul className="list-disc list-inside space-y-1 pl-4">
// //             {Array.isArray(job.responsibilities) ? (
// //               job.responsibilities.map((resp, index) => (
// //                 <li key={`resp-${index}`}>{resp}</li>
// //               ))
// //             ) : (
// //               <li>{job.responsibilities}</li>
// //             )}
// //           </ul>
// //         </>
// //       )}

// //       {/* Resume Selection Modal */}
// //       {isResumeModalOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// //             <h2 className="text-xl font-semibold mb-4">Select a Resume</h2>
// //             {isResumesLoading ? (
// //               <p>Loading resumes...</p>
// //             ) : resumes.length === 0 ? (
// //               <p>No resumes available. Please upload a resume first.</p>
// //             ) : (
// //               <div className="space-y-2">
// //                 {resumes.data.map((resume) => (
// //                   <div key={resume.id} className="flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="resume"
// //                       value={resume.id}
// //                       checked={selectedResumeId === resume.id}
// //                       onChange={() => setSelectedResumeId(resume.id)}
// //                       className="mr-2"
// //                     />
// //                     <label>{resume.file_name}</label>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //             <div className="flex justify-end space-x-4 mt-6">
// //               <button
// //                 onClick={closeResumeModal}
// //                 className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleApplyJob}
// //                 disabled={!selectedResumeId || isApplying}
// //                 className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded ${
// //                   !selectedResumeId || isApplying
// //                     ? "opacity-50 cursor-not-allowed"
// //                     : ""
// //                 }`}
// //               >
// //                 {isApplying ? "Submitting..." : "Submit Application"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobDetails;
// // // THIS VERSION IS NO RESUME UPDAET YET.
// // // import React, { useState } from "react";
// // // import {
// // //   useSaveJobMutation,
// // //   useJobApplicationMutation,
// // // } from "../../redux/api/userApi";

// // // import coverImg from "../../assets/utils/B.png";
// // // import { toast } from "react-toastify"; // Optional for notifications

// // // const JobDetails = ({ job }) => {
// // //   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
// // //   const [selectedResumeId, setSelectedResumeId] = useState(null);

// // //   // RTK Query hooks
// // //   const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
// // //   const [jobApplication, { isLoading: isApplying }] =
// // //     useJobApplicationMutation();
// // //   const { data: resumes = [], isLoading: isResumesLoading } =
// // //     useGetResumesQuery();

// // //   // Handle Save Job
// // //   const handleSaveJob = async () => {
// // //     if (!job?.id) return;
// // //     try {
// // //       await saveJob(job.id).unwrap();
// // //       toast.success("Job saved successfully!");
// // //     } catch (error) {
// // //       if (error.status === 204) {
// // //         toast.info("Job already saved.");
// // //       } else {
// // //         toast.error(error.data?.message || "Failed to save job.");
// // //       }
// // //     }
// // //   };

// // //   // Handle Apply Job
// // //   const handleApplyJob = async () => {
// // //     if (!job?.id) return;
// // //     if (!selectedResumeId) {
// // //       toast.error("Please select a resume to apply.");
// // //       return;
// // //     }
// // //     try {
// // //       await jobApplication({
// // //         jobId: job.id,
// // //         resumeId: selectedResumeId,
// // //       }).unwrap();
// // //       toast.success("Application submitted successfully!");
// // //       setIsResumeModalOpen(false);
// // //       setSelectedResumeId(null);
// // //     } catch (error) {
// // //       if (error.status === 400 && error.data?.message === "Already applied") {
// // //         toast.info("You have already applied to this job.");
// // //       } else {
// // //         toast.error(error.data?.message || "Failed to apply.");
// // //       }
// // //     }
// // //   };

// // //   // Open/Close Resume Modal
// // //   const openResumeModal = () => {
// // //     if (resumes.length === 0) {
// // //       toast.info("No resumes found. Please upload a resume first.");
// // //       return;
// // //     }
// // //     setIsResumeModalOpen(true);
// // //   };
// // //   const closeResumeModal = () => {
// // //     setIsResumeModalOpen(false);
// // //     setSelectedResumeId(null);
// // //   };

// // //   // Initial state when no job is selected
// // //   if (!job) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
// // //         <h2 className="text-xl font-semibold">Select a job to view details</h2>
// // //         <p className="mt-2 text-gray-500">
// // //           Or create a new job using the button above!
// // //         </p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6 m-2 rounded-lg shadow overflow-y-auto h-screen">
// // //       {/* Job Image */}
// // //       {job.post_image_url ? (
// // //         <img
// // //           src={job.post_image_url}
// // //           alt={job.title}
// // //           className="w-full h-48 object-cover rounded-md mb-4"
// // //         />
// // //       ) : (
// // //         <img
// // //           src={coverImg}
// // //           alt="Default cover"
// // //           className="w-full h-48 object-cover object-top rounded-md mb-4 dark:invert-100"
// // //         />
// // //       )}

// // //       <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
// // //       <p className="text-sm mb-1">
// // //         <strong>Location:</strong> {job.location || "N/A"}
// // //       </p>
// // //       {job.address && (
// // //         <p className="text-sm mb-1">
// // //           <strong>Address:</strong> {job.address}
// // //         </p>
// // //       )}
// // //       <p className="text-sm mb-1">
// // //         <strong>Type:</strong> {job.employment_type}
// // //       </p>
// // //       {(job.salary_min || job.salary_max) && (
// // //         <p className="text-sm mb-1">
// // //           <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
// // //           {job.salary_max || "N/A"}
// // //         </p>
// // //       )}
// // //       {job.application_deadline && (
// // //         <p className="text-sm text-red-600 mb-4">
// // //           <strong>Apply by:</strong>{" "}
// // //           {new Date(job.application_deadline).toLocaleDateString()}
// // //         </p>
// // //       )}

// // //       {/* Action Buttons */}
// // //       <div className="flex space-x-4 mb-4">
// // //         <button
// // //           onClick={handleSaveJob}
// // //           disabled={isSaving}
// // //           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
// // //             isSaving ? "opacity-50 cursor-not-allowed" : ""
// // //           }`}
// // //         >
// // //           {isSaving ? "Saving..." : "Save Job"}
// // //         </button>
// // //         <button
// // //           onClick={openResumeModal}
// // //           disabled={isApplying}
// // //           className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${
// // //             isApplying ? "opacity-50 cursor-not-allowed" : ""
// // //           }`}
// // //         >
// // //           {isApplying ? "Applying..." : "Apply Now"}
// // //         </button>
// // //       </div>

// // //       <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // //         Description
// // //       </h2>
// // //       <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

// // //       {/* Requirements */}
// // //       {job.requirements && job.requirements.length > 0 && (
// // //         <>
// // //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // //             Requirements
// // //           </h2>
// // //           <ul className="list-disc list-inside space-y-1 pl-4">
// // //             {Array.isArray(job.requirements) ? (
// // //               job.requirements.map((req, index) => (
// // //                 <li key={`req-${index}`}>{req}</li>
// // //               ))
// // //             ) : (
// // //               <li>{job.requirements}</li>
// // //             )}
// // //           </ul>
// // //         </>
// // //       )}

// // //       {/* Responsibilities */}
// // //       {job.responsibilities && job.responsibilities.length > 0 && (
// // //         <>
// // //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // //             Responsibilities
// // //           </h2>
// // //           <ul className="list-disc list-inside space-y-1 pl-4">
// // //             {Array.isArray(job.responsibilities) ? (
// // //               job.responsibilities.map((resp, index) => (
// // //                 <li key={`resp-${index}`}>{resp}</li>
// // //               ))
// // //             ) : (
// // //               <li>{job.responsibilities}</li>
// // //             )}
// // //           </ul>
// // //         </>
// // //       )}

// // //       {/* Resume Selection Modal */}
// // //       {isResumeModalOpen && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// // //             <h2 className="text-xl font-semibold mb-4">Select a Resume</h2>
// // //             {isResumesLoading ? (
// // //               <p>Loading resumes...</p>
// // //             ) : resumes.length === 0 ? (
// // //               <p>No resumes available. Please upload a resume first.</p>
// // //             ) : (
// // //               <div className="space-y-2">
// // //                 {resumes.map((resume) => (
// // //                   <div key={resume.id} className="flex items-center">
// // //                     <input
// // //                       type="radio"
// // //                       name="resume"
// // //                       value={resume.id}
// // //                       checked={selectedResumeId === resume.id}
// // //                       onChange={() => setSelectedResumeId(resume.id)}
// // //                       className="mr-2"
// // //                     />
// // //                     <label>{resume.file_name}</label>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //             <div className="flex justify-end space-x-4 mt-6">
// // //               <button
// // //                 onClick={closeResumeModal}
// // //                 className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleApplyJob}
// // //                 disabled={!selectedResumeId || isApplying}
// // //                 className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded ${
// // //                   !selectedResumeId || isApplying
// // //                     ? "opacity-50 cursor-not-allowed"
// // //                     : ""
// // //                 }`}
// // //               >
// // //                 {isApplying ? "Submitting..." : "Submit Application"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default JobDetails;

// // // // import React, { useState } from "react";
// // // // // import {
// // // // //   useSaveJobMutation,
// // // // //   useApplyJobMutation,
// // // // //   useGetResumesQuery,
// // // // // } from "../../redux/api/jobApi";
// // // // // import {
// // // // //   useSaveJobMutation,
// // // // //   useApplyJobMutation,
// // // // //   useGetResumesQuery,
// // // // // } from "../../redux/api/jobseekerApi";
// // // // import {
// // // //   useSaveJobMutation,
// // // //   useJobApplicationMutation,
// // // // } from "../../redux/api/userApi";

// // // // import coverImg from "../../assets/utils/B.png";
// // // // import { toast } from "react-toastify"; // Optional for notifications

// // // // const JobDetails = ({ job }) => {
// // // //   const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
// // // //   const [selectedResumeId, setSelectedResumeId] = useState(null);

// // // //   // RTK Query hooks
// // // //   const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
// // // //   const [jobApplication, { isLoading: isApplying }] =
// // // //     useJobApplicationMutation();
// // // //   const { data: resumes = [], isLoading: isResumesLoading } =
// // // //     useGetResumesQuery();

// // // //   // Handle Save Job
// // // //   const handleSaveJob = async () => {
// // // //     if (!job?.id) return;
// // // //     try {
// // // //       await saveJob(job.id).unwrap();
// // // //       toast.success("Job saved successfully!");
// // // //     } catch (error) {
// // // //       if (error.status === 204) {
// // // //         toast.info("Job already saved.");
// // // //       } else {
// // // //         toast.error(error.data?.message || "Failed to save job.");
// // // //       }
// // // //     }
// // // //   };

// // // //   // Handle Apply Job
// // // //   const handleApplyJob = async () => {
// // // //     if (!job?.id) return;
// // // //     if (!selectedResumeId) {
// // // //       toast.error("Please select a resume to apply.");
// // // //       return;
// // // //     }
// // // //     try {
// // // //       await jobApplication({
// // // //         jobId: job.id,
// // // //         resumeId: selectedResumeId,
// // // //       }).unwrap();
// // // //       toast.success("Application submitted successfully!");
// // // //       setIsResumeModalOpen(false);
// // // //       setSelectedResumeId(null);
// // // //     } catch (error) {
// // // //       if (error.status === 400 && error.data?.message === "Already applied") {
// // // //         toast.info("You have already applied to this job.");
// // // //       } else {
// // // //         toast.error(error.data?.message || "Failed to apply.");
// // // //       }
// // // //     }
// // // //   };

// // // //   // Open/Close Resume Modal
// // // //   const openResumeModal = () => {
// // // //     if (resumes.length === 0) {
// // // //       toast.info("No resumes found. Please upload a resume first.");
// // // //       return;
// // // //     }
// // // //     setIsResumeModalOpen(true);
// // // //   };
// // // //   const closeResumeModal = () => {
// // // //     setIsResumeModalOpen(false);
// // // //     setSelectedResumeId(null);
// // // //   };

// // // //   // Initial state when no job is selected
// // // //   if (!job) {
// // // //     return (
// // // //       <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
// // // //         <h2 className="text-xl font-semibold">Select a job to view details</h2>
// // // //         <p className="mt-2 text-gray-500">
// // // //           Or create a new job using the button above!
// // // //         </p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="p-6 m-2 rounded-lg shadow overflow-y-auto h-screen">
// // // //       {/* Job Image */}
// // // //       {job.post_image_url ? (
// // // //         <img
// // // //           src={job.post_image_url}
// // // //           alt={job.title}
// // // //           className="w-full h-48 object-cover rounded-md mb-4"
// // // //         />
// // // //       ) : (
// // // //         <img
// // // //           src={coverImg}
// // // //           alt="Default cover"
// // // //           className="w-full h-48 object-cover object-top rounded-md mb-4 dark:invert-100"
// // // //         />
// // // //       )}

// // // //       <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
// // // //       <p className="text-sm mb-1">
// // // //         <strong>Location:</strong> {job.location || "N/A"}
// // // //       </p>
// // // //       {job.address && (
// // // //         <p className="text-sm mb-1">
// // // //           <strong>Address:</strong> {job.address}
// // // //         </p>
// // // //       )}
// // // //       <p className="text-sm mb-1">
// // // //         <strong>Type:</strong> {job.employment_type}
// // // //       </p>
// // // //       {(job.salary_min || job.salary_max) && (
// // // //         <p className="text-sm mb-1">
// // // //           <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
// // // //           {job.salary_max || "N/A"}
// // // //         </p>
// // // //       )}
// // // //       {job.application_deadline && (
// // // //         <p className="text-sm text-red-600 mb-4">
// // // //           <strong>Apply by:</strong>{" "}
// // // //           {new Date(job.application_deadline).toLocaleDateString()}
// // // //         </p>
// // // //       )}

// // // //       {/* Action Buttons */}
// // // //       <div className="flex space-x-4 mb-4">
// // // //         <button
// // // //           onClick={handleSaveJob}
// // // //           disabled={isSaving}
// // // //           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
// // // //             isSaving ? "opacity-50 cursor-not-allowed" : ""
// // // //           }`}
// // // //         >
// // // //           {isSaving ? "Saving..." : "Save Job"}
// // // //         </button>
// // // //         <button
// // // //           onClick={openResumeModal}
// // // //           disabled={isApplying}
// // // //           className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ${
// // // //             isApplying ? "opacity-50 cursor-not-allowed" : ""
// // // //           }`}
// // // //         >
// // // //           {isApplying ? "Applying..." : "Apply Now"}
// // // //         </button>
// // // //       </div>

// // // //       <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // // //         Description
// // // //       </h2>
// // // //       <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

// // // //       {/* Requirements */}
// // // //       {job.requirements && job.requirements.length > 0 && (
// // // //         <>
// // // //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // // //             Requirements
// // // //           </h2>
// // // //           <ul className="list-disc list-inside space-y-1 pl-4">
// // // //             {Array.isArray(job.requirements) ? (
// // // //               job.requirements.map((req, index) => (
// // // //                 <li key={`req-${index}`}>{req}</li>
// // // //               ))
// // // //             ) : (
// // // //               <li>{job.requirements}</li>
// // // //             )}
// // // //           </ul>
// // // //         </>
// // // //       )}

// // // //       {/* Responsibilities */}
// // // //       {job.responsibilities && job.responsibilities.length > 0 && (
// // // //         <>
// // // //           <h2 className="text-lg font-semibold mt-4 mb-2 border-t pt-3">
// // // //             Responsibilities
// // // //           </h2>
// // // //           <ul className="list-disc list-inside space-y-1 pl-4">
// // // //             {Array.isArray(job.responsibilities) ? (
// // // //               job.responsibilities.map((resp, index) => (
// // // //                 <li key={`resp-${index}`}>{resp}</li>
// // // //               ))
// // // //             ) : (
// // // //               <li>{job.responsibilities}</li>
// // // //             )}
// // // //           </ul>
// // // //         </>
// // // //       )}

// // // //       {/* Resume Selection Modal */}
// // // //       {isResumeModalOpen && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // // //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
// // // //             <h2 className="text-xl font-semibold mb-4">Select a Resume</h2>
// // // //             {isResumesLoading ? (
// // // //               <p>Loading resumes...</p>
// // // //             ) : resumes.length === 0 ? (
// // // //               <p>No resumes available. Please upload a resume first.</p>
// // // //             ) : (
// // // //               <div className="space-y-2">
// // // //                 {resumes.map((resume) => (
// // // //                   <div key={resume.id} className="flex items-center">
// // // //                     <input
// // // //                       type="radio"
// // // //                       name="resume"
// // // //                       value={resume.id}
// // // //                       checked={selectedResumeId === resume.id}
// // // //                       onChange={() => setSelectedResumeId(resume.id)}
// // // //                       className="mr-2"
// // // //                     />
// // // //                     <label>{resume.file_name}</label>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //             <div className="flex justify-end space-x-4 mt-6">
// // // //               <button
// // // //                 onClick={closeResumeModal}
// // // //                 className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //               <button
// // // //                 onClick={handleApplyJob}
// // // //                 disabled={!selectedResumeId || isApplying}
// // // //                 className={`bg-teal-500 hover:bg-teal-700 text-white py-2 px-4 rounded ${
// // // //                   !selectedResumeId || isApplying
// // // //                     ? "opacity-50 cursor-not-allowed"
// // // //                     : ""
// // // //                 }`}
// // // //               >
// // // //                 {isApplying ? "Submitting..." : "Submit Application"}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default JobDetails;
