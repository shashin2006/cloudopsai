/**
 * CloudOpsAI - Persistent Collapsible SRE Sidebar Navigation
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Terminal,
  AlertOctagon,
  Cpu,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const NAV_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    path: "/services",
    label: "Services",
    icon: Layers,
    badge: null,
  },
  {
    path: "/logs",
    label: "Logs",
    icon: Terminal,
    badge: "LIVE",
    badgeColor: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  },
  {
    path: "/incidents",
    label: "Incidents",
    icon: AlertOctagon,
    badge: "3 ACTIVE",
    badgeColor: "bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold",
  },
  {
    path: "/ai-insights",
    label: "AI Insights",
    icon: Cpu,
    badge: "93%",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
  },
  {
    path: "/reports",
    label: "Reports",
    icon: FileText,
    badge: null,
  },
];

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const { user, logout, isBackendLive } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast({
      type: "info",
      title: "Logged Out",
      message: "You have securely signed out of CloudOpsAI.",
    });
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0 ring-1 ring-white/20">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-mono">
                  CloudOps<span className="text-sky-400">AI</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-semibold">
                  SRE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                Operations Platform
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {!isCollapsed ? "Operations & Observability" : "•••"}
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)] font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-sky-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Collapsed Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-slate-100 text-xs rounded-md shadow-xl border border-slate-750 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Backend Status indicator */}
      {!isCollapsed ? (
        <div className="px-4 py-2.5 mx-3 mb-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendLive
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse"
                  : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
              }`}
            />
            <span className="font-mono text-slate-300">
              {isBackendLive ? "FastAPI Live" : "Isolated Demo"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">v1.4.0</span>
        </div>
      ) : (
        <div className="flex justify-center mb-2" title={isBackendLive ? "FastAPI Backend Online" : "Demo Mode"}>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isBackendLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
        </div>
      )}

      {/* Footer Navigation: Settings, Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-1 shrink-0 bg-slate-950/40">
        <NavLink
          to="/settings"
          onClick={() => setIsMobileOpen(false)}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? "bg-slate-800/80 text-slate-100 border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`
          }
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-200" />
          {!isCollapsed && <span className="truncate">Settings & Engine</span>}
        </NavLink>

        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/40 border border-slate-800/50 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "SR"}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user?.name || "Alex Mercer"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.role || "Lead SRE"}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        id="mobile-sidebar"
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
