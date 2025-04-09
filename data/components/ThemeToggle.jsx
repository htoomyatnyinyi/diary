import { useEffect, useState } from "react";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage or system preference on initial load
    if (localStorage.theme) return localStorage.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Apply the theme to the document
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button onClick={toggleTheme} className="p-2 text-xl m-1">
      {theme === "light" ? (
        <div className="flex items-center">
          <AiFillMoon />
          <p className="text-sm"> Dark</p>
        </div>
      ) : (
        <div className="flex items-center">
          <AiFillSun />
          <p className="text-sm"> Light</p>
        </div>
      )}
    </button>
  );
};

export default ThemeToggle;
