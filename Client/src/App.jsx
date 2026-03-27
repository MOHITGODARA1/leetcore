import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-80">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome
        </h1>

        <p className="text-gray-600 mb-6">
          This is a basic React + Tailwind UI.
        </p>

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;