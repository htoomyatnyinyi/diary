import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Overview</h1>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard title="Total Applicants" value="30" change="+12%" />
          <MetricCard title="Active Job Listings" value="100" change="+35%" />
          <MetricCard title="Pending Interviews" value="15" change="-5%" />
          <MetricCard title="Hired Candidates" value="5" change="+15%" />
        </div>
        <Graph />
      </div>
    </div>
  );
};

export default Dashboard;

const MetricCard = ({ title, value, change }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p
        className={`text-sm ${
          change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </p>
    </div>
  );
};
