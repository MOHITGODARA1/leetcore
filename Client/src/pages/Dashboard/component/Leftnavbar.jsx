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

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function LeftNavbar() {
    const navigate = useNavigate();
    const { subject } = useParams();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const subjects = [
        { name: "DSA", slug: "dsa", icon: <Code size={18} /> },
        { name: "Operating System", slug: "operating-system", icon: <Cpu size={18} /> },
        { name: "DBMS", slug: "dbms", icon: <Database size={18} /> },
        { name: "OOPS", slug: "oops", icon: <BookOpen size={18} /> },
        { name: "Networks", slug: "networks", icon: <Network size={18} /> },
        { name: "Low Level Design", slug: "lld", icon: <Layers size={18} /> },
        { name: "System Design", slug: "system-design", icon: <Server size={18} /> },
        { name: "Interview Prep", slug: "interview-prep", icon: <Briefcase size={18} /> },
    ];

    return (
        <div className="fixed top-[9vh] left-0 h-[91vh] w-64 
            bg-[#0d0f11] text-white border-r border-gray-800 flex flex-col">

            <div className="flex flex-col gap-1.5 p-3 mt-3">
                {subjects.map((item, index) => {
                    const active = subject === item.slug;

                    return (
                        <button
                            key={item.slug}
                            onClick={() => navigate(`/dashboard/${item.slug}`)}
                            className={`
                                relative flex items-center gap-3 px-4 py-2 rounded-md
                                text-sm transition-all duration-200 ease-out
                                ${active
                                    ? "bg-[#1a1d21] text-white font-medium"
                                    : "text-gray-400 hover:text-white hover:bg-[#15171a]"
                                }
                                ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                            `}
                            style={{ transitionDelay: `${index * 40}ms` }}
                        >
                            {/* Active indicator */}
                            <span
                                className={`
                                    absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-r
                                    ${active ? "bg-white" : "bg-transparent"}
                                `}
                            />

                            {/* Icon */}
                            <span className="transition-transform duration-200 group-hover:scale-105">
                                {item.icon}
                            </span>

                            {/* Text */}
                            <span className="tracking-wide">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto p-4 text-xs text-gray-500 border-t border-gray-800">
                © LeetCore 2026
            </div>
        </div>
    );
}

export default LeftNavbar;