import React from "react";
import {
  AiFillApple,
  AiFillPushpin,
  AiFillMoneyCollect,
  AiFillCalendar,
} from "react-icons/ai";

const JobDetails = ({ coverImg }) => {
  const sampleJob = {
    title: "Software Engineer",
    company_name: "Tech Corp",
    location: "Remote",
    employment_type: "Full Time",
    salary_min: "80000",
    salary_max: "120000",
    posted_at: "2025-04-01",
    description: "Develop and maintain web applications.",
    requirements: ["JavaScript", "React", "Node.js"],
    responsibilities: ["Code reviews", "Feature development"],
  };

  return (
    <div className="space-y-6">
      <img src={coverImg} alt="cover" className="w-full h-100 bg-cover" />
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
            {sampleJob.title}
          </h2>
          <AiFillApple className="h-10 w-10" />
        </div>
        <p className="mt-1">{sampleJob.company_name}</p>
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-300">
          Save Job
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300">
          Apply Now
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p>
          <AiFillPushpin /> <span>{sampleJob.location}</span>
        </p>
        <p>
          <AiFillPushpin /> <span>{sampleJob.employment_type}</span>
        </p>
        <p>
          <AiFillMoneyCollect />{" "}
          <span>
            ${sampleJob.salary_min} - ${sampleJob.salary_max}
          </span>
        </p>
        <p>
          <AiFillCalendar />{" "}
          <span>{new Date(sampleJob.posted_at).toLocaleDateString()}</span>
        </p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-amber-400 mb-2">
          Description
        </h3>
        <p>{sampleJob.description}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-amber-400 mb-2">
          Requirements
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          {sampleJob.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-amber-400 mb-2">
          Responsibilities
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          {sampleJob.responsibilities.map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetails;
