import React from "react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard/dashboard";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;