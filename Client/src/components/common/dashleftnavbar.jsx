import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Building2,
  Brain,
  User,
  ChevronRight,
} from "lucide-react";

function DashLeftNavbar() {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    {
      name: "Interview Prep",
      icon: Brain,
      path: "/dashboard/data-structures-and-algorithms",
    },
    {
      name: "Online Assessment",
      icon: BookOpen,
      path: "/dashboard/what's-next-on-leetcore",
    },
    {
      name: "Companies",
      icon: Building2,
      path: "/dashboard/Career-oppertunity-on-leetcore",
    },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-white/5 border-r border-white/10 flex flex-col justify-between">
      {/* Top */}
      <div className="py-6 min-h-0 overflow-y-auto">
        <nav className="space-y-2 px-4">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-lg  px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-[#222222] text-white"
                      : "text-white hover:bg-[#222222] hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[16px] font-bold">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile */}
      <div className="border-t border-white/10 p-4">
        <NavLink
          to="/dashboard/profile"
          className="flex items-center justify-between rounded-xl  px-3 py-1  transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center ">
              <User size={20} className="text-white" />
            </div>

            
              <h3 className="text-lg font-semibold text-white">
                Profile
              </h3>
            
          </div>

          <ChevronRight
            size={18}
            className="text-white/40"
          />
        </NavLink>
      </div>
    </aside>
  );
}

export default DashLeftNavbar;
