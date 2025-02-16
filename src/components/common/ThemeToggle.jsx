"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center p-1 transition-all">
        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-14 h-8 flex items-center rounded-full transition-all 
        bg-gray-200 dark:bg-gray-800 p-1 border border-gray-400 dark:border-gray-600"
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-sky-900 shadow-md transition-all transform 
          ${resolvedTheme === "dark" ? "translate-x-6" : "translate-x-0"}`}
      >
        {resolvedTheme === "dark" ? "🌙" : "☀️"}
      </div>
    </button>
  );
}