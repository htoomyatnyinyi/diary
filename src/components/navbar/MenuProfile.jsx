import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useToggleDropdown from "../../hooks/useToggleDropdown";

const MenuProfile = ({ profileLinks, onLogout, isLoggingOut }) => {
  const { isOpen, toggle, close, dropdownRef } = useToggleDropdown();

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center p-2 m-1 space-x-1 dark:bg-white dark:text-cyan-900 bg-cyan-900 text-white border-r-2 border-b-2 hover:bg-white hover:text-cyan-900 dark:hover:bg-cyan-900 dark:hover:text-white transition-colors duration-200"
        aria-label="Toggle profile menu"
      >
        <FaUserCircle size={24} />
        <span>Account</span>
      </button>
      {isOpen && <div className="fixed inset-0 z-30" onClick={close}></div>}
      <div
        ref={dropdownRef}
        className={`fixed right-10 top-16 shadow-2xl z-40 bg-cyan-900 text-white dark:bg-white dark:text-cyan-900 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 w-48">
          {profileLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block px-4 py-2 text-sm hover:bg-white hover:text-cyan-900 dark:hover:bg-cyan-900 dark:hover:text-white"
              onClick={close}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 bg-white hover:bg-red-400 hover:text-white"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuProfile;
