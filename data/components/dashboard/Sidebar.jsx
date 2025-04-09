// components/dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = ({ menuItems, onItemClick }) => {
  return (
    <div className="p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-50"
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm lg:text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; // // components/dashboard/Sidebar.jsx
// import { NavLink } from "react-router-dom";

// const Sidebar = ({ menuItems }) => {
//   return (
//     <div className="p-4">
//       <div className="text-xl font-bold mb-8">Dashboard</div>
//       <nav className="space-y-1">
//         {menuItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center px-4 py-2 rounded-lg transition-colors ${
//                 isActive
//                   ? "bg-indigo-600 text-white"
//                   : "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-50"
//               }`
//             }
//           >
//             <span className="mr-3">{item.icon}</span>
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
