import React from "react";
import { useDispatch, useSelector } from "react-redux";
import coverImg from "../../assets/utils/A.png";
import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
// import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";
// import { selectJob } from "../../redux/slices/jobSlice";
import { selectJob } from "../../redux/slice/jobSlice";

const Job = () => {
  const dispatch = useDispatch();
  const selectedJobId = useSelector((state) => state.reducer.job.selectedJobId);

  const { data, isLoading: isJobLoading } = useGetJobsQuery(null);
  const { data: jobDetails, isLoading: isJobByIdLoading } = useGetJobByIdQuery(
    selectedJobId,
    {
      skip: !selectedJobId,
    }
  );

  if (!data) return <p>There is no data</p>;
  if (isJobLoading) return <p>Loading ....</p>;

  const viewJobDetails = (id) => {
    dispatch(selectJob(id));
  };

  return (
    <div className="min-h-screen p-2">
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <JobLists
            jobs={data.data}
            onJobSelect={viewJobDetails}
            selectedJobId={selectedJobId}
          />
        </div>
        <div className="col-span-2">
          {isJobByIdLoading ? (
            <p>Loading Job Details...</p>
          ) : (
            <JobDetails coverImg={coverImg} job={jobDetails?.data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Job;

const JobLists = ({ jobs, onJobSelect, selectedJobId }) => {
  return (
    <div>
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`bg-green-600 p-2 m-1 hover:bg-green-900 text-black ${
            selectedJobId === job.id ? "bg-green-800" : ""
          }`}
        >
          <button onClick={() => onJobSelect(job.id)}>
            <div className="bg-amber-200 p-2">
              <p>{job.title}</p>
              <p>{job.employment_type}</p>
              <p>{job.salary_min}</p>
              <p>{job.salary_max}</p>
            </div>
            <div className="bg-green-200 p-2">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
                nisi enim consequuntur, veniam amet quos nesciunt deserunt
                facilis! Reprehenderit cupiditate reiciendis magnam. Pariatur
                qui aut alias distinctio molestiae officiis? Laudantium?
              </p>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

const JobDetails = ({ coverImg, job }) => {
  if (!job) return <p>Select a job to view details</p>;

  return (
    <div className="bg-sky-600 text-white p-2 m-1">
      <img src={coverImg} alt="Job cover" width={500} height={500} />
      <h1 className="text-teal-400">{job.title}</h1>
      <p className="text-yellow-600">{job.description}</p>
      <p>Employment Type: {job.employment_type}</p>
      <p>
        Salary Range: ${job.salary_min} - ${job.salary_max}
      </p>
      <p>{job.address}</p>
      <p>{job.location}</p>
      <p>{job.application_deadline}</p>
    </div>
  );
};

// fully rtk_and useState function
// import React, { useState } from "react";
// import coverImg from "../../assets/utils/A.png";
// import { useGetJobsQuery, useGetJobByIdQuery } from "../../redux/api/jobApi";

// const Job = () => {
//   const { data, isLoading: isJobLoading } = useGetJobsQuery(null);

//   const [selectedJobId, setSelectedJobId] = useState(null);

//   const { data: jobDetails, isLoading: isJobByIdLoading } = useGetJobByIdQuery(
//     selectedJobId,
//     {
//       skip: !selectedJobId, // Only fetch when there's a selectedJobId
//     }
//   );

//   if (!data) return <p>There is no data</p>;
//   if (isJobLoading) return <p>Loading ....</p>;

//   const viewJobDetails = (id) => {
//     setSelectedJobId(id);
//   };

//   return (
//     <div className="min-h-screen p-2">
//       <div className="grid grid-cols-3">
//         <div className="col-span-1">
//           <JobLists jobs={data.data} onJobSelect={viewJobDetails} />
//         </div>
//         <div className="col-span-2">
//           {isJobByIdLoading ? (
//             <p>Loading Job Details...</p>
//           ) : (
//             <JobDetails coverImg={coverImg} job={jobDetails?.data} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Job;

// const JobLists = ({ jobs, onJobSelect }) => {
//   return (
//     <div>
//       {jobs.map((job) => (
//         <div
//           key={job.id}
//           className="bg-green-600 p-2 m-1 hover:bg-green-900 text-black "
//         >
//           <button onClick={() => onJobSelect(job.id)}>
//             <div className="bg-amber-200 p-2">
//               <p>{job.title}</p>
//               <p>{job.employment_type}</p>
//               <p>{job.salary_min}</p>
//               <p>{job.salary_max}</p>
//             </div>
//             <div className="bg-green-200 p-2">
//               <p>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
//                 nisi enim consequuntur, veniam amet quos nesciunt deserunt
//                 facilis! Reprehenderit cupiditate reiciendis magnam. Pariatur
//                 qui aut alias distinctio molestiae officiis? Laudantium?
//               </p>
//             </div>
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// const JobDetails = ({ coverImg, job }) => {
//   if (!job) return <p>Select a job to view details</p>;

//   return (
//     <div className="bg-sky-600 text-white p-2 m-1">
//       <img src={coverImg} alt="Job cover" width={500} height={500} />
//       <h1 className="text-teal-400">{job.title}</h1>
//       <p className="text-yellow-600">{job.description}</p>

//       <p>Employment Type: {job.employment_type}</p>
//       <p>
//         Salary Range: ${job.salary_min} - ${job.salary_max}
//       </p>
//       <p>{job.employment_type}</p>
//       <p>{job.address}</p>
//       <p>{job.location}</p>
//       <p>{job.application_deadline}</p>

//       {/* Add more job details as needed */}
//     </div>
//   );
// };
