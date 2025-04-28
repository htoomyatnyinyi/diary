import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  useGetEmployerProfileQuery,
  useGetOwnJobsQuery,
  useDeleteJobMutation,
  useGetAppliedJobsQuery,
  useUpdateApplicationStatusMutation,
  useGetAnalyticsQuery,
} from "../../../redux/api/employerApi";

const EmployerDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold  mb-4">Employer Dashboard</h1>
      <Status />
    </div>
  );
};

export default EmployerDashboard;

const Status = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetEmployerProfileQuery();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useGetAnalyticsQuery();

  const {
    data: jobs,
    isLoading: isJobsLoading,
    error: jobsError,
    refetch: refetchJobs,
  } = useGetOwnJobsQuery({ page: 1, limit: 10 });

  const {
    data: appliedJobs,
    isLoading: isAppliedJobsLoading,
    error: appliedJobsError,
    refetch: refetchAppliedJobs,
  } = useGetAppliedJobsQuery({ page: 1, limit: 10 });

  const [deleteJob, { isLoading: isDeletingJob }] = useDeleteJobMutation();
  const [updateApplicationStatus, { isLoading: isUpdatingStatus }] =
    useUpdateApplicationStatusMutation();

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId).unwrap();
      refetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job.");
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus({
        id: applicationId,
        statusData: { status },
      }).unwrap();
      refetchAppliedJobs();
    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status.");
    }
  };

  // Transform analytics data for Recharts
  const chartData = React.useMemo(() => {
    if (!analytics?.data) return [];

    const { jobStats = [], applicationStats = [] } = analytics.data;

    // Combine jobStats and applicationStats by date
    const dates = [
      ...new Set([
        ...jobStats.map((item) => item.date),
        ...applicationStats.map((item) => item.date),
      ]),
    ].sort();

    return dates.map((date) => ({
      date,
      jobs: jobStats.find((item) => item.date === date)?.job_count || 0,
      applications:
        applicationStats.find((item) => item.date === date)
          ?.application_count || 0,
    }));
  }, [analytics]);

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <section>
        <h2 className="text-2xl font-semibold  mb-4">Profile</h2>
        {isProfileLoading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : profileError ? (
          <p className="text-red-500">
            Error loading profile:{" "}
            {profileError.data?.message || "Unknown error"}
          </p>
        ) : !profile?.data ? (
          <p className="text-gray-500">No profile found.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Company Name
                </h3>
                <p className="text-gray-600">{profile.data.company_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Phone
                </h3>
                <p className="text-gray-600">{profile.data.contact_phone}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Industry</h3>
                <p className="text-gray-600">
                  {profile.data.industry || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Website</h3>
                <p className="text-gray-600">
                  {profile.data.website_url ? (
                    <a
                      href={profile.data.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.data.website_url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900">
                  Description
                </h3>
                <p className="text-gray-600">
                  {profile.data.company_description || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Analytics Section */}
      <section>
        <h2 className="text-2xl font-semibold  mb-4">Analytics</h2>
        {isAnalyticsLoading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : analyticsError ? (
          <p className="text-red-500">
            Error loading analytics:{" "}
            {analyticsError.data?.message || "Unknown error"}
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
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#3b82f6"
                name="Job Posts"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#10b981"
                name="Applications"
                dot={false}
              />
            </LineChart>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-md">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Jobs
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.data.totalJobs}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-md">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Applications
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.data.totalApplications}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Jobs Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Job Posts</h2>
        {isJobsLoading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobsError ? (
          <p className="text-red-500">
            Error loading jobs: {jobsError.data?.message || "Unknown error"}
          </p>
        ) : jobs?.data?.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
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
                {jobs?.data?.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.application_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={isDeletingJob}
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
        <h2 className="text-2xl font-semibold  mb-4">Applications</h2>
        {isAppliedJobsLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : appliedJobsError ? (
          <p className="text-red-500">
            Error loading applications:
            {appliedJobsError.data?.message || "Unknown error"}
          </p>
        ) : appliedJobs?.data?.every(
            (job) => !job.applications || job.applications.length === 0
          ) ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appliedJobs?.data?.flatMap((job) =>
                  job.applications?.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a
                          href={`/employer/applicant/${app.user_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View Profile اردیبهشت
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.resume_id ? (
                          <a
                            href={`/api/employer/applied-user-resume/${app.resume_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Download Resume
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateStatus(app.id, e.target.value)
                          }
                          disabled={isUpdatingStatus}
                          className="px-4 py-2 border rounded-md"
                        >
                          {[
                            "pending",
                            "reviewed",
                            "interviewed",
                            "offered",
                            "rejected",
                            "withdrawn",
                          ].map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
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
//   XAxis,
//   YAxis,
//   Legend,
// } from "recharts";
// import {
//   useGetEmployerProfileQuery,
//   useGetOwnJobsQuery,
//   useDeleteJobMutation,
//   useGetAppliedJobsQuery,
//   useUpdateApplicationStatusMutation,
//   useGetAnalyticsQuery,
// } from "../../../redux/api/employerApi";

// const EmployerDashboard = () => {
//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-900 mb-4">
//         Employer Dashboard
//       </h1>
//       <Status />
//     </div>
//   );
// };

// export default EmployerDashboard;

// const Status = () => {
//   const {
//     data: profile,
//     isLoading: isProfileLoading,
//     error: profileError,
//   } = useGetEmployerProfileQuery();

//   const {
//     data: analytics,
//     isLoading: isAnalyticsLoading,
//     error: analyticsError,
//   } = useGetAnalyticsQuery();

//   const {
//     data: jobs,
//     isLoading: isJobsLoading,
//     error: jobsError,
//     refetch: refetchJobs,
//   } = useGetOwnJobsQuery({ page: 1, limit: 10 });

//   const {
//     data: appliedJobs,
//     isLoading: isAppliedJobsLoading,
//     error: appliedJobsError,
//     refetch: refetchAppliedJobs,
//   } = useGetAppliedJobsQuery({ page: 1, limit: 10 });

//   const [deleteJob, { isLoading: isDeletingJob }] = useDeleteJobMutation();
//   const [updateApplicationStatus, { isLoading: isUpdatingStatus }] =
//     useUpdateApplicationStatusMutation();

//   const handleDeleteJob = async (jobId) => {
//     try {
//       await deleteJob(jobId).unwrap();
//       refetchJobs();
//     } catch (error) {
//       console.error("Error deleting job:", error);
//       alert("Failed to delete job.");
//     }
//   };

//   const handleUpdateStatus = async (applicationId, status) => {
//     try {
//       await updateApplicationStatus({
//         id: applicationId,
//         statusData: { status },
//       }).unwrap();
//       refetchAppliedJobs();
//     } catch (error) {
//       console.error("Error updating application status:", error);
//       alert("Failed to update application status.");
//     }
//   };

//   // Transform analytics data for Recharts
//   const chartData = React.useMemo(() => {
//     if (!analytics?.data) return [];

//     const { jobStats = [], applicationStats = [] } = analytics.data;

//     // Combine jobStats and applicationStats by date
//     const dates = [
//       ...new Set([
//         ...jobStats.map((item) => item.date),
//         ...applicationStats.map((item) => item.date),
//       ]),
//     ].sort();

//     return dates.map((date) => ({
//       date,
//       jobs: jobStats.find((item) => item.date === date)?.job_count || 0,
//       applications:
//         applicationStats.find((item) => item.date === date)
//           ?.application_count || 0,
//     }));
//   }, [analytics]);

//   return (
//     <div className="space-y-8">
//       {/* Profile Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h2>
//         {isProfileLoading ? (
//           <p className="text-gray-500">Loading profile...</p>
//         ) : profileError ? (
//           <p className="text-red-500">
//             Error loading profile:{" "}
//             {profileError.data?.message || "Unknown error"}
//           </p>
//         ) : !profile?.data ? (
//           <p className="text-gray-500">No profile found.</p>
//         ) : (
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Company Name
//                 </h3>
//                 <p className="text-gray-600">{profile.data.company_name}</p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Contact Phone
//                 </h3>
//                 <p className="text-gray-600">{profile.data.contact_phone}</p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900">Industry</h3>
//                 <p className="text-gray-600">
//                   {profile.data.industry || "N/A"}
//                 </p>
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900">Website</h3>
//                 <p className="text-gray-600">
//                   {profile.data.website_url ? (
//                     <a
//                       href={profile.data.website_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {profile.data.website_url}
//                     </a>
//                   ) : (
//                     "N/A"
//                   )}
//                 </p>
//               </div>
//               <div className="col-span-2">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Description
//                 </h3>
//                 <p className="text-gray-600">
//                   {profile.data.company_description || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Analytics Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
//         {isAnalyticsLoading ? (
//           <p className="text-gray-500">Loading analytics...</p>
//         ) : analyticsError ? (
//           <p className="text-red-500">
//             Error loading analytics:{" "}
//             {analyticsError.data?.message || "Unknown error"}
//           </p>
//         ) : !chartData.length ? (
//           <p className="text-gray-500">No analytics data available.</p>
//         ) : (
//           <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
//             <LineChart
//               width={Math.min(window.innerWidth - 40, 600)}
//               height={300}
//               data={chartData}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="jobs"
//                 stroke="#3b82f6"
//                 name="Job Posts"
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="applications"
//                 stroke="#10b981"
//                 name="Applications"
//                 dot={false}
//               />
//             </LineChart>
//             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="p-4 bg-blue-100 rounded-md">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Total Jobs
//                 </h3>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {analytics.data.totalJobs}
//                 </p>
//               </div>
//               <div className="p-4 bg-green-100 rounded-md">
//                 berta
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Total Applications
//                 </h3>
//                 <p className="text-2xl font-bold text-green-600">
//                   {analytics.data.totalApplications}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Jobs Section */}
//       <section>
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Posts</h2>
//         {isJobsLoading ? (
//           <p className="text-gray-500">Loading jobs...</p>
//         ) : jobsError ? (
//           <p className="text-red-500">
//             Error loading jobs: {jobsError.data?.message || "Unknown error"}
//           </p>
//         ) : jobs?.data?.length === 0 ? (
//           <p className="text-gray-500">No jobs found.</p>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Applications
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
//                 {jobs?.data?.map((job) => (
//                   <tr key={job.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {job.title}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {job.application_count}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {job.is_active ? "Active" : "Inactive"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                       <button
//                         onClick={() => handleDeleteJob(job.id)}
//                         disabled={isDeletingJob}
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
//         {isAppliedJobsLoading ? (
//           <p className="text-gray-500">Loading applications...</p>
//         ) : appliedJobsError ? (
//           <p className="text-red-500">
//             Error loading applications:{" "}
//             {appliedJobsError.data?.message || "Unknown error"}
//           </p>
//         ) : appliedJobs?.data?.every(
//             (job) => !job.applications || job.applications.length === 0
//           ) ? (
//           <p className="text-gray-500">No applications found.</p>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Job Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Applicant
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Resume
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {appliedJobs?.data?.flatMap((job) =>
//                   job.applications?.map((app) => (
//                     <tr key={app.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {job.title}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <a
//                           href={`/employer/applicant/${app.user_id}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View Profile اردیبهشت
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {app.status}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {app.resume_id ? (
//                           <a
//                             href={`/api/employer/applied-user-resume/${app.resume_id}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 hover:underline"
//                           >
//                             Download Resume
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
//                         <select
//                           value={app.status}
//                           onChange={(e) =>
//                             handleUpdateStatus(app.id, e.target.value)
//                           }
//                           disabled={isUpdatingStatus}
//                           className="px-4 py-2 border rounded-md"
//                         >
//                           {[
//                             "pending",
//                             "reviewed",
//                             "interviewed",
//                             "offered",
//                             "rejected",
//                             "withdrawn",
//                           ].map((status) => (
//                             <option key={status} value={status}>
//                               {status.charAt(0).toUpperCase() + status.slice(1)}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };
