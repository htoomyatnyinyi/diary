import React from "react";
import { AiFillHeart, AiFillSave } from "react-icons/ai";

const JobLists = () => {
  const sampleJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company_name: "Tech Corp",
      category: "Engineering",
      location: "Remote",
      employment_type: "Full Time",
      salary_min: "80000",
      salary_max: "120000",
    },
    {
      id: 3,
      title: "Software Engineer",
      company_name: "Tech Corp",
      category: "Engineering",
      location: "Remote",
      employment_type: "Full Time",
      salary_min: "80000",
      salary_max: "120000",
    },
    {
      id: 2,
      title: "Software Engineer",
      company_name: "Tech Corp",
      category: "Engineering",
      location: "Remote",
      employment_type: "Full Time",
      salary_min: "80000",
      salary_max: "120000",
    },
  ];

  return (
    <ul className="space-y-4">
      {sampleJobs.length === 0 ? (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          No jobs available.
        </div>
      ) : (
        sampleJobs.map((job) => (
          <li
            key={job.id}
            className="p-4 ring-2 hover:bg-cyan-900 hover:text-white dark:hover:bg-white dark:hover:text-cyan-900 rounded-md transition-all duration-300"
          >
            <div className="flex-1 text-left w-full cursor-pointer">
              <div className="flex justify-between items-center border-b-2">
                <h4 className="font-semibold text-lg p-2 text-amber-300">
                  {job.title}
                </h4>
                <button className="p-2 rounded-lg bg-blue-600 text-white hover:bg-cyan-600 transition-all duration-300">
                  <AiFillHeart />
                </button>
              </div>
              <p className="p-1">{job.company_name}</p>
              <p className="p-1">Category: {job.category}</p>
              <p className="p-1">Location: {job.location}</p>
              <p className="p-1">Type: {job.employment_type}</p>
              <p className="p-1">
                Salary: ${job.salary_min} - ${job.salary_max}
              </p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default JobLists;
