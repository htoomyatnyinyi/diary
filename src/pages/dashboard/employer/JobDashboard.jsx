import React, { useState } from "react";
import CreateNewJobSidebar from "./CreateNewJob"; // We'll create this next

const JobDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Job Management</h1>
      {/* Add other dashboard content here, like a list of existing jobs */}

      <button
        onClick={openSidebar}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create New Job Posting
      </button>

      <CreateNewJobSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
};

export default JobDashboard;
