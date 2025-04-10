// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchJobDetails,
//   searchJobs,
//   createSavedJob,
//   fetchSavedJobs,
//   deleteSavedJob,
//   createApplication,
//   fetchApplications,
//   deleteApplication,
// } from "../redux/slice/jobSeekerSlice";
// import {
//   AiFillApple,
//   AiFillCalendar,
//   AiFillCloseCircle,
//   AiFillDislike,
//   AiFillHeart,
//   AiFillLike,
//   AiFillMoneyCollect,
//   AiFillPushpin,
//   AiFillSave,
// } from "react-icons/ai";

// import coverImg from "../assets/utils/Learning.png";

// const SearchJobs = () => {
//   const dispatch = useDispatch();
//   const {
//     searchResults,
//     jobDetails,
//     savedJobs,
//     applications,
//     totalJobs,
//     loading,
//     error,
//   } = useSelector((state) => state.jobSeeker);
//   const { user } = useSelector((state) => state.auth || {});
//   const isJobSeeker = user?.role === "job_seeker";

//   const [filters, setFilters] = useState({
//     title: "",
//     location: "",
//     category: "",
//     employment_type: "",
//     // salary_min: "",
//     // salary_max: "",
//     page: 1,
//     limit: 10,
//   });

//   const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
//   const [showSavedJobs, setShowSavedJobs] = useState(false);
//   const [showApplications, setShowApplications] = useState(false);

//   useEffect(() => {
//     if (isJobSeeker) {
//       dispatch(fetchSavedJobs());
//       dispatch(fetchApplications());
//     }
//     dispatch(searchJobs(filters));
//   }, [dispatch, isJobSeeker]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     dispatch(searchJobs(filters));
//     setIsMobileDetailsOpen(false);
//   };

//   const handleFetchJobDetails = (jobId) => {
//     dispatch(fetchJobDetails(jobId));
//     setIsMobileDetailsOpen(true);
//   };

//   const handleSaveJob = (jobId) => dispatch(createSavedJob(jobId));
//   const handleApply = (jobId) =>
//     dispatch(createApplication({ job_post_id: jobId }));
//   const isJobSaved = (jobId) =>
//     savedJobs.some((savedJob) => savedJob.id === jobId);
//   const handlePageChange = (newPage) => {
//     setFilters((prev) => ({ ...prev, page: newPage }));
//     dispatch(searchJobs({ ...filters, page: newPage }));
//   };

//   const totalPages = Math.ceil(totalJobs / filters.limit);

//   return (
//     <div className="min-h-screen p-2">
//       <div className="max-w-7xl mx-auto">
//         {/* Search Form */}

//         <form
//           onSubmit={handleSearch}
//           // className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8  p-6 rounded-xl shadow-lg"
//           className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8  p-6  shadow-lg"
//         >
//           {[
//             { name: "title", placeholder: "Job Title" },
//             { name: "location", placeholder: "Location" },
//             { name: "category", placeholder: "Category" },
//           ].map((field) => (
//             <input
//               key={field.name}
//               name={field.name}
//               value={filters[field.name]}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               className="p-2 border-b-2 border-b-cyan-900 dark:border-b-white placeholder-cyan-900 dark:placeholder-white
//               focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//             />
//           ))}
//           <select
//             name="employment_type"
//             value={filters.employment_type}
//             onChange={handleChange}
//             className="p-3  bg-cyan-900 text-white dark:text-cyan-900 dark:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//           >
//             <option value="" className="">
//               EMPLOYMENT TYPE
//             </option>
//             {[
//               "full_time",
//               "part_time",
//               "contract",
//               "internship",
//               "apprenticeship",
//             ].map((type) => (
//               <option key={type} value={type} className="">
//                 {type.replace("_", " ").toUpperCase()}
//               </option>
//             ))}
//           </select>
//           {/* <input
//             name="salary_min"
//             value={filters.salary_min}
//             onChange={handleChange}
//             placeholder="Min Salary"
//             type="number"
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//           />
//           <input
//             name="salary_max"
//             value={filters.salary_max}
//             onChange={handleChange}
//             placeholder="Max Salary"
//             type="number"
//             className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
//           /> */}
//           <button
//             type="submit"
//             className="md:col-span-4 p-3 bg-gradient-to-r from-cyan-800 to-cyan-900 text-white rounded-lg hover:from-cyan-900 hover:to-cyan-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//             disabled={loading}
//           >
//             {loading ? "Searching..." : "Find Jobs"}
//           </button>
//         </form>

