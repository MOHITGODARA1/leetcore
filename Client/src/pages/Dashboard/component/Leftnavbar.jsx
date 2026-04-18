import {
    BookOpen,
    Cpu,
    Database,
    Code,
    Network,
    Layers,
    Server,
    Briefcase,
    Search
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

function LeftNavbar() {
    const navigate = useNavigate();
    const { subject } = useParams();

    const coreTopics = [
        { name: "DSA", slug: "dsa", icon: <Code size={16} /> },
        { name: "Operating System", slug: "operating-system", icon: <Cpu size={16} /> },
        { name: "DBMS", slug: "dbms", icon: <Database size={16} /> },
        { name: "OOPS", slug: "oops", icon: <BookOpen size={16} /> },
        { name: "Networks", slug: "networks", icon: <Network size={16} /> },
        { name: "Low Level Design", slug: "lld", icon: <Layers size={16} /> },
    ];

    const interview = [
        { name: "Interview Prep", slug: "interview-prep", icon: <Briefcase size={16} /> },
        { name: "System Design", slug: "system-design", icon: <Server size={16} /> },
    ];

    const renderItems = (items) =>
        items.map((item) => {
            const active = subject === item.slug;

            return (
                <button
                    key={item.slug}
                    onClick={() => navigate(`/dashboard/${item.slug}`)}
                    className={`
                        flex items-center gap-4 px-3 py-2 rounded-md text-md w-full
                        transition-all duration-150 cursor-pointer
                        ${active
                            ? "bg-[#23272c] text-white"
                            : "text-white hover:bg-[#1a1d21]"
                        }
                    `}
                >
                    <span>{item.icon}</span>
                    <span className="tracking-wide">{item.name}</span>
                </button>
            );
        });

    return (
        <div className="fixed top-[9vh] left-0 h-[91vh] w-64 
            bg-[#0d0f11] text-white border-r border-gray-800 flex flex-col">

            {/* 🔍 Search */}
            {/* <div className="p-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#15171a] rounded-md text-gray-400 text-sm">
                    <Search size={14} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none w-full text-sm"
                    />
                </div>
            </div> */}

            {/* CORE TOPICS */}
            <div className="px-3 mt-2">
                <p className="text-xs text-gray-500 mb-2 tracking-wide uppercase">
                    Core Topics
                </p>
                <div className="flex flex-col gap-1">
                    {renderItems(coreTopics)}
                </div>
            </div>

            {/* INTERVIEW */}
            <div className="px-3 mt-6">
                <p className="text-xs text-gray-500 mb-2 tracking-wide uppercase">
                    Interview
                </p>
                <div className="flex flex-col gap-1">
                    {renderItems(interview)}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto p-4 text-xs text-gray-500 border-t border-gray-800">
                © LeetCore 2026
            </div>
        </div>
    );
}

export default LeftNavbar;