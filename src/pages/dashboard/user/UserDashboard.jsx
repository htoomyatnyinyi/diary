import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useGetApplicationsQuery,
  useGetSavedJobsQuery,
  useDeleteApplicationMutation,
  useDeleteSavedJobMutation,
  useGetAnalyticsQuery,
} from "../../../redux/api/userApi";

const UserDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to your dashboard. View your job applications, saved jobs, and
        analytics below.
      </p>
      <Status />
    </div>
  );
};

export default UserDashboard;

const Status = () => {
  const {
    data: analytic,
    isLoading: isAnalyticLoading,
    error: analyticError,
  } = useGetAnalyticsQuery();
  const {
    data: savedJobs,
    isLoading: isSavedJobsLoading,
    error: savedJobsError,
    refetch: refetchSavedJobs,
  } = useGetSavedJobsQuery(null);
  const {
    data: applications,
    isLoading: isApplicationLoading,
    error: applicationsError,
    refetch: refetchApplications,
  } = useGetApplicationsQuery(null);
  const [deleteApplication, { isLoading: isDeletingApplication }] =
    useDeleteApplicationMutation();
  const [deleteSavedJob, { isLoading: isDeletingSavedJob }] =
    useDeleteSavedJobMutation();

  const handleDeleteSavedJob = async (id) => {
    try {
      await deleteSavedJob(id).unwrap();
      refetchSavedJobs();
    } catch (error) {
      console.error("Error deleting saved job:", error);
      alert("Failed to delete saved job.");
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id).unwrap();
      refetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application.");
    }
  };

  // Transform analytic.data to Recharts-compatible format
  const chartData = React.useMemo(() => {
    // Log full analytic object for debugging
    console.log("Full analytic object:", analytic);

    // Fallback data if analytic or analytic.data is invalid
    const fallbackData = [
      { date: "2025-04-01", applications: 10, savedJobs: 5 },
      { date: "2025-04-02", applications: 15, savedJobs: 7 },
      { date: "2025-04-03", applications: 12, savedJobs: 6 },
    ];

    if (!analytic?.data) {
      console.warn("analytic.data is null or undefined, using fallback data");
      return fallbackData;
    }

    // Check if analytic.data is an array
    if (Array.isArray(analytic.data)) {
      return analytic.data.map((item) => ({
        date:
          item.date ||
          item.created_at ||
          new Date().toISOString().split("T")[0],
        applications: Number(item.applications_count || item.applications || 0),
        savedJobs: Number(item.saved_jobs_count || item.savedJobs || 0),
      }));
    }

    // Handle if analytic.data is an object (e.g., { applications: [], savedJobs: [] })
    if (typeof analytic.data === "object") {
      const { applications = [], savedJobs = [] } = analytic.data;
      if (Array.isArray(applications) && Array.isArray(savedJobs)) {
        const dates = [
          ...new Set([
            ...applications.map((a) => a.date || a.created_at),
            ...savedJobs.map((s) => s.date || s.created_at),
          ]),
        ];
        return dates.map((date) => ({
          date: date || new Date().toISOString().split("T")[0],
          applications: Number(
            applications.find((a) => (a.date || a.created_at) === date)
              ?.count || 0
          ),
          savedJobs: Number(
            savedJobs.find((s) => (s.date || s.created_at) === date)?.count || 0
          ),
        }));
      }
    }

    // If data is invalid, return fallback
    console.warn(
      "analytic.data is not an array or valid object, using fallback data"
    );
    return fallbackData;
  }, [analytic]);

  return (
    <div className="space-y-8">
      {/* Analytics Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
        {isAnalyticLoading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : analyticError ? (
          <p className="text-red-500">
            Error loading analytics:
            {analyticError.data?.message || "Unknown error"}
          </p>
        ) : !chartData.length ? (
          <p className="text-gray-500">No analytics data available.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
            <LineChart
              width={Math.min(window.innerWidth - 40, 600)}
              height={300}
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3b82f6"
                name="Applications"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="savedJobs"
                stroke="#10b981"
                name="Saved Jobs"
                dot={false}
              />
            </LineChart>
          </div>
        )}
      </section>

      {/* Saved Jobs Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Saved Jobs
        </h2>
        {isSavedJobsLoading ? (
          <p className="text-gray-500">Loading saved jobs...</p>
        ) : savedJobsError ? (
          <p className="text-red-500">
            Error loading saved jobs:{" "}
            {savedJobsError.data?.message || "Unknown error"}
          </p>
        ) : savedJobs?.data?.length === 0 ? (
          <p className="text-gray-500">No saved jobs found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedJobs?.data?.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDeleteSavedJob(job.id)}
                        disabled={isDeletingSavedJob}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Applications Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Applications
        </h2>
        {isApplicationLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : applicationsError ? (
          <p className="text-red-500">
            Error loading applications:{" "}
            {applicationsError.data?.message || "Unknown error"}
          </p>
        ) : applications?.data?.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications?.data?.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        disabled={isDeletingApplication}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

// import React from "react";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   Tooltip,
//   YAxis,
//   XAxis,
// } from "recharts";
// import {
//   useGetApplicationsQuery,
//   useGetSavedJobsQuery,
//   useDeleteApplicationMutation,
//   useDeleteSavedJobMutation,
//   useGetAnalyticsQuery,
// } from "../../../redux/api/userApi";

// const UserDashboard = () => {
//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
//       <p className="text-gray-600 mb-6">
//         Welcome to your dashboard. View your job applications, saved jobs, and
//         analytics below.
//       </p>
//       <Status />
//     </div>
//   );
// };

// export default UserDashboard;

// const Status = () => {
//   const {
//     data: analytic,
//     isLoading: isAnalyticLoading,
//     error: analyticError,
//   } = useGetAnalyticsQuery();
//   const {
//     data: savedJobs,
//     isLoading: isSavedJobsLoading,
//     error: savedJobsError,
//     refetch: refetchSavedJobs,
//   } = useGetSavedJobsQuery(null);
//   const {
//     data: applications,
//     isLoading: isApplicationLoading,
//     error: applicationsError,
//     refetch: refetchApplications,
//   } = useGetApplicationsQuery(null);
//   const [deleteApplication, { isLoading: isDeletingApplication }] =
//     useDeleteApplicationMutation();
//   const [deleteSavedJob, { isLoading: isDeletingSavedJob }] =
//     useDeleteSavedJobMutation();

//   const handleDeleteSavedJob = async (id) => {
//     try {
//       await deleteSavedJob(id).unwrap();
//       refetchSavedJobs();
//     } catch (error) {
//       console.error("Error deleting saved job:", error);
//       alert("Failed to delete saved job.");
//     }
//   };

//   const handleDeleteApplication = async (id) => {
//     try {
//       await deleteApplication(id).unwrap();
//       refetchApplications();
//     } catch (error) {
//       console.error("Error deleting application:", error);
//       alert("Failed to delete application.");
//     }
//   };

//   // Sample chart data (adjust based on actual analytic.data structure)
//   const chartData = analytic?.data || [
//     { date: "2025-04-01", applications: 10, savedJobs: 5 },
//     { date: "2025-04-02", applications: 15, savedJobs: 7 },
//     { date: "2025-04-03", applications: 12, savedJobs: 6 },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Analytics Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
//         {isAnalyticLoading ? (
//           <p className="text-gray-500">Loading analytics...</p>
//         ) : analyticError ? (
//           <p className="text-red-500">
//             Error loading analytics:{" "}
//             {analyticError.data?.message || "Unknown error"}
//           </p>
//         ) : (
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <LineChart width={600} height={300} data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="applications"
//                 stroke="#3b82f6"
//                 name="Applications"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="savedJobs"
//                 stroke="#10b981"
//                 name="Saved Jobs"
//               />
//             </LineChart>
//           </div>
//         )}
//       </section>

//       {/* Saved Jobs Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Saved Jobs
//         </h2>
//         {isSavedJobsLoading ? (
//           <p className="text-gray-500">Loading saved jobs...</p>
//         ) : savedJobsError ? (
//           <p className="text-red-500">
//             Error loading saved jobs:{" "}
//             {savedJobsError.data?.message || "Unknown error"}
//           </p>
//         ) : savedJobs?.data?.length === 0 ? (
//           <p className="text-gray-500">No saved jobs found.</p>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {savedJobs?.data?.map((job) => (
//                   <tr key={job.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {job.title}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                       <button
//                         onClick={() => handleDeleteSavedJob(job.id)}
//                         disabled={isDeletingSavedJob}
//                         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {/* Applications Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Applications
//         </h2>
//         {isApplicationLoading ? (
//           <p className="text-gray-500">Loading applications...</p>
//         ) : applicationsError ? (
//           <p className="text-red-500">
//             Error loading applications:{" "}
//             {applicationsError.data?.message || "Unknown error"}
//           </p>
//         ) : applications?.data?.length === 0 ? (
//           <p className="text-gray-500">No applications found.</p>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {applications?.data?.map((app) => (
//                   <tr key={app.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {app.title}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {app.status}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                       <button
//                         onClick={() => handleDeleteApplication(app.id)}
//                         disabled={isDeletingApplication}
//                         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }; // import React from "react";
// // import {
// //   LineChart,
// //   Line,
// //   PieChart,
// //   CartesianGrid,
// //   Tooltip,
// //   YAxis,
// //   XAxis,
// // } from "recharts";
// // import {
// //   useGetApplicationsQuery,
// //   useGetSavedJobsQuery,
// //   useDeleteApplicationMutation,
// //   useDeleteSavedJobMutation,
// //   useGetAnalyticsQuery,
// // } from "../../../redux/api/userApi";

// // const UserDashboard = () => {
// //   return (
// //     <div>
// //       <h1>User Dashboard</h1>
// //       <p>
// //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas recusandae
// //         commodi perspiciatis repellat tenetur rerum vitae eaque! Autem ducimus,
// //         repellendus impedit ullam magni nulla soluta, necessitatibus minima
// //         cupiditate harum debitis.
// //       </p>
// //       <Status />
// //     </div>
// //   );
// // };

// // export default UserDashboard;

// // const Status = () => {
// //   const { data: analytic, isLoading: isAnalyticLoading } =
// //     useGetAnalyticsQuery();

// //   const {
// //     data: SavedJobs,
// //     isLoading: isSavedJobsLoading,
// //     refetch: refetchSaveJob,
// //   } = useGetSavedJobsQuery(null);

// //   const {
// //     data: Applications,
// //     isLoading: isApplicationLoading,
// //     refetch: refetchApplication,
// //   } = useGetApplicationsQuery(null);

// //   const [deleteApplication, { isLoading: isDeleting }] =
// //     useDeleteApplicationMutation();

// //   const [deleteSavedJob, { isLoading: isSavJobDeleting }] =
// //     useDeleteSavedJobMutation();

// //   if (isDeleting) return <p>Loading....</p>;

// //   const handleDeleteSavedJob = async (id) => {
// //     try {
// //       await deleteSavedJob(id).unwrap();
// //       // Refetch applications after successful deletion
// //       refetchSaveJob();
// //     } catch (error) {
// //       // Handle error if deletion fails
// //       console.error("Error deleting save job:", error);
// //       // Optionally display an error message to the user
// //     }
// //   };

// //   const handleDeleteApplication = async (id) => {
// //     try {
// //       await deleteApplication(id).unwrap();
// //       // Refetch applications after successful deletion
// //       refetchApplication();
// //     } catch (error) {
// //       // Handle error if deletion fails
// //       console.error("Error deleting application:", error);
// //       // Optionally display an error message to the user
// //     }
// //   };

// //   return (
// //     <div>
// //       <div>
// //         <div>
// //           {isSavedJobsLoading ? (
// //             <p className="h-96 w-auto bg-orange-500">Loading...</p>
// //           ) : (
// //             <div className="bg-green-500 h-96 w-auto">
// //               {SavedJobs?.data?.map((e) => (
// //                 <div key={e.id}>
// //                   <p>{e.title}</p>
// //                   <button
// //                     onClick={() => handleDeleteSavedJob(e.id)}
// //                     disabled={isSavJobDeleting}
// //                     className="bg-orange-500 p-2 "
// //                   >
// //                     Delete Saved Job
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //         <div>
// //           <h1></h1>
// //           {isApplicationLoading ? (
// //             <p className="bg-pink-500 h-96 w-auto">Loading Application</p>
// //           ) : (
// //             <div className="bg-blue-500 h-96 w-auto overflow-scroll">
// //               {Applications?.data?.map((e) => (
// //                 <div key={e.id} className="bg-slate-400 text-black m-1">
// //                   <h1>{e.title}</h1>
// //                   <p>{e.status}</p>
// //                   <button
// //                     onClick={() => handleDeleteApplication(e.id)}
// //                     disabled={isDeleting}
// //                     className="bg-green-500 p-2 m-1"
// //                   >
// //                     Delete Application
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // export default Status;

// // // import React from "react";

// // // import {
// // //   LineChart,
// // //   Line,
// // //   YAxis,
// // //   XAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // // } from "recharts";

// // // import { AiFillMerge } from "react-icons/ai";
// // // import Status from "../../profile/Status";

// // // const data = [
// // //   { name: "A", uv: 0, pv: 0, amt: 0 },
// // //   { name: "B", uv: 200, pv: 1500, amt: 1700 },
// // //   { name: "C", uv: 100, pv: 2400, amt: 2500 },
// // //   { name: "D", uv: 300, pv: 1000, amt: 1300 },
// // //   { name: "E", uv: 700, pv: 2400, amt: 3100 },
// // //   { name: "F", uv: 500, pv: 2000, amt: 2500 },
// // //   { name: "G", uv: 900, pv: 4000, amt: 4900 },
// // // ];

// // // const UserDashboard = () => {
// // //   return (
// // //     <div>
// // //       <div>
// // //         <h1>UserDashboard</h1>
// // //         <AiFillMerge />
// // //       </div>

// // //       <div>
// // //         <div className=" dark:bg-cyan-900 ">
// // //           <LineChart data={data} width={800} height={400}>
// // //             <Line type="monotone" dataKey="pv" stroke="#ffabab" dot={false} />
// // //             <Line type="monotone" dataKey="uv" stroke="#ffbbbb" dot={false} />
// // //             <Line type="monotone" dataKey="amt" stroke="#ffaaaa" dot={false} />
// // //             <CartesianGrid stroke="#ccc" strokeDasharray="1 10" />
// // //             <YAxis />
// // //             <XAxis dataKey="name" />
// // //             <Tooltip />
// // //           </LineChart>
// // //         </div>
// // //         <div>
// // //           <LineChart width={200} height={50} data={data}>
// // //             <Line type="monotone" dataKey="amt" stroke="#ff6b6b" dot={false} />
// // //           </LineChart>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default UserDashboard;

// // // // import React from "react";
// // // // import {
// // // //   LineChart,
// // // //   Line,
// // // //   YAxis,
// // // //   XAxis,
// // // //   CartesianGrid,
// // // //   Tooltip,
// // // // } from "recharts";
// // // // import { AiFillAlert, AiFillMerge } from "react-icons/ai";

// // // // // Simplified data with string names
// // // // const data = [
// // // //   { name: "Merge", uv: 0, pv: 0, amt: 2400 },
// // // //   { name: "Alert", uv: 200, pv: 1500, amt: 1700 },
// // // //   { name: "C", uv: 100, pv: 2400, amt: 2500 },
// // // //   { name: "D", uv: 300, pv: 1000, amt: 1300 },
// // // //   { name: "E", uv: 700, pv: 2400, amt: 3100 },
// // // //   { name: "F", uv: 500, pv: 2000, amt: 2500 },
// // // //   { name: "G", uv: 900, pv: 4000, amt: 4900 },
// // // // ];

// // // // // Custom tick formatter for XAxis to render icons
// // // // const CustomTick = ({ x, y, payload }) => {
// // // //   if (payload.value === "Merge") {
// // // //     return <AiFillMerge x={x - 10} y={y - 10} size={20} color="black" />;
// // // //   }
// // // //   if (payload.value === "Alert") {
// // // //     return <AiFillAlert x={x - 10} y={y - 10} size={30} color="black" />;
// // // //   }
// // // //   return (
// // // //     <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
// // // //       {payload.value}
// // // //     </text>
// // // //   );
// // // // };

// // // // const UserDashboard = () => {
// // // //   return (
// // // //     <div>
// // // //       <div>
// // // //         <h1>UserDashboard</h1>
// // // //       </div>
// // // //       <AiFillMerge size={30} />
// // // //       <p>
// // // //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
// // // //         repellendus, dolore similique iure omnis, quam esse pariatur officiis in
// // // //         illo dicta suscipit at quod? Voluptatem repudiandae iusto error ex hic!
// // // //       </p>
// // // //       <div>
// // // //         <ul className="m-1 p-2 flex space-x-5">
// // // //           <li>
// // // //             <div className="block w-10 h-10 bg-pink-500"></div>
// // // //           </li>
// // // //           <li>
// // // //             <div className="block w-10 h-10 bg-pink-500"></div>
// // // //           </li>
// // // //           <li>
// // // //             <div className="block w-10 h-10 bg-pink-500"></div>
// // // //           </li>
// // // //         </ul>
// // // //         <div>
// // // //           <LineChart data={data} width={800} height={400}>
// // // //             <Line type="monotone" dataKey="pv" stroke="#ffabab" dot={false} />
// // // //             <Line type="monotone" dataKey="uv" stroke="#ffbbbb" dot={false} />
// // // //             <Line type="monotone" dataKey="amt" stroke="#ffaaaa" dot={false} />
// // // //             {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
// // // //             <YAxis />
// // // //             <XAxis dataKey="name" tick={<CustomTick />} />
// // // //             <Tooltip />
// // // //           </LineChart>
// // // //         </div>
// // // //         <div>
// // // //           <LineChart width={200} height={100} data={data}>
// // // //             <Line type="monotone" dataKey="amt" stroke="#ff6b6b" dot={false} />
// // // //           </LineChart>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default UserDashboard;
