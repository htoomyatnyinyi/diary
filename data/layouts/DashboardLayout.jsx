// layouts/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const DashboardLayout = ({
  sidebar,
  header,
  mainContent,
  rightPanel,
  footer,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Behavior */}
      <aside
        className={`
        ${sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
        fixed lg:static z-30 w-64 bg-indigo-700 text-white shadow-md
        transform transition-transform duration-200 ease-in-out
        h-full lg:h-auto
      `}
      >
        <div className="p-4 flex justify-between items-center lg:hidden">
          <div className="text-xl font-bold">Dashboard</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white p-1 rounded-md hover:bg-indigo-600"
          >
            <FiX size={24} />
          </button>
        </div>
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header with Mobile Menu Button */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            {header}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Primary Content */}
            <div className="flex-1">{mainContent}</div>

            {/* Right Panel - Hidden on mobile unless specified otherwise */}
            {rightPanel && (
              <div
                className={`
                ${isMobile ? "hidden" : "block"}
                xl:w-80 2xl:w-96 space-y-4
              `}
              >
                {rightPanel}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        {footer && (
          <footer className="bg-white border-t py-3 px-4">{footer}</footer>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout; // // layouts/DashboardLayout.jsx
// const DashboardLayout = ({
//   sidebar,
//   header,
//   mainContent,
//   rightPanel,
//   footer,
// }) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-indigo-700 text-white shadow-md">
//         {sidebar}
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm z-10">{header}</header>

//         {/* Content Area */}
//         <main className="flex-1 overflow-y-auto p-4">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Primary Content */}
//             <div className="flex-1">{mainContent}</div>

//             {/* Right Panel (Notifications, etc.) */}
//             <div className="lg:w-80 xl:w-96 space-y-4">{rightPanel}</div>
//           </div>
//         </main>

//         {/* Footer */}
//         {footer && (
//           <footer className="bg-white border-t py-3 px-4">{footer}</footer>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
