import React from "react";

const AppLauncher = () => {
  const apps = [
    { name: "Account", icon: "👤" },
    { name: "Drive", icon: "📁" },
    { name: "Business", icon: "🏢" },
    { name: "Gmail", icon: "✉️" },
    // { name: "YouTube", icon: "▶️" },
    // { name: "Gemini", icon: "✨" },
    // { name: "Maps", icon: "🗺️" },
    // { name: "Search", icon: "🔍" },
    // { name: "Calendar", icon: "📅" },
    // { name: "News", icon: "📰" },
    // { name: "Photos", icon: "🖼️" },
    // { name: "Meet", icon: "📹" },
  ];

  return (
    <div
      className="absolute right-0 mt-16 w-72 bg-black/90 rounded-2xl p-4 
    shadow-xl grid grid-cols-3 gap-4 z-50 max-h-96 overflow-y-auto"
    >
      {apps.map((app, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200"
        >
          <div className="text-2xl mb-1">{app.icon}</div>
          <div className="text-xs text-white text-center">{app.name}</div>
        </div>
      ))}
    </div>
  );
};

export default AppLauncher;
