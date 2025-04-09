import DashboardLayout from "../../layouts/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import StatsCard from "../../components/dashboard/StatsCard";

const RecentActivity = () => <div>Recent Activity Component</div>;
const NotificationsPanel = () => <div>Notifications Panel Component</div>;

const DashboardPage = () => {
  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/" },
    { icon: "👥", label: "Users", path: "/users" },
    { icon: "📦", label: "Products", path: "/products" },
    { icon: "💰", label: "Sales", path: "/sales" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$34,245",
      icon: "💵",
      trend: { value: 12.5, label: "vs last month" },
    },
    {
      title: "New Users",
      value: "2,345",
      icon: "👤",
      trend: { value: 8.2, label: "vs last month" },
    },
    {
      title: "Pending Orders",
      value: "156",
      icon: "🛒",
      trend: { value: -3.4, label: "vs last month" },
    },
  ];

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <DashboardLayout
      sidebar={<Sidebar menuItems={menuItems} />}
      header={
        <Header
          user={{ name: "John Doe", avatar: "https://i.pravatar.cc/150?img=3" }}
          onSearch={handleSearch}
        />
      }
      mainContent={
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      }
      rightPanel={<NotificationsPanel />}
    />
  );
};

export default DashboardPage;
