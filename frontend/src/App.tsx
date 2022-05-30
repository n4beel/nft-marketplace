import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Assets from "./pages/Assets";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
     <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="assets" element={<Assets />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
