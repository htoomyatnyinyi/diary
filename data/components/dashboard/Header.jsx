// components/dashboard/Header.jsx
const Header = ({ user, onSearch }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => onSearch(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <span>🔔</span>
        </button>
        <div className="flex items-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-medium">{user.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
