import React, { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaCheckCircle,
  FaFilePdf,
  FaPaperPlane,
} from "react-icons/fa";

interface Pasien {
  no_rawat: string;
  no_rkm_medis: string;
  tgl_registrasi: string;
  status: string;
  no_sep: string;
  no_kartu: string;
  nm_pasien: string;
  tgl_lahir: string;
  status_claim?: number;
  claim_id?: number;
  jk: string;
}

export default function Ralan() {
  const [data, setData] = useState<Pasien[]>([]);
  const [filter, setFilter] = useState(localStorage.getItem?.("filter")||"");
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(localStorage.getItem?.("startDate")||"");
  const [endDate, setEndDate] = useState(localStorage.getItem?.("endDate")||"");
  const [noBpjs, setNoBpjs] = useState(localStorage.getItem?.("noBpjs")||"");
  const [noSep, setNoSep] = useState(localStorage.getItem?.("noSep")||"");
  const [noRekam, setNoRekam] = useState(localStorage.getItem?.("noRekam")||"");

  const getList = async () => {
    try {
      let dt = "";
      if (startDate !== "") {
        dt += `?mulai=${startDate}`;
        if (endDate !== "") {
          dt += `&sampai=${startDate}`;
        }
      }
      const raw = await fetch(`http://192.168.20.114:3000/grab/list/rajal${dt}`);
      const data = await raw.json();
      setData(data.data);
    } catch {
      setData(data);
    }
  };
  useEffect(() => {
    getList();
    localStorage.setItem("filter",filter);
    localStorage.setItem("startDate",startDate);
    localStorage.setItem("endDate",endDate);
    localStorage.setItem("noBpjs",noBpjs);
    localStorage.setItem("noSep",noSep);
    localStorage.setItem("noRekam",noRekam);
  }, [startDate, endDate,filter]);

  const columns: TableColumn<Pasien>[] = [
    {
      name: "No Rekam Medis",
      selector: (row) => row.no_rkm_medis,
      sortable: true,
      style: { justifyContent: "center" },
    },
    // {
    //   name: "No Rawat",
    //   selector: (row) => row.no_rawat,
    //   sortable: true,
    //   style: { justifyContent: "center" },
    // },
    {
      name: "Nama",
      selector: (row) => row.nm_pasien,
      sortable: true,
      style: {
        textAlign: "left",
        justifyContent: "flex-start",
      },
    },
    {
      name: "Nomor Kartu",
      selector: (row) => row.no_kartu,
      style: { justifyContent: "center" },
    },
    {
      name: "SEP",
      selector: (row) => row.no_sep,
      style: { justifyContent: "center" },
    },
    {
      name: "Tanggal Registrasi",
      selector: (row) =>
        new Date(row.tgl_registrasi).toLocaleDateString("id-ID"),
      sortable: true,
      style: { justifyContent: "center" },
    },
    {
      name: "Data Klaim",
      selector: (row) => row.status,
      style: { justifyContent: "center" },
    },
    {
      name: "Status Klaim",
      cell: (row) => {
        let status = null;
        let color = "bg-blue-500 text-white";
        switch (row.status_claim) {
          case 1:
            status = "Klaim Baru"
            color = "bg-yellow-500 text-black"
            break;
          case 2:
            status = "Grouping Idrg"
            break;
          case 3:
            status = "Final Idrg"
            color = "bg-green-600 text-white"
            break;
          case 4:
            status = "Grouping Inacbg"
            break;
          case 5:
            status = "Final Inacbg"
            break;
          case 6:
            status = "Final Klaim"
            break;
          case 7:
            status = "Terkirim"
            break;
        
          default:
            color = "bg-red-500 text-white"
            status = "Belum"
            break;
        }

        return (
          <span className={`px-3 py-1 text-sm rounded ${color}`}>{status}</span>
        );
      },
      style: { justifyContent: "center" },
    },
    {
      name: "Aksi",
      ignoreRowClick: true,
      style: { justifyContent: "center" },
      cell: (row) => (
        <div className="flex justify-center gap-3">
          {/* Klaim */}
          <button
            onClick={() =>
              navigate(`klaim/${row.no_rawat.replace(/\//g, "-")}`)
            }
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Klaim"
          >
            <FaFileAlt size={12} />
          </button>

          <button
            className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
            title="Belum"
          >
            <FaCheckCircle size={12} />
          </button>

          <button
            className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            title="PDF"
          >
            <FaFilePdf size={12} />
          </button>

          <button
            className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            title="Kirim"
          >
            <FaPaperPlane size={12} />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#0369a1",
        color: "white",
        fontSize: "14px",
        minHeight: "36px",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        justifyContent: "center",
        paddingTop: "6px",
        paddingBottom: "6px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "32px",
        lineHeight: "1.2rem",
      },
    },
    cells: {
      style: {
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "8px",
        paddingRight: "8px",
        justifyContent: "center",
      },
    },
  };

  const filteredData = data.filter((item) => {
    const inSearch =
      item.nm_pasien.toLowerCase().includes(filter.toLowerCase()) ||
      item.no_rkm_medis.includes(filter) ||
      item.no_sep?.includes(filter);

    const matchBpjs = noBpjs
      ? item.no_kartu?.toLowerCase().includes(noBpjs.toLowerCase())
      : true;

    const matchSep = noSep
      ? item.no_sep?.toLowerCase().includes(noSep.toLowerCase())
      : true;

    const matchRekam = noRekam
      ? item.no_rkm_medis?.toLowerCase().includes(noRekam.toLowerCase())
      : true;

    return matchSep && inSearch && matchBpjs && matchRekam;
  });

  return (
    <div className="p-6 rounded shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-700 text-sans">
          Rawat Jalan
        </h2>
      </div>
      <div className="flex flex-wrap justify-between items-center mb-4 bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              No Rekam Medis
            </label>
            <input
              type="number"
              value={noRekam}
              onChange={(e) => setNoRekam(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              No BPJS
            </label>
            <input
              type="number"
              value={noBpjs}
              onChange={(e) => setNoBpjs(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              No SEP
            </label>
            <input
              type="text"
              value={noSep}
              onChange={(e) => setNoSep(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Tanggal Masuk
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Tanggal Keluar
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
            />
          </div>

          <div className="flex flex-col w-52">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              Cari Pasien
            </label>
            <input
              type="text"
              placeholder="Cari"
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-sky-300"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={25}
        paginationRowsPerPageOptions={[25, 50, 100]}
        highlightOnHover
        striped
        customStyles={customStyles}
      />
    </div>
  );
}
