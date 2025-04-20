import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import {
  useGetAppliedJobsQuery,
  useGetAppliedUserProfileByIdQuery,
  useGetAppliedUserResumeByIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../../redux/api/employerApi";
import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css"; // Also recommended for text selection

// Set workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const JobDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Job Management</h1>
        {/* Add other dashboard content here, like a list of existing jobs */}
        <button
          onClick={openSidebar}
          className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 "
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
  // const [appliedProfileId, setAppliedProfileId] = useState(null);

  const {
    data: getAppliedJobs,
    isLoading: isGetAppliedJobLoading,
    isError: isGetAppliedJobError,
    // You might want to add 'refetch' if you want to refresh the list after an update
    // refetch: refetchAppliedJobs,
  } = useGetAppliedJobsQuery(null);

  const [
    updateApplicationStatus,
    {
      isLoading: isUpdateApplicationStatusLoading,
      isError: isUpdateApplicationStatusError,
      error: errorUpdateApplicationStatus,
      // You might want 'reset' to clear error states manually
      // reset: resetUpdateStatus,
    },
  ] = useUpdateApplicationStatusMutation();

  // --- Handler function for status change ---
  const handleStatusChange = async (applicationId, newStatus) => {
    console.log(`Updating application ${applicationId} to status ${newStatus}`);
    try {
      // Call the mutation provided by RTK Query
      await updateApplicationStatus({
        id: applicationId, // This matches the 'id' expected in the RTK query definition
        statusData: { status: newStatus }, // This matches the 'statusData' and the backend's req.body expectation
      }).unwrap(); // .unwrap() gives you a promise that rejects on error, making try/catch easier

      console.log("Update successful for application:", applicationId);
      // Optional: Show a success message (e.g., using a toast library)
      // Optional: Refetch the list to confirm the update visually
      // refetchAppliedJobs();
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optional: Show an error message (e.g., using a toast library)
      // You can access specific error details from 'err' or 'errorUpdateApplicationStatus'
    }
  };

  return (
    <div className=" p-2 m-1 ">
      <div>
        {isGetAppliedJobError ? (
          <div>
            <h1>Erro at Get AppliedJob</h1>
          </div>
        ) : (
          <div>
            {isGetAppliedJobLoading ? (
              <div>
                <h1>Loading ...</h1>
              </div>
            ) : (
              <div>
                <h1>This is Get Applied Job List</h1>
                {getAppliedJobs.data.map((job) => (
                  <div key={job.id} className="m-1 p-2 outline">
                    <div className="text-green-500">
                      <p className="text-3xl underline">{job.title}</p>
                      <p>{job.description}</p>
                      <p>{job.min_salary}</p>
                      <p>{job.category}</p>
                      <p>{job.employment_type}</p>
                      <p>{job.location}</p>
                      <p>{job.salary_min}</p>
                      <p>{job.salary_max}</p>
                      <div className="mt-2">
                        <div className="text-pink-500">
                          <strong>Total User Application Count :: </strong>
                          {job.application_count ?? 0}
                        </div>
                        <div className="text-red-600 dark:text-red-400">
                          <strong>Deadline: </strong>
                          {/* Format date for better readability */}
                          {job.application_deadline
                            ? new Date(
                                job.application_deadline
                              ).toLocaleDateString()
                            : "N/A"}
                          <p>{job.application_deadline}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {/* Logic  */}
                      {job.application_count === 0 ? (
                        <div>
                          <h1 className="bg-yellow-500 p-2 m-1">
                            There is no applications for this post yet.!
                          </h1>
                        </div>
                      ) : (
                        <div>
                          <h1>Application Received:: </h1>
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
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
  const [showResume, setShowResume] = useState(false); // resume get already temp
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetAppliedUserProfileByIdQuery(application.user_id, {
    skip: !showProfile,
  });
  // pending
  // const {
  //   data: userResumeResponse,
  //   isLoading: isResumeLoading,
  //   isError: isResumeError,
  // } = useGetAppliedUserResumeByIdQuery(application.resume_id, {
  //   skip: !application.resume_id,
  // });
  const {
    data: userResumeResponse,
    isLoading: isResumeLoading,
    isError: isResumeError,
  } = useGetAppliedUserResumeByIdQuery(showResume, { skip: !showResume });

  if (isResumeLoading) return <p>Loading</p>;

  // console.log(userResumeResponse?.data, "resume info", application.resume_id);
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
        <button
          onClick={() => setShowResume(application.resume_id)}
          className="bg-green-500 p-2 m-1"
        >
          Show Resume
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
        {showResume && (
          <div>
            {isResumeLoading ? (
              <div>
                <p> Resume Loading ...</p>
              </div>
            ) : (
              <div>
                <Document
                  file={userResumeResponse}
                  onLoadError={(error) =>
                    console.error("PDF load error", error)
                  }
                  className="bg-amber-300 p-2 m-1"
                >
                  <Page pageNumber={1} width={300} />
                </Document>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// backup before edit
// import React, { useState } from "react";
// import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next
// import {
//   useGetAppliedJobsQuery,
//   useGetAppliedUserProfileByIdQuery,
//   useUpdateApplicationStatusMutation,
// } from "../../../redux/api/employerApi";

// const JobDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const openSidebar = () => setIsSidebarOpen(true);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   return (
//     <div>
//       <div className="p-6">
//         <h1 className="text-3xl font-bold mb-6">Job Management</h1>
//         {/* Add other dashboard content here, like a list of existing jobs */}
//         <button
//           onClick={openSidebar}
//           className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 "
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
//   const [appliedProfileId, setAppliedProfileId] = useState(null);

//   const {
//     data: getAppliedJobs,
//     isLoading: isGetAppliedJobLoading,
//     isError: isGetAppliedJobError,
//     // You might want to add 'refetch' if you want to refresh the list after an update
//     // refetch: refetchAppliedJobs,
//   } = useGetAppliedJobsQuery(null);

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

//   const {
//     data: getAppliedUserProfileByIdResponse,
//     isLoading: isAppliedUserProfileByIdLoading,
//   } = useGetAppliedUserProfileByIdQuery(appliedProfileId, {
//     skip: !appliedProfileId,
//   });

//   if (isAppliedUserProfileByIdLoading) return <p>Loaidng</p>;

//   console.log(
//     getAppliedUserProfileByIdResponse?.data,
//     "check profile status and "
//   );

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

//   return (
//     <div className=" p-2 m-1 ">
//       <div>
//         {isGetAppliedJobError ? (
//           <div>
//             <h1>Erro at Get AppliedJob</h1>
//           </div>
//         ) : (
//           <div>
//             {isGetAppliedJobLoading ? (
//               <div>
//                 <h1>Loading ...</h1>
//               </div>
//             ) : (
//               <div>
//                 <h1>This is Get Applied Job List</h1>
//                 {getAppliedJobs.data.map((e) => (
//                   <div key={e.id} className="m-1 p-2 outline">
//                     <div className="text-green-500">
//                       <p className="text-3xl underline">{e.title}</p>
//                       <p>{e.description}</p>
//                       <p>{e.min_salary}</p>
//                       <p>{e.category}</p>
//                       <p>{e.employment_type}</p>
//                       <p>{e.location}</p>
//                       <p>{e.salary_min}</p>
//                       <p>{e.salary_max}</p>
//                       <div className="mt-2">
//                         <div className="text-pink-500">
//                           <strong>Total User Application Count :: </strong>
//                           {e.application_count ?? 0}
//                         </div>
//                         <div className="text-red-600 dark:text-red-400">
//                           <strong>Deadline: </strong>
//                           {/* Format date for better readability */}
//                           {e.application_deadline
//                             ? new Date(
//                                 e.application_deadline
//                               ).toLocaleDateString()
//                             : "N/A"}
//                           <p>{e.application_deadline}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* --- Applications List for this Job --- */}
//                     <div className="mt-4">
//                       <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
//                         Applications Received:
//                       </h4>
//                       {e.applications.map((a) => (
//                         <div
//                           key={a.id}
//                           className="bg-white text-cyan-900 dark:bg-cyan-900 dark:text-white p-2 m-1"
//                         >
//                           {a.id ? (
//                             <div>
//                               <div>
//                                 <p>
//                                   <label>Job Application ID :</label>
//                                   {a.id}
//                                 </p>
//                                 <div>
//                                   <label>
//                                     Click Here to Get Applied Profile Info
//                                   </label>
//                                   {/* <button
//                                     onClick={() =>
//                                       console.log(
//                                         "View Profile Funtion",
//                                         a.user_id
//                                       )
//                                     }
//                                     className="bg-green-500 p-2 m-1 hover:bg-green-900"
//                                   >
//                                     View Profile
//                                   </button> */}
//                                   <button
//                                     onClick={() =>
//                                       setAppliedProfileId(a.user_id)
//                                     }
//                                     className="bg-yellow-500 p-2 m-1 hover:bg-green-900"
//                                   >
//                                     View Profile
//                                   </button>
//                                 </div>
//                               </div>
//                               <p>
//                                 <strong>Applied User ID :: </strong>
//                                 {a.user_id || "NULL"}
//                               </p>
//                               <p>
//                                 <strong>Applied Time :: </strong>
//                                 {a.applied_at}
//                               </p>
//                               <p>
//                                 <strong>Resume Attachment ID :: </strong>
//                                 {a.resume_id}
//                               </p>
//                               <p>
//                                 <strong>Job Status to Applications :: </strong>
//                                 {a.status}
//                               </p>
//                               <p>
//                                 <strong>Status Update Time :: </strong>
//                                 {a.updated_at}
//                               </p>
//                               {/* // edit reamin from here */}
//                               <label>Change The Job Status Here :: </label>
//                               {errorUpdateApplicationStatus ? (
//                                 <div>
//                                   <h1 className="text-pink-500">
//                                     Error Update Application Status
//                                   </h1>
//                                 </div>
//                               ) : (
//                                 <div>
//                                   {isUpdateApplicationStatusLoading ? (
//                                     <div className="text-blue-500">
//                                       Update Application STatus Loading
//                                     </div>
//                                   ) : (
//                                     <div>
//                                       <select
//                                         // id={`status-select-${a.id}`}
//                                         // id={a.id}
//                                         value={a.status || ""}
//                                         onChange={(e) =>
//                                           handleStatusChange(
//                                             a.id,
//                                             e.target.value
//                                           )
//                                         }
//                                         disabled={
//                                           isUpdateApplicationStatusLoading
//                                         }
//                                         className="bg-white hover:bg-green-400 text-black p-2 m-1"
//                                       >
//                                         <option value="pending">Pending</option>
//                                         <option value="reviewed">
//                                           Reviewed
//                                         </option>
//                                         <option value="interviewed">
//                                           Interview
//                                         </option>
//                                         <option value="offered">Offered</option>
//                                         <option value="rejected">
//                                           Rejected
//                                         </option>
//                                         <option value="withdrawn">
//                                           WithDrawn
//                                         </option>
//                                       </select>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div>There is No More Application Yet.</div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <div>
//                       {isAppliedUserProfileByIdLoading ? (
//                         <div>Loading AppliedUser Profile By Id </div>
//                       ) : (
//                         <div className="bg-sky-400">
//                           <p>
//                             {getAppliedUserProfileByIdResponse?.data.first_name}
//                           </p>
//                           <p>
//                             {getAppliedUserProfileByIdResponse?.data.last_name}
//                           </p>
//                           <p>
//                             {getAppliedUserProfileByIdResponse?.data.gender}
//                           </p>
//                           <p>{getAppliedUserProfileByIdResponse?.data.bio}</p>
//                           <p>
//                             {
//                               getAppliedUserProfileByIdResponse?.data
//                                 .date_of_birth
//                             }
//                           </p>
//                           <p>{getAppliedUserProfileByIdResponse?.data.phone}</p>
//                           <p>
//                             {getAppliedUserProfileByIdResponse?.data.location}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
