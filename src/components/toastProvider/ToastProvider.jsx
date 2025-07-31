"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

const ToastProvider = () => {
  const [theme, setTheme] = useState("system");
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === "dark") setTheme("dark");
    else setTheme("light");
    setMounted(true);
  }, [resolvedTheme]);
  if (!mounted) return null;
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover={false}
        draggable
        theme={theme}
      />
    </div>
  );
};

export default ToastProvider;
