import React from "react";

const SearchForm = () => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 shadow-lg">
      {[
        { name: "title", placeholder: "Job Title" },
        { name: "location", placeholder: "Location" },
        { name: "category", placeholder: "Category" },
      ].map((field) => (
        <input
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          className="p-2 border-b-2 border-b-cyan-900 dark:border-b-white placeholder-cyan-900 dark:placeholder-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
        />
      ))}
      <select
        name="employment_type"
        className="p-3 bg-cyan-900 text-white dark:text-cyan-900 dark:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
      >
        <option value="">EMPLOYMENT TYPE</option>
        {[
          "full_time",
          "part_time",
          "contract",
          "internship",
          "apprenticeship",
        ].map((type) => (
          <option key={type} value={type}>
            {type.replace("_", " ").toUpperCase()}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="md:col-span-4 p-3 bg-gradient-to-r from-cyan-800 to-cyan-900 text-white rounded-lg hover:from-cyan-900 hover:to-cyan-800 transition-all duration-300 shadow-md"
      >
        Find Jobs
      </button>
    </form>
  );
};

export default SearchForm;
