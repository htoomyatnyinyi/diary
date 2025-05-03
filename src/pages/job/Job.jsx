import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
import { selectJob } from "../../redux/slice/jobSlice";
import CreateNewJob from "../dashboard/employer/CreateNewJob";
import JobDetails from "./JobDetails";
import { useAuthMeQuery } from "../../redux/api/authApi";
// import coverImg from "../../assets/utils/A.png";ß

const Job = () => {
  const dispatch = useDispatch();
  const selectedJobId = useSelector((state) => state.slice.job.selectedJobId);

  // RTK Query hooks for fetching data
  const {
    data: authData,
    isLoading: isAuthLoading,
    error: authError,
  } = useAuthMeQuery(null);

  const {
    data: jobs = { data: [] },
    isLoading: isJobListLoading,
    error: jobListError,
  } = useGetJobsQuery(null);

  const {
    data: jobDetails,
    isLoading: isJobDetailsLoading,
    error: jobDetailsError,
  } = useGetJobByIdQuery(selectedJobId, { skip: !selectedJobId });

  // State for managing the sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  const viewJobDetails = (id) => {
    dispatch(selectJob(id));
  };

  const deselectJob = () => {
    dispatch(selectJob(null));
  };

  if (isJobListLoading)
    return <p className="p-4 text-center">Loading Job List...</p>;

  if (jobListError)
    return (
      <p className="p-4 text-center text-green-500">
        Error loading jobs: {jobListError.toString()}
      </p>
    );

  // // auth query
  // // destructuring the object from authme
  // const {
  //   user: { role },
  // } = data || {};
  // Safely get the role with proper fallbacks
  const role = authData?.user?.role;

  return (
    <div className="min-h-screen">
      {/* Header Area with Create Button */}
      <div className="p-4 flex justify-between items-center">
        {/* // Then use the role in your conditional rendering */}
        {role === "employer" && (
          <div className="">
            <h1 className="text-2xl font-semibold">Job Postings</h1>
            <button
              onClick={openSidebar}
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Job
            </button>
            <CreateNewJob isOpen={isSidebarOpen} onClose={closeSidebar} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col md:grid md:grid-cols-3 min-h-[calc(100vh-80px)]">
        {/* Job List: Full width on mobile, 1/3 on desktop */}
        <div
          className={`col-span-1 border-r border-gray-300 md:block ${
            selectedJobId ? "hidden md:block" : "block"
          }`}
        >
          <JobLists
            jobs={jobs.data}
            onJobSelect={viewJobDetails}
            selectedJobId={selectedJobId}
          />
        </div>

        {/* Job Details: Slide-in on mobile, 2/3 on desktop */}
        <div
          className={`col-span-2 fixed inset-0 md:static bg-slate-900 md:bg-transparent transform transition-transform duration-300 ease-in-out ${
            selectedJobId
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          } md:block ${
            selectedJobId ? "block" : "hidden md:block"
          } z-50 md:z-auto`}
        >
          {selectedJobId && isJobDetailsLoading ? (
            <p className="p-4 text-center text-white">Loading Job Details...</p>
          ) : selectedJobId && jobDetailsError ? (
            <p className="p-4 text-center text-red-500">
              Error loading job details.
            </p>
          ) : (
            <JobDetails
              // coverImg={coverImg} // directly import form jobdetails
              job={jobDetails?.data}
              onBack={deselectJob} // Pass deselect function for mobile "Back" button
              role={role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;

const JobLists = ({ jobs, onJobSelect, selectedJobId }) => {
  if (!jobs || jobs.length === 0) {
    return <p className="p-4 text-white">No jobs found.</p>;
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide border-r border-cyan-900">
      {jobs.map((job) => (
        <div
          key={job.id}
          onClick={() => onJobSelect(job.id)}
          className={`p-6 m-4 rounded cursor-pointer transition-colors duration-150 ease-in-out ${
            selectedJobId === job.id
              ? "border-4 dark:text-white text-cyan-900"
              : "bg-slate-900 hover:bg-black text-white"
          }`}
        >
          <p className="font-semibold">{job.title}</p>
          <h1>Micro Labs</h1>
          <p>{job.description}</p>
          <br />
          <p className="text-sm">
            {job.employment_type} - {job.location || "N/A"}
          </p>
          <p>{job.address}</p>
          {(job.salary_min || job.salary_max) && (
            <p className="text-sm text-green-500 p-2 m-1">
              ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
