import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Pages that use the Public Landing Navbar (Full-Width)
  const isPublicPage = currentPath === "/" || currentPath === "/login" || currentPath === "/register";

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="pt-20">{children}</main>
      </div>
    );
  }

  // Workspace Pages (Persistent Left Sidebar Layout)
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Page Workspace Content */}
      <main className="flex-1 pl-72 transition-all duration-300 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
