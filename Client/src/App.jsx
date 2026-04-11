import React, { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard/dashboard";
import Arraypage from "./pages/Arraypage";
import Stringpage from "./pages/Stringpage";
import Twopointerpage from "./pages/TwoPointerpage";
import Stackpage from "./pages/Stackpage";
import LinkedListpage from "./pages/LinkedListpage";
import SlidingWindowpage from "./pages/SlidingWindowpage";
import SlowFastpage from "./pages/SlowFastpage";
import BinarySearchpage from "./pages/BinarySearchpage";
import Recursionpage from "./pages/Recursionpage";
import Hashingpage from "./pages/Hashingpage";
import Backtrackingpage from "./pages/Backtrackingpage";
import DynamicProgrammingPage from "./pages/DynamicProgrammingpage";
import Quepage from "./pages/Queuepage";
import { Routes, Route, useParams } from "react-router-dom";

/* Fallback Page */
const Page = ({ title }) => {
  return (
    <div style={{ color: "white", padding: "40px" }}>
      <h1>{title}</h1>
    </div>
  );
};

/* 🔥 Topic Renderer */
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
    "queue": <Quepage />,
    "dynamic-programming": <DynamicProgrammingPage />,
    "recursion": <Recursionpage />,
  };

  return topicMap[topic] || <Page title="Not Found" />;
}

/* 🔥 Protected Route */
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUser(data.user); // ✅ FIXED
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
        <h1 className="text-xl">Not Logged In ❌</h1>
      </div>
    );
  }

  return children;
};

/* 🔥 Main App */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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
    </Routes>
  );
}

export default App;