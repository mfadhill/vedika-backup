import { useState, useRef, useEffect } from "react";
import { RiComputerLine } from "react-icons/ri";
import { FiHome, FiFileText, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <aside className="fixed top-0 left-0 h-screen w-16 bg-blue-500 shadow-lg flex flex-col items-center z-20">
        <div className="p-2">
          <Link to ="/">
          <img src="/logo-rs.png" alt="Logo" className="h-8" />
          </Link>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={() =>
              setActiveMenu(activeMenu === "dashboard" ? null : "dashboard")
            }
            className={`p-3 rounded-lg transition ${activeMenu === "dashboard"
              ? "bg-white text-blue-600 shadow"
              : "text-white hover:bg-blue-600"
              }`}
          >
            <FiHome size={22} />
          </button>

          <button
            onClick={() =>
              setActiveMenu(activeMenu === "audit" ? null : "audit")
            }
            className={`p-3 rounded-lg transition ${activeMenu === "audit"
              ? "bg-white text-blue-600 shadow"
              : "text-white hover:bg-blue-600"
              }`}
          >
             <RiComputerLine size = {22}/>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          {/* <button
            onClick={() => console.log("Logout clicked")}
            className="p-3 rounded-lg text-white hover:bg-blue-600 transition"
          >
            <FiLogOut size={22} />
          </button> */}
          <Link
        to="/login"
        title="logout"
        className="p-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition inline-flex items-center justify-center"
      >
      <FiLogOut size={22} />

      </Link>
        </div>
      </aside>

      {activeMenu && (
        <aside
          ref={menuRef}
          className="fixed top-0 left-16 w-60 h-screen bg-blue-100 border-l shadow-inner p-4 transition-all duration-300 z-30"
        >
          {/* Dashboard */}
          {activeMenu === "dashboard" && (
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-1 border-b pb-2">
                RSUFS Vedika
              </h2>
              <ul className="space-y-2 text-gray-700 mt-3">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-blue-100 hover:text-blue-600 ${activeSubmenu === "overview"
                      ? "bg-blue-200 text-blue-700 font-semibold"
                      : ""
                      }`}
                    onClick={() => setActiveSubmenu("overview")}
                  >
                    <FiHome size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Audit / Ranap */}
          {activeMenu === "audit" && (
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-1 border-b pb-2">
                RSUFS Vedika
              </h2>
              <ul className="space-y-2 text-gray-700 mt-3">
                <li>
                  <Link
                    to="/ralan"
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-blue-100 hover:text-blue-600 ${activeSubmenu === "ralan"
                      ? "bg-blue-200 text-blue-700 font-semibold"
                      : ""
                      }`}
                    onClick={() => {
                      setActiveSubmenu("ralan");
                      setActiveMenu(null);
                    }}

                  >
                    <FiFileText size={18} />
                    <span>Berkas Ralan (Baru)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ranap"
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-blue-100 hover:text-blue-600 ${activeSubmenu === "ranap"
                      ? "bg-blue-200 text-blue-700 font-semibold"
                      : ""
                      }`}
                    onClick={() => {
                      setActiveSubmenu("ranap");
                      setActiveMenu(null);
                    }}
                  >
                    <FiFileText size={18} />
                    <span>Berkas Ranap (Baru)</span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/pasien"
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-blue-100 hover:text-blue-600 ${activeSubmenu === "idrg"
                      ? "bg-blue-200 text-blue-700 font-semibold"
                      : ""
                      }`}
                    onClick={() => setActiveSubmenu("idrg")}
                  >
                    <FiFileText size={18} />
                    <span>IDRG </span>
                  </Link>
                </li> */}
              </ul>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
