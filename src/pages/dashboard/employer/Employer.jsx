import React from "react";

import defaultCover from "../../../assets/utils/A.png";
import defaultProfile from "../../../assets/utils/B.png";

const Employer = () => {
  return (
    <div>
      <h1>Hi</h1>
      <EmployerProfile
        employerName="Htoo Myat Nyi Nyi"
        description="Too Muh Knowledge Make A Fools"
      />
    </div>
  );
};
export default Employer;

const EmployerProfile = ({
  employerName,
  description,
  coverImageUrl = defaultCover, // Use provided URL or default
  profileImageUrl = defaultProfile, // Use provided URL or default
  // location,
  // industry,
}) => {
  return (
    // Outer container for shadow, rounded corners, and max width
    <div className=" mx-auto  shadow-lg rounded-lg overflow-hidden my-4">
      {/* --- Cover Image Section --- */}
      <div
        className="h-96 bg-cover bg-center bg-gray-300" // Added placeholder bg color
        style={{ backgroundImage: `url(${coverImageUrl})` }}
        role="img" // Accessibility
        aria-label={`${employerName} cover image`}
      >
        <p className="text-sm ">Develop By Htoo Myat Nyi Nyi</p>
        {/* Optionally add elements over the cover image here */}
      </div>

      {/* --- Profile Content Area --- */}
      <div className="relative p-6 ">
        {/* Relative positioning context for the profile image */}
        {/* --- Profile Picture/Logo --- */}
        {/* Positioned to overlap the bottom of the cover image */}
        <div className="absolute left-16 mt-16 sm:-mt-20">
          {/* Adjust negative margin as needed */}
          <img
            src={profileImageUrl}
            alt={`${employerName} profile`}
            // Styling for the profile image: size, circle, border
            className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-gray-200 shadow-md" // Added placeholder bg and shadow
          />
        </div>
        {/* --- Text Content --- */}
        {/* Add padding/margin to the left to clear the profile picture */}
        <div className="pt-8 sm:pt-4 pl-0 sm:pl-40 min-h-20 ">
          {/* Adjust left padding (sm:pl-40) based on profile image size + spacing */}
          <h1 className="text-2xl sm:text-3xl font-bold  mb-1">
            {employerName}
          </h1>
          {/* Optional: Add more details like location or industry */}
          {/* {location && <p className="text-sm text-gray-500 mb-1">{location}</p>} */}
          {/* {industry && <p className="text-sm text-gray-500 mb-3">{industry}</p>} */}
          <p className="text-sm sm:text-base mt-2">{description}</p>
        </div>
        {/* --- Optional: Action Buttons or Links --- */}
        {/* Example: Buttons positioned below the main text */}
        <div className="mt-4 pl-0 sm:pl-40 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
            View Jobs
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300">
            Follow
          </button>
        </div>
      </div>
      <div className="bg-amber-300 h-10 w-auto flex space-x-5 justify-around">
        <button className="bg-sky-400">Hi</button>
        <button className="bg-sky-400">Hi</button>
        <button className="bg-sky-400">Hi</button>
        <button className="bg-sky-400">Hi</button>
      </div>
      <div className="h-screen"></div>
    </div>
  );
};

// --- How to Use Example (in another component) ---
/*
import EmployerProfile from './EmployerProfile'; // Adjust import path
import specificCoverImage from '../../../assets/company_x_cover.jpg';
import specificProfileImage from '../../../assets/company_x_logo.png';

const MyPage = () => {
  return (
    <div>
      <EmployerProfile
        employerName="Example Corp"
        description="Leading innovation in the tech industry. Join our dynamic team and shape the future."
        coverImageUrl={specificCoverImage} // Pass specific image URL
        profileImageUrl={specificProfileImage} // Pass specific image URL
        // location="Silicon Valley, CA"
        // industry="Technology"
      />

      <EmployerProfile
        employerName="Another Company Inc."
        description="Building sustainable solutions for a better tomorrow. We value creativity and collaboration."
        // Uses default images if URLs are not provided
      />
    </div>
  );
}
*/ // import React from "react";
// import cover from "../../../assets/utils/A.png";

// const Employer = () => {
//   return (
//     <div className="bg-cover h-96 w-auto">
//       <img
//         src={cover}
//         alt="cover"
//         className="bg-cover bg-amber-100 h-96 w-auto"
//       />
//       <h1>Welcom To Employer Dashboard</h1>
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eos
//         quisquam corrupti quae est deserunt libero ipsa veniam. Cumque ad sed
//         inventore esse quasi quisquam optio vel incidunt atque repellat?
//       </p>
//       ß
//     </div>
//   );
// };

// export default Employer;

// // import React from "react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // const employeeData = [
// //   { month: "Jan", employees: 120, applications: 240 },
// //   { month: "Feb", employees: 130, applications: 280 },
// //   { month: "Mar", employees: 125, applications: 300 },
// //   { month: "Apr", employees: 140, applications: 320 },
// //   { month: "May", employees: 135, applications: 310 },
// //   { month: "Jun", employees: 150, applications: 350 },
// // ];

// // const jobData = [
// //   { day: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
// //   { day: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
// //   { day: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
// //   { day: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
// //   { day: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
// //   { day: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
// //   { day: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
// // ];

// // const statisticData = [
// //   { name: "Job Booster", value: 2300 },
// //   { name: "Job Alert", value: 274 },
// // ];

