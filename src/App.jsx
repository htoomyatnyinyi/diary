import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.jsx";

const App = () => {
  return (
    <div className="bg-white dark:bg-black dark:text-white text-cyan-900">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
