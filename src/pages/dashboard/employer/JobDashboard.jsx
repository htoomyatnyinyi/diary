import React, { useState } from "react";
import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next
import {
  useGetAppliedJobsQuery,
  useUpdateApplicationStatusMutation,
} from "../../../redux/api/employerApi";

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
  const {
    data: getAppliedJobs,
    isLoading: isGetAppliedJobLoading,
    isError: isGetAppliedJobError,
    // You might want to add 'refetch' if you want to refresh the list after an update
    // refetch: refetchAppliedJobs,
  } = useGetAppliedJobsQuery();

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

  // const handleStatusChange = (applicationId, newStatus) => {
  //   console.log("Hi", applicationId, newStatus);
  // };

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

  // // Check if the response structure is as expected before mapping
  // if (!getAppliedJobs || !Array.isArray(getAppliedJobs.data)) {
  //   console.error(
  //     "Unexpected data structure for applied jobs:",
  //     getAppliedJobs
  //   );
  //   return (
  //     <div>
  //       <h1>Could not load job data or no jobs found.</h1>
  //     </div>
  //   );
  // }

  // if (getAppliedJob.data.length === 0) {
  //   return (
  //     <div>
  //       <h1>No one has applied to your posted jobs yet.</h1>
  //     </div>
  //   );
  // }

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
                {getAppliedJobs.data.map((e) => (
                  <div key={e.id} className="m-1 p-2 outline">
                    <div className="text-green-500">
                      <p className="text-3xl underline">{e.title}</p>
                      <p>{e.description}</p>
                      <p>{e.min_salary}</p>
                      <p>{e.category}</p>
                      <p>{e.employment_type}</p>
                      <p>{e.location}</p>
                      <p>{e.salary_min}</p>
                      <p>{e.salary_max}</p>
                      <div className="mt-2">
                        <div className="text-pink-600 dark:text-pink-400">
                          <strong>Total Applications: </strong>
                          {e.application_count ?? 0}{" "}
                          {/* Use nullish coalescing */}
                        </div>
                        <p className="text-red-600 dark:text-red-400">
                          <strong>Deadline: </strong>
                          {/* Format date for better readability */}
                          {e.application_deadline
                            ? new Date(
                                e.application_deadline
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      {/* <div>
                        <div className="text-pink-500">
                          <strong>Total User Application Count</strong>
                          {e.application_count}
                        </div>
                        <p className="text-red-300">
                          Application Close After This Day ::
                          {e.application_deadline}
                        </p>
                      </div> */}
                    </div>

                    {/* --- Applications List for this Job --- */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Applications Received:
                      </h4>
                      {e.applications.map((a) => (
                        <div
                          key={a.id}
                          className="bg-white text-cyan-900 dark:bg-cyan-900 dark:text-white p-2 m-1"
                        >
                          <div>
                            <p>
                              <label>Job Application ID :</label>
                              {a.id}
                            </p>
                            <div>
                              <label>
                                Click Here to Get Applied Profile Info
                              </label>
                              <button
                                onClick={() =>
                                  console.log("View Profile Funtion")
                                }
                                className="bg-green-500 p-2 m-1 hover:bg-green-900"
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                          <p>
                            <strong>Applied User ID :: </strong>
                            {a.user_id}
                          </p>
                          <p>
                            <strong>Applied Time :: </strong>
                            {a.applied_at}
                          </p>
                          <p>
                            <strong>Resume Attachment ID :: </strong>
                            {a.resume_id}
                          </p>
                          <p>
                            <strong>Job Status to Applications :: </strong>
                            {a.status}
                          </p>
                          <p>
                            <strong>Status Update Time :: </strong>
                            {a.updated_at}
                          </p>
                          {/* // edit reamin from here */}
                          <label>Change The Job Status Here :: </label>
                          <select
                            // id={`status-select-${a.id}`}
                            // id={a.id}
                            value={a.status}
                            onChange={(e) =>
                              handleStatusChange(a.id, e.target.value)
                            }
                            disabled={isUpdateApplicationStatusLoading}
                            className="bg-white hover:bg-green-400 text-black p-2 m-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interview</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                            <option value="withdraw">WithDraw</option>
                          </select>
                        </div>
                      ))}
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
