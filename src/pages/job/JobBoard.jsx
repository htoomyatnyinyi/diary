// import { useGetJobsQuery, useGetJobByIdQuery } from "./jobApi";
import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
import { useSelector, useDispatch } from "react-redux";
import { selectJob } from "../../redux/slice/jobSlice";
// import { selectJob } from "./jobSlice"; // Assume a slice for job selection
import { useEffect, useMemo } from "react";
import { debounce } from "lodash";

const JobBoard = () => {
  const dispatch = useDispatch();
  const selectedJobId = useSelector((state) => state.reducer.job.selectedJobId);

  // Fetch jobs with pagination and controlled polling
  const {
    data: jobs,
    isLoading,
    error,
  } = useGetJobsQuery(
    { page: 1, limit: 10 },
    {
      pollingInterval: 15000, // Poll every 15 seconds
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch job details only for selected job
  const { data: selectedJob } = useGetJobByIdQuery(selectedJobId, {
    skip: !selectedJobId, // Avoid fetching if no job is selected
  });

  // Debounce job selection to prevent rapid API calls
  const debouncedSelectJob = useMemo(
    () =>
      debounce((jobId) => {
        dispatch(selectJob(jobId));
      }, 300),
    [dispatch]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSelectJob.cancel();
  }, [debouncedSelectJob]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Job Listings</h1>
      <ul>
        {jobs?.data.map((job) => (
          <li
            key={job.id}
            onClick={() => debouncedSelectJob(job.id)}
            style={{
              cursor: "pointer",
              fontWeight: job.id === selectedJobId ? "bold" : "normal",
            }}
          >
            {job.title || "Untitled Job"}
          </li>
        ))}
      </ul>
      {selectedJob && (
        <div>
          <h2>{selectedJob.title || "No Title"}</h2>
          <p>{selectedJob.description || "No Description"}</p>
          <p>
            Salary: ${selectedJob.salary_min || "N/A"} - $
            {selectedJob.salary_max || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobBoard;

// // import { useGetJobsQuery, useGetJobByIdQuery } from "./jobApi";
// import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
// import { useSelector, useDispatch } from "react-redux";
// import { selectJob } from "../../redux/slice/jobSlice";
// import { useEffect, useMemo } from "react";
// import { debounce } from "lodash";

// const JobBoard = () => {
//   const dispatch = useDispatch();
//   const selectedJobId = useSelector((state) => state.reducer.job.selectedJobId);

//   // Fetch job list with reasonable polling
//   const {
//     data: jobs,
//     isLoading,
//     error,
//   } = useGetJobsQuery(null, {
//     // pollingInterval: 15000, // Poll every 15 seconds
//     // skipPollingIfUnfocused: true,
//     refetchOnMountOrArgChange: true,
//   });

//   // Fetch selected job details only if needed
//   const { data: selectedJob } = useGetJobByIdQuery(selectedJobId, {
//     skip: !selectedJobId,
//   });

//   // Debounce job selection to prevent rapid subscription changes
//   const debouncedSelectJob = useMemo(
//     () =>
//       debounce((jobId) => {
//         dispatch(selectJob(jobId));
//       }, 300),
//     [dispatch]
//   );

//   // Clean up subscriptions on unmount
//   useEffect(() => {
//     return () => {
//       debouncedSelectJob.cancel();
//     };
//   }, [debouncedSelectJob]);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <div>
//       <h1>Jobs</h1>
//       <ul>
//         {jobs?.data.map((job) => (
//           <li
//             key={job.id}
//             onClick={() => debouncedSelectJob(job.id)}
//             style={{ cursor: "pointer" }}
//           >
//             {job.title || "Untitled Job"}
//           </li>
//         ))}
//       </ul>
//       {selectedJob && (
//         <div>
//           <h2>{selectedJob.title}</h2>
//           <p>{selectedJob.description}</p>
//           <p>
//             Salary: ${selectedJob.salary_min} - ${selectedJob.salary_max}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobBoard;
