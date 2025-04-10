import React from "react";
import homeImage from "../assets/utils/Question.png";

const Home = () => {
  return (
    <div className="h-screen flex items-center justify-between p-8 md:p-16">
      <div className="w-1/2 ">
        <h1 className="text-4xl font-bold  mb-4">
          Unlock Your Potential Today!
        </h1>
        <p className="text-lg mb-8">
          Join thousands of satisfied users who have transformed their lives
          with our innovative solutions. Experience the difference and take the
          first step towards a brighter future.
        </p>
        {/* Optional Call to Action Button */}
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full">
          Learn More
        </button>
      </div>
      <div className="w-1/2 flex justify-end">
        <img
          src={homeImage}
          alt="homeImage"
          className=" dark:invert-100 "
          // className="max-w-md rounded-lg"
        />
      </div>
    </div>
  );
};

export default Home;