// // const COLORS = ["#4b9bff", "#a3cfff"];

// // function Employer() {
// //   return (
// //     <div className="flex h-screen ">
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
// //             <div className="p-6 rounded-lg shadow">
// //               <h3 className=" text-sm font-medium">Total Employees</h3>
// //               <p className="mt-2 text-3xl font-semsibold">150</p>
// //             </div>
// //             <div className="p-6 rounded-lg shadow">
// //               <h3 className=" text-sm font-medium">Job Applications</h3>
// //               <p className="mt-2 text-3xl font-semibold">350</p>
// //             </div>
// //             <div className="p-6 rounded-lg shadow">
// //               <h3 className=" text-sm font-medium">Open Positions</h3>
// //               <p className="mt-2 text-3xl font-semibold">12</p>
// //             </div>
// //             <div className="p-6 rounded-lg shadow">
// //               <h3 className=" text-sm font-medium">Departments</h3>
// //               <p className="mt-2 text-3xl font-semibold">8</p>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// //             <div className="p-6 rounded-lg shadow">
// //               <h2 className="text-lg font-semibold mb-4">Employee Growth</h2>
// //               <LineChart width={400} height={300} data={employeeData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="month" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Line type="monotone" dataKey="employees" stroke="#8884d8" />
// //               </LineChart>
// //             </div>
// //             <div className="p-6 rounded-lg shadow">
// //               <h2 className="text-lg font-semibold mb-4">Job Applications</h2>
// //               <BarChart width={400} height={300} data={employeeData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="month" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="applications" fill="#82ca9d" />
// //               </BarChart>
// //             </div>
// //           </div>

// //           {/* Popular Jobs Section */}
// //           <div className="p-6 rounded-lg shadow mt-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg font-semibold">Popular Jobs</h2>
// //               <select className="border rounded p-1 text-gray-600">
// //                 <option>This Week</option>
// //                 <option>Last Week</option>
// //                 <option>This Month</option>
// //               </select>
// //             </div>
// //             <div className="space-y-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex-1">
// //                   <p className="text-sm font-medium text-gray-700">UID</p>
// //                   <p className="text-xs ">UI Designer</p>
// //                 </div>
// //                 <div className="w-1/2">
// //                   <LineChart width={200} height={50} data={jobData}>
// //                     <Line
// //                       type="monotone"
// //                       dataKey="UID"
// //                       stroke="#ff6b6b"
// //                       dot={false}
// //                     />
// //                   </LineChart>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-sm font-medium text-gray-700">3,837</p>
// //                   <p className="text-xs text-red-500">-32%</p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <div className="flex-1">
// //                   <p className="text-sm font-medium text-gray-700">UXD</p>
// //                   <p className="text-xs ">UX Designer</p>
// //                 </div>
// //                 <div className="w-1/2">
// //                   <LineChart width={200} height={50} data={jobData}>
// //                     <Line
// //                       type="monotone"
// //                       dataKey="UXD"
// //                       stroke="#4b9bff"
// //                       dot={false}
// //                     />
// //                   </LineChart>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-sm font-medium text-gray-700">2,345</p>
// //                   <p className="text-xs text-green-500">+12%</p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <div className="flex-1">
// //                   <p className="text-sm font-medium text-gray-700">PM</p>
// //                   <p className="text-xs ">Project Manager</p>
// //                 </div>
// //                 <div className="w-1/2">
// //                   <LineChart width={200} height={50} data={jobData}>
// //                     <Line
// //                       type="monotone"
// //                       dataKey="PM"
// //                       stroke="#4b9bff"
// //                       dot={false}
// //                     />
// //                   </LineChart>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-sm font-medium text-gray-700">1,345</p>
// //                   <p className="text-xs text-green-500">+24%</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Statistic (Donut Chart) Section */}
// //           <div className="p-6 rounded-lg shadow mt-6 relative">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg font-semibold flex items-center">
// //                 Statistic
// //                 <svg
// //                   className="w-5 h-5 ml-2 "
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth="2"
// //                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                   />
// //                 </svg>
// //               </h2>
// //               <select className="border rounded p-1 text-gray-600">
// //                 <option>This Week</option>
// //                 <option>Last Week</option>
// //                 <option>This Month</option>
// //               </select>
// //             </div>
// //             <div className="flex justify-center relative">
// //               <PieChart width={300} height={300}>
// //                 <Pie
// //                   data={statisticData}
// //                   cx="50%"
// //                   cy="50%"
// //                   innerRadius={80}
// //                   outerRadius={100}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                   labelLine={false}
// //                 >
// //                   {statisticData.map((entry, index) => (
// //                     <Cell
// //                       key={`cell-${index}`}
// //                       fill={COLORS[index % COLORS.length]}
// //                     />
// //                   ))}
// //                 </Pie>
// //               </PieChart>
// //               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
// //                 <p className="">Total</p>
// //                 <p className="text-2xl font-semibold">2574</p>
// //               </div>
// //             </div>
// //             <div className="flex justify-center mt-4 space-x-6">
// //               {statisticData.map((entry, index) => (
// //                 <div key={entry.name} className="flex items-center">
// //                   <span
// //                     className="w-4 h-4 rounded-full mr-2"
// //                     style={{ backgroundColor: COLORS[index] }}
// //                   ></span>
// //                   <span className="text-sm text-gray-700">
// //                     {entry.name}: {entry.value}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Employer;
