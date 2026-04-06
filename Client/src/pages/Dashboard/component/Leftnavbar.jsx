import {
    BookOpen,
    Cpu,
    Database,
    Code,
    Network,
    Layers,
    Server,
    Briefcase
} from "lucide-react";

function LeftNavbar({ active, setActive }) {

    const subjects = [
        { name: "DSA", icon: <Code size={18} /> },
        { name: "Operating System", icon: <Cpu size={18} /> },
        { name: "DBMS", icon: <Database size={18} /> },
        { name: "OOPS", icon: <BookOpen size={18} /> },
        { name: "Networks", icon: <Network size={18} /> },
        { name: "Low Level Design", icon: <Layers size={18} /> },
        { name: "System Design", icon: <Server size={18} /> },
        { name: "Interview Prep", icon: <Briefcase size={18} /> },
    ];

    return (
        <div className="fixed top-[9vh] left-0 h-[91vh] w-64 bg-[#0d0f11] text-white border-r border-gray-700 flex flex-col">

            <div className="flex flex-col gap-2 p-3 mt-3">
                {subjects.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActive(item.name)} // ✅ update parent
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
              ${active === item.name
                                ? "bg-[#333333] text-white font-semibold"
                                : "text-gray-300 hover:bg-[#333333] hover:text-white"
                            }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto p-4 text-sm text-gray-400 border-t border-gray-700">
                © LeetCore 2026
            </div>
        </div>
    );
}

export default LeftNavbar;