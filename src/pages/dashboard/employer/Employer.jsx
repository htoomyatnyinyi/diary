import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const employeeData = [
  { month: "Jan", employees: 120, applications: 240 },
  { month: "Feb", employees: 130, applications: 280 },
  { month: "Mar", employees: 125, applications: 300 },
  { month: "Apr", employees: 140, applications: 320 },
  { month: "May", employees: 135, applications: 310 },
  { month: "Jun", employees: 150, applications: 350 },
];

const jobData = [
  { day: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
  { day: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
  { day: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
  { day: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
  { day: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
  { day: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
  { day: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
];

const statisticData = [
  { name: "Job Booster", value: 2300 },
  { name: "Job Alert", value: 274 },
];

const COLORS = ["#4b9bff", "#a3cfff"];

function Employer() {
  return (
    <div className="flex h-screen ">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-6 rounded-lg shadow">
              <h3 className=" text-sm font-medium">Total Employees</h3>
              <p className="mt-2 text-3xl font-semsibold">150</p>
            </div>
            <div className="p-6 rounded-lg shadow">
              <h3 className=" text-sm font-medium">Job Applications</h3>
              <p className="mt-2 text-3xl font-semibold">350</p>
            </div>
            <div className="p-6 rounded-lg shadow">
              <h3 className=" text-sm font-medium">Open Positions</h3>
              <p className="mt-2 text-3xl font-semibold">12</p>
            </div>
            <div className="p-6 rounded-lg shadow">
              <h3 className=" text-sm font-medium">Departments</h3>
              <p className="mt-2 text-3xl font-semibold">8</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Employee Growth</h2>
              <LineChart width={400} height={300} data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="employees" stroke="#8884d8" />
              </LineChart>
            </div>
            <div className="p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Job Applications</h2>
              <BarChart width={400} height={300} data={employeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>

          {/* Popular Jobs Section */}
          <div className="p-6 rounded-lg shadow mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Popular Jobs</h2>
              <select className="border rounded p-1 text-gray-600">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">UID</p>
                  <p className="text-xs ">UI Designer</p>
                </div>
                <div className="w-1/2">
                  <LineChart width={200} height={50} data={jobData}>
                    <Line
                      type="monotone"
                      dataKey="UID"
                      stroke="#ff6b6b"
                      dot={false}
                    />
                  </LineChart>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">3,837</p>
                  <p className="text-xs text-red-500">-32%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">UXD</p>
                  <p className="text-xs ">UX Designer</p>
                </div>
                <div className="w-1/2">
                  <LineChart width={200} height={50} data={jobData}>
                    <Line
                      type="monotone"
                      dataKey="UXD"
                      stroke="#4b9bff"
                      dot={false}
                    />
                  </LineChart>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">2,345</p>
                  <p className="text-xs text-green-500">+12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">PM</p>
                  <p className="text-xs ">Project Manager</p>
                </div>
                <div className="w-1/2">
                  <LineChart width={200} height={50} data={jobData}>
                    <Line
                      type="monotone"
                      dataKey="PM"
                      stroke="#4b9bff"
                      dot={false}
                    />
                  </LineChart>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">1,345</p>
                  <p className="text-xs text-green-500">+24%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistic (Donut Chart) Section */}
          <div className="p-6 rounded-lg shadow mt-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                Statistic
                <svg
                  className="w-5 h-5 ml-2 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </h2>
              <select className="border rounded p-1 text-gray-600">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="flex justify-center relative">
              <PieChart width={300} height={300}>
                <Pie
                  data={statisticData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {statisticData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="">Total</p>
                <p className="text-2xl font-semibold">2574</p>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-6">
              {statisticData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  <span className="text-sm text-gray-700">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Employer;

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
// } from "recharts";
// import Sidebar from "../Sidebar";
// import Header from "../Header";

// import LineGraph from "../LineGraph";

// const employeeData = [
//   { month: "Jan", employees: 120, applications: 240 },
//   { month: "Feb", employees: 130, applications: 280 },
//   { month: "Mar", employees: 125, applications: 300 },
//   { month: "Apr", employees: 140, applications: 320 },
//   { month: "May", employees: 135, applications: 310 },
//   { month: "Jun", employees: 150, applications: 350 },
// ];
// const jobData = [
//   { day: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
//   { day: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
//   { day: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
//   { day: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
//   { day: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
//   { day: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
//   { day: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
// ];

// const Employer = () => {
//   return (
//     <div>
//       <LineGraph />
//       <div>
//         // Add this inside the main section of App.js, below the existing charts
//         <div className="bg-cyan-600 p-6 rounded-lg shadow mt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Popular Jobs</h2>
//             <select className="border rounded p-1 text-gray-600">
//               <option>This Week</option>
//               <option>Last Week</option>
//               <option>This Month</option>
//             </select>
//           </div>
//           <div className="space-y-6">
//             {/* UID - UI Designer */}
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-700">UID</p>
//                 <p className="text-xs text-gray-500">UI Designer</p>
//               </div>
//               <div className="w-1/2">
//                 <LineChart width={200} height={50} data={jobData}>
//                   <Line
//                     type="monotone"
//                     dataKey="UID"
//                     stroke="#ff6b6b"
//                     dot={false}
//                   />
//                 </LineChart>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-700">3,837</p>
//                 <p className="text-xs text-red-500">-32%</p>
//               </div>
//             </div>

//             {/* UXD - UX Designer */}
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-700">UXD</p>
//                 <p className="text-xs text-gray-500">UX Designer</p>
//               </div>
//               <div className="w-1/2">
//                 <LineChart width={200} height={50} data={jobData}>
//                   <Line
//                     type="monotone"
//                     dataKey="UXD"
//                     stroke="#4b9bff"
//                     dot={false}
//                   />
//                 </LineChart>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-700">2,345</p>
//                 <p className="text-xs text-green-500">+12%</p>
//               </div>
//             </div>

//             {/* PM - Project Manager */}
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-700">PM</p>
//                 <p className="text-xs text-gray-500">Project Manager</p>
//               </div>
//               <div className="w-1/2">
//                 <LineChart width={200} height={50} data={jobData}>
//                   <Line
//                     type="monotone"
//                     dataKey="PM"
//                     stroke="#4b9bff"
//                     dot={false}
//                   />
//                 </LineChart>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-700">1,345</p>
//                 <p className="text-xs text-green-500">+24%</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <h1 className="text-3xl font-bold underline">Employer</h1>
//       <p className="text-lg">Welcome to the Employer Dashboard</p>
//       <p className="text-sm text-gray-500">
//         Here you can manage job postings, view applications, and more.
//       </p>
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Header />
//           <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               {/* Stats Cards */}
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h3 className="text-gray-500 text-sm font-medium">
//                   Total Employees
//                 </h3>
//                 <p className="mt-2 text-3xl font-semibold text-gray-900">150</p>
//               </div>
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h3 className="text-gray-500 text-sm font-medium">
//                   Job Applications
//                 </h3>
//                 <p className="mt-2 text-3xl font-semibold text-gray-900">350</p>
//               </div>
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h3 className="text-gray-500 text-sm font-medium">
//                   Open Positions
//                 </h3>
//                 <p className="mt-2 text-3xl font-semibold text-gray-900">12</p>
//               </div>
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h3 className="text-gray-500 text-sm font-medium">
//                   Departments
//                 </h3>
//                 <p className="mt-2 text-3xl font-semibold text-gray-900">8</p>
//               </div>
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h2 className="text-lg font-semibold mb-4">Employee Growth</h2>
//                 <LineChart width={500} height={300} data={employeeData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="employees" stroke="#8884d8" />
//                 </LineChart>
//               </div>
//               <div className="bg-cyan-600 p-6 rounded-lg shadow">
//                 <h2 className="text-lg font-semibold mb-4">Job Applications</h2>
//                 <BarChart width={500} height={300} data={employeeData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="applications" fill="#82ca9d" />
//                 </BarChart>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Employer;
