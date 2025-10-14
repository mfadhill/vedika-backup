import jsPDF from "jspdf";
import QRCode from "qrcode-generator";

interface Pasien {
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

export const generateSEP = async (pasien: Pasien): Promise<string> => {
  const doc = new jsPDF("p", "mm", "a4");

  const qr = QRCode(0, "L");
  qr.addData(pasien?.no_sep || "-");
  qr.make();
  const qrCode = qr.createDataURL(4);

  // === Layout setup ===
  let y = 20;
  const labelX1 = 10;
  const valueX1 = 40;
  const labelX2 = 115;
  const valueX2 = 150;

const writeOneCol = (label: string, value: any) => {
  const offset = 2; 
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(label, labelX1, y);
  doc.text(":", valueX1 - 2, y);
  doc.text(String(value ?? "-"), valueX1 + offset, y);

  y += 6;
};

  const writeTwoCols = (
    label1: string,
    value1: any,
    label2: string,
    value2: any
  ) => {
    const offset = 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(label1, labelX1, y);
    doc.text(":", valueX1 - 2, y);
    doc.text(String(value1 ?? "-"), valueX1 + offset, y);

    doc.text(label2, labelX2, y);
    doc.text(":", valueX2 - 2, y);
    doc.text(String(value2 ?? "-"), valueX2 + offset, y);

    y += 6;
  };

 try {
  doc.addImage("/logo-bpjs.png", "PNG", 9, 10, 50, 8);
} catch {
  console.warn("Logo BPJS tidak ditemukan — pastikan path benar.");
}

doc.setFont("helvetica", "bold");
doc.setFontSize(13);
doc.text("SURAT ELEGIBILITAS PESERTA", 93, 14); 


doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", 95, 18);

  y = 30;

  // === DATA PASIEN ===
  
  writeOneCol("No. SEP", pasien?.no_sep);
  writeOneCol("Tgl. SEP", pasien?.tgl_registrasi);
  writeTwoCols(`No. Kartu `, `${pasien?.no_kartu} (RM : ${pasien?.no_rkm_medis})`, "Peserta", pasien?.peserta);
  writeTwoCols("Nama Peserta", pasien?.nm_pasien, "Jns. Rawat", pasien?.no_kartu);
  writeTwoCols("Tgl. Lahir", pasien?.tgl_lahir, "Jns. Kunjungan", pasien?.status);
  writeTwoCols("No. Telepon", "082276563452", "Sub/Spesialis", "INSTALASI GAWAT DARURAT");
  writeTwoCols("Dokter", pasien?.dokter, "Kls. Hak", pasien?.klsHak);
  writeTwoCols("Faskes Perujuk", pasien?.faskes, "Kls. Rawat", pasien?.klsrawat);
  writeTwoCols("Diagnosa Awal", pasien?.diagnosa, "Penjamin", pasien?.penjamin);

// === CATATAN + QR SEJAJAR ===
const qrX = 150; // posisi kolom kanan
const qrSize = 20;

doc.setFontSize(9);
doc.text("Catatan", labelX1, y);
doc.text(":", valueX1 - 2, y);
doc.text(String(pasien?.catatan ?? "-"), valueX1 + 4, y);

doc.text("Pasien / Keluarga Pasien", qrX + qrSize / 2, y, { align: "center" });

const qrY = y + 2;
doc.addImage(qrCode, "PNG", qrX, qrY, qrSize, qrSize);

doc.text(`(${pasien?.nm_pasien ?? "-"})`, qrX + qrSize / 2, qrY + qrSize + 6, { align: "center" });

doc.setFontSize(7);
const agreementY = qrY + qrSize / 2 + 3; // titik tengah vertikal QR

doc.text(
  "*Saya menyetujui BPJS Kesehatan menggunakan informasi medis pasien jika diperlukan.",
  labelX1,
  agreementY
);
doc.text("**SEP bukan sebagai bukti penjaminan peserta.", labelX1, agreementY + 4);

// Setelah selesai, lanjut posisi Y di bawah QR
y = qrY + qrSize + 10;




 

  // === OUTPUT ===
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
