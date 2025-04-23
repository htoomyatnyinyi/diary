import React, { useState } from "react";
import { Link } from "react-router-dom";
import homeImage from "../assets/utils/Question.png";
import CreateEmployerProfile from "./profile/CreateEmployerProfile";

// import { useGetJobByIdQuery } from "../redux/api/jobApi";
// import JobDashboard from "./dashboard/employer/JobDashboard";

const Home = () => {
  // const [jobId, setJobId] = useState(null);
  // const { data, isLoading } = useGetJobByIdQuery(jobId, { skip: !jobId });

  // if (isLoading) return <h1>Loading</h1>;
  // if (!data) return <h3>No Data</h3>;

  // console.log(data, "jobId fetch data");

  return (
    <div>
      <div className="h-screen flex items-center justify-between p-8 md:p-16">
        <div className="w-1/2 ">
          <h1 className="text-4xl font-bold  mb-4">
            Unlock Your Potential Today!
          </h1>
          <p className="text-lg mb-8">
            Join thousands of satisfied users who have transformed their lives
            with our innovative solutions. Experience the difference and take
            the first step towards a brighter future.
          </p>
          {/* Optional Call to Action Button */}
          {/* <button
          onClick={() => setJobId(1)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
          >
          Learn More fetch wiht id 1
          </button> */}
          <Link
            to="/register_company"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
            // className="underline font-bold py-3 px-6 rounded-full"
          >
            For Employer To Register
          </Link>
        </div>
        <div className="w-1/2 flex justify-end">
          <img
            src={homeImage}
            alt="homeImage"
            className=" dark:invert-100 "
            // className="max-w-md rounded-lg"
          />
        </div>
        {/* <JobDashboard /> */}
      </div>
      <CreateEmployerProfile />
    </div>
  );
};

export default Home;
