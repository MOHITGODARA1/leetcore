import {
  LayoutGrid,
  GitBranch,
  Database,
  Terminal,
  Brain,
  FileCode2,
  Boxes,
  Network,
  ShieldCheck,
} from "lucide-react";

const topics = [
  { name: "All Topics", icon: LayoutGrid },
  { name: "Data Structures", icon: Boxes },
  { name: "Database", icon: Database },
  { name: "Operating System", icon: Terminal },
  { name: "Computer Networks", icon: Network },
  { name: "OOPs", icon: Brain },
  { name: "System Design", icon: FileCode2 },
  { name: "Low Level Design", icon: Brain },
  { name: "Prep & Tools", icon: ShieldCheck },
];

const getTabColor = (tabName) => {
  if (tabName === "Algorithms" || tabName === "Data Structures")
    return "border-blue-500 text-blue-400";

  if (tabName === "Operating System" || tabName === "Computer Networks")
    return "border-purple-500 text-purple-400";

  if (tabName === "Database")
    return "border-teal-500 text-teal-400";

  if (
    tabName === "OOPs" ||
    tabName === "System Design" ||
    tabName === "Low Level Design"
  )
    return "border-emerald-500 text-emerald-400";

  if (tabName === "Prep & Tools")
    return "border-indigo-500 text-indigo-400";

  return "border-[#F46717] text-[#F46717]";
};

function Mainnavbar({ activeTab, setActiveTab }) {
  return (
    <div className="w-[calc(100%-1.5rem)] ml-6 border-b mt-3 border-white/10">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        {topics.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex cursor-pointer items-center gap-2.5 whitespace-nowrap border-b-2 px-2 py-3.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "border-transparent text-white/80 hover:text-white hover:bg-white/[0.03] rounded-t-lg"
              }`}
            >
              <Icon size={16} />
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Mainnavbar;