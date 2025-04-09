// import React from "react";
// import Employer from "./dashboard/employer/Employer";
// import Jobseeker from "./dashboard/jobseeker/Jobseeker";
// import EmployerRegisterForm from "../components/registeration/EmployerRegisterForm";

// const Home = () => {
//   return (
//     <div>
//       <EmployerRegisterForm />
//     </div>
//   );
// };

// export default Home;
import React, { useState } from "react";
import Employer from "./dashboard/employer/Employer";
import Jobseeker from "./dashboard/jobseeker/Jobseeker";
import EmployerRegisterForm from "../components/registeration/EmployerRegisterForm";

const Home = () => {
  const [userRole, setUserRole] = useState("guest"); // Example roles: "employer", "jobseeker", "guest"

  const renderContent = () => {
    switch (userRole) {
      case "employer":
        return <Employer />;
      case "jobseeker":
        return <Jobseeker />;
      default:
        return <EmployerRegisterForm />;
    }
  };

  return <div className="home-container">{renderContent()}</div>;
};

export default Home;

// // import React from "react";
// // import Theme from "../hooks/utils/Theme";
// // import {
// //   AiFillAlipayCircle,
// //   AiFillApi,
// //   AiFillApple,
// //   AiFillAppstore,
// //   AiFillBilibili,
// // } from "react-icons/ai";
// // import { Link } from "react-router-dom";

// // const Home = () => {
// //   return (
// //     <div>
// //       <div className="">
// //         <h1>Home</h1>
// //         <p>Welcome to the Home page</p>
// //         <SocialBar />
// //         <div className="h-screen">
// //           <h1>
// //             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus enim
// //             nemo corrupti magnam. Laboriosam repellat facilis, reprehenderit
// //             distinctio ipsam sunt libero adipisci dicta quaerat odio explicabo
// //             vel iste ut vero.
// //           </h1>
// //         </div>
// //         <div className="h-screen">
// //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
// //           molestias pariatur cupiditate, quod eligendi labore obcaecati
// //           voluptates impedit porro dignissimos voluptatum quo sunt temporibus
// //           corrupti similique alias saepe assumenda inventore.
// //         </div>
// //       </div>
// //       <div className="h-screen">
// //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
// //         cumque aliquam tenetur. Accusantium similique labore sit eaque quo nemo
// //         aperiam repudiandae, ducimus a. Ab voluptate placeat unde blanditiis
// //         esse in.
// //       </div>
// //       <div className="h-screen">
// //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat adipisci
// //         ea doloribus ullam. Nisi, suscipit eligendi. Iste fugiat officia, eaque
// //         dicta mollitia temporibus, laudantium minus tempore animi sint beatae!
// //         Maiores.
// //       </div>
// //     </div>
// //   );
// // };

// // export default Home;

// // const SocialBar = () => {
// //   return (
// //     <div>
// //       <Theme />
// //       <div className="sidebar-social">
// //         <div className=" ">
// //           <Link to={"/"}>
// //             <NavIcon icons={<AiFillApi />} name="htoomyatnyinyi@gmail.com" />
// //           </Link>
// //           <NavIcon icons={<AiFillAppstore />} name="FacebookAddress" />
// //           <NavIcon
// //             icons={<AiFillBilibili />}
// //             name="https://github.com/htoomyatnyinyi/projects"
// //           />
// //           <NavIcon icons={<AiFillApple />} name="+959792400340" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const NavIcon = ({ icons, name }) => {
// //   return (
// //     <div className="icon-style group">
// //       {icons}
// //       <span className="icon-name group-hover:scale-100">{name}</span>
// //     </div>
// //   );
// // };

// import React from "react";
// import image from "../assets/utils/Learning.png";
// import PreviewFile from "../components/PreviewFile";
// import Admin from "./dashboard/admin/Admin";
// import AdminDashboard from "../components/AdminDashboard";
// const Home = () => {
//   return (
//     <div className="h-screen bg-white dark:bg-cyan-900">
//       <AdminDashboard />
//       <img src={image} className="w-auto h-auto " />
//       {/* <button onClick={"_blank"}>Click</button> */}
//       {/* <Sidebar /> */}
//     </div>
//   );
// };

// export default Home;

// const Sidebar = () => {
//   return (
//     <div className="">
//       <img src={image} className="w-auto h-auto " />
//       <button onClick={"_blank"}>Click</button>
//       <PreviewFile />
//     </div>
//   );
// };
