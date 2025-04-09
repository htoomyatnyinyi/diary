// components/dashboard/Header.jsx
const Header = ({ user, onSearch }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile Search (when activated) */}
      {showMobileSearch && (
        <div className="lg:hidden p-2 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => onSearch(e.target.value)}
              autoFocus
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Regular Header */}
      <div
        className={`flex items-center justify-between ${
          showMobileSearch ? "hidden lg:flex" : ""
        }`}
      >
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => onSearch(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <button
            className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setShowMobileSearch(true)}
          >
            <span>🔍</span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <span>🔔</span>
          </button>
          <div className="flex items-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-medium hidden md:inline">{user.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; // import React from "react";

// function Header() {
//   return (
//     <header className="bg-white shadow-sm p-4 flex justify-between items-center">
//       <h1 className="text-xl font-semibold text-gray-800">
//         Dashboard Overview
//       </h1>
//       <div className="flex items-center space-x-4">
//         <button className="p-2 hover:bg-gray-100 rounded-full">
//           <svg
//             className="w-6 h-6 text-gray-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//             />
//           </svg>
//         </button>
//         <div className="flex items-center space-x-2">
//           <img
//             src="https://via.placeholder.com/32"
//             alt="User"
//             className="w-8 h-8 rounded-full"
//           />
//           <span className="text-gray-700">John Doe</span>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
