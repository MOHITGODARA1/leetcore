import React from "react";

// Reusable SVG Badge Icon Component
export function BadgeIcon({ slug, size = 48, unlocked = true, className = "" }) {
  const grayscaleClass = unlocked ? "" : "grayscale opacity-40";

  // Streak Badges: Circle with arched divide, black top, orange bottom
  const renderStreakBadge = (title, daysText, color = "#FF9F1C") => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={`${grayscaleClass} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="badgeCircleClip">
            <circle cx="100" cy="100" r="90" />
          </clipPath>
          {/* Top text path following the outer curve */}
          <path
            id="streakTopPath"
            d="M 32 100 A 68 68 0 0 1 168 100"
            fill="none"
          />
        </defs>

        {/* Outer White Border Ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
        
        <g clipPath="url(#badgeCircleClip)">
          {/* Bottom Orange Section */}
          <rect x="0" y="0" width="200" height="200" fill={color} />
          
          {/* Top Black Section with Arched Divide */}
          <path d="M -10 -10 L 210 -10 L 210 108 Q 100 68 -10 108 Z" fill="#0E0E12" />
          
          {/* Dividing Thin White Line */}
          <path d="M -10 108 Q 100 68 210 108" fill="none" stroke="#FFFFFF" strokeWidth="2" />
          
          {/* Top Title Text curved along path */}
          <text fill={color} fontSize="13" fontWeight="900" letterSpacing="1.2" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
            <textPath href="#streakTopPath" startOffset="50%" textAnchor="middle">
              {title}
            </textPath>
          </text>

          {/* Center Big Days Number */}
          <text
            x="100"
            y="148"
            textAnchor="middle"
            fontSize="54"
            fontWeight="900"
            fill="#0E0E12"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            {daysText}
          </text>

          {/* Days Label below */}
          <text
            x="100"
            y="174"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="#0E0E12"
            letterSpacing="1.5"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            DAYS
          </text>
        </g>
      </svg>
    );
  };

  const renderShieldBadge = (line1, line2, color) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={`${grayscaleClass} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Shield Path */}
        <path
          d="M 100 22 C 135 22, 165 30, 172 40 C 172 90, 155 142, 100 174 C 45 142, 28 90, 28 40 C 35 30, 65 22, 100 22 Z"
          fill="#0C0C0F"
          stroke={color}
          strokeWidth="4"
        />
        {/* Inner Shield Path */}
        <path
          d="M 100 28 C 131 28, 158 35, 164 44 C 164 88, 149 135, 100 165 C 51 135, 36 88, 36 44 C 42 35, 69 28, 100 28 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />

        {/* Text Center Header */}
        <text
          x="100"
          y="72"
          textAnchor="middle"
          fill={color}
          fontSize="15"
          fontWeight="900"
          letterSpacing="0.5"
          fontFamily="'Georgia', 'Times New Roman', serif"
        >
          {line1}
        </text>
        <text
          x="100"
          y="94"
          textAnchor="middle"
          fill={color}
          fontSize="15"
          fontWeight="900"
          letterSpacing="0.5"
          fontFamily="'Georgia', 'Times New Roman', serif"
        >
          {line2}
        </text>

        {/* Laurel Wreath */}
        <g fill={color} opacity="0.85">
          {/* Left Wreath Leaves */}
          <path d="M 75,130 C 72,125 68,122 62,120 C 66,124 70,128 72,133 Z" />
          <path d="M 70,122 C 66,117 60,115 54,114 C 59,117 63,121 66,126 Z" />
          <path d="M 64,113 C 59,108 52,106 46,107 C 51,109 56,113 58,118 Z" />
          <path d="M 60,102 C 55,97 48,96 42,98 C 47,99 51,103 54,108 Z" />
          <path d="M 58,91 C 54,86 48,86 42,89 C 47,89 51,93 53,98 Z" />
          
          {/* Right Wreath Leaves */}
          <path d="M 125,130 C 128,125 132,122 138,120 C 134,124 130,128 128,133 Z" />
          <path d="M 130,122 C 134,117 140,115 146,114 C 141,117 137,121 134,126 Z" />
          <path d="M 136,113 C 141,108 148,106 154,107 C 149,109 144,113 142,118 Z" />
          <path d="M 140,102 C 145,97 152,96 158,98 C 153,99 149,103 146,108 Z" />
          <path d="M 142,91 C 146,86 152,86 158,89 C 153,89 149,93 147,98 Z" />
        </g>

        {/* Center Star */}
        <path
          d="M 100 114 L 104 124 L 115 124 L 106 130 L 109 141 L 100 134 L 91 141 L 94 130 L 85 124 L 96 124 Z"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
        />
      </svg>
    );
  };

  // Question Milestone Badges: Black center, outer ring with curved text top/bottom, custom logo center
  const renderMilestoneBadge = (title, subtitle, themeColor, logoElement) => {
    const pathIdTop = `topPath-${slug}`;
    const pathIdBottom = `bottomPath-${slug}`;
    
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={`${grayscaleClass} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Top text path - Clockwise left to right */}
          <path
            id={pathIdTop}
            d="M 32 100 A 68 68 0 0 1 168 100"
            fill="none"
          />
          {/* Bottom text path - Counter-clockwise right to left (upright text) */}
          <path
            id={pathIdBottom}
            d="M 168 102 A 68 68 0 0 1 32 102"
            fill="none"
          />
        </defs>

        {/* Outer Border (Double ring style) */}
        <circle cx="100" cy="100" r="92" fill="#0E0E12" stroke={themeColor} strokeWidth="3" />
        
        {/* Inner Black Circle */}
        <circle cx="100" cy="100" r="66" fill="#000000" stroke={themeColor} strokeWidth="2.5" />

        {/* Top Text */}
        <text
          fill={themeColor}
          fontSize="11"
          fontWeight="900"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          <textPath href={`#${pathIdTop}`} startOffset="50%" textAnchor="middle">
            {title}
          </textPath>
        </text>

        {/* Bottom Text */}
        <text
          fill={themeColor}
          fontSize="11"
          fontWeight="900"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {/* dy=10 aligns it nicely in the center of the outer ring */}
          <textPath href={`#${pathIdBottom}`} startOffset="50%" textAnchor="middle" dy="10">
            {subtitle}
          </textPath>
        </text>

        {/* Center Graphic */}
        <g transform="translate(0, 0)">
          {logoElement}
        </g>
      </svg>
    );
  };

  switch (slug) {
    // 1. Streak Badges
    case "week-warrior":
      return renderStreakBadge("WEEK WARRIOR", "7");
    case "consistency-champion":
      return renderStreakBadge("CONSISTENCY CHAMPION", "14");
    case "unbreakable":
      return renderStreakBadge("UNBREAKABLE", "30");
    case "iron-discipline":
      return renderStreakBadge("IRON DISCIPLINE", "60");
    case "annual-warrior":
      return renderStreakBadge("ANNUAL WARRIOR", "365");

    // 2. Question Milestones
    case "initiator":
      return renderMilestoneBadge(
        "THE INITIATOR",
        "20 QUESTIONS",
        "#F46717", // Orange
        (
          <g transform="translate(68, 68) scale(1)">
            {/* Top-Left Piece (Orange) */}
            <path
              d="M 5 5 H 32 V 12 A 5 5 0 0 1 37 17 A 5 5 0 0 1 32 22 V 37 H 22 A 5 5 0 0 0 17 32 A 5 5 0 0 0 12 37 H 5 V 5"
              fill="#F46717"
              stroke="#000"
              strokeWidth="1.5"
            />
            {/* Top-Right Piece (White) */}
            <path
              d="M 32 5 H 59 V 37 H 49 A 5 5 0 0 1 44 32 A 5 5 0 0 1 39 37 H 32 V 22 A 5 5 0 0 0 37 17 A 5 5 0 0 0 32 12 Z"
              fill="#FFFFFF"
              stroke="#000"
              strokeWidth="1.5"
            />
            {/* Bottom-Left Piece (White) */}
            <path
              d="M 5 37 H 12 A 5 5 0 0 1 17 32 A 5 5 0 0 1 22 37 H 32 V 59 H 5 V 49 A 5 5 0 0 0 10 44 A 5 5 0 0 0 5 39 Z"
              fill="#FFFFFF"
              stroke="#000"
              strokeWidth="1.5"
            />
            {/* Bottom-Right Piece (Orange) */}
            <path
              d="M 32 37 H 39 A 5 5 0 0 0 44 32 A 5 5 0 0 0 49 37 H 59 V 49 A 5 5 0 0 1 54 44 A 5 5 0 0 1 59 39 V 59 H 32 Z"
              fill="#F46717"
              stroke="#000"
              strokeWidth="1.5"
            />
          </g>
        )
      );

    case "problem-solver":
      return renderMilestoneBadge(
        "PROBLEM SOLVER",
        "50 QUESTIONS",
        "#8CE39E", // Green
        (
          <g transform="translate(0, -6)">
            {/* Phoenix Bird Wing Left */}
            <path
              d="M 100 125 C 90 105, 65 92, 48 90 C 65 97, 80 110, 85 125 C 75 115, 60 108, 45 108 C 60 115, 75 125, 80 135 C 70 130, 58 127, 48 127 C 62 134, 85 145, 92 155 L 100 135"
              fill="#8CE39E"
            />
            {/* Phoenix Bird Wing Right */}
            <path
              d="M 100 125 C 110 105, 135 92, 152 90 C 135 97, 120 110, 115 125 C 125 115, 140 108, 155 108 C 140 115, 125 125, 120 135 C 130 130, 142 127, 152 127 C 138 134, 115 145, 108 155 L 100 135"
              fill="#8CE39E"
            />
            {/* Tail Feathers */}
            <path
              d="M 100 135 L 94 165 L 100 157 L 106 165 Z M 100 135 L 86 155 Q 94 147 100 140 Q 106 147 114 155 Z"
              fill="#8CE39E"
            />
            {/* Head and Body */}
            <path d="M 100 90 L 97 98 L 100 106 L 103 98 Z" fill="#8CE39E" />
            <path d="M 100 106 C 96 110, 96 122, 100 130 C 104 122, 104 110, 100 106 Z" fill="#8CE39E" />
          </g>
        )
      );

    case "dsa-explorer":
      return renderMilestoneBadge(
        "DSA EXPLORER",
        "100 QUESTIONS",
        "#C5A059", // Gold
        (
          <g transform="translate(0, 0)">
            {/* Globe Circles */}
            <circle cx="100" cy="100" r="28" fill="none" stroke="#C5A059" strokeWidth="2" />
            <line x1="72" y1="100" x2="128" y2="100" stroke="#C5A059" strokeWidth="2" />
            <line x1="100" y1="72" x2="100" y2="128" stroke="#C5A059" strokeWidth="2" />
            
            {/* Latitudes */}
            <path d="M 76 90 Q 100 98 124 90" fill="none" stroke="#C5A059" strokeWidth="2" />
            <path d="M 76 110 Q 100 102 124 110" fill="none" stroke="#C5A059" strokeWidth="2" />
            
            {/* Longitudes */}
            <ellipse cx="100" cy="100" rx="14" ry="28" fill="none" stroke="#C5A059" strokeWidth="2" />

            {/* Laurel Wreath Left */}
            <path d="M 66 115 C 58 105, 58 85, 70 70" fill="none" stroke="#C5A059" strokeWidth="2" />
            {/* Leaves Left */}
            <path d="M 65 110 Q 56 108 60 100 Q 66 106 65 110 Z" fill="#C5A059" />
            <path d="M 62 98 Q 52 94 58 86 Q 64 92 62 98 Z" fill="#C5A059" />
            <path d="M 65 86 Q 57 78 64 72 Q 69 80 65 86 Z" fill="#C5A059" />
            <path d="M 70 74 Q 66 64 74 60 Q 77 70 70 74 Z" fill="#C5A059" />

            {/* Laurel Wreath Right */}
            <path d="M 134 115 C 142 105, 142 85, 130 70" fill="none" stroke="#C5A059" strokeWidth="2" />
            {/* Leaves Right */}
            <path d="M 135 110 Q 144 108 140 100 Q 134 106 135 110 Z" fill="#C5A059" />
            <path d="M 138 98 Q 148 94 142 86 Q 136 92 138 98 Z" fill="#C5A059" />
            <path d="M 135 86 Q 143 78 136 72 Q 131 80 135 86 Z" fill="#C5A059" />
            <path d="M 130 74 Q 134 64 126 60 Q 123 70 130 74 Z" fill="#C5A059" />
          </g>
        )
      );

    case "algo-addict":
      return renderMilestoneBadge(
        "ALGORITHM ADDICT",
        "250 QUESTIONS",
        "#3AAFA9", // Teal
        (
          <g transform="translate(0, 0)">
            {/* Butterfly Left Wing */}
            <path
              d="M 100 100 C 95 85, 75 70, 60 82 C 50 90, 60 110, 82 110 C 67 115, 57 125, 65 135 C 72 142, 88 130, 100 115"
              fill="#3AAFA9"
              opacity="0.9"
            />
            {/* Butterfly Right Wing */}
            <path
              d="M 100 100 C 105 85, 125 70, 140 82 C 150 90, 140 110, 118 110 C 133 115, 143 125, 135 135 C 128 142, 112 130, 100 115"
              fill="#3AAFA9"
              opacity="0.9"
            />
            {/* Antennae */}
            <path d="M 98 85 Q 99 70 93 65" fill="none" stroke="#3AAFA9" strokeWidth="2" strokeLinecap="round" />
            <path d="M 102 85 Q 101 70 107 65" fill="none" stroke="#3AAFA9" strokeWidth="2" strokeLinecap="round" />
            {/* Body */}
            <ellipse cx="100" cy="108" rx="2.5" ry="18" fill="#3AAFA9" />
          </g>
        )
      );

    // 3. Solve Milestones (Placeholders/Fallback themes)
    case "core-master":
      return renderMilestoneBadge(
        "CORE MASTER",
        "500 QUESTIONS",
        "#B28269", // Bronze
        (
          <g transform="translate(0, 0)">
            <path
              d="M 98,66 L 108,84 L 103,86 L 116,96 L 109,99 L 124,109 L 115,112 L 121,123 L 104,124 L 98,135 L 94,123 L 88,124 L 90,118 L 84,115 L 88,110 L 80,108 L 84,105 L 72,102 L 78,98 L 82,101 L 80,92 L 86,94 L 84,84 L 90,87 L 90,72 L 94,84 Z"
              fill="#B28269"
            />
          </g>
        )
      );

    case "leetcore-legend":
      return renderMilestoneBadge(
        "LEETCORE LEGEND",
        "1000 QUESTIONS",
        "#F46717", // Orange
        (
          <g transform="translate(0, 0)">
            <path
              d="M 68,90 C 72,82 78,76 86,76 C 96,76 103,84 108,82 C 114,80 120,72 128,76 C 122,81 115,83 109,87 C 117,87 126,84 130,89 C 122,93 114,94 108,98 C 115,99 123,97 126,102 C 117,106 109,106 104,111 C 110,112 116,111 118,116 C 108,119 100,117 96,122 C 98,124 102,126 101,129 C 94,125 90,120 88,114 C 84,113 78,111 76,106 C 79,106 82,105 84,103 C 76,101 71,97 68,90 Z"
              fill="#F46717"
            />
            <circle cx="80" cy="86" r="2.5" fill="#000000" />
          </g>
        )
      );

    // 4. Topic Mastery Badges
    case "array-master":
      return renderShieldBadge("ARRAY", "MASTER", "#FFA133");

    case "string-specialist":
      return renderShieldBadge("STRING", "SPECIALIST", "#FFA133");

    case "hashing-hero":
      return renderMilestoneBadge(
        "HASHING HERO",
        "TOPIC COMPLETED",
        "#3B82F6", // Blue
        (
          <g transform="translate(0, 0)">
            {/* Hash symbol / Grid */}
            <path
              d="M 82 76 L 82 124 M 118 76 L 118 124 M 72 90 L 128 90 M 72 110 L 128 110"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )
      );

    case "search-master":
      return renderMilestoneBadge(
        "SEARCH MASTER",
        "TOPIC COMPLETED",
        "#8B5CF6", // Violet
        (
          <g transform="translate(-4, -4)">
            {/* Target search */}
            <circle cx="95" cy="95" r="18" fill="none" stroke="#8B5CF6" strokeWidth="3" />
            <line x1="108" y1="108" x2="128" y2="128" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="95" cy="95" r="6" fill="#8B5CF6" />
          </g>
        )
      );

    case "linked-list-expert":
      return renderShieldBadge("LINKED LIST", "EXPERT", "#FFA133");

    case "stack-sensei":
      return renderShieldBadge("STACK", "SENSEI", "#FFA133");

    case "queue-commander":
      return renderShieldBadge("QUEUE", "COMMANDER", "#FFA133");

    case "recursion-master":
      return renderMilestoneBadge(
        "RECURSION MASTER",
        "TOPIC COMPLETED",
        "#F43F5E",
        (
          <g transform="translate(0, 0)">
            <text x="100" y="112" textAnchor="middle" fill="#F43F5E" fontSize="38" fontWeight="bold" fontFamily="monospace">f()</text>
          </g>
        )
      );

    case "backtracking-master":
      return renderMilestoneBadge(
        "BACKTRACKING MASTER",
        "TOPIC COMPLETED",
        "#10B981",
        (
          <g transform="translate(0, 0)">
            <text x="100" y="112" textAnchor="middle" fill="#10B981" fontSize="38" fontWeight="bold" fontFamily="monospace">←</text>
          </g>
        )
      );

    case "trees-master":
      return renderShieldBadge("TREE", "EXPLORER", "#FFA133");

    case "bst-master":
      return renderMilestoneBadge(
        "BST MASTER",
        "TOPIC COMPLETED",
        "#059669",
        (
          <g transform="translate(0, 0)">
            <circle cx="100" cy="76" r="8" fill="#059669" />
            <circle cx="80" cy="105" r="8" fill="#059669" />
            <circle cx="120" cy="105" r="8" fill="#059669" />
            <line x1="98" y1="84" x2="84" y2="97" stroke="#059669" strokeWidth="2" strokeLinejoin="round" />
            <line x1="102" y1="84" x2="116" y2="97" stroke="#059669" strokeWidth="2" strokeLinejoin="round" />
            <text x="100" y="138" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="monospace">BST</text>
          </g>
        )
      );

    case "heap-master":
      return renderMilestoneBadge(
        "HEAP MASTER",
        "TOPIC COMPLETED",
        "#F59E0B",
        (
          <g transform="translate(0, 0)">
            <polygon points="100,70 70,120 130,120" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="100" cy="80" r="6" fill="#F59E0B" />
            <circle cx="88" cy="100" r="6" fill="#F59E0B" />
            <circle cx="112" cy="100" r="6" fill="#F59E0B" />
          </g>
        )
      );

    case "graphs-master":
      return renderShieldBadge("GRAPH", "NAVIGATOR", "#FFA133");

    case "trie-master":
      return renderMilestoneBadge(
        "TRIE MASTER",
        "TOPIC COMPLETED",
        "#A855F7",
        (
          <g transform="translate(0, 0)">
            <text x="100" y="112" textAnchor="middle" fill="#A855F7" fontSize="38" fontWeight="bold" fontFamily="monospace">T</text>
          </g>
        )
      );

    case "greedy-master":
      return renderMilestoneBadge(
        "GREEDY MASTER",
        "TOPIC COMPLETED",
        "#EAB308",
        (
          <g transform="translate(0, 0)">
            <text x="100" y="112" textAnchor="middle" fill="#EAB308" fontSize="38" fontWeight="bold" fontFamily="monospace">$</text>
          </g>
        )
      );

    case "dp-master":
      return renderShieldBadge("DP", "ARCHITECT", "#FFA133");

    case "bit-master":
      return renderMilestoneBadge(
        "BIT MASTER",
        "TOPIC COMPLETED",
        "#64748B",
        (
          <g transform="translate(0, 0)">
            <text x="100" y="112" textAnchor="middle" fill="#64748B" fontSize="36" fontWeight="bold" fontFamily="monospace">01</text>
          </g>
        )
      );

    default:
      // General fallback badge
      return renderMilestoneBadge(
        slug.toUpperCase().replace("-", " "),
        "ACHIEVEMENT",
        "#F46717",
        (
          <circle cx="100" cy="100" r="15" fill="#F46717" />
        )
      );
  }
}
