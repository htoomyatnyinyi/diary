import React from "react";

const Slider = ({ isOpen, onClose }) => {
  // Reset form when sidebar closes or on successful submission
  useEffect(() => {
    if (!isOpen) {
      // Optionally delay reset slightly for closing animation
      console.log("Hi ");
    }
  }, [isOpen]);

  return (
    <div className="h-screens">
      {/* Overlay */}
      <div
        className={`pt-16 fixed inset-0 backdrop-blur-xl z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} // Close sidebar when clicking overlay
      ></div>
      {/* SideBar Container */}
      <div
        className={`fixed shadow-xl z-50  transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        <p className="text-wrap text-sky-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos,
          voluptas corrupti excepturi ipsum tempora dolorum quo. Porro magni
          suscipit natus quod a recusandae! Laudantium corrupti dolores saepe id
          deleniti provident?
        </p>
      </div>
      {/* Sidebar Container */}
      {/* <div
        className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5  shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`} // Added overflow-y-auto
      >
        <h1 className="">This is Testing Page</h1>
      </div> */}
    </div>
  );
};

export default Slider;
/*
// Usage
  // State for managing the sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Functions to control sidebar
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
      
  
  // Render the Sidebar (conditionally) 
      <button
          onClick={openSidebar}
          className="bg-teal-500 hover:bg-teal-700 font-bold py-2 px-4 rounded"
        >
          Create New Job
        </button>
  <Slider isOpen={isSidebarOpen} onClose={closeSidebar} />
*/
