import React from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { FaClock, FaEye, FaFilePdf, FaPaperPlane, FaUpload } from "react-icons/fa";


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
   status_claim: number;
}

const dataPasien: Pasien[] = [
   {
      no_rawat: "2025/001",
      no_rkm_medis: "000001",
      tgl_registrasi: "2025-10-10T08:00:00Z",
      status: "Lengkap",
      no_sep: "SEP-2025001",
      no_kartu: "0001234567890",
      nm_pasien: "Ahmad Santoso",
      tgl_lahir: "1990-04-15",
      jk: "L",
      status_claim: 1,
   },
   {
      no_rawat: "2025/002",
      no_rkm_medis: "000002",
      tgl_registrasi: "2025-10-11T09:30:00Z",
      status: "Lengkap",
      no_sep: "SEP-2025002",
      no_kartu: "0009876543210",
      nm_pasien: "Dewi Lestari",
      tgl_lahir: "1993-09-22",
      jk: "P",
      status_claim: 3,
   },
];

const columns: TableColumn<Pasien>[] = [
   {
      name: "NO RM",
      selector: (row) => row.no_rkm_medis,
      sortable: true,
      center: true,
   },
   {
      name: "PASIEN",
      selector: (row) => row.nm_pasien,
      sortable: true,
   },
   {
      name: "NOMOR KARTU BPJS",
      selector: (row) => row.no_kartu,
      center: true,
   },
   {
      name: "NOMOR SEP",
      selector: (row) => row.no_sep,
      center: true,
   },
   {
      name: "Tanggal Registrasi",
      selector: (row) =>
         new Date(row.tgl_registrasi).toLocaleDateString("id-ID"),
      sortable: true,
      center: true,
   },
   {
      name: "STATUS",
      ignoreRowClick: true,
      style: { justifyContent: "center" },
      cell: (row) => (
         <div className="flex justify-center gap-3">
            <button
               className="p-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
               title="Belum Dikirim"
            >
               <FaClock size={12} />
            </button>

            <button
               className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
               title="Berkas PDF"
            >
               <FaFilePdf size={12} />
            </button>

            <button
               className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
               title="Berkas WebView"
            >
               <FaEye size={12} />
            </button>

            <button
               className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
               title="Berkas Upload"
            >
               <FaUpload size={12} />
            </button>

            <button
               className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
               title="Kirim Berkas"
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

const LogKirimBerkas = () => {
   return (
      <div className="p-4">
         <h1 className="font-semibold text-lg mb-3 text-black mb-10">
            Berkas Klaim
         </h1>

         <DataTable
            columns={columns}
            data={dataPasien}
            customStyles={customStyles}
            pagination
            highlightOnHover
            dense
         />
      </div>
   );
};

export default LogKirimBerkas;
