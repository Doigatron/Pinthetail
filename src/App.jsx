import React from "react";
import Map from "./components/Map"; // ✅ correct path since Map.jsx is inside components

function App() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Pinthetail</h1>
      <Map />
    </div>
  );
}

export default App;