//         {/* Main Content */}
//         {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//           {/* Job List */}
//           <div className="  lg:col-span-2">
//             <div className="scrollbar-hide rounded-xl shadow-lg p-2 max-h-[70vh] overflow-y-auto ">
//               <JobLists
//                 jobs={searchResults}
//                 handleFetchJobDetails={handleFetchJobDetails}
//                 handleSaveJob={isJobSeeker ? handleSaveJob : null}
//                 isJobSaved={isJobSaved}
//                 isJobSeeker={isJobSeeker}
//               />
//             </div>
//             {totalJobs > 0 && (
//               <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-gray-600 dark:text-gray-300  p-4 rounded-lg shadow">
//                 <span>
//                   Showing {(filters.page - 1) * filters.limit + 1} -{" "}
//                   {Math.min(filters.page * filters.limit, totalJobs)} of{" "}
//                   {totalJobs}
//                 </span>
//                 <div className="flex gap-2 mt-2 sm:mt-0">
//                   <button
//                     onClick={() => handlePageChange(filters.page - 1)}
//                     disabled={filters.page === 1 || loading}
//                     className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition-all duration-300"
//                   >
//                     Prev
//                   </button>
//                   <span className="px-4 py-2">
//                     {filters.page} / {totalPages}
//                   </span>
//                   <button
//                     onClick={() => handlePageChange(filters.page + 1)}
//                     disabled={filters.page >= totalPages || loading}
//                     className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition-all duration-300"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Job Details */}
//           <div className="lg:col-span-3">
//             <div className="scrollbar-hide  rounded-xl shadow-lg p-6 max-h-[70vh] overflow-y-auto hidden lg:block">
//               <JobDetails
//                 job={jobDetails}
//                 handleSaveJob={isJobSeeker ? handleSaveJob : null}
//                 handleApply={isJobSeeker ? handleApply : null}
//                 isJobSaved={isJobSaved}
//                 isJobSeeker={isJobSeeker}
//               />
//             </div>

//             {isMobileDetailsOpen && (
//               <div className="lg:hidden fixed inset-0 bg-cyan-900 text-white z-50 flex items-center justify-center p-1">
//                 <div className="  shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
//                   <button
//                     onClick={() => setIsMobileDetailsOpen(false)}
//                     className="absolute top-4 right-4 text-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
//                   >
//                     <AiFillCloseCircle className="h-10 w-10" />
//                     {/* <svg
//                       className="h-6 w-6"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg> */}
//                   </button>
//                   <JobDetails
//                     job={jobDetails}
//                     handleSaveJob={isJobSeeker ? handleSaveJob : null}
//                     handleApply={isJobSeeker ? handleApply : null}
//                     isJobSaved={isJobSaved}
//                     isJobSeeker={isJobSeeker}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Saved Jobs & Applications */}
//         {isJobSeeker && (
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Saved Jobs */}
//             <div className=" rounded-xl shadow-lg p-6">
//               <button
//                 onClick={() => setShowSavedJobs(!showSavedJobs)}
//                 className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 mb-4"
//               >
//                 {showSavedJobs ? "Hide Saved Jobs" : "Show Saved Jobs"}
//               </button>
//               {showSavedJobs &&
//                 (savedJobs.length === 0 ? (
//                   <p className="">No saved jobs yet.</p>
//                 ) : (
//                   <ul className="space-y-3">
//                     {savedJobs.map((job) => (
//                       <li
//                         key={job.id}
//                         className="flex justify-between items-center p-3  rounded-lg"
//                       >
//                         <span className="text-gray-900 dark:text-white">
//                           {job.title}
//                         </span>
//                         <button
//                           onClick={() => dispatch(deleteSavedJob(job.id))}
//                           className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
//                         >
//                           Remove
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 ))}
//             </div>

