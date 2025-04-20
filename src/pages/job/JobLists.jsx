// not ready yet.
// import React from "react";

// // --- JobLists Component --- (Minor update for clarity)
// const JobLists = ({ jobs, onJobSelect, selectedJobId }) => {
//   if (!jobs || jobs.length === 0) {
//     return <p className="p-4">No jobs found.</p>;
//   }

//   return (
//     // Consider fixed height for scroll if needed, or let parent handle layout
//     <div className="h-screen overflow-y-auto scrollbar-hide border-r border-gray-200 ">
//       {jobs.map((job) => (
//         // Using div instead of button for better structure, apply onClick to div
//         <div
//           key={job.id}
//           onClick={() => onJobSelect(job.id)} // Apply onClick here
//           className={`p-3 m-2 rounded-md border cursor-pointer transition-colors duration-150 ease-in-out
//                         ${
//                           selectedJobId === job.id
//                             ? "bg-teal-100 border-teal-400"
//                             : "bg-sky-950 border-gray-200 hover:bg-sky-800 hover:border-gray-300"
//                         }`}
//         >
//           <p className="font-semibold ">{job.title}</p>
//           <p className="text-sm ">
//             {job.employment_type} - {job.location || "N/A"}
//           </p>
//           {(job.salary_min || job.salary_max) && ( // Show salary only if available
//             <p className="text-sm text-green-500 mt-1">
//               ${job.salary_min || "N/A"} - ${job.salary_max || "N/A"}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default JobLists;
