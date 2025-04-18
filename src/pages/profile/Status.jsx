import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  CartesianGrid,
  Tooltip,
  YAxis,
  XAxis,
} from "recharts";

import {
  useGetApplicationsQuery,
  useGetSavedJobsQuery,
  useDeleteApplicationMutation,
  useDeleteSavedJobMutation,
  useGetAnalyticsQuery,
} from "../../redux/api/userApi";

const jobData = [
  { day: "Mon", UID: 4000, UXD: 2400, PM: 1300 },
  { day: "Tue", UID: 3000, UXD: 2000, PM: 1100 },
  { day: "Wed", UID: 4500, UXD: 2600, PM: 1400 },
  { day: "Thu", UID: 3200, UXD: 2200, PM: 1200 },
  { day: "Fri", UID: 3800, UXD: 2500, PM: 1350 },
  { day: "Sat", UID: 3600, UXD: 2300, PM: 1250 },
  { day: "Sun", UID: 3837, UXD: 2345, PM: 1345 },
];

const statisticData = [
  { name: "Job Booster", value: 2300 },
  { name: "Job Alert", value: 274 },
];

const COLORS = ["#4b9bff", "#a3cfff"];

const Status = () => {
  const { data: analytic, isLoading: isAnalyticLoading } =
    useGetAnalyticsQuery();

  // if (isAnalyticLoading) return <p>Loading ..</p>;

  console.log(analytic?.data, "check");
  const savedJobTrendData = analytic?.data?.savedJobTrend || [];

  console.log(savedJobTrendData);
  const individualData = [
    { name: "Users", value: analytic?.data?.total_users },
    { name: "Jobs", value: analytic?.data?.total_jobs },
    { name: "Applications", value: analytic?.data?.total_applications },
    { name: "Saved Jobs", value: analytic?.data?.total_savedJobs },
    { name: "Applied Jobs", value: analytic?.data?.total_appliedJobs },
    { name: "Resumes", value: analytic?.data?.total_uploadedResumes },
  ];

  const combinedData = [
    {
      // name: "Status",
      Users: analytic?.data?.total_users,
      Jobs: analytic?.data?.total_jobs,
      Applications: analytic?.data?.total_applications,
      SavedJobs: analytic?.data?.total_savedJobs,
      AppliedJobs: analytic?.data?.total_appliedJobs,
      Resumes: analytic?.data?.total_uploadedResumes,
    },
  ];

  const {
    data: SavedJobs,
    isLoading: isSavedJobsLoading,
    refetch: refetchSaveJob,
  } = useGetSavedJobsQuery(null);

  const {
    data: Applications,
    isLoading: isApplicationLoading,
    refetch: refetchApplication,
  } = useGetApplicationsQuery(null);

  const [deleteApplication, { isLoading: isDeleting }] =
    useDeleteApplicationMutation();

  const [deleteSavedJob, { isLoading: isSavJobDeleting }] =
    useDeleteSavedJobMutation();

  if (isDeleting) return <p>Loading....</p>;

  const handleDeleteSavedJob = async (id) => {
    try {
      await deleteSavedJob(id).unwrap();
      // Refetch applications after successful deletion
      refetchSaveJob();
    } catch (error) {
      // Handle error if deletion fails
      console.error("Error deleting save job:", error);
      // Optionally display an error message to the user
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id).unwrap();
      // Refetch applications after successful deletion
      refetchApplication();
    } catch (error) {
      // Handle error if deletion fails
      console.error("Error deleting application:", error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1>Welcome to Job Status Page</h1>
          {isAnalyticLoading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : (
            <div className="flex  p-2 m-1  justify-around items-center">
              <div>
                <h1> Total SavedJobs: {analytic?.data.total_savedJobs}</h1>
                <h1>Total Applied Jobs : {analytic?.data.total_appliedJobs}</h1>
                <h1>Total Resumes : {analytic?.data.total_uploadedResumes}</h1>
                <div>
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      {individualData.map((item, idx) => (
                        <div key={idx} className="border p-2 rounded">
                          <h2 className="text-sm text-gray-700 mb-1">
                            {item.name}
                          </h2>
                          <LineChart
                            width={200}
                            height={50}
                            data={[{ name: item.name, value: item.value }]}
                          >
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#4b9bff"
                              dot={false}
                            />
                            <YAxis />
                          </LineChart>
                        </div>
                      ))}
                    </div>
                  </div>
                  <LineChart width={200} height={50} data={jobData}>
                    <Line
                      type="monotone"
                      dataKey="UID"
                      stroke="#ff6b6b"
                      dot={false}
                    />
                  </LineChart>
                  <div className="mt-4 border p-2 rounded">
                    <h2 className="text-sm text-gray-700 mb-1">
                      Combined Status
                    </h2>
                    <LineChart width={600} height={200} data={combinedData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Line type="monotone" dataKey="Users" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Jobs" stroke="#82ca9d" />
                      <Line
                        type="monotone"
                        dataKey="Applications"
                        stroke="#ffc658"
                      />
                      <Line
                        type="monotone"
                        dataKey="SavedJobs"
                        stroke="#ff7300"
                      />
                      <Line
                        type="monotone"
                        dataKey="AppliedJobs"
                        stroke="#00c49f"
                      />
                      <Line
                        type="monotone"
                        dataKey="Resumes"
                        stroke="#0088fe"
                      />
                    </LineChart>
                  </div>
                </div>
              </div>
              {/* <h1> Users: {analytic.data.total_users}</h1>
              <h1>Jobs : {analytic.data.total_jobs}</h1>
              <h1>Applications : {analytic.data.total_applications}</h1> */}
              {/* {analytic?.data.map((e) => (
                <div>
                  <h1>{e.total_users}</h1>
                  <h1>{e.total_jobs}</h1>
                  <h1>{e.total_applications}</h1>
                </div>
              ))} */}
            </div>
          )}
        </div>
        <div>
          {isSavedJobsLoading ? (
            <p className="h-96 w-auto bg-orange-500">Loading...</p>
          ) : (
            <div className="bg-green-500 h-96 w-auto">
              {SavedJobs?.data?.map((e) => (
                <div key={e.id}>
                  <p>{e.title}</p>
                  <button
                    onClick={() => handleDeleteSavedJob(e.id)}
                    disabled={isSavJobDeleting}
                    className="bg-orange-500 p-2 "
                  >
                    Delete Saved Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1></h1>
          {isApplicationLoading ? (
            <p className="bg-pink-500 h-96 w-auto">Loading Application</p>
          ) : (
            <div className="bg-blue-500 h-96 w-auto overflow-scroll">
              {Applications?.data?.map((e) => (
                <div key={e.id} className="bg-slate-400 text-black m-1">
                  <h1>{e.title}</h1>
                  <p>{e.status}</p>
                  <button
                    onClick={() => handleDeleteApplication(e.id)}
                    disabled={isDeleting}
                    className="bg-green-500 p-2 m-1"
                  >
                    Delete Application
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;

// import React from "react";
// import {
//   useGetApplicationsQuery,
//   useGetSavedJobsQuery,
//   useDeleteApplicationMutation,
// } from "../../redux/api/userApi";

// const Status = () => {
//   const { data: SavedJobs, isLoading: isSavedJobsLoading } =
//     useGetSavedJobsQuery(null);

//   const {
//     data: Applications,
//     isLoading: isApplicationLoading,
//     refetch,
//   } = useGetApplicationsQuery(null);

//   const [deleteApplication, { isLoading: isDeleting }] =
//     useDeleteApplicationMutation();

//   if (isDeleting) return <p>Loading....</p>;

//   const handleDeleteApplication = async ({ id }) => {
//     try {
//       await deleteApplication(id).unwrap();
//       refetch();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <h1>WElcome to Job STatus Page</h1>
//         </div>
//         <div>
//           {isSavedJobsLoading ? (
//             <p className="h-96 w-auto bg-orange-500">Loading...</p>
//           ) : (
//             <div className="bg-green-500 h-96 w-auto">
//               {SavedJobs.data.map((e) => (
//                 <div key={e.id}>
//                   <p>{e.title}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div>
//           <h1></h1>
//           {isApplicationLoading ? (
//             <p className="bg-pink-500 h-96 w-auto">Loading Application</p>
//           ) : (
//             <div className="bg-blue-500 text-white h-96 w-auto">
//               {Applications.data.map((e) => (
//                 <div key={e.id} className="bg-white text-black m-1">
//                   <h1>{e.title}</h1>
//                   <p>{e.status}</p>
//                   <button
//                     onClick={() => handleDeleteApplication(e.id)}
//                     // onClick={() => deleteApplication(e.id).refetch()}
//                     disabled={isDeleting}
//                     className="bg-pink-500 p-2 m-1"
//                   >
//                     DeleteApplicaitoin
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Status;