//             {/* Applications */}
//             <div className=" rounded-xl shadow-lg p-6">
//               <button
//                 onClick={() => setShowApplications(!showApplications)}
//                 className="w-full p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 mb-4"
//               >
//                 {showApplications ? "Hide Applications" : "Show Applications"}
//               </button>
//               {showApplications &&
//                 (applications.length === 0 ? (
//                   <p className="">No applications yet.</p>
//                 ) : (
//                   <ul className="space-y-3">
//                     {applications.map((app) => (
//                       <li
//                         key={app.id}
//                         className="flex justify-between items-center p-3  rounded-lg"
//                       >
//                         <span className="">
//                           {app.title} - {app.status}
//                         </span>
//                         <button
//                           onClick={() => dispatch(deleteApplication(app.id))}
//                           className="p-2  bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
//                         >
//                           Cancel
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchJobs;

// // const JobLists = ({
// //   jobs,
// //   handleFetchJobDetails,
// //   handleSaveJob,
// //   isJobSaved,
// //   isJobSeeker,
// // }) => {
// //   if (!jobs || jobs.length === 0) {
// //     return (
// //       <div className="p-4 text-gray-500 dark:text-gray-400">
// //         No jobs available.
// //       </div>
// //     );
// //   }

// //   return (
// //     <ul className="space-y-4">
// //       {jobs.map((job) => (
// //         <li
// //           key={job.id}
// //           className="p-4 ring-2 hover:bg-cyan-900 hover:text-white dark:hover:bg-white dark:hover:text-cyan-900 rounded-md transition-all duration-300"
// //         >
// //           {/* Job Details Section */}
// //           <button
// //             className="flex-1 text-left w-full"
// //             onClick={() => handleFetchJobDetails(job.id)}
// //           >
// //             <div className="flex justify-between items-center border-b-2">
// //               <h4 className="font-semibold text-lg p-2 text-amber-300">
// //                 {job.title}
// //               </h4>
// //               <div>
// //                 {isJobSeeker && (
// //                   <button
// //                     onClick={() => handleSaveJob(job.id)}
// //                     className={` p-2 rounded-lg  transition-all duration-300 ${
// //                       isJobSaved(job.id)
// //                         ? "bg-cyan-200 cexitexiursor-not-allowed"
// //                         : "dark:bg-white bg-blue-600 text-white dark:text-cyan-400 hover:bg-cyan-600"
// //                     }`}
// //                     disabled={isJobSaved(job.id)}
// //                   >
// //                     {isJobSaved(job.id) ? <AiFillSave /> : <AiFillHeart />}
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //             <p className="p-1">{job.company_name || "Unknown Company"}</p>
// //             <p className="p-1">
// //               Category: {job.category || "Unknown Category"}
// //             </p>
// //             <p className="p-1">Location: {job.location || "N/A"}</p>
// //             <p className="p-1">Type: {job.employment_type}</p>
// //             <p className="p-1">
// //               Salary: ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
// //             </p>
// //           </button>
// //         </li>
// //       ))}
// //     </ul>
// //   );
// // };

// const JobLists = ({
//   jobs,
//   handleFetchJobDetails,
//   handleSaveJob,
//   isJobSaved,
//   isJobSeeker,
// }) => {
//   if (!jobs || jobs.length === 0) {
//     return (
//       <div className="p-4 text-gray-500 dark:text-gray-400">
//         No jobs available.
//       </div>
//     );
//   }

