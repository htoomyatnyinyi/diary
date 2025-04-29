import React, { useState } from "react";
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
  useGetAppliedUserProfileByIdQuery,
  useGetAppliedUserResumeByIdQuery,
} from "../../../redux/api/employerApi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set workerSrc for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const EmployerDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Employer Dashboard
      </h1>
      <Status />
    </div>
  );
};

export default EmployerDashboard;

const SlideView = ({ isOpen, onClose, userId, resumeId, viewType }) => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useGetAppliedUserProfileByIdQuery(userId, {
    skip: !isOpen || viewType !== "profile",
  });

  const {
    data: resume,
    isLoading: isResumeLoading,
    isError: isResumeError,
    error: resumeError,
  } = useGetAppliedUserResumeByIdQuery(resumeId, {
    skip: !isOpen || viewType !== "resume" || !resumeId,
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* Sidebar */}
      <div
        className={`relative w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {viewType === "profile"
                ? "Applicant Profile"
                : "Applicant Resume"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {viewType === "profile" && (
            <div>
              {isProfileLoading ? (
                <p>Loading profile...</p>
              ) : isProfileError ? (
                <p className="text-red-500">
                  Error loading profile:{" "}
                  {profileError?.data?.message || "Unknown error"}
                </p>
              ) : profile?.data ? (
                <div className="space-y-2">
                  <p>
                    <strong>First Name:</strong>{" "}
                    {profile.data.first_name || "N/A"}
                  </p>
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {profile.data.last_name || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile.data.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {profile.data.location || "N/A"}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.data.bio || "N/A"}
                  </p>
                  {profile.data.profile_image_url && (
                    <img
                      src={profile.data.profile_image_url}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mt-2"
                    />
                  )}
                </div>
              ) : (
                <p>No profile data found.</p>
              )}
            </div>
          )}
          {viewType === "resume" && (
            <div>
              {isResumeLoading ? (
                <p>Loading resume...</p>
              ) : isResumeError ? (
                <p className="text-red-500">
                  Error loading resume:{" "}
                  {resumeError?.data?.message || "Unknown error"}
                </p>
              ) : resume ? (
                <div className="bg-gray-100 p-2 rounded">
                  <Document
                    file={resume}
                    onLoadError={(error) =>
                      console.error("PDF load error:", error)
                    }
                  >
                    <Page pageNumber={1} width={300} />
                  </Document>
                </div>
              ) : (
                <p>No resume data found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

  const [slideView, setSlideView] = useState({
    isOpen: false,
    userId: null,
    resumeId: null,
    viewType: null, // "profile" or "resume"
  });

  const openSlideView = (userId, resumeId, viewType) => {
    setSlideView({ isOpen: true, userId, resumeId, viewType });
  };

  const closeSlideView = () => {
    setSlideView({
      isOpen: false,
      userId: null,
      resumeId: null,
      viewType: null,
    });
  };

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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h2>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Posts</h2>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Applications
        </h2>
        {isAppliedJobsLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : appliedJobsError ? (
          <p className="text-red-500">
            Error loading applications:{" "}
            {appliedJobsError.data?.message || "Unknown error"}
          </p>
        ) : !appliedJobs?.data ||
          appliedJobs.data.every(
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
                {appliedJobs.data.flatMap((job) =>
                  job.applications && job.applications.length > 0
                    ? job.applications.map((app) => (
                        <tr key={app.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {job.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() =>
                                openSlideView(
                                  app.user_id,
                                  app.resume_id,
                                  "profile"
                                )
                              }
                              className="text-blue-600 hover:underline"
                            >
                              View Profile
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.resume_id ? (
                              <button
                                onClick={() =>
                                  openSlideView(
                                    app.user_id,
                                    app.resume_id,
                                    "resume"
                                  )
                                }
                                className="text-blue-600 hover:underline"
                              >
                                View Resume
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <select
                              value={app.status || "pending"}
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
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    : []
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SlideView for Profile and Resume */}
      <SlideView
        isOpen={slideView.isOpen}
        onClose={closeSlideView}
        userId={slideView.userId}
        resumeId={slideView.resumeId}
        viewType={slideView.viewType}
      />
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
//       <h1 className="text-3xl font-bold  mb-4">Employer Dashboard</h1>
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
//         <h2 className="text-2xl font-semibold  mb-4">Profile</h2>
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
//         <h2 className="text-2xl font-semibold  mb-4">Analytics</h2>
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
//         <h2 className="text-2xl font-semibold mb-4">Job Posts</h2>
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
//         <h2 className="text-2xl font-semibold  mb-4">Applications</h2>
//         {isAppliedJobsLoading ? (
//           <p className="text-gray-500">Loading applications...</p>
//         ) : appliedJobsError ? (
//           <p className="text-red-500">
//             Error loading applications:
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
//                       {console.log(app, "app at")}

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {/* console.log(app, 'app job application') */}
//                         {job.title}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <a
//                           href={`/employer/applicant/${app.user_id}`}
//                           className="text-blue-600 hover:underline"
//                         >
//                           View Profile
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

// // import React from "react";
// // import {
// //   LineChart,
// //   Line,
// //   CartesianGrid,
// //   Tooltip,
// //   XAxis,
// //   YAxis,
// //   Legend,
// // } from "recharts";
// // import {
// //   useGetEmployerProfileQuery,
// //   useGetOwnJobsQuery,
// //   useDeleteJobMutation,
// //   useGetAppliedJobsQuery,
// //   useUpdateApplicationStatusMutation,
// //   useGetAnalyticsQuery,
// // } from "../../../redux/api/employerApi";

// // const EmployerDashboard = () => {
// //   return (
// //     <div className="max-w-5xl mx-auto p-6">
// //       <h1 className="text-3xl font-bold text-gray-900 mb-4">
// //         Employer Dashboard
// //       </h1>
// //       <Status />
// //     </div>
// //   );
// // };

// // export default EmployerDashboard;

// // const Status = () => {
// //   const {
// //     data: profile,
// //     isLoading: isProfileLoading,
// //     error: profileError,
// //   } = useGetEmployerProfileQuery();

// //   const {
// //     data: analytics,
// //     isLoading: isAnalyticsLoading,
// //     error: analyticsError,
// //   } = useGetAnalyticsQuery();

// //   const {
// //     data: jobs,
// //     isLoading: isJobsLoading,
// //     error: jobsError,
// //     refetch: refetchJobs,
// //   } = useGetOwnJobsQuery({ page: 1, limit: 10 });

// //   const {
// //     data: appliedJobs,
// //     isLoading: isAppliedJobsLoading,
// //     error: appliedJobsError,
// //     refetch: refetchAppliedJobs,
// //   } = useGetAppliedJobsQuery({ page: 1, limit: 10 });

// //   const [deleteJob, { isLoading: isDeletingJob }] = useDeleteJobMutation();
// //   const [updateApplicationStatus, { isLoading: isUpdatingStatus }] =
// //     useUpdateApplicationStatusMutation();

// //   const handleDeleteJob = async (jobId) => {
// //     try {
// //       await deleteJob(jobId).unwrap();
// //       refetchJobs();
// //     } catch (error) {
// //       console.error("Error deleting job:", error);
// //       alert("Failed to delete job.");
// //     }
// //   };

// //   const handleUpdateStatus = async (applicationId, status) => {
// //     try {
// //       await updateApplicationStatus({
// //         id: applicationId,
// //         statusData: { status },
// //       }).unwrap();
// //       refetchAppliedJobs();
// //     } catch (error) {
// //       console.error("Error updating application status:", error);
// //       alert("Failed to update application status.");
// //     }
// //   };

// //   // Transform analytics data for Recharts
// //   const chartData = React.useMemo(() => {
// //     if (!analytics?.data) return [];

// //     const { jobStats = [], applicationStats = [] } = analytics.data;

// //     // Combine jobStats and applicationStats by date
// //     const dates = [
// //       ...new Set([
// //         ...jobStats.map((item) => item.date),
// //         ...applicationStats.map((item) => item.date),
// //       ]),
// //     ].sort();

// //     return dates.map((date) => ({
// //       date,
// //       jobs: jobStats.find((item) => item.date === date)?.job_count || 0,
// //       applications:
// //         applicationStats.find((item) => item.date === date)
// //           ?.application_count || 0,
// //     }));
// //   }, [analytics]);

// //   return (
// //     <div className="space-y-8">
// //       {/* Profile Section */}
// //       <section>
// //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h2>
// //         {isProfileLoading ? (
// //           <p className="text-gray-500">Loading profile...</p>
// //         ) : profileError ? (
// //           <p className="text-red-500">
// //             Error loading profile:{" "}
// //             {profileError.data?.message || "Unknown error"}
// //           </p>
// //         ) : !profile?.data ? (
// //           <p className="text-gray-500">No profile found.</p>
// //         ) : (
// //           <div className="bg-white p-6 rounded-lg shadow-md">
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div>
// //                 <h3 className="text-lg font-medium text-gray-900">
// //                   Company Name
// //                 </h3>
// //                 <p className="text-gray-600">{profile.data.company_name}</p>
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-medium text-gray-900">
// //                   Contact Phone
// //                 </h3>
// //                 <p className="text-gray-600">{profile.data.contact_phone}</p>
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-medium text-gray-900">Industry</h3>
// //                 <p className="text-gray-600">
// //                   {profile.data.industry || "N/A"}
// //                 </p>
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-medium text-gray-900">Website</h3>
// //                 <p className="text-gray-600">
// //                   {profile.data.website_url ? (
// //                     <a
// //                       href={profile.data.website_url}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="text-blue-600 hover:underline"
// //                     >
// //                       {profile.data.website_url}
// //                     </a>
// //                   ) : (
// //                     "N/A"
// //                   )}
// //                 </p>
// //               </div>
// //               <div className="col-span-2">
// //                 <h3 className="text-lg font-medium text-gray-900">
// //                   Description
// //                 </h3>
// //                 <p className="text-gray-600">
// //                   {profile.data.company_description || "N/A"}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </section>

// //       {/* Analytics Section */}
// //       <section>
// //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analytics</h2>
// //         {isAnalyticsLoading ? (
// //           <p className="text-gray-500">Loading analytics...</p>
// //         ) : analyticsError ? (
// //           <p className="text-red-500">
// //             Error loading analytics:{" "}
// //             {analyticsError.data?.message || "Unknown error"}
// //           </p>
// //         ) : !chartData.length ? (
// //           <p className="text-gray-500">No analytics data available.</p>
// //         ) : (
// //           <div className="bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
// //             <LineChart
// //               width={Math.min(window.innerWidth - 40, 600)}
// //               height={300}
// //               data={chartData}
// //               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
// //             >
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="date" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Line
// //                 type="monotone"
// //                 dataKey="jobs"
// //                 stroke="#3b82f6"
// //                 name="Job Posts"
// //                 dot={false}
// //               />
// //               <Line
// //                 type="monotone"
// //                 dataKey="applications"
// //                 stroke="#10b981"
// //                 name="Applications"
// //                 dot={false}
// //               />
// //             </LineChart>
// //             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div className="p-4 bg-blue-100 rounded-md">
// //                 <h3 className="text-lg font-medium text-gray-900">
// //                   Total Jobs
// //                 </h3>
// //                 <p className="text-2xl font-bold text-blue-600">
// //                   {analytics.data.totalJobs}
// //                 </p>
// //               </div>
// //               <div className="p-4 bg-green-100 rounded-md">
// //                 berta
// //                 <h3 className="text-lg font-medium text-gray-900">
// //                   Total Applications
// //                 </h3>
// //                 <p className="text-2xl font-bold text-green-600">
// //                   {analytics.data.totalApplications}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </section>

// //       {/* Jobs Section */}
// //       <section>
// //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Posts</h2>
// //         {isJobsLoading ? (
// //           <p className="text-gray-500">Loading jobs...</p>
// //         ) : jobsError ? (
// //           <p className="text-red-500">
// //             Error loading jobs: {jobsError.data?.message || "Unknown error"}
// //           </p>
// //         ) : jobs?.data?.length === 0 ? (
// //           <p className="text-gray-500">No jobs found.</p>
// //         ) : (
// //           <div className="bg-white rounded-lg shadow-md overflow-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Title
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Applications
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {jobs?.data?.map((job) => (
// //                   <tr key={job.id}>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                       {job.title}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                       {job.application_count}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                       {job.is_active ? "Active" : "Inactive"}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
// //                       <button
// //                         onClick={() => handleDeleteJob(job.id)}
// //                         disabled={isDeletingJob}
// //                         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
// //                       >
// //                         Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </section>

// //       {/* Applications Section */}
// //       <section>
// //         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
// //           Applications
// //         </h2>
// //         {isAppliedJobsLoading ? (
// //           <p className="text-gray-500">Loading applications...</p>
// //         ) : appliedJobsError ? (
// //           <p className="text-red-500">
// //             Error loading applications:{" "}
// //             {appliedJobsError.data?.message || "Unknown error"}
// //           </p>
// //         ) : appliedJobs?.data?.every(
// //             (job) => !job.applications || job.applications.length === 0
// //           ) ? (
// //           <p className="text-gray-500">No applications found.</p>
// //         ) : (
// //           <div className="bg-white rounded-lg shadow-md overflow-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Job Title
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Applicant
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Resume
// //                   </th>
// //                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {appliedJobs?.data?.flatMap((job) =>
// //                   job.applications?.map((app) => (
// //                     <tr key={app.id}>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                         {job.title}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         <a
// //                           href={`/employer/applicant/${app.user_id}`}
// //                           className="text-blue-600 hover:underline"
// //                         >
// //                           View Profile اردیبهشت
// //                         </a>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         {app.status}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                         {app.resume_id ? (
// //                           <a
// //                             href={`/api/employer/applied-user-resume/${app.resume_id}`}
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="text-blue-600 hover:underline"
// //                           >
// //                             Download Resume
// //                           </a>
// //                         ) : (
// //                           "N/A"
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
// //                         <select
// //                           value={app.status}
// //                           onChange={(e) =>
// //                             handleUpdateStatus(app.id, e.target.value)
// //                           }
// //                           disabled={isUpdatingStatus}
// //                           className="px-4 py-2 border rounded-md"
// //                         >
// //                           {[
// //                             "pending",
// //                             "reviewed",
// //                             "interviewed",
// //                             "offered",
// //                             "rejected",
// //                             "withdrawn",
// //                           ].map((status) => (
// //                             <option key={status} value={status}>
// //                               {status.charAt(0).toUpperCase() + status.slice(1)}
// //                             </option>
// //                           ))}
// //                         </select>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </section>
// //     </div>
// //   );
// // };

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const employeeData = [
//   { month: "Jan", employees: 120, applications: 240 },
//   { month: "Feb", employees: 130, applications: 280 },
//   { month: "Mar", employees: 125, applications: 300 },
//   { month: "Apr", employees: 140, applications: 320 },
//   { month: "May", employees: 135, applications: 310 },
//   { month: "Jun", employees: 150, applications: 350 },
// ];

// const jobData = [
//   { day: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
//   { day: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
//   { day: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
//   { day: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
//   { day: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
//   { day: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
//   { day: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
// ];

// const statisticData = [
//   { name: "Job Booster", value: 2300 },
//   { name: "Job Alert", value: 274 },
// ];

// const COLORS = ["#4b9bff", "#a3cfff"];

// function Employer() {
//   return (
//     <div className="flex h-screen ">
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             <div className="p-6 rounded-lg shadow">
//               <h3 className=" text-sm font-medium">Total Employees</h3>
//               <p className="mt-2 text-3xl font-semsibold">150</p>
//             </div>
//             <div className="p-6 rounded-lg shadow">
//               <h3 className=" text-sm font-medium">Job Applications</h3>
//               <p className="mt-2 text-3xl font-semibold">350</p>
//             </div>
//             <div className="p-6 rounded-lg shadow">
//               <h3 className=" text-sm font-medium">Open Positions</h3>
//               <p className="mt-2 text-3xl font-semibold">12</p>
//             </div>
//             <div className="p-6 rounded-lg shadow">
//               <h3 className=" text-sm font-medium">Departments</h3>
//               <p className="mt-2 text-3xl font-semibold">8</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//             <div className="p-6 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Employee Growth</h2>
//               <LineChart width={400} height={300} data={employeeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="employees" stroke="#8884d8" />
//               </LineChart>
//             </div>
//             <div className="p-6 rounded-lg shadow">
//               <h2 className="text-lg font-semibold mb-4">Job Applications</h2>
//               <BarChart width={400} height={300} data={employeeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="applications" fill="#82ca9d" />
//               </BarChart>
//             </div>
//           </div>

//           {/* Popular Jobs Section */}
//           <div className="p-6 rounded-lg shadow mt-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Popular Jobs</h2>
//               <select className="border rounded p-1 text-gray-600">
//                 <option>This Week</option>
//                 <option>Last Week</option>
//                 <option>This Month</option>
//               </select>
//             </div>
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-700">UID</p>
//                   <p className="text-xs ">UI Designer</p>
//                 </div>
//                 <div className="w-1/2">
//                   <LineChart width={200} height={50} data={jobData}>
//                     <Line
//                       type="monotone"
//                       dataKey="UID"
//                       stroke="#ff6b6b"
//                       dot={false}
//                     />
//                   </LineChart>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-700">3,837</p>
//                   <p className="text-xs text-red-500">-32%</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-700">UXD</p>
//                   <p className="text-xs ">UX Designer</p>
//                 </div>
//                 <div className="w-1/2">
//                   <LineChart width={200} height={50} data={jobData}>
//                     <Line
//                       type="monotone"
//                       dataKey="UXD"
//                       stroke="#4b9bff"
//                       dot={false}
//                     />
//                   </LineChart>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-700">2,345</p>
//                   <p className="text-xs text-green-500">+12%</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-700">PM</p>
//                   <p className="text-xs ">Project Manager</p>
//                 </div>
//                 <div className="w-1/2">
//                   <LineChart width={200} height={50} data={jobData}>
//                     <Line
//                       type="monotone"
//                       dataKey="PM"
//                       stroke="#4b9bff"
//                       dot={false}
//                     />
//                   </LineChart>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-700">1,345</p>
//                   <p className="text-xs text-green-500">+24%</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Statistic (Donut Chart) Section */}
//           <div className="p-6 rounded-lg shadow mt-6 relative">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold flex items-center">
//                 Statistic
//                 <svg
//                   className="w-5 h-5 ml-2 "
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </h2>
//               <select className="border rounded p-1 text-gray-600">
//                 <option>This Week</option>
//                 <option>Last Week</option>
//                 <option>This Month</option>
//               </select>
//             </div>
//             <div className="flex justify-center relative">
//               <PieChart width={300} height={300}>
//                 <Pie
//                   data={statisticData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={80}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   labelLine={false}
//                 >
//                   {statisticData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//                 <p className="">Total</p>
//                 <p className="text-2xl font-semibold">2574</p>
//               </div>
//             </div>
//             <div className="flex justify-center mt-4 space-x-6">
//               {statisticData.map((entry, index) => (
//                 <div key={entry.name} className="flex items-center">
//                   <span
//                     className="w-4 h-4 rounded-full mr-2"
//                     style={{ backgroundColor: COLORS[index] }}
//                   ></span>
//                   <span className="text-sm text-gray-700">
//                     {entry.name}: {entry.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Employer;
