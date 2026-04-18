import React, { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./Features/Dashboard/DashboardPage";
import Arraypage from "./Features/DSA/page/Arraypage";
import Stringpage from "./Features/DSA/page/Stringpage";
import Twopointerpage from "./Features/DSA/page/TwoPointerpage";
import Stackpage from "./Features/DSA/page/Stackpage";
import LinkedListpage from "./Features/DSA/page/LinkedListpage";
import SlidingWindowpage from "./Features/DSA/page/SlidingWindowpage";
import SlowFastpage from "./Features/DSA/page/SlowFastpage";
import BinarySearchpage from "./Features/DSA/page/BinarySearchpage";
import Recursionpage from "./Features/DSA/page/Recursionpage";
import Hashingpage from "./Features/DSA/page/Hashingpage";
import Backtrackingpage from "./Features/DSA/page/Backtrackingpage";
import DynamicProgrammingPage from "./Features/DSA/page/DynamicProgrammingpage";
import Queuepage from "./Features/DSA/page/Queuepage";
import Leaderboardpage from "./Features/Leaderboard/Leaderboardpage";
import WeeklyLeaderboardpage from "./Features/Weeklyboard/WeeklyLeaderboard";
import { Routes, Route, useParams } from "react-router-dom";

/* Fallback Page */
const Page = ({ title }) => {
  return (
    <div style={{ color: "white", padding: "40px" }}>
      <h1>{title}</h1>
    </div>
  );
};

/*  Topic Renderer */
function TopicRenderer() {
  const { topic } = useParams();

  const topicMap = {
    "arrays": <Arraypage />,
    "string": <Stringpage />,
    "two-pointers": <Twopointerpage />,
    "slow-fast": <SlowFastpage />,
    "stack": <Stackpage />,
    "linked-list": <LinkedListpage />,
    "sliding-window": <SlidingWindowpage />,
    "binary-search": <BinarySearchpage />,
    "hashing": <Hashingpage />,
    "backtracking": <Backtrackingpage />,
    "queue": <Queuepage />,
    "dynamic-programming": <DynamicProgrammingPage />,
    "recursion": <Recursionpage />,
  };

  return topicMap[topic] || <Page title="Not Found" />;
}

/*  Protected Route */
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${API_URL}/api/v1/auth/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUser(data.user); //  FIXED
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-[#0a0a0a]">
        <h1 className="text-xl">Not Logged In </h1>
      </div>
    );
  }

  return children;
};

/*  Main App */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* <ProtectedRoute>
        <Route path="/dashboard" element={<Navigate to="/dashboard/dsa" replace />} />
      </ProtectedRoute> */}
      <Route path="/dashboard/:subject" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/:subject/:topic" element={
        <ProtectedRoute>
          <TopicRenderer />
        </ProtectedRoute>
      } />
      <Route path="/leaderboard" element={
        <ProtectedRoute>
          <Leaderboardpage />
        </ProtectedRoute>
      } />
      <Route path="/weeklyleaderboard" element={
        <ProtectedRoute>
          <WeeklyLeaderboardpage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;