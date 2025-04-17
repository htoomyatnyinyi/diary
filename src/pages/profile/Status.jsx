import React from "react";
import {
  useGetApplicationsQuery,
  useGetSavedJobsQuery,
  useDeleteApplicationMutation,
  useDeleteSavedJobMutation,
  useGetAnalyticsQuery,
} from "../../redux/api/userApi";

const Status = () => {
  const { data: analytic, isLoading: isAnalyticLoading } =
    useGetAnalyticsQuery();

  // if (isAnalyticLoading) return <p>Loading ..</p>;

  // console.log(analytic, "check");

  const {
    data: SavedJobs,
    isLoading: isSavedJobsLoading,
    refetch: refetchSaveJob,
  } = useGetSavedJobsQuery(null);

  const {
    data: Applications,
    isLoading: isApplicationLoading,
    refetch: refetchApplication,
  } = useGetApplicationsQuery(null);

  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteApplicationMutation();

  const [deleteSavedJob, { isLoading: isSavJobDeleting }] =
    useDeleteSavedJobMutation();

  if (isDeleting) return <p>Loading....</p>;

  const handleDeleteSavedJob = async (id) => {
    try {
      await deleteSavedJob(id).unwrap();
      // Refetch applications after successful deletion
      refetchSaveJob();
    } catch (error) {
      // Handle error if deletion fails
      console.error("Error deleting save job:", error);
      // Optionally display an error message to the user
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id).unwrap();
      // Refetch applications after successful deletion
      refetchApplication();
    } catch (error) {
      // Handle error if deletion fails
      console.error("Error deleting application:", error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1>Welcome to Job Status Page</h1>
          {isAnalyticLoading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : (
            <div className="flex  p-2 m-1  justify-around items-center">
              <h1> Users: {analytic.data.total_users}</h1>
              <h1>Jobs : {analytic.data.total_jobs}</h1>
              <h1>Applications : {analytic.data.total_applications}</h1>
              {/* {analytic?.data.map((e) => (
                <div>
                  <h1>{e.total_users}</h1>
                  <h1>{e.total_jobs}</h1>
                  <h1>{e.total_applications}</h1>
                </div>
              ))} */}
            </div>
          )}
        </div>
        <div>
          {isSavedJobsLoading ? (
            <p className="h-96 w-auto bg-orange-500">Loading...</p>
          ) : (
            <div className="bg-green-500 h-96 w-auto">
              {SavedJobs?.data?.map((e) => (
                <div key={e.id}>
                  <p>{e.title}</p>
                  <button
                    onClick={() => handleDeleteSavedJob(e.id)}
                    disabled={isSavJobDeleting}
                    className="bg-orange-500 p-2 "
                  >
                    Delete Saved Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1></h1>
          {isApplicationLoading ? (
            <p className="bg-pink-500 h-96 w-auto">Loading Application</p>
          ) : (
            <div className="bg-blue-500 text-white h-96 w-auto">
              {Applications?.data?.map((e) => (
                <div key={e.id} className="bg-white text-black m-1">
                  <h1>{e.title}</h1>
                  <p>{e.status}</p>
                  <button
                    onClick={() => handleDeleteApplication(e.id)}
                    disabled={isDeleting}
                    className="bg-pink-500 p-2 m-1"
                  >
                    Delete Application
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;

// import React from "react";
// import {
//   useGetApplicationsQuery,
//   useGetSavedJobsQuery,
//   useDeleteApplicationMutation,
// } from "../../redux/api/userApi";

// const Status = () => {
//   const { data: SavedJobs, isLoading: isSavedJobsLoading } =
//     useGetSavedJobsQuery(null);

//   const {
//     data: Applications,
//     isLoading: isApplicationLoading,
//     refetch,
//   } = useGetApplicationsQuery(null);

//   const [deleteApplication, { isLoading: isDeleting }] =
//     useDeleteApplicationMutation();

//   if (isDeleting) return <p>Loading....</p>;

//   const handleDeleteApplication = async ({ id }) => {
//     try {
//       await deleteApplication(id).unwrap();
//       refetch();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <h1>WElcome to Job STatus Page</h1>
//         </div>
//         <div>
//           {isSavedJobsLoading ? (
//             <p className="h-96 w-auto bg-orange-500">Loading...</p>
//           ) : (
//             <div className="bg-green-500 h-96 w-auto">
//               {SavedJobs.data.map((e) => (
//                 <div key={e.id}>
//                   <p>{e.title}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div>
//           <h1></h1>
//           {isApplicationLoading ? (
//             <p className="bg-pink-500 h-96 w-auto">Loading Application</p>
//           ) : (
//             <div className="bg-blue-500 text-white h-96 w-auto">
//               {Applications.data.map((e) => (
//                 <div key={e.id} className="bg-white text-black m-1">
//                   <h1>{e.title}</h1>
//                   <p>{e.status}</p>
//                   <button
//                     onClick={() => handleDeleteApplication(e.id)}
//                     // onClick={() => deleteApplication(e.id).refetch()}
//                     disabled={isDeleting}
//                     className="bg-pink-500 p-2 m-1"
//                   >
//                     DeleteApplicaitoin
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Status;
