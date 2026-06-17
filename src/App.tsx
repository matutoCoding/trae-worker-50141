import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Animals from "@/pages/Animals";
import Feeding from "@/pages/Feeding";
import Health from "@/pages/Health";
import Breeding from "@/pages/Breeding";
import Enclosure from "@/pages/Enclosure";
import Behavior from "@/pages/Behavior";
import Education from "@/pages/Education";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/feeding" element={<Feeding />} />
          <Route path="/health" element={<Health />} />
          <Route path="/breeding" element={<Breeding />} />
          <Route path="/enclosure" element={<Enclosure />} />
          <Route path="/behavior" element={<Behavior />} />
          <Route path="/education" element={<Education />} />
        </Route>
      </Routes>
    </Router>
  );
}
