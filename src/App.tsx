import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import RanapPage from "./pages/Ranap";
import RalanPage from "./pages/Ralan";
import BerkasRanap from "./pages/BerkasRanap";
import DaftarPasien from "./pages/DaftarPasien";
import KlaimRalanPage from "./components/pasien/KlaimRalan";
import KlaimRanapPage from "./components/pasien/KlaimRanap";
import Login from "./pages/auth/login";

function AppLayout() {
  const location = useLocation();

  const noSidebarRoutes = ["/login"];

  const hideSidebar = noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-200">
      {!hideSidebar && <Sidebar />}

      <div className={`flex-1 flex flex-col ${!hideSidebar ? "ml-14" : ""}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/ranap" element={<RanapPage />} />
          <Route path="/ralan" element={<RalanPage />} />
          <Route path="/pasien" element={<DaftarPasien />} />
          <Route path="/ralan/klaim/:no_rawat" element={<KlaimRalanPage />} />
          <Route path="/ranap/klaim/:no_rawat" element={<KlaimRanapPage />} />
          <Route path="/ranap/berkas/:no_rawat" element={<BerkasRanap />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
