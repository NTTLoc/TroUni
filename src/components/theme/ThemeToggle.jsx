import { useEffect, useState } from "react";
import "./ThemeToggle.scss";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Tối" : "☀️ Sáng"}
    </button>
  );
};

export default ThemeToggle;