//   return (
//     <ul className="space-y-4">
//       {jobs.map((job) => (
//         <li
//           key={job.id}
//           className="p-4 ring-2 hover:bg-cyan-900 hover:text-white dark:hover:bg-white dark:hover:text-cyan-900 rounded-md transition-all duration-300"
//         >
//           {/* Replace button with div */}
//           <div
//             className="flex-1 text-left w-full cursor-pointer"
//             onClick={() => handleFetchJobDetails(job.id)}
//           >
//             <div className="flex justify-between items-center border-b-2">
//               <h4 className="font-semibold text-lg p-2 text-amber-300">
//                 {job.title}
//               </h4>
//               <div>
//                 {isJobSeeker && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent click from bubbling to the div
//                       handleSaveJob(job.id);
//                     }}
//                     className={`p-2 rounded-lg transition-all duration-300 ${
//                       isJobSaved(job.id)
//                         ? "bg-cyan-200 cursor-not-allowed" // Fixed typo from "cexitexiursor-not-allowed"
//                         : "dark:bg-white bg-blue-600 text-white dark:text-cyan-400 hover:bg-cyan-600"
//                     }`}
//                     disabled={isJobSaved(job.id)}
//                   >
//                     {isJobSaved(job.id) ? <AiFillSave /> : <AiFillHeart />}
//                   </button>
//                 )}
//               </div>
//             </div>
//             <p className="p-1">{job.company_name || "Unknown Company"}</p>
//             <p className="p-1">
//               Category: {job.category || "Unknown Category"}
//             </p>
//             <p className="p-1">Location: {job.location || "N/A"}</p>
//             <p className="p-1">Type: {job.employment_type}</p>
//             <p className="p-1">
//               Salary: ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
//             </p>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// const JobDetails = ({
//   job,
//   handleSaveJob,
//   handleApply,
//   isJobSaved,
//   isJobSeeker,
// }) => {
//   if (!job) {
//     return (
//       <div className="p-6 ">
//         <h1>Select a job to view details.</h1>
//         <p>Later This space will show ads display</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <img src={coverImg} alt="coverImage" className="w-full h-100 bg-cover " />
//       <div>
//         <div className="flex justify-between items-center">
//           <h2 className="text-3xl font-bold  bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
//             {job.title}
//           </h2>
//           <AiFillApple className="h-10 w-10" />
//           {/* <span className="text-amber-400">So</span> */}
//         </div>
//         <p className=" mt-1">
//           {job.company_name || "N/A: Company Nale Not Available"}
//         </p>
//       </div>
//       {isJobSeeker && (
//         <div className="flex gap-4">
//           <button
//             onClick={() => handleSaveJob(job.id)}
//             className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
//               isJobSaved(job.id)
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-yellow-500 hover:bg-yellow-600"
//             }`}
//             disabled={isJobSaved(job.id)}
//           >
//             {isJobSaved(job.id) ? "Saved" : "Save Job"}
//           </button>
//           <button
//             onClick={() => handleApply(job.id)}
//             className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
//           >
//             Apply Now
//           </button>
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
//         <p>
//           <AiFillPushpin />
//           <span className="">{job.location || "N/A"}</span>
//         </p>
//         <p>
//           {/* <strong className="">Type:</strong>{" "} */}
//           <AiFillPushpin />
//           <span className="">{job.employment_type || "N/A"}</span>
//         </p>
//         <p>
//           <AiFillMoneyCollect />
//           {/* <strong className="">Salary:</strong>{" "} */}
//           <span className="">
//             ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
//           </span>
//         </p>
//         <p>
//           {/* <strong className="">Posted:</strong>{" "} */}
//           <AiFillCalendar />
//           <span className="">
//             {new Date(job.posted_at).toLocaleDateString()}
//           </span>
//         </p>
//       </div>

//       <div className="">
//         <h3 className="text-xl font-semibold text-amber-400  mb-2">
//           Description
//         </h3>
//         <p className="">{job.description || "No description available"}</p>
//       </div>

//       <div>
//         <h3 className="text-xl font-semibold  mb-2 text-amber-400">
//           Requirements
//         </h3>
//         <ul className="list-disc pl-5 space-y-1 ">
//           {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
//             job.requirements.map((req, index) => <li key={index}>{req}</li>)
//           ) : (
//             <li>No requirements listed</li>
//           )}
//         </ul>
//       </div>

//       <div>
//         <h3 className="text-xl font-semibold text-amber-400 mb-2">
//           Responsibilities
//         </h3>
//         <ul className="list-disc pl-5 space-y-1 ">
//           {Array.isArray(job.responsibilities) &&
//           job.responsibilities.length > 0 ? (
//             job.responsibilities.map((resp, index) => (
//               <li key={index}>{resp}</li>
//             ))
//           ) : (
//             <li>No responsibilities listed</li>
//           )}
//         </ul>
//       </div>

//       {/* {isJobSeeker && (
//         <div className="flex gap-4">
//           <button
//             onClick={() => handleSaveJob(job.id)}
//             className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
//               isJobSaved(job.id)
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-yellow-500 hover:bg-yellow-600"
//             }`}
//             disabled={isJobSaved(job.id)}
//           >
//             {isJobSaved(job.id) ? "Saved" : "Save Job"}
//           </button>
//           <button
//             onClick={() => handleApply(job.id)}
//             className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
//           >
//             Apply Now
//           </button>
//         </div>
//       )} */}
//     </div>
//   );
// };
