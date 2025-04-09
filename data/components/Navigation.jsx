import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Links from "./Links";
import AppLauncher from "./AppLauncher";
import logo from "../assets/utils/1.png";
import { AiFillAccountBook } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showApps, setShowApps] = useState(false);

  return (
    <nav className="fixed top-0 left-0 min-w-full z-50 baackdrop-blur-4xl ">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Links />
          </div>

          {/* Right Section (App Launcher + Theme Toggle) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setShowApps(!showApps)}
              className="p-2 text-blue-900 hover:text-black transition-colors duration-200"
              aria-label="Toggle app launcher"
            >
              <AiFillAccountBook size={24} />
            </button>
            {showApps && <AppLauncher />}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2  focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-200 shadow-md">
            <div className="">
              <Links />
              <div className="flex justify-between items-center px-2 py-3">
                <button
                  onClick={() => setShowApps(!showApps)}
                  className="p-2 text-blue-900 hover:text-black transition-colors duration-200"
                  aria-label="Toggle app launcher"
                >
                  <AiFillAccountBook size={24} />
                </button>
                <ThemeToggle />
              </div>
              {showApps && <AppLauncher />}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";
// import Links from "./Links";
// import AppLauncher from "./AppLauncher";
// import logo from "../assets/utils/1.png";
// import { AiFillAccountBook } from "react-icons/ai";
// import { FaBars, FaTimes } from "react-icons/fa";

// const Navigation = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showApps, setShowApps] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-amber-200 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/">
//               <img src={logo} alt="Logo" className="h-10 w-auto" />
//             </Link>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Links />
//           </div>

//           {/* Right Section (App Launcher + Theme Toggle) */}
//           <div className="hidden md:flex items-center space-x-4">
//             <button
//               onClick={() => setShowApps(!showApps)}
//               className="p-2 text-cyan-900 hover:text-black transition-colors duration-200"
//             >
//               <AiFillAccountBook size={24} />
//             </button>
//             {showApps && <AppLauncher />}
//             <ThemeToggle />
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 text-cyan-900 hover:text-black focus:outline-none"
//             >
//               {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-amber-200 shadow-md">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               <Links />
//               <div className="flex justify-between items-center px-2 py-3">
//                 <button
//                   onClick={() => setShowApps(!showApps)}
//                   className="p-2 text-cyan-900 hover:text-black transition-colors duration-200"
//                 >
//                   <AiFillAccountBook size={24} />
//                 </button>
//                 <ThemeToggle />
//               </div>
//               {showApps && <AppLauncher />}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navigation;

// import React, { useState } from "react";
// import ThemeToggle from "./ThemeToggle";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../assets/utils/1.png";
// import {
//   AiFillAccountBook,
//   AiFillAlipayCircle,
//   AiFillAmazonSquare,
//   AiFillBulb,
//   AiFillSignal,
// } from "react-icons/ai";

// const Navigation = () => {
//   const [showApps, setShowApps] = useState(false);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-amber-200 shadow-md">
//       <div className="flex justify-between items-center">
//         <div>
//           <h4>Logo</h4>
//         </div>
//         <Links />

//         {/* Google-style Grid Icon */}
//         <div className="relative">
//           <button
//             onClick={() => setShowApps(!showApps)}
//             className="text-white hover:text-black"
//           >
//             <AiFillAccountBook size={24} />
//           </button>

//           {/* App Launcher Dropdown */}
//           {showApps && <AppLauncher />}
//           <ThemeToggle />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;

// const Links = () => {
//   const [openMenu, setOpenMenu] = useState(false);

//   const links = [
//     { name: "Home", icon: <AiFillAccountBook />, path: "/" },
//     { name: "Job", icon: <AiFillAlipayCircle />, path: "/job" },
//     { name: "Dashboard", icon: <AiFillAmazonSquare />, path: "/dashboard" },
//     { name: "Contact", icon: <AiFillBulb />, path: "/contact" },
//   ];

//   const session = false;
//   const isAdmin = false;

//   return (
//     <div className="flex">
//       {links.map((link, index) => (
//         <NavLink
//           key={index}
//           name={link.name}
//           icon={link.icon}
//           path={link.path}
//         />
//       ))}
//       {session ? (
//         <>
//           {isAdmin && <NavLink name="Dashboard" path="/dashboard" />}
//           <button>Logout</button>
//         </>
//       ) : (
//         // <NavLink name={<AiFillSignal />} path="/signin" />
//         <NavLink name="SignIn" path="/signin" />
//       )}
//     </div>
//   );
// };

// const NavLink = ({ name, icon, path }) => {
//   const location = useLocation();

//   const isActive = location.pathname === path;

//   return (
//     <div>
//       <Link
//         to={path}
//         className={`p-2 ${
//           isActive ? "border-b-4 border-b-cyan-900" : "text-cyan-500"
//         }`}
//       >
//         <span className="flex items-center  ">
//           {icon}
//           {name}
//         </span>
//       </Link>
//     </div>
//   );
// };

// const AppLauncher = () => {
//   const apps = [
//     { name: "Account", icon: "👤" },
//     { name: "Drive", icon: "📁" },
//     { name: "Business", icon: "🏢" },
//     { name: "Gmail", icon: "✉️" },
//     { name: "YouTube", icon: "▶️" },
//     { name: "Gemini", icon: "✨" },
//     { name: "Maps", icon: "🗺️" },
//     { name: "Search", icon: "🔍" },
//     { name: "Calendar", icon: "📅" },
//     { name: "News", icon: "📰" },
//     { name: "Photos", icon: "🖼️" },
//     { name: "Meet", icon: "📹" },
//   ];

//   return (
//     <div className="absolute right-0 mt-2 w-72 bg-black/90 rounded-2xl p-2 shadow-xl grid grid-cols-3 gap-4 z-50">
//       {apps.map((app, index) => (
//         <div
//           key={index}
//           className="flex flex-col items-center justify-center p-2 hover:bg-white/10 rounded-lg cursor-pointer"
//         >
//           <div className="text-2xl mb-1">{app.icon}</div>
//           <div className="text-xs text-center">{app.name}</div>
//         </div>
//       ))}
//     </div>
//   );
// };
