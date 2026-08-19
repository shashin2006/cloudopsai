/**
 * CloudOpsAI - Application Layout Shell
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Header } from "./Header.jsx";

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Persistent Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Persistent Top Header */}
        <Header
          isCollapsed={isCollapsed}
          onMobileMenuToggle={() => setIsMobileOpen(true)}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* SRE Operational Footer */}
        <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>CloudOpsAI Operations Center • Production SRE Edition</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>LLM: NVIDIA Llama-3.3-70B</span>
            <span>DB: PostgreSQL / SQLAlchemy</span>
            <span>API: FastAPI</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
