import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import IncidentsPage from "./pages/IncidentsPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import CompareParticipants from "./pages/CompareParticipants_beforeReducer";
import FleetDashboardMockup from "./pages/FleetDashboardMockup";

function App() {
  const m = new Set();
  m.add("a");
  const k = m.has("a");
  console.log(k);
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/dashboard" element={<FleetDashboardMockup />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/compare-participants" element={<CompareParticipants />} />
          <Route path="*" element={<FleetDashboardMockup />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
