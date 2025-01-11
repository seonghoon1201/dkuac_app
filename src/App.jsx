import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splashscreen from "./components/Splashscreen";
import Login from "./pages/Login";
import Equipment from "./pages/Equipment";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splashscreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/equipment" element={<Equipment />} />
      </Routes>
    </Router>
  );
};

export default App;
