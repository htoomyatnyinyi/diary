import React from "react";

import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { AiFillMerge } from "react-icons/ai";
import Status from "../../profile/Status";

const data = [
  { name: "A", uv: 0, pv: 0, amt: 0 },
  { name: "B", uv: 200, pv: 1500, amt: 1700 },
  { name: "C", uv: 100, pv: 2400, amt: 2500 },
  { name: "D", uv: 300, pv: 1000, amt: 1300 },
  { name: "E", uv: 700, pv: 2400, amt: 3100 },
  { name: "F", uv: 500, pv: 2000, amt: 2500 },
  { name: "G", uv: 900, pv: 4000, amt: 4900 },
];

const UserDashboard = () => {
  return (
    <div>
      <div>
        <h1>UserDashboard</h1>
        <Status />
      </div>
      <AiFillMerge />

      <div>
        <div className="m-1 p-2 flex space-x-5">
          <li>
            <div className="block w-10 h-10 bg-pink-500"></div>
          </li>
          <li>
            <div className="block w-10 h-10 bg-pink-500"></div>
          </li>
          <li>
            <div className="block w-10 h-10 bg-pink-500"></div>
          </li>
        </div>

        <div className=" dark:bg-cyan-900 ">
          <LineChart data={data} width={800} height={400}>
            <Line type="monotone" dataKey="pv" stroke="#ffabab" dot={false} />
            <Line type="monotone" dataKey="uv" stroke="#ffbbbb" dot={false} />
            <Line type="monotone" dataKey="amt" stroke="#ffaaaa" dot={false} />
            <CartesianGrid stroke="#ccc" strokeDasharray="1 10" />
            <YAxis />
            <XAxis dataKey="name" />
            <Tooltip />
          </LineChart>
        </div>
        <div>
          <LineChart width={200} height={50} data={data}>
            <Line type="monotone" dataKey="amt" stroke="#ff6b6b" dot={false} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

// import React from "react";
// import {
//   LineChart,
//   Line,
//   YAxis,
//   XAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";
// import { AiFillAlert, AiFillMerge } from "react-icons/ai";

// // Simplified data with string names
// const data = [
//   { name: "Merge", uv: 0, pv: 0, amt: 2400 },
//   { name: "Alert", uv: 200, pv: 1500, amt: 1700 },
//   { name: "C", uv: 100, pv: 2400, amt: 2500 },
//   { name: "D", uv: 300, pv: 1000, amt: 1300 },
//   { name: "E", uv: 700, pv: 2400, amt: 3100 },
//   { name: "F", uv: 500, pv: 2000, amt: 2500 },
//   { name: "G", uv: 900, pv: 4000, amt: 4900 },
// ];

// // Custom tick formatter for XAxis to render icons
// const CustomTick = ({ x, y, payload }) => {
//   if (payload.value === "Merge") {
//     return <AiFillMerge x={x - 10} y={y - 10} size={20} color="black" />;
//   }
//   if (payload.value === "Alert") {
//     return <AiFillAlert x={x - 10} y={y - 10} size={30} color="black" />;
//   }
//   return (
//     <text x={x} y={y} dy={16} textAnchor="middle" fill="#666">
//       {payload.value}
//     </text>
//   );
// };

// const UserDashboard = () => {
//   return (
//     <div>
//       <div>
//         <h1>UserDashboard</h1>
//       </div>
//       <AiFillMerge size={30} />
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
//         repellendus, dolore similique iure omnis, quam esse pariatur officiis in
//         illo dicta suscipit at quod? Voluptatem repudiandae iusto error ex hic!
//       </p>
//       <div>
//         <ul className="m-1 p-2 flex space-x-5">
//           <li>
//             <div className="block w-10 h-10 bg-pink-500"></div>
//           </li>
//           <li>
//             <div className="block w-10 h-10 bg-pink-500"></div>
//           </li>
//           <li>
//             <div className="block w-10 h-10 bg-pink-500"></div>
//           </li>
//         </ul>
//         <div>
//           <LineChart data={data} width={800} height={400}>
//             <Line type="monotone" dataKey="pv" stroke="#ffabab" dot={false} />
//             <Line type="monotone" dataKey="uv" stroke="#ffbbbb" dot={false} />
//             <Line type="monotone" dataKey="amt" stroke="#ffaaaa" dot={false} />
//             {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
//             <YAxis />
//             <XAxis dataKey="name" tick={<CustomTick />} />
//             <Tooltip />
//           </LineChart>
//         </div>
//         <div>
//           <LineChart width={200} height={100} data={data}>
//             <Line type="monotone" dataKey="amt" stroke="#ff6b6b" dot={false} />
//           </LineChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
