import React from "react";
import coverImg from "../../assets/utils/A.png";
// import SearchForm from "../../components/job/SearchForm";
// import JobLists from "../../components/job/JobLists";
// import JobDetails from "../../components/job/JobDetails";

const Job = () => {
  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        {/* <SearchForm /> */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-8">
          {/* Job List */}
          <div className="lg:col-span-2">
            <div className="scrollbar-hide rounded-xl shadow-lg p-2 max-h-[70vh] overflow-y-auto">
              <JobLists />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-gray-600 dark:text-gray-300 p-4 rounded-lg shadow">
              <span>Showing 1 - 10 of 50</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-300">
                  Prev
                </button>
                <span className="px-4 py-2">1 / 5</span>
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all duration-300">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="lg:col-span-3">
            <div className="scrollbar-hide rounded-xl shadow-lg p-6 max-h-[70vh] overflow-y-auto hidden lg:block">
              <JobDetails coverImg={coverImg} />
            </div>

            {/* Mobile Job Details */}
            <div className="lg:hidden fixed inset-0 bg-cyan-900 text-white z-50 flex items-center justify-center p-1 hidden">
              <div className="shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                <button className="absolute top-4 right-4 text-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <JobDetails coverImg={coverImg} />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Jobs & Applications */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavedJobs />
          <Applications />
        </div> */}
      </div>
    </div>
  );
};

export default Job;
const JobLists = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};
const JobDetails = () => {
  return (
    <div>
      <h1>Hello JobDetails</h1>
    </div>
  );
};
