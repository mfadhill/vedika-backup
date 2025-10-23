import React, { useEffect, useState } from "react";
import { generateSEP } from "./pdf/Sep";
import { generateOBAT } from "./pdf/Obat";
// import { generateEKlaim } from "./pdf/EKlaim";
import { generateTRIASE } from "./pdf/Triase";
import { generateHASILLAB } from "./pdf/HasilLab";
import { generateSPRI } from "./pdf/Spri";
import { generateRadiologi } from "./pdf/Radiologi";
import { generateBilling } from "./pdf/Billing";
import { generateResumeRanap } from "./pdf/Resume-ranap";
import { useParams } from "react-router-dom";
import axios from "axios";
import { generateCpptRanap } from "./pdf/CpptRanap";
import { generateTindakanMedis } from "./pdf/LaporanTindakanMedis";
import { generateLaporanOperasi } from "./pdf/LaporanOperasi";
import { generateAsesmen } from "./pdf/Asesmen";
import { generateSuratControl } from "./pdf/Ralan/SuratControl";

export interface Pasien {
  claim_id?: number | null;
  status_claim: number | null;
  nm_pasien: string;
  no_rkm_medis: string;
  tgl_lahir: string;
  jk: string;
  no_sep: string;
  no_kartu: string;
  tgl_registrasi?: string;
  tb?: number;
  berat?: number;
  kelas?: string;
  naik?: string;
  dokter?: string;
  stts_pulang?: string;
  status?: string;
  td?: string;
  klsrawat?: string
}

const BerkasRanap: React.FC = () => {
  const { no_rawat } = useParams<{ no_rawat: string }>();
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activePdf, setActivePdf] = useState<"SEP" | "OBAT" | "BILLING" | "ASESMEN" | "TRIASE" | "RESUME" | "HASILLAB" | "SPRI" | "RADIOLOGI" | "CPPTRANAP" | "TINDAKANMEDIS" | "LAPORANOPERASI" | null>(null);

  const getData = async () => {
    if (!no_rawat) return;
    const formattedNoRawat = no_rawat.replace(/-/g, "/");

    try {
      const res = await axios.get(
        `http://192.168.20.4:3000/grab/pasien/${formattedNoRawat}`
      );
      const apiData = res.data?.data?.[0];
      if (apiData) {
        console.log("Data dari API:", apiData);
        setPasien(apiData);
      } else {
        console.warn("Data pasien tidak ditemukan");
      }
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
    }
  };

  useEffect(() => {
    if (no_rawat) getData();
  }, [no_rawat]);

  const hitungUmur = (tglLahir) => {
    if (!tglLahir) return "-";
    const lahir = new Date(tglLahir);
    const now = new Date();

    let umur = now.getFullYear() - lahir.getFullYear();
    const bulan = now.getMonth() - lahir.getMonth();

    if (bulan < 0 || (bulan === 0 && now.getDate() < lahir.getDate())) {
      umur--;
    }

    return `${umur} Tahun`;
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const date = new Date(tgl);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  return (
    <div className="min-h-screen font-sans p-6 bg-gray-200 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">
        Berkas Klaim | {pasien?.no_rkm_medis} - {pasien?.nm_pasien} - {pasien?.status}
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-6 w-full space-y-3">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Resume Medis</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[
            ["Nomor Rekam Medis", pasien?.no_rkm_medis],
            ["Ruang", "Kamar Kelas VIP"],
            ["Nama", pasien?.nm_pasien],
            ["Kelas", pasien?.klsrawat],
            [
              "Tanggal Lahir / Umur",
              `${formatTanggal(pasien?.tgl_lahir)} / ${hitungUmur(pasien?.tgl_lahir)}`,
            ],
            ["DPJP", pasien?.dokter],
            ["Jenis Kelamin", pasien?.jk === "L" ? "Laki-laki" : "Perempuan"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center">
              <span className="font-medium text-gray-700 w-44">{label}</span>
              <span className="mr-2">:</span>
              <span className="text-gray-500">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Tombol + Preview PDF */}
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full flex space-x-4">
        <div className="w-1/4 flex flex-col space-y-2">
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "SEP" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              if (!pasien) {
                alert("Data pasien belum tersedia");
                return;
              }
              const url = await generateSEP(pasien!);
              setPdfUrl(url);
              setActivePdf("SEP");
            }}

          >
            SEP
          </button>

          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "RESUME" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateResumeRanap();
              setPdfUrl(url);
              setActivePdf("RESUME");
            }}
          >
            RESUME PASIEN RANAP
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "SuratControl" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateSuratControl();
              setPdfUrl(url);
              setActivePdf("SuratControl");
            }}
          >
            SPRI
          </button>

          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "HASILLAB" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateHASILLAB();
              setPdfUrl(url);
              setActivePdf("HASILLAB");
            }}
          >
            LABORATORIUM
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "LAPORANOPERASI" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateLaporanOperasi();
              setPdfUrl(url);
              setActivePdf("LAPORANOPERASI");
            }}
          >
            LAPORAN OPERASI
          </button>

          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "RADIOLOGI" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateRadiologi();
              setPdfUrl(url);
              setActivePdf("RADIOLOGI");
            }}
          >
            RADIOLOGI
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "CPPTRANAP" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateCpptRanap();
              setPdfUrl(url);
              setActivePdf("CPPTRANAP");
            }}
          >
            CPPT RANAP
          </button>

          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "OBAT" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={() => {
              setPdfUrl(generateOBAT());
              setActivePdf("OBAT");
            }}
          >
            OBAT
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "BILLING" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateBilling();
              setPdfUrl((url));
              setActivePdf("BILLING");
            }}
          >
            BILLING
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "ASESMEN" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateAsesmen();
              setPdfUrl((url));
              setActivePdf("ASESMEN");
            }}
          >
            ASESMEN AWAL MEDIS
          </button>
          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "TINDAKANMEDIS" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateTindakanMedis();
              setPdfUrl((url));
              setActivePdf("TINDAKANMEDIS");
            }}
          >
            LAPORAN TINDAKAN MEDIS
          </button>

          <button
            className={`w-full text-left text-sm font-sans px-2 py-1 rounded hover:bg-blue-300 ${activePdf === "TRIASE" ? "bg-blue-500 text-white" : ""
              }`}
            onClick={async () => {
              const url = await generateTRIASE();
              setPdfUrl(url);
              setActivePdf("TRIASE");
            }}
          >
            TRIASE
          </button>
        </div>

        <div className="flex-1">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-96 rounded"
              title="PDF Preview"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-400 border border-dashed rounded">
              Klik tombol untuk preview PDF
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BerkasRanap;
