import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
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
    <div className="max-w-full mx-auto p-6">
      <h1 className="text-4xl font-bold  mb-8">User Dashboard</h1>
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

  const chartData = React.useMemo(() => {
    if (!analytic?.data) return [];
    return [
      {
        name: "Analytics",
        // total_users: analytic.data.total_users || 0,
        // total_jobs: analytic.data.total_jobs || 0,
        total_applications: analytic.data.total_applications || 0,
        total_savedJobs: analytic.data.total_savedJobs || 0,
        total_appliedJobs: analytic.data.total_appliedJobs || 0,
        total_uploadedResumes: analytic.data.total_uploadedResumes || 0,
      },
    ];
  }, [analytic]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Analytics Card */}
      <section className=" rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold  mb-4">Analytics Overview</h2>
        {isAnalyticLoading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : analyticError ? (
          <p className="text-red-500">
            Error: {analyticError.data?.message || "Unknown error"}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="total_users" fill="#4F46E5" name="Total Users" />
              <Bar dataKey="total_jobs" fill="#10B981" name="Total Jobs" /> */}
              <Bar
                dataKey="total_applications"
                fill="#F59E0B"
                name="Total Applications"
              />
              <Bar
                dataKey="total_savedJobs"
                fill="#EF4444"
                name="Total Saved Jobs"
              />
              <Bar
                dataKey="total_appliedJobs"
                fill="#8B5CF6"
                name="Total Applied Jobs"
              />
              <Bar
                dataKey="total_uploadedResumes"
                fill="#06B6D4"
                name="Total Uploaded Resumes"
              />
            </BarChart>
          </div>
        )}
      </section>

      {/* Saved Jobs Card */}
      <section className=" rounded-xl border shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Saved Jobs</h2>
        {isSavedJobsLoading ? (
          <p className="text-gray-500">Loading saved jobs...</p>
        ) : savedJobsError ? (
          <p className="text-red-500">
            Error: {savedJobsError.data?.message || "Unknown error"}
          </p>
        ) : savedJobs?.data?.length === 0 ? (
          <p className="text-gray-500">No saved jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium ">
                    Job Title
                  </th>
                  <th className="text-right py-3 px-4 font-medium ">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {savedJobs.data.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{job.title}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteSavedJob(job.id)}
                        disabled={isDeletingSavedJob}
                        className="text-sm p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
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

      {/* Applications Card */}
      <section className=" rounded-xl border shadow-lg p-6 col-span-1 lg:col-span-2">
        <h2 className="text-2xl font-semibold  mb-4">Applications</h2>
        {isApplicationLoading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : applicationsError ? (
          <p className="text-red-500">
            Error: {applicationsError.data?.message || "Unknown error"}
          </p>
        ) : applications?.data?.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium ">
                    Job Title
                  </th>
                  <th className="text-left py-3 px-4 font-medium ">Status</th>
                  <th className="text-right py-3 px-4 font-medium ">Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {applications.data.map((app) => (
                  <tr key={app.id} className="hover:bg-cyan-900">
                    <td className="py-3 px-4">{app.title}</td>
                    <td className="py-3 px-4 text-green-500">{app.status}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        disabled={isDeletingApplication}
                        className="text-sm p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
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
