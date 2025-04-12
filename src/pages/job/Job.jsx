import React, { useState } from "react"; // Import useState
import { useDispatch, useSelector } from "react-redux";
import coverImg from "../../assets/utils/A.png"; // Adjust path if needed

// Import RTK Query hooks (assuming jobApi.js is correctly set up)
import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
import { selectJob } from "../../redux/slice/jobSlice";

// Import the sidebar component
import CreateNewJob from "../dashboard/employer/CreateNewJob";

const Job = () => {
  const dispatch = useDispatch();
  const selectedJobId = useSelector((state) => state.slice.job.selectedJobId);

  // State for managing the sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // RTK Query hooks for fetching data
  const {
    data: jobs = [],
    isLoading: isJobListLoading,
    error: jobListError,
  } = useGetJobsQuery(null); // Default jobs to empty array

  const {
    data: jobDetails,
    isLoading: isJobDetailsLoading,
    error: jobDetailsError,
  } = useGetJobByIdQuery(selectedJobId, { skip: !selectedJobId });

  // Functions to control sidebar
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const viewJobDetails = (id) => {
    dispatch(selectJob(id));
  };

  // --- Loading and Error States Handling ---
  if (isJobListLoading)
    return <p className="p-4 text-center">Loading Job List...</p>;

  // if (isJobDetailsLoading)
  //   return <p className="p-4 text-center">Loading JobDetails...</p>;

  if (jobListError)
    return (
      <p className="p-4 text-center text-red-500">
        Error loading jobs: {jobListError.toString()}
      </p>
    );
  // Note: jobs is defaulted to [] above, so no need for !jobs check

  return (
    <div className="min-h-screen">
      {/* Header Area with Create Button */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Job Postings</h1>
        <button
          onClick={openSidebar}
          className="bg-teal-500 hover:bg-teal-700 font-bold py-2 px-4 rounded"
        >
          Create New Job
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Left Column: Job List */}
        <div className="col-span-1 border-r border-gray-300">
          <JobLists
            jobs={jobs.data} // Pass the jobs array directly
            onJobSelect={viewJobDetails}
            selectedJobId={selectedJobId}
          />
        </div>

        {/* Right Column: Job Details */}
        <div className="col-span-1 md:col-span-2">
          {/* Handle loading/error state for job details specifically */}
          {selectedJobId && isJobDetailsLoading ? (
            <p className="p-4 text-center">Loading Job Details...</p>
          ) : selectedJobId && jobDetailsError ? (
            <p className="p-4 text-center text-red-500">
              Error loading job details.
            </p>
          ) : (
            <JobDetails
              coverImg={coverImg}
              job={jobDetails?.data} // Pass the fetched job details
            />
          )}
        </div>
      </div>

      {/* Render the Sidebar (conditionally) */}
      <CreateNewJob isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default Job;

// --- JobLists Component --- (Minor update for clarity)
const JobLists = ({ jobs, onJobSelect, selectedJobId }) => {
  if (!jobs || jobs.length === 0) {
    return <p className="p-4">No jobs found.</p>;
  }

  return (
    // Consider fixed height for scroll if needed, or let parent handle layout
    <div className="h-screen overflow-y-auto scrollbar-hide border-r border-gray-200 ">
      {jobs.map((job) => (
        // Using div instead of button for better structure, apply onClick to div
        <div
          key={job.id}
          onClick={() => onJobSelect(job.id)} // Apply onClick here
          className={`p-4 m-2 rounded-md border cursor-pointer transition-colors duration-150 ease-in-out
                        ${
                          selectedJobId === job.id
                            ? " border-teal-400"
                            : " border-gray-200  hover:border-gray-300 bg-white text-blue-900 dark:bg-cyan-900 dark:text-white"
                        }`}
        >
          <p className="font-semibold ">{job.title}</p>
          <p className="text-sm ">
            {job.employment_type} - {job.location || "N/A"}
          </p>
          {(job.salary_min || job.salary_max) && ( // Show salary only if available
            <p className="text-sm text-green-500 mt-1">
              ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// --- JobDetails Component --- (Updated to show requirements/responsibilities)
const JobDetails = ({ coverImg, job }) => {
  // Initial state when no job is selected
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700">
          Select a job to view details
        </h2>
        <p className="mt-2 text-gray-500">
          Or create a new job using the button above!
        </p>
        {/* You can place ads or other content here */}
      </div>
    );
  }

  // Display selected job details
  return (
    <div className="p-6 m-2  rounded-lg shadow overflow-y-auto h-screen">
      {/* Display job image if available */}
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
          className="w-full h-48 object-cover object-top  rounded-md mb-4 dark:invert-100"
          // className="w-full h-48 object-cover rounded-md mb-4 dark:invert-100"
        /> // Fallback image
      )}

      <h1 className="text-2xl font-bold  mb-2">{job.title}</h1>
      <p className="text-sm  mb-1">
        <strong>Location:</strong> {job.location || "N/A"}
      </p>
      {job.address && (
        <p className="text-sm  mb-1">
          <strong>Address:</strong> {job.address}
        </p>
      )}
      <p className="text-sm  mb-1">
        <strong>Type:</strong> {job.employment_type}
      </p>
      {(job.salary_min || job.salary_max) && (
        <p className="text-sm  mb-1">
          <strong>Salary:</strong> ${job.salary_min || "N/A"} - $
          {job.salary_max || "N/A"}
        </p>
      )}
      {job.application_deadline && (
        <p className="text-sm text-red-600 mb-4">
          <strong>Apply by:</strong>{" "}
          {new Date(job.application_deadline).toLocaleDateString()}
        </p>
      )}

      <h2 className="text-lg font-semibold  mt-4 mb-2 border-t pt-3">
        Description
      </h2>
      {/* Use whitespace-pre-wrap to respect formatting from backend */}
      <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

      {/* Display Requirements (Assuming they are fetched with job details) */}
      {job.requirements && job.requirements.length > 0 && (
        <>
          <h2 className="text-lg font-semibold  mt-4 mb-2 border-t pt-3">
            Requirements
          </h2>
          <ul className="list-disc list-inside space-y-1 pl-4">
            {/* Check if requirements is an array, otherwise show raw data for debugging */}
            {Array.isArray(job.requirements) ? (
              job.requirements.map((req, index) => (
                <li key={`req-${index}`}>{req}</li>
              ))
            ) : (
              <li>{job.requirements}</li> // Fallback if not an array
            )}
          </ul>
        </>
      )}

      {/* Display Responsibilities (Assuming they are fetched with job details) */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <>
          <h2 className="text-lg font-semibold  mt-4 mb-2 border-t pt-3">
            Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-1  pl-4">
            {/* Check if responsibilities is an array */}
            {Array.isArray(job.responsibilities) ? (
              job.responsibilities.map((resp, index) => (
                <li key={`resp-${index}`}>{resp}</li>
              ))
            ) : (
              <li>{job.responsibilities}</li> // Fallback if not an array
            )}
          </ul>
        </>
      )}
    </div>
  );
};

// same version before edit it.
// import React, { useState } from "react"; // Import useState
// import { useDispatch, useSelector } from "react-redux";
// import coverImg from "../../assets/utils/A.png"; // Adjust path if needed

// // Import RTK Query hooks (assuming jobApi.js is correctly set up)
// import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
// import { selectJob } from "../../redux/slice/jobSlice";

// // Import the sidebar component
// import CreateNewJob from "../dashboard/employer/CreateNewJob";

// const Job = () => {
//   const dispatch = useDispatch();
//   const selectedJobId = useSelector((state) => state.slice.job.selectedJobId);

//   // State for managing the sidebar visibility
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // RTK Query hooks for fetching data
//   const {
//     data: jobs = [],
//     isLoading: isJobListLoading,
//     error: jobListError,
//   } = useGetJobsQuery(null); // Default jobs to empty array

//   const {
//     data: jobDetails,
//     isLoading: isJobDetailsLoading,
//     error: jobDetailsError,
//   } = useGetJobByIdQuery(selectedJobId, { skip: !selectedJobId });

//   // Functions to control sidebar
//   const openSidebar = () => setIsSidebarOpen(true);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   const viewJobDetails = (id) => {
//     dispatch(selectJob(id));
//   };

//   // --- Loading and Error States Handling ---
//   if (isJobListLoading)
//     return <p className="p-4 text-center">Loading Job List...</p>;

//   // if (isJobDetailsLoading)
//   //   return <p className="p-4 text-center">Loading JobDetails...</p>;

//   if (jobListError)
//     return (
//       <p className="p-4 text-center text-red-500">
//         Error loading jobs: {jobListError.toString()}
//       </p>
//     );
//   // Note: jobs is defaulted to [] above, so no need for !jobs check

//   return (
//     <div className="min-h-screen">
//       {/* Header Area with Create Button */}
//       <div className="p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-semibold">Job Postings</h1>
//         <button
//           onClick={openSidebar}
//           className="bg-teal-500 hover:bg-teal-700 font-bold py-2 px-4 rounded"
//         >
//           Create New Job
//         </button>
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3">
//         {/* Left Column: Job List */}
//         <div className="col-span-1 border-r border-gray-300">
//           <JobLists
//             jobs={jobs.data} // Pass the jobs array directly
//             onJobSelect={viewJobDetails}
//             selectedJobId={selectedJobId}
//           />
//         </div>

//         {/* Right Column: Job Details */}
//         <div className="col-span-1 md:col-span-2">
//           {/* Handle loading/error state for job details specifically */}
//           {selectedJobId && isJobDetailsLoading ? (
//             <p className="p-4 text-center">Loading Job Details...</p>
//           ) : selectedJobId && jobDetailsError ? (
//             <p className="p-4 text-center text-red-500">
//               Error loading job details.
//             </p>
//           ) : (
//             <JobDetails
//               coverImg={coverImg}
//               job={jobDetails?.data} // Pass the fetched job details
//             />
//           )}
//         </div>
//       </div>

//       {/* Render the Sidebar (conditionally) */}
//       <CreateNewJob isOpen={isSidebarOpen} onClose={closeSidebar} />
//     </div>
//   );
// };

// export default Job;

// // --- JobLists Component --- (Minor update for clarity)
// const JobLists = ({ jobs, onJobSelect, selectedJobId }) => {
//   if (!jobs || jobs.length === 0) {
//     return <p className="p-4">No jobs found.</p>;
//   }

//   return (
//     // Consider fixed height for scroll if needed, or let parent handle layout
//     <div className="h-screen overflow-y-auto scrollbar-hide border-r border-gray-200 ">
//       {jobs.map((job) => (
//         // Using div instead of button for better structure, apply onClick to div
//         <div
//           key={job.id}
//           onClick={() => onJobSelect(job.id)} // Apply onClick here
//           className={`p-3 m-2 rounded-md border cursor-pointer transition-colors duration-150 ease-in-out
//                         ${
//                           selectedJobId === job.id
//                             ? "bg-teal-100 border-teal-400"
//                             : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
//                         }`}
//         >
//           <p className="font-semibold text-gray-800">{job.title}</p>
//           <p className="text-sm text-gray-600">
//             {job.employment_type} - {job.location || "N/A"}
//           </p>
//           {(job.salary_min || job.salary_max) && ( // Show salary only if available
//             <p className="text-sm text-green-700 mt-1">
//               ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// // --- JobDetails Component --- (Updated to show requirements/responsibilities)
// const JobDetails = ({ coverImg, job }) => {
//   // Initial state when no job is selected
//   if (!job) {
//     return (
//       <div className="flex flex-col items-center justify-center p-6 m-2 h-full text-center rounded-lg">
//         <h2 className="text-xl font-semibold text-gray-700">
//           Select a job to view details
//         </h2>
//         <p className="mt-2 text-gray-500">
//           Or create a new job using the button above!
//         </p>
//         {/* You can place ads or other content here */}
//       </div>
//     );
//   }

//   // Display selected job details
//   return (
//     <div className="p-6 m-2 bg-white  rounded-lg shadow overflow-y-auto h-screen">
//       {/* Display job image if available */}
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
//           className="w-full h-48 object-cover rounded-md mb-4"
//         /> // Fallback image
//       )}

//       <h1 className="text-2xl font-bold text-teal-700 mb-2">{job.title}</h1>
//       <p className="text-sm text-gray-500 mb-1">
//         <strong>Location:</strong> {job.location || "N/A"}
//       </p>
//       {job.address && (
//         <p className="text-sm text-gray-500 mb-1">
//           <strong>Address:</strong> {job.address}
//         </p>
//       )}
//       <p className="text-sm text-gray-500 mb-1">
//         <strong>Type:</strong> {job.employment_type}
//       </p>
//       {(job.salary_min || job.salary_max) && (
//         <p className="text-sm text-gray-500 mb-1">
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

//       <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2 border-t pt-3">
//         Description
//       </h2>
//       {/* Use whitespace-pre-wrap to respect formatting from backend */}
//       <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

//       {/* Display Requirements (Assuming they are fetched with job details) */}
//       {job.requirements && job.requirements.length > 0 && (
//         <>
//           <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2 border-t pt-3">
//             Requirements
//           </h2>
//           <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
//             {/* Check if requirements is an array, otherwise show raw data for debugging */}
//             {Array.isArray(job.requirements) ? (
//               job.requirements.map((req, index) => (
//                 <li key={`req-${index}`}>{req}</li>
//               ))
//             ) : (
//               <li>{job.requirements}</li> // Fallback if not an array
//             )}
//           </ul>
//         </>
//       )}

//       {/* Display Responsibilities (Assuming they are fetched with job details) */}
//       {job.responsibilities && job.responsibilities.length > 0 && (
//         <>
//           <h2 className="text-lg font-semibold text-gray-800 mt-4 mb-2 border-t pt-3">
//             Responsibilities
//           </h2>
//           <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
//             {/* Check if responsibilities is an array */}
//             {Array.isArray(job.responsibilities) ? (
//               job.responsibilities.map((resp, index) => (
//                 <li key={`resp-${index}`}>{resp}</li>
//               ))
//             ) : (
//               <li>{job.responsibilities}</li> // Fallback if not an array
//             )}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };
