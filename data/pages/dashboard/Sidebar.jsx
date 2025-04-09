import React from "react";

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Employer Dashboard</h2>
      </div>
      <nav className="mt-6">
        <a
          href="#"
          className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200"
        >
          Employees
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200"
        >
          Job Postings
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200"
        >
          Applications
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 text-gray-700 hover:bg-gray-200"
        >
          Settings
        </a>
      </nav>
    </div>
  );
}

export default Sidebar;
