import { NavLink } from "react-router-dom";
import {
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PlusCircle,
} from "lucide-react";
import logo from "../assets/a78e3ccc-52c9-4c59-87b6-a7bd8f4d3080.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriptions", label: "My Subscriptions", icon: ListChecks },
  { to: "/subscriptions/new", label: "Add Subscription", icon: PlusCircle },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/survey", label: "Usage Survey", icon: ClipboardCheck },
];

function Navbar({ onLogout, unreadCount = 0 }) {
  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-stone-200 bg-stone-950 px-6 py-6 text-stone-100">
      <div>
        <div className="flex items-center gap-3 rounded-2xl bg-stone-900 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/15">
            <img
              src={logo}
              alt="Smart Subscription Manager"
              className="h-8 w-8 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-stone-400">Smart Subscription</p>
            <p className="text-sm font-semibold">Manager</p>
          </div>
        </div>

        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-500/15 text-teal-100"
                      : "text-stone-300 hover:bg-stone-900"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-stone-300 hover:bg-stone-900"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Navbar;
