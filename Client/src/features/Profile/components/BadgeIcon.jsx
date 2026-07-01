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
        "#E28743", // Bronze
        (
          <g transform="translate(0, 0)">
            {/* Shield */}
            <path
              d="M 100 70 L 128 80 V 110 C 128 128, 100 142, 100 142 C 100 142, 72 128, 72 110 V 80 Z"
              fill="none"
              stroke="#E28743"
              strokeWidth="3.5"
            />
            {/* Star inside shield */}
            <path
              d="M 100 88 L 104 98 L 115 98 L 106 104 L 109 115 L 100 108 L 91 115 L 94 104 L 85 98 L 96 98 Z"
              fill="#E28743"
            />
          </g>
        )
      );

    case "leetcore-legend":
      return renderMilestoneBadge(
        "LEETCORE LEGEND",
        "1000 QUESTIONS",
        "#F4B41A", // Gold
        (
          <g transform="translate(0, 0)">
            {/* Crown */}
            <path
              d="M 68 122 L 60 90 L 80 102 L 100 80 L 120 102 L 140 90 L 132 122 Z"
              fill="none"
              stroke="#F4B41A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Crown dots */}
            <circle cx="60" cy="90" r="3.5" fill="#F4B41A" />
            <circle cx="100" cy="80" r="3.5" fill="#F4B41A" />
            <circle cx="140" cy="90" r="3.5" fill="#F4B41A" />
            <ellipse cx="100" cy="115" rx="16" ry="3.5" fill="#F4B41A" />
          </g>
        )
      );

    // 4. Topic Mastery Badges
    case "array-master":
      return renderMilestoneBadge(
        "ARRAY MASTER",
        "TOPIC COMPLETED",
        "#14B8A6", // Teal
        (
          <g transform="translate(0, 5)">
            <rect x="70" y="86" width="60" height="24" rx="4" fill="none" stroke="#14B8A6" strokeWidth="3" />
            <line x1="90" y1="86" x2="90" y2="110" stroke="#14B8A6" strokeWidth="2.5" />
            <line x1="110" y1="86" x2="110" y2="110" stroke="#14B8A6" strokeWidth="2.5" />
            <text x="80" y="102" textAnchor="middle" fill="#14B8A6" fontSize="11" fontWeight="bold" fontFamily="monospace">0</text>
            <text x="100" y="102" textAnchor="middle" fill="#14B8A6" fontSize="11" fontWeight="bold" fontFamily="monospace">1</text>
            <text x="120" y="102" textAnchor="middle" fill="#14B8A6" fontSize="11" fontWeight="bold" fontFamily="monospace">2</text>
          </g>
        )
      );

    case "string-specialist":
      return renderMilestoneBadge(
        "STRING SPECIALIST",
        "TOPIC COMPLETED",
        "#EC4899", // Pink
        (
          <g transform="translate(0, 0)">
            {/* Quotations mark and string text */}
            <text x="100" y="105" textAnchor="middle" fill="#EC4899" fontSize="30" fontWeight="900" fontFamily="monospace">"str"</text>
          </g>
        )
      );

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
      return renderMilestoneBadge(
        "LINKED LIST EXPERT",
        "TOPIC COMPLETED",
        "#0EA5E9", // Sky Blue
        (
          <g transform="translate(0, 0)">
            {/* Nodes connected */}
            <circle cx="70" cy="100" r="8" fill="#0EA5E9" />
            <circle cx="100" cy="100" r="8" fill="#0EA5E9" />
            <circle cx="130" cy="100" r="8" fill="#0EA5E9" />
            <path d="M 78 100 L 92 100 M 108 100 L 122 100" stroke="#0EA5E9" strokeWidth="2.5" />
            {/* Arrows */}
            <path d="M 88 97 L 92 100 L 88 103 M 118 97 L 122 100 L 118 103" fill="none" stroke="#0EA5E9" strokeWidth="1.5" />
          </g>
        )
      );

    case "stack-sensei":
      return renderMilestoneBadge(
        "STACK SENSEI",
        "TOPIC COMPLETED",
        "#F97316", // Orange
        (
          <g transform="translate(0, 4)">
            {/* Stacked plates */}
            <rect x="75" y="80" width="50" height="8" rx="2" fill="#F97316" />
            <rect x="75" y="92" width="50" height="8" rx="2" fill="#F97316" />
            <rect x="75" y="104" width="50" height="8" rx="2" fill="#F97316" />
          </g>
        )
      );

    case "queue-commander":
      return renderMilestoneBadge(
        "QUEUE COMMANDER",
        "TOPIC COMPLETED",
        "#84CC16", // Lime
        (
          <g transform="translate(0, 0)">
            {/* Queue items queueing */}
            <rect x="70" y="94" width="12" height="12" rx="2" fill="#84CC16" />
            <rect x="90" y="94" width="12" height="12" rx="2" fill="#84CC16" />
            <rect x="110" y="94" width="12" height="12" rx="2" fill="#84CC16" />
            <path d="M 126 100 L 138 100 M 134 96 L 138 100 L 134 104" fill="none" stroke="#84CC16" strokeWidth="2" />
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
