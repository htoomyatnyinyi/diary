import { LineChart, Line } from "recharts";

const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 600, pv: 400, amt: 800 },
  { name: "Page C", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 200, pv: 400, amt: 800 },
  { name: "Page E", uv: 400, pv: 9000, amt: 2400 },
  { name: "Page F", uv: 90, pv: 40, amt: 600 },
  { name: "Page G", uv: 250, pv: 400, amt: 200 },
  { name: "Page H", uv: 460, pv: 40, amt: 800 },
];

// const data = [
//   { name: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
//   { name: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
//   { name: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
//   { name: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
//   { name: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
//   { name: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
//   { name: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
// ];

import React from "react";

const LineGraph = () => {
  return (
    <div>
      <LineChart className="bg-sky-400" width={400} height={400} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
      {"End Here"}
    </div>
  );
};

// const renderLineChart = (
//   <LineChart width={400} height={400} data={data}>
//     <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//   </LineChart>
// );

export default LineGraph;
