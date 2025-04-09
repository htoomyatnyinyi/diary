// components/dashboard/StatsCard.jsx
const StatsCard = ({ title, value, icon, trend }) => {
  const trendColor = trend.value > 0 ? "text-green-500" : "text-red-500";
  const trendIcon = trend.value > 0 ? "↑" : "↓";

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-indigo-100 p-2 sm:p-3 rounded-lg">
          <span className="text-indigo-600 text-lg sm:text-xl">{icon}</span>
        </div>
      </div>
      <div className={`mt-2 sm:mt-4 text-xs sm:text-sm ${trendColor}`}>
        <span>
          {trendIcon} {trend.value}%
        </span>
        <span className="text-gray-500 ml-1">{trend.label}</span>
      </div>
    </div>
  );
};

export default StatsCard; // // components/dashboard/StatsCard.jsx
// const StatsCard = ({ title, value, icon, trend }) => {
//   const trendColor = trend.value > 0 ? "text-green-500" : "text-red-500";
//   const trendIcon = trend.value > 0 ? "↑" : "↓";

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between">
//         <div>
//           <p className="text-gray-500 text-sm font-medium">{title}</p>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="bg-indigo-100 p-3 rounded-lg">
//           <span className="text-indigo-600 text-xl">{icon}</span>
//         </div>
//       </div>
//       <div className={`mt-4 text-sm ${trendColor}`}>
//         <span>
//           {trendIcon} {trend.value}%
//         </span>
//         <span className="text-gray-500 ml-1">{trend.label}</span>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;
