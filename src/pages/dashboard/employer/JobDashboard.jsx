import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  useGetAppliedJobsQuery,
  useGetAppliedUserProfileByIdQuery,
  useGetAppliedUserResumeByIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../../redux/api/employerApi";
import CreateNewJobSidebar from "./CreateNewJob";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const JobDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
        <button
          onClick={openSidebar}
          className="bg-cyan-600 hover:bg-cyan-700 transition text-white font-semibold p-2 rounded-lg shadow-md"
        >
          + Create New Job
        </button>
      </div>
      <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <JobUpdateStatus />
    </div>
  );
};

export default JobDashboard;

// --- Applied Jobs Section ---

const JobUpdateStatus = () => {
  const {
    data: getAppliedJobs,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAppliedJobsQuery({ page: 1, limit: 10 });

  const [
    updateApplicationStatus,
    { isLoading: isUpdatingStatus, isError: isUpdateError, error: updateError },
  ] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus({
        id: applicationId,
        statusData: { status: newStatus },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  if (isError) {
    return (
      <div className="text-red-500 text-lg">
        Error: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-gray-600 text-lg">Loading applied jobs...</div>;
  }

  if (!getAppliedJobs?.data?.length) {
    return <div className="text-gray-600 text-lg">No applied jobs found.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-700">
        Applied Jobs
      </h2>

      {getAppliedJobs.data.map((job) => (
        <div
          key={job.id}
          className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div className="border-b pb-4">
            <h3 className="text-2xl font-semibold text-green-600">
              {job.title}
            </h3>
            <p className="text-gray-700">{job.description}</p>
            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <p>
                <strong>Category:</strong> {job.category || "N/A"}
              </p>
              <p>
                <strong>Employment:</strong> {job.employment_type || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {job.location || "N/A"}
              </p>
              <p>
                <strong>Salary:</strong>{" "}
                {job.salary_min
                  ? `${job.salary_min} - ${job.salary_max}`
                  : "N/A"}
              </p>
              <p>
                <strong>Deadline:</strong>{" "}
                {job.application_deadline
                  ? new Date(job.application_deadline).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-pink-500">
                <strong>Total Applications:</strong>{" "}
                {job.application_count ?? 0}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {job.application_count === 0 ? (
              <div className="bg-yellow-100 p-4 rounded text-yellow-800">
                No applications yet.
              </div>
            ) : (
              job.applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  handleStatusChange={handleStatusChange}
                  isLoading={isUpdatingStatus}
                  error={isUpdateError ? updateError : null}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Individual Application Card ---

const ApplicationCard = ({
  application,
  handleStatusChange,
  isLoading,
  error,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const {
    data: userProfile,
    isLoading: loadingProfile,
    isError: profileError,
  } = useGetAppliedUserProfileByIdQuery(application.user_id, {
    skip: !showProfile,
  });

  const {
    data: userResume,
    isLoading: loadingResume,
    isError: resumeError,
  } = useGetAppliedUserResumeByIdQuery(application.resume_id, {
    skip: !showResume || !application.resume_id,
  });

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-3">
      <div className="space-y-1 text-gray-700">
        <p>
          <strong>Application ID:</strong> {application.id}
        </p>
        <p>
          <strong>User ID:</strong> {application.user_id || "N/A"}
        </p>
        <p>
          <strong>Applied At:</strong>{" "}
          {new Date(application.applied_at).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {application.status}
        </p>
        <p>
          <strong>Last Update:</strong>{" "}
          {new Date(application.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4">
        <select
          value={application.status || "pending"}
          onChange={(e) => handleStatusChange(application.id, e.target.value)}
          disabled={isLoading}
          className="border border-gray-300 p-2 rounded text-gray-700 bg-white"
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="interviewed">Interviewed</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
          <option value="withdrawn">Withdrawn</option>
        </select>

        {error && (
          <p className="text-red-500 text-sm mt-1">
            Failed to update: {error?.data?.message}
          </p>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mt-3">
        <button
          onClick={() => setShowProfile((prev) => !prev)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded transition"
        >
          {showProfile ? "Hide Profile" : "View Profile"}
        </button>

        <button
          onClick={() => setShowResume((prev) => !prev)}
          disabled={!application.resume_id}
          className={`py-2 px-4 rounded transition text-white ${
            application.resume_id
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {showResume ? "Hide Resume" : "Show Resume"}
        </button>
      </div>

      {showProfile && (
        <div className="p-4 bg-white rounded-lg shadow-inner mt-2">
          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : profileError ? (
            <p className="text-red-500">Error loading profile</p>
          ) : (
            <div>
              <p>
                <strong>First Name:</strong>{" "}
                {userProfile?.data?.first_name || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                {userProfile?.data?.last_name || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {userProfile?.data?.phone || "N/A"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {userProfile?.data?.location || "N/A"}
              </p>
              <p>
                <strong>Bio:</strong> {userProfile?.data?.bio || "N/A"}
              </p>
            </div>
          )}
        </div>
      )}

      {showResume && application.resume_id && (
        <div className="mt-2 p-4 bg-white rounded-lg">
          {loadingResume ? (
            <p>Loading resume...</p>
          ) : resumeError ? (
            <p className="text-red-500">Error loading resume</p>
          ) : (
            <Document
              file={userResume}
              onLoadError={(error) => console.error(error)}
            >
              <Page pageNumber={1} width={400} />
            </Document>
          )}
        </div>
      )}
    </div>
  );
};

// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import {
//   useGetAppliedJobsQuery,
//   useGetAppliedUserProfileByIdQuery,
//   useGetAppliedUserResumeByIdQuery,
//   useUpdateApplicationStatusMutation,
// } from "../../../redux/api/employerApi";
// import CreateNewJobSidebar from "./CreateNewJob";

// import "react-pdf/dist/Page/AnnotationLayer.css";
// import "react-pdf/dist/Page/TextLayer.css";

// // Set workerSrc for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const JobDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const openSidebar = () => setIsSidebarOpen(true);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   return (
//     <div>
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Job Management</h1>
//         <button
//           onClick={openSidebar}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Create New Job Posting
//         </button>
//         <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
//       </div>
//       <JobUpdateStatus />
//     </div>
//   );
// };

// export default JobDashboard;

// const JobUpdateStatus = () => {
//   const {
//     data: getAppliedJobs,
//     isLoading: isGetAppliedJobLoading,
//     isError: isGetAppliedJobError,
//     error: getAppliedJobError,
//     refetch: refetchAppliedJobs,
//   } = useGetAppliedJobsQuery({ page: 1, limit: 10 });

//   const [
//     updateApplicationStatus,
//     {
//       isLoading: isUpdateApplicationStatusLoading,
//       isError: isUpdateApplicationStatusError,
//       error: errorUpdateApplicationStatus,
//     },
//   ] = useUpdateApplicationStatusMutation();

//   const handleStatusChange = async (applicationId, newStatus) => {
//     try {
//       await updateApplicationStatus({
//         id: applicationId,
//         statusData: { status: newStatus },
//       }).unwrap();
//       refetchAppliedJobs();
//       console.log("Status updated for application:", applicationId);
//     } catch (err) {
//       console.error("Failed to update status:", err);
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   return (
//     <div className="p-2 m-1">
//       {isGetAppliedJobError ? (
//         <div className="text-red-500">
//           <h1>
//             Error fetching applied jobs:{" "}
//             {getAppliedJobError?.data?.message || "Unknown error"}
//           </h1>
//         </div>
//       ) : isGetAppliedJobLoading ? (
//         <div>
//           <h1>Loading...</h1>
//         </div>
//       ) : !getAppliedJobs?.data?.length ? (
//         <div>
//           <h1>No applied jobs found.</h1>
//         </div>
//       ) : (
//         <div>
//           <h1 className="text-2xl font-semibold mb-4">Applied Jobs</h1>
//           {getAppliedJobs.data.map((job) => (
//             <div key={job.id} className="m-1 p-2 border rounded">
//               <div className="text-green-500">
//                 <p className="text-2xl underline">{job.title}</p>
//                 <p>{job.description}</p>
//                 <p>
//                   <strong>Category:</strong> {job.category || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Employment Type:</strong>{" "}
//                   {job.employment_type || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Location:</strong> {job.location || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Salary:</strong>{" "}
//                   {job.salary_min
//                     ? `${job.salary_min} - ${job.salary_max}`
//                     : "N/A"}
//                 </p>
//                 <div className="mt-2">
//                   <div className="text-pink-500">
//                     <strong>Total Applications:</strong>{" "}
//                     {job.application_count ?? 0}
//                   </div>
//                   <div className="text-red-600">
//                     <strong>Deadline:</strong>{" "}
//                     {job.application_deadline
//                       ? new Date(job.application_deadline).toLocaleDateString()
//                       : "N/A"}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 {job.application_count === 0 ? (
//                   <div className="bg-yellow-100 p-2 m-1 rounded">
//                     <h1>No applications for this post yet.</h1>
//                   </div>
//                 ) : (
//                   <div>
//                     <h2 className="text-lg font-medium mt-4">
//                       Applications Received:
//                     </h2>
//                     {job.applications.map((app) => (
//                       <ApplicationCard
//                         key={app.id}
//                         application={app}
//                         handleStatusChange={handleStatusChange}
//                         isLoading={isUpdateApplicationStatusLoading}
//                         error={
//                           isUpdateApplicationStatusError
//                             ? errorUpdateApplicationStatus
//                             : null
//                         }
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ApplicationCard = ({
//   application,
//   handleStatusChange,
//   isLoading,
//   error,
// }) => {
//   const [showProfile, setShowProfile] = useState(false);
//   const [showResume, setShowResume] = useState(false);

//   const {
//     data: userProfile,
//     isLoading: isProfileLoading,
//     isError: isProfileError,
//     error: profileError,
//   } = useGetAppliedUserProfileByIdQuery(application.user_id, {
//     skip: !showProfile,
//   });

//   const {
//     data: userResumeResponse,
//     isLoading: isResumeLoading,
//     isError: isResumeError,
//     error: resumeError,
//   } = useGetAppliedUserResumeByIdQuery(application.resume_id, {
//     skip: !showResume || !application.resume_id,
//   });

//   return (
//     <div className="bg-white p-2 m-1 rounded shadow">
//       <div>
//         <p>
//           <strong>Application ID:</strong> {application.id}
//         </p>
//         <p>
//           <strong>User ID:</strong> {application.user_id || "N/A"}
//         </p>
//         <p>
//           <strong>Applied At:</strong>{" "}
//           {new Date(application.applied_at).toLocaleString() || "N/A"}
//         </p>
//         <p>
//           <strong>Resume ID:</strong> {application.resume_id || "N/A"}
//         </p>
//         <p>
//           <strong>Status:</strong> {application.status || "N/A"}
//         </p>
//         <p>
//           <strong>Status Updated At:</strong>{" "}
//           {new Date(application.updated_at).toLocaleString() || "N/A"}
//         </p>

//         <div className="my-2">
//           <label className="block text-sm font-medium">
//             Change Application Status:
//           </label>
//           <select
//             value={application.status || "pending"}
//             onChange={(e) => handleStatusChange(application.id, e.target.value)}
//             disabled={isLoading}
//             className="bg-white border rounded p-2 mt-1 text-black"
//           >
//             <option value="pending">Pending</option>
//             <option value="reviewed">Reviewed</option>
//             <option value="interviewed">Interview</option>
//             <option value="offered">Offered</option>
//             <option value="rejected">Rejected</option>
//             <option value="withdrawn">Withdrawn</option>
//           </select>
//           {error && (
//             <p className="text-red-500 text-sm mt-1">
//               Failed to update status: {error?.data?.message || "Unknown error"}
//             </p>
//           )}
//         </div>

//         <button
//           onClick={() => setShowProfile((prev) => !prev)}
//           className="bg-yellow-500 text-white p-2 mt-2 rounded hover:bg-yellow-600"
//         >
//           {showProfile ? "Hide Profile" : "View Profile"}
//         </button>
//         <button
//           onClick={() => setShowResume((prev) => !prev)}
//           disabled={!application.resume_id}
//           className={`p-2 m-1 rounded text-white ${
//             application.resume_id
//               ? "bg-green-500 hover:bg-green-600"
//               : "bg-gray-400 cursor-not-allowed"
//           }`}
//         >
//           {showResume ? "Hide Resume" : "Show Resume"}
//         </button>

//         {showProfile && (
//           <div className="mt-2 p-2 bg-gray-100 rounded">
//             {isProfileLoading ? (
//               <p>Loading profile...</p>
//             ) : isProfileError ? (
//               <p className="text-red-500">
//                 Error fetching profile:{" "}
//                 {profileError?.data?.message || "Unknown error"}
//               </p>
//             ) : userProfile?.data ? (
//               <div>
//                 <p>
//                   <strong>First Name:</strong>{" "}
//                   {userProfile.data.first_name || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Last Name:</strong>{" "}
//                   {userProfile.data.last_name || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {userProfile.data.phone || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Location:</strong>{" "}
//                   {userProfile.data.location || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Bio:</strong> {userProfile.data.bio || "N/A"}
//                 </p>
//               </div>
//             ) : (
//               <p>No profile data found.</p>
//             )}
//           </div>
//         )}

//         {showResume && application.resume_id && (
//           <div className="mt-2">
//             {isResumeLoading ? (
//               <p>Loading resume...</p>
//             ) : isResumeError ? (
//               <p className="text-red-500">
//                 Error loading resume:{" "}
//                 {resumeError?.data?.message || "Unknown error"}
//               </p>
//             ) : userResumeResponse ? (
//               <div className="bg-amber-100 p-2 rounded">
//                 <Document
//                   file={userResumeResponse}
//                   onLoadError={(error) =>
//                     console.error("PDF load error:", error)
//                   }
//                 >
//                   <Page pageNumber={1} width={300} />
//                 </Document>
//               </div>
//             ) : (
//               <p>No resume data found.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // import React, { useState } from "react";
// // import { Document, Page, pdfjs } from "react-pdf";

// // import {
// //   useGetAppliedJobsQuery,
// //   useGetAppliedUserProfileByIdQuery,
// //   useGetAppliedUserResumeByIdQuery,
// //   useUpdateApplicationStatusMutation,
// // } from "../../../redux/api/employerApi";
// // import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next

// // import "react-pdf/dist/Page/AnnotationLayer.css";
// // import "react-pdf/dist/Page/TextLayer.css"; // Also recommended for text selection

// // // Set workerSrc for react-pdf
// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
// //           className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 "
// //         >
// //           Create New Job Posting
// //         </button>
// //         <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
// //       </div>
// //       <JobUpdateStatus />
// //     </div>
// //   );
// // };

// // export default JobDashboard;

// // const JobUpdateStatus = () => {
// //   // const [appliedProfileId, setAppliedProfileId] = useState(null);

// //   const {
// //     data: getAppliedJobs,
// //     isLoading: isGetAppliedJobLoading,
// //     isError: isGetAppliedJobError,
// //     // You might want to add 'refetch' if you want to refresh the list after an update
// //     // refetch: refetchAppliedJobs,
// //   } = useGetAppliedJobsQuery(null);

// //   const [
// //     updateApplicationStatus,
// //     {
// //       isLoading: isUpdateApplicationStatusLoading,
// //       isError: isUpdateApplicationStatusError,
// //       error: errorUpdateApplicationStatus,
// //       // You might want 'reset' to clear error states manually
// //       // reset: resetUpdateStatus,
// //     },
// //   ] = useUpdateApplicationStatusMutation();

// //   // --- Handler function for status change ---
// //   const handleStatusChange = async (applicationId, newStatus) => {
// //     console.log(`Updating application ${applicationId} to status ${newStatus}`);
// //     try {
// //       // Call the mutation provided by RTK Query
// //       await updateApplicationStatus({
// //         id: applicationId, // This matches the 'id' expected in the RTK query definition
// //         statusData: { status: newStatus }, // This matches the 'statusData' and the backend's req.body expectation
// //       }).unwrap(); // .unwrap() gives you a promise that rejects on error, making try/catch easier

// //       console.log("Update successful for application:", applicationId);
// //       // Optional: Show a success message (e.g., using a toast library)
// //       // Optional: Refetch the list to confirm the update visually
// //       // refetchAppliedJobs();
// //     } catch (err) {
// //       console.error("Failed to update status:", err);
// //       // Optional: Show an error message (e.g., using a toast library)
// //       // You can access specific error details from 'err' or 'errorUpdateApplicationStatus'
// //     }
// //   };

// //   return (
// //     <div className=" p-2 m-1 ">
// //       <div>
// //         {isGetAppliedJobError ? (
// //           <div>
// //             <h1>Erro at Get AppliedJob</h1>
// //           </div>
// //         ) : (
// //           <div>
// //             {isGetAppliedJobLoading ? (
// //               <div>
// //                 <h1>Loading ...</h1>
// //               </div>
// //             ) : (
// //               <div>
// //                 <h1>This is Get Applied Job List</h1>
// //                 {getAppliedJobs.data.map((job) => (
// //                   <div key={job.id} className="m-1 p-2 outline">
// //                     <div className="text-green-500">
// //                       <p className="text-3xl underline">{job.title}</p>
// //                       <p>{job.description}</p>
// //                       <p>{job.min_salary}</p>
// //                       <p>{job.category}</p>
// //                       <p>{job.employment_type}</p>
// //                       <p>{job.location}</p>
// //                       <p>{job.salary_min}</p>
// //                       <p>{job.salary_max}</p>
// //                       <div className="mt-2">
// //                         <div className="text-pink-500">
// //                           <strong>Total User Application Count :: </strong>
// //                           {job.application_count ?? 0}
// //                         </div>
// //                         <div className="text-red-600 dark:text-red-400">
// //                           <strong>Deadline: </strong>
// //                           {/* Format date for better readability */}
// //                           {job.application_deadline
// //                             ? new Date(
// //                                 job.application_deadline
// //                               ).toLocaleDateString()
// //                             : "N/A"}
// //                           <p>{job.application_deadline}</p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div>
// //                       {/* Logic  */}
// //                       {job.application_count === 0 ? (
// //                         <div>
// //                           <h1 className="bg-yellow-500 p-2 m-1">
// //                             There is no applications for this post yet.!
// //                           </h1>
// //                         </div>
// //                       ) : (
// //                         <div>
// //                           <h1>Application Received:: </h1>
// //                           {job.applications.map((app) => (
// //                             <ApplicationCard
// //                               key={app.id}
// //                               application={app}
// //                               handleStatusChange={handleStatusChange}
// //                               isLoading={isUpdateApplicationStatusLoading}
// //                               error={errorUpdateApplicationStatus}
// //                             />
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // const ApplicationCard = ({
// //   application,
// //   handleStatusChange,
// //   isLoading,
// //   error,
// // }) => {
// //   const [showProfile, setShowProfile] = useState(false);
// //   const [showResume, setShowResume] = useState(false); // resume get already temp
// //   const {
// //     data: userProfile,
// //     isLoading: isProfileLoading,
// //     isError: isProfileError,
// //   } = useGetAppliedUserProfileByIdQuery(application.user_id, {
// //     skip: !showProfile,
// //   });
// //   // pending
// //   // const {
// //   //   data: userResumeResponse,
// //   //   isLoading: isResumeLoading,
// //   //   isError: isResumeError,
// //   // } = useGetAppliedUserResumeByIdQuery(application.resume_id, {
// //   //   skip: !application.resume_id,
// //   // });
// //   const {
// //     data: userResumeResponse,
// //     isLoading: isResumeLoading,
// //     isError: isResumeError,
// //   } = useGetAppliedUserResumeByIdQuery(showResume, { skip: !showResume });

// //   if (isResumeLoading) return <p>Loading</p>;

// //   // console.log(userResumeResponse?.data, "resume info", application.resume_id);
// //   return (
// //     <div className="bg-white text-cyan-900 dark:bg-cyan-900 dark:text-white p-2 m-1">
// //       <div>
// //         <p>
// //           <strong>Application ID: </strong> {application.id}
// //         </p>
// //         <p>
// //           <strong>User ID: </strong> {application.user_id || "NULL"}
// //         </p>
// //         <p>
// //           <strong>Applied At: </strong> {application.applied_at}
// //         </p>
// //         <p>
// //           <strong>Resume ID: </strong> {application.resume_id}
// //         </p>
// //         <p>
// //           <strong>Status: </strong> {application.status}
// //         </p>
// //         <p>
// //           <strong>Status Updated At: </strong> {application.updated_at}
// //         </p>

// //         <div className="my-2">
// //           <label className="block">Change Job Application Status:</label>
// //           <select
// //             value={application.status || ""}
// //             onChange={(e) => handleStatusChange(application.id, e.target.value)}
// //             disabled={isLoading}
// //             className="bg-white text-black p-2 mt-1"
// //           >
// //             <option value="pending">Pending</option>
// //             <option value="reviewed">Reviewed</option>
// //             <option value="interviewed">Interview</option>
// //             <option value="offered">Offered</option>
// //             <option value="rejected">Rejected</option>
// //             <option value="withdrawn">Withdrawn</option>
// //           </select>
// //           {error && (
// //             <p className="text-red-500 text-sm mt-1">
// //               Failed to update status. Please try again.
// //             </p>
// //           )}
// //         </div>

// //         <button
// //           onClick={() => setShowProfile((prev) => !prev)}
// //           className="bg-yellow-500 p-2 mt-2 hover:bg-yellow-700"
// //         >
// //           {showProfile ? "Hide Profile" : "View Profile"}
// //         </button>
// //         <button
// //           onClick={() => setShowResume(application.resume_id)}
// //           className="bg-green-500 p-2 m-1"
// //         >
// //           Show Resume
// //         </button>

// //         {showProfile && (
// //           <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
// //             {isProfileLoading ? (
// //               <p>Loading profile...</p>
// //             ) : isProfileError ? (
// //               <p className="text-red-500">Error fetching profile</p>
// //             ) : userProfile ? (
// //               <div>
// //                 <p>
// //                   <strong>First Name: </strong>
// //                   {userProfile.data.first_name}
// //                 </p>
// //                 <p>
// //                   <strong>Last Name: </strong>
// //                   {userProfile.data.last_name}
// //                 </p>
// //                 <p>
// //                   <strong>Email: </strong>
// //                   {userProfile.data.email}
// //                 </p>
// //                 {/* Add more fields as needed */}
// //               </div>
// //             ) : (
// //               <p>No profile data found.</p>
// //             )}
// //           </div>
// //         )}
// //         {showResume && (
// //           <div>
// //             {isResumeLoading ? (
// //               <div>
// //                 <p> Resume Loading ...</p>
// //               </div>
// //             ) : (
// //               <div>
// //                 <Document
// //                   file={userResumeResponse}
// //                   onLoadError={(error) =>
// //                     console.error("PDF load error", error)
// //                   }
// //                   className="bg-amber-300 p-2 m-1"
// //                 >
// //                   <Page pageNumber={1} width={300} />
// //                 </Document>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // // backup before edit
// // // import React, { useState } from "react";
// // // import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next
// // // import {
// // //   useGetAppliedJobsQuery,
// // //   useGetAppliedUserProfileByIdQuery,
// // //   useUpdateApplicationStatusMutation,
// // // } from "../../../redux/api/employerApi";

// // // const JobDashboard = () => {
// // //   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

// // //   const openSidebar = () => setIsSidebarOpen(true);
// // //   const closeSidebar = () => setIsSidebarOpen(false);

// // //   return (
// // //     <div>
// // //       <div className="p-6">
// // //         <h1 className="text-3xl font-bold mb-6">Job Management</h1>
// // //         {/* Add other dashboard content here, like a list of existing jobs */}
// // //         <button
// // //           onClick={openSidebar}
// // //           className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 "
// // //         >
// // //           Create New Job Posting
// // //         </button>
// // //         <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
// // //       </div>
// // //       <JobUpdateStatus />
// // //     </div>
// // //   );
// // // };

// // // export default JobDashboard;

// // // const JobUpdateStatus = () => {
// // //   const [appliedProfileId, setAppliedProfileId] = useState(null);

// // //   const {
// // //     data: getAppliedJobs,
// // //     isLoading: isGetAppliedJobLoading,
// // //     isError: isGetAppliedJobError,
// // //     // You might want to add 'refetch' if you want to refresh the list after an update
// // //     // refetch: refetchAppliedJobs,
// // //   } = useGetAppliedJobsQuery(null);

// // //   const [
// // //     updateApplicationStatus,
// // //     {
// // //       isLoading: isUpdateApplicationStatusLoading,
// // //       isError: isUpdateApplicationStatusError,
// // //       error: errorUpdateApplicationStatus,
// // //       // You might want 'reset' to clear error states manually
// // //       // reset: resetUpdateStatus,
// // //     },
// // //   ] = useUpdateApplicationStatusMutation();

// // //   const {
// // //     data: getAppliedUserProfileByIdResponse,
// // //     isLoading: isAppliedUserProfileByIdLoading,
// // //   } = useGetAppliedUserProfileByIdQuery(appliedProfileId, {
// // //     skip: !appliedProfileId,
// // //   });

// // //   if (isAppliedUserProfileByIdLoading) return <p>Loaidng</p>;

// // //   console.log(
// // //     getAppliedUserProfileByIdResponse?.data,
// // //     "check profile status and "
// // //   );

// // //   // --- Handler function for status change ---
// // //   const handleStatusChange = async (applicationId, newStatus) => {
// // //     console.log(`Updating application ${applicationId} to status ${newStatus}`);
// // //     try {
// // //       // Call the mutation provided by RTK Query
// // //       await updateApplicationStatus({
// // //         id: applicationId, // This matches the 'id' expected in the RTK query definition
// // //         statusData: { status: newStatus }, // This matches the 'statusData' and the backend's req.body expectation
// // //       }).unwrap(); // .unwrap() gives you a promise that rejects on error, making try/catch easier

// // //       console.log("Update successful for application:", applicationId);
// // //       // Optional: Show a success message (e.g., using a toast library)
// // //       // Optional: Refetch the list to confirm the update visually
// // //       // refetchAppliedJobs();
// // //     } catch (err) {
// // //       console.error("Failed to update status:", err);
// // //       // Optional: Show an error message (e.g., using a toast library)
// // //       // You can access specific error details from 'err' or 'errorUpdateApplicationStatus'
// // //     }
// // //   };

// // //   return (
// // //     <div className=" p-2 m-1 ">
// // //       <div>
// // //         {isGetAppliedJobError ? (
// // //           <div>
// // //             <h1>Erro at Get AppliedJob</h1>
// // //           </div>
// // //         ) : (
// // //           <div>
// // //             {isGetAppliedJobLoading ? (
// // //               <div>
// // //                 <h1>Loading ...</h1>
// // //               </div>
// // //             ) : (
// // //               <div>
// // //                 <h1>This is Get Applied Job List</h1>
// // //                 {getAppliedJobs.data.map((e) => (
// // //                   <div key={e.id} className="m-1 p-2 outline">
// // //                     <div className="text-green-500">
// // //                       <p className="text-3xl underline">{e.title}</p>
// // //                       <p>{e.description}</p>
// // //                       <p>{e.min_salary}</p>
// // //                       <p>{e.category}</p>
// // //                       <p>{e.employment_type}</p>
// // //                       <p>{e.location}</p>
// // //                       <p>{e.salary_min}</p>
// // //                       <p>{e.salary_max}</p>
// // //                       <div className="mt-2">
// // //                         <div className="text-pink-500">
// // //                           <strong>Total User Application Count :: </strong>
// // //                           {e.application_count ?? 0}
// // //                         </div>
// // //                         <div className="text-red-600 dark:text-red-400">
// // //                           <strong>Deadline: </strong>
// // //                           {/* Format date for better readability */}
// // //                           {e.application_deadline
// // //                             ? new Date(
// // //                                 e.application_deadline
// // //                               ).toLocaleDateString()
// // //                             : "N/A"}
// // //                           <p>{e.application_deadline}</p>
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     {/* --- Applications List for this Job --- */}
// // //                     <div className="mt-4">
// // //                       <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
// // //                         Applications Received:
// // //                       </h4>
// // //                       {e.applications.map((a) => (
// // //                         <div
// // //                           key={a.id}
// // //                           className="bg-white text-cyan-900 dark:bg-cyan-900 dark:text-white p-2 m-1"
// // //                         >
// // //                           {a.id ? (
// // //                             <div>
// // //                               <div>
// // //                                 <p>
// // //                                   <label>Job Application ID :</label>
// // //                                   {a.id}
// // //                                 </p>
// // //                                 <div>
// // //                                   <label>
// // //                                     Click Here to Get Applied Profile Info
// // //                                   </label>
// // //                                   {/* <button
// // //                                     onClick={() =>
// // //                                       console.log(
// // //                                         "View Profile Funtion",
// // //                                         a.user_id
// // //                                       )
// // //                                     }
// // //                                     className="bg-green-500 p-2 m-1 hover:bg-green-900"
// // //                                   >
// // //                                     View Profile
// // //                                   </button> */}
// // //                                   <button
// // //                                     onClick={() =>
// // //                                       setAppliedProfileId(a.user_id)
// // //                                     }
// // //                                     className="bg-yellow-500 p-2 m-1 hover:bg-green-900"
// // //                                   >
// // //                                     View Profile
// // //                                   </button>
// // //                                 </div>
// // //                               </div>
// // //                               <p>
// // //                                 <strong>Applied User ID :: </strong>
// // //                                 {a.user_id || "NULL"}
// // //                               </p>
// // //                               <p>
// // //                                 <strong>Applied Time :: </strong>
// // //                                 {a.applied_at}
// // //                               </p>
// // //                               <p>
// // //                                 <strong>Resume Attachment ID :: </strong>
// // //                                 {a.resume_id}
// // //                               </p>
// // //                               <p>
// // //                                 <strong>Job Status to Applications :: </strong>
// // //                                 {a.status}
// // //                               </p>
// // //                               <p>
// // //                                 <strong>Status Update Time :: </strong>
// // //                                 {a.updated_at}
// // //                               </p>
// // //                               {/* // edit reamin from here */}
// // //                               <label>Change The Job Status Here :: </label>
// // //                               {errorUpdateApplicationStatus ? (
// // //                                 <div>
// // //                                   <h1 className="text-pink-500">
// // //                                     Error Update Application Status
// // //                                   </h1>
// // //                                 </div>
// // //                               ) : (
// // //                                 <div>
// // //                                   {isUpdateApplicationStatusLoading ? (
// // //                                     <div className="text-blue-500">
// // //                                       Update Application STatus Loading
// // //                                     </div>
// // //                                   ) : (
// // //                                     <div>
// // //                                       <select
// // //                                         // id={`status-select-${a.id}`}
// // //                                         // id={a.id}
// // //                                         value={a.status || ""}
// // //                                         onChange={(e) =>
// // //                                           handleStatusChange(
// // //                                             a.id,
// // //                                             e.target.value
// // //                                           )
// // //                                         }
// // //                                         disabled={
// // //                                           isUpdateApplicationStatusLoading
// // //                                         }
// // //                                         className="bg-white hover:bg-green-400 text-black p-2 m-1"
// // //                                       >
// // //                                         <option value="pending">Pending</option>
// // //                                         <option value="reviewed">
// // //                                           Reviewed
// // //                                         </option>
// // //                                         <option value="interviewed">
// // //                                           Interview
// // //                                         </option>
// // //                                         <option value="offered">Offered</option>
// // //                                         <option value="rejected">
// // //                                           Rejected
// // //                                         </option>
// // //                                         <option value="withdrawn">
// // //                                           WithDrawn
// // //                                         </option>
// // //                                       </select>
// // //                                     </div>
// // //                                   )}
// // //                                 </div>
// // //                               )}
// // //                             </div>
// // //                           ) : (
// // //                             <div>There is No More Application Yet.</div>
// // //                           )}
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                     <div>
// // //                       {isAppliedUserProfileByIdLoading ? (
// // //                         <div>Loading AppliedUser Profile By Id </div>
// // //                       ) : (
// // //                         <div className="bg-sky-400">
// // //                           <p>
// // //                             {getAppliedUserProfileByIdResponse?.data.first_name}
// // //                           </p>
// // //                           <p>
// // //                             {getAppliedUserProfileByIdResponse?.data.last_name}
// // //                           </p>
// // //                           <p>
// // //                             {getAppliedUserProfileByIdResponse?.data.gender}
// // //                           </p>
// // //                           <p>{getAppliedUserProfileByIdResponse?.data.bio}</p>
// // //                           <p>
// // //                             {
// // //                               getAppliedUserProfileByIdResponse?.data
// // //                                 .date_of_birth
// // //                             }
// // //                           </p>
// // //                           <p>{getAppliedUserProfileByIdResponse?.data.phone}</p>
// // //                           <p>
// // //                             {getAppliedUserProfileByIdResponse?.data.location}
// // //                           </p>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };
