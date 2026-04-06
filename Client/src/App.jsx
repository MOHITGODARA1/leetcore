import React from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard/dashboard";
import Arraypage from "./pages/Arraypage";
import { Routes, Route } from "react-router-dom";
const Page = ({ title }) => {
  return (
    <div style={{ color: "white", padding: "40px" }}>
      <h1>{title}</h1>
    </div>
  );
};
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dsa/arrays" element={<Arraypage />} />
        <Route path="/dsa/two-pointers" element={<Page title="Two Pointers" />} />
        <Route path="/dsa/stack" element={<Page title="Stack" />} />
        <Route path="/dsa/linked-list" element={<Page title="Linked List" />} />
        <Route path="/dsa/sliding-window" element={<Page title="Sliding Window" />} />
        <Route path="/dsa/binary-search" element={<Page title="Binary Search" />} />
        <Route path="/dsa/trees" element={<Page title="Trees" />} />
        <Route path="/dsa/tries" element={<Page title="Tries" />} />
        <Route path="/dsa/heap" element={<Page title="Heap" />} />
        <Route path="/dsa/backtracking" element={<Page title="Backtracking" />} />
      </Routes>
    </>
  );
}

export default App;