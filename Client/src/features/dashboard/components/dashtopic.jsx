import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Database,
  Cpu,
  Network,
  BrainCircuit,
  Target,
  Layers3,
  Code2,
  Binary,
  FileCode2,
  GitBranch,
  ShieldCheck,
} from "lucide-react";

const CATEGORY_STYLES = {
  dsa: {
    color: "#3B82F6", // Blue
    buttonBg: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    progressBg: "bg-blue-500",
  },
  systems: {
    color: "#8B5CF6", // Purple
    buttonBg: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    progressBg: "bg-purple-500",
  },
  database: {
    color: "#0D9488", // Teal
    buttonBg: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800",
    progressBg: "bg-teal-500",
  },
  design: {
    color: "#10B981", // Emerald
    buttonBg: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
    progressBg: "bg-emerald-500",
  },
  prep: {
    color: "#6366F1", // Indigo
    buttonBg: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
    progressBg: "bg-indigo-500",
  }
};

const topics = [
  {
    title: "Data Structures & Algorithms",
    progress: 0,
    total: 8,
    category: "dsa",
    link: "/dashboard/data-structures-and-algorithms",
    icon: Boxes,
  },
  {
    title: "SQL",
    progress: 0,
    total: 5,
    category: "database",
    link: "/dashboard/sql",
    icon: Database,
  },
  {
    title: "Operating System",
    progress: 0,
    total: 3,
    category: "systems",
    link: "/dashboard/operating-system",
    icon: Cpu,
  },
  {
    title: "Computer Networks",
    progress: 0,
    total: 3,
    category: "systems",
    link: "/dashboard/computer-networks",
    icon: Network,
  },
  {
    title: "System Design",
    progress: 0,
    total:6,
    category: "design",
    link: "/dashboard/system-design",
    icon: BrainCircuit,
  },
  {
    title: "Low Level Design",
    progress: 0,
    total: 10,
    category: "design",
    link: "/dashboard/low-level-design",
    icon: Layers3,
  },
  {
    title: "Object Oriented Programming",
    progress: 0,
    total: 5,
    category: "design",
    link: "/dashboard/object-oriented-programming",
    icon: Code2,
  },
  {
    title: "Aptitude",
    progress: 0,
    total: 4,
    category: "prep",
    link: "/dashboard/aptitude",
    icon: Target,
  },
  {
    title: "Programming Fundamentals",
    progress: 0,
    total: 8,
    category: "dsa",
    link: "/dashboard/programming-fundamentals",
    icon: Binary,
  },
  {
    title: "C++",
    progress: 0,
    total: 4,
    category: "dsa",
    link: "/dashboard/c-plus-plus",
    icon: FileCode2,
  },
  {
    title: "Git & GitHub",
    progress: 0,
    total: 8,
    category: "prep",
    link: "/dashboard/git-and-github",
    icon: GitBranch,
  },
  {
    title: "Interview Preparation",
    progress: 0,
    total: 6,
    category: "prep",
    link: "/dashboard/interview-preparation",
    icon: ShieldCheck,
  },
];

const filterTopics = (topicsList, activeTab) => {
  if (activeTab === "All Topics") return topicsList;
  if (activeTab === "Algorithms" || activeTab === "Data Structures") {
    return topicsList.filter(t => t.category === "dsa");
  }
  if (activeTab === "Database") {
    return topicsList.filter(t => t.category === "database");
  }
  if (activeTab === "Operating System") {
    return topicsList.filter(t => t.title === "Operating System");
  }
  if (activeTab === "Computer Networks") {
    return topicsList.filter(t => t.title === "Computer Networks");
  }
  if (activeTab === "OOPs") {
    return topicsList.filter(t => t.title === "Object Oriented Programming");
  }
  if (activeTab === "System Design") {
    return topicsList.filter(t => t.title === "System Design");
  }
  if (activeTab === "Low Level Design") {
    return topicsList.filter(t => t.title === "Low Level Design");
  }
  if (activeTab === "Prep & Tools") {
    return topicsList.filter(t => t.category === "prep");
  }
  return topicsList;
};

function TopicCard({ topic }) {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = (topic.progress / topic.total) * 100;
  const isInProgress = topic.progress > 0;
  
  const categoryStyle = CATEGORY_STYLES[topic.category] || CATEGORY_STYLES.dsa;
  const Icon = topic.icon;

  const cardBg = isInProgress ? "bg-[#11111b]" : "bg-[#0b0b0d]";
  const cardBorder = isInProgress ? "border border-white/10" : "border border-white/5";

  return (
    <Link to={topic.link} className="w-full">
      <div
        className={`rounded-2xl h-35 w-[98%] cursor-pointer p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group bg-white/11   `}
        
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header: Title + Icon */}
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white leading-snug truncate group-hover:text-white transition-colors">
              {topic.title}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {topic.progress}/{topic.total} Completed
            </p>
          </div>
          <div className="shrink-0 " style={{ color: categoryStyle.color }}>
            <Icon size={45} />
          </div>
        </div>

        {/* Middle: Progress Info + Bar */}
        <div className="w-full mt-3 flex items-center">
            {Array.from({ length: topic.total }).map((_, i) => {
                const isFilled = i < topic.progress;
                const isLast = i === topic.total - 1;

                return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div
                    className={`rounded-full transition-all duration-300 ${
                        isFilled
                        ? `w-4 h-4 ${categoryStyle.progressBg}`
                        : "w-4 h-4 bg-white/20"
                    }`}
                    />
                    {!isLast && (
                    <div
                        className={`flex-1 h-[10px]   transition-all duration-300 ${
                        i < topic.progress - 1 ? categoryStyle.progressBg : "bg-white/10"
                        }`}
                    />
                    )}
                </div>
                );
            })}
            </div>
      </div>
    </Link>
  );
}

function DashTopic({ activeTab }) {
  const filtered = filterTopics(topics, activeTab);

  return (
    <div className="w-[calc(100%-1.5rem)] ml-6 py-2 flex mt-5 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-12 w-full justify-items-start">
        {filtered.map((topic) => (
          <TopicCard key={topic.title} topic={topic} />
        ))}
      </div>
    </div>
  );
}

export default DashTopic;