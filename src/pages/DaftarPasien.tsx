import React, { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

interface Pasien {
  no_rawat: string;
  no_rkm_medis: string;
  tgl_registrasi: string;
  status: string;
  no_sep: string;
  no_kartu: string;
  nm_pasien: string;
  tgl_lahir: string;
  jk: string;
}

export default function DaftarPasien() {
  const [data, setData] = useState<Pasien[]>([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 
  
  const getList = async () => {
    try {
      let dt = "";
      if (startDate!==""){
        dt += `?mulai=${startDate}`;
        if (endDate!==""){
          dt += `&sampai=${startDate}`;
        }
      }
      const raw = await fetch(`http://192.168.20.4:3000/grab/list${dt}`);
      const data = await raw.json();
      console.log(data);
      setData(data.data)  
    } catch {
      setData(data);
    }
  }
  useEffect(() => {
    getList();
  }, [startDate, endDate]);

  const columns: TableColumn<Pasien>[] = [
  {
    name: "No Rawat",
    selector: (row) => row.no_rawat,
    sortable: true,
    style: { justifyContent: "center" },
  },
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
    name: "Status",
    selector: (row) => row.status,
    style: { justifyContent: "center" },
  },
  {
    name: "Aksi",
    ignoreRowClick: true,
    style: { justifyContent: "center" },
    cell: (row) => (
      <div className="flex justify-center gap-4">
        <button
          onClick={() =>
            navigate(`/klaim/${row.no_rawat.replace(/\//g, "-")}`)
          }
          className="px-2 py-0 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          title="Klaim"
        >
          Klaim
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
    // console.log(item)
    // const tgl = new Date(item.tgl_registrasi);
    const inSearch =
      item.nm_pasien.toLowerCase().includes(filter.toLowerCase()) ||
      item.no_rkm_medis.includes(filter) ||
      item.no_sep?.includes(filter);

    // const inDateRange =
    //   (!startDate || tgl >= new Date(startDate)) &&
    //   (!endDate || tgl <= new Date(endDate));

    return inSearch
  });

  return (
    <div className="p-6 rounded shadow">
      <div className="flex flex-wrap justify-between items-center mb-4 bg-white rounded-lg p-3 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-700 text-sans ">
          Daftar Pasien
        </h2>

        <div className="flex gap-4 items-end">
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
