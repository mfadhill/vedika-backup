import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface ResumeData {
  namaPasien: string;
  noRm: string;
  umur: string;
  ruang: string;
  tglLahir: string;
  jk: string;
  pekerjaan: string;
  tglMasuk: string;
  alamat: string;
  tglKeluar: string;
  diagnosaAwal: string;
  alasan: string;
  keluhanUtama: string;
  pemeriksaanFisik: string;
  jalannyaPenyakit: string;
  pemeriksaanPenunjang: string;
  hasilLaborat: string;
  tindakanDanOperasi: string;
  obatDiRs: string;
  diagnosaUtama: string;
  kdDiagnosaUtama: string;
  diagnosaSekunder: string[];
  kdDiagnosaSekunder: string[];
  prosedurUtama: string;
  kdProsedurUtama: string;
  prosedurSekunder: string[];
  kdProsedurSekunder: string[];
  alergi: string;
  diet: string;
  labBelum: string;
  edukasi: string;
  keadaan: string;
  caraKeluar: string;
  dilanjutkan: string;
  kontrol: string;
  obatPulang: string;
  dokter: string;
}

export const generateResumeRanap = async (): Promise<string> => {
  const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: [210, 330], // ukuran F4 (lebar x tinggi)
});

  const img = new Image();
  img.src = "/logo-rs.png";

  const dataResume: ResumeData = {
    namaPasien: "Ahmad Fadhil",
    noRm: "00123",
    umur: "35 Tahun",
    ruang: "Poli Penyakit Dalam",
    tglLahir: "01-01-1990",
    jk: "Laki-laki",
    pekerjaan: "Pegawai Swasta",
    tglMasuk: "12-09-2025",
    alamat: "Jl. Contoh No.1",
    tglKeluar: "15-09-2025",
    diagnosaAwal: "Demam Tinggi",
    alasan: "Demam 4 hari",
    keluhanUtama: "Demam tinggi, mual, pusing",
    pemeriksaanFisik: "Tekanan darah normal, nadi 80x/menit",
    jalannyaPenyakit: "Dirawat di ruang isolasi, diberikan cairan IV dan obat penurun panas",
    pemeriksaanPenunjang: "X-Ray: Normal",
    hasilLaborat: "HB: 13 g/dL, Leukosit: 7000/mm³",
    tindakanDanOperasi: "Tidak ada operasi, hanya tindakan medis rutin",
    obatDiRs: "Paracetamol, Vitamin C, Infus Ringer Laktat",
    diagnosaUtama: "Demam Tertentu",
    kdDiagnosaUtama: "A00",
    diagnosaSekunder: ["Infeksi Saluran Pernapasan", "Dehidrasi"],
    kdDiagnosaSekunder: ["J06", "E86"],
    prosedurUtama: "Pemasangan infus",
    kdProsedurUtama: "P01",
    prosedurSekunder: ["Pemeriksaan laboratorium", "Foto thorax"],
    kdProsedurSekunder: ["L01", "R01"],
    alergi: "Tidak ada",
    diet: "Diet tinggi kalori dan cairan cukup",
    labBelum: "Hasil kultur darah masih pending",
    edukasi: "Kontrol kembali jika demam >38°C, minum obat sesuai anjuran dokter",
    keadaan: "Sehat",
    caraKeluar: "Pulang dengan pengawasan keluarga",
    dilanjutkan: "Kontrol Poli Penyakit Dalam",
    kontrol: "22-09-2025",
    obatPulang: "Paracetamol 500mg, 3x sehari",
    dokter: "Dr. Budi",
  };

  const safe = (v?: string) => v || "-";
  const qrData = await QRCode.toDataURL(dataResume.noRm);

return new Promise((resolve) => {
img.onload = () => {
const pageWidth = doc.internal.pageSize.getWidth();
const margin = 8;
const centerX = pageWidth / 2;


  // === HEADER RS ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.addImage(img, "PNG", margin, 6, 18, 18);
  let y = 10;
  doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, y, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 4;
  doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", centerX, y, { align: "center" });
  y += 4;
  doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, y, { align: "center" });
  y += 4;
  doc.text("E-mail: rsfastabiqsehat@gmail.com", centerX, y, { align: "center" });
  const garisY = y + 4;
  doc.line(margin, garisY, pageWidth - margin, garisY);

  // === JUDUL ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const judulY = garisY + 6;
  doc.text("RESUME MEDIS PASIEN", centerX, judulY, { align: "center" });
  doc.line(margin, judulY + 2.5, pageWidth - margin, judulY + 2.5);

     doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  let startY = 40;
  const leftLabelX = 15;
  const leftColonX = 50;
  const leftValueX = 55;
  const rightLabelX = pageWidth / 2 + 5;
  const rightColonX = rightLabelX + 35;
  const rightValueX = rightColonX + 5;

  // === Baris 1 ===
doc.text("Nama Pasien", leftLabelX, startY);
doc.text(":", leftColonX, startY);
doc.text(dataResume.namaPasien, leftValueX, startY);
doc.text("No. Rekam Medis", rightLabelX, startY);
doc.text(":", rightColonX, startY);
doc.text(dataResume.noRm, rightValueX, startY);
startY += 4;

// === Baris 2 ===
doc.text("Umur", leftLabelX, startY);
doc.text(":", leftColonX, startY);
doc.text(dataResume.umur, leftValueX, startY);
doc.text("Ruang", rightLabelX, startY);
doc.text(":", rightColonX, startY);
doc.text(dataResume.ruang, rightValueX, startY);
startY += 4;

// === Baris 3 ===
doc.text("Tgl Lahir", leftLabelX, startY);
doc.text(":", leftColonX, startY);
doc.text(dataResume.tglLahir, leftValueX, startY);
doc.text("Jenis Kelamin", rightLabelX, startY);
doc.text(":", rightColonX, startY);
doc.text(dataResume.jk, rightValueX, startY);
startY += 4;

// === Baris 4 ===
doc.text("Pekerjaan", leftLabelX, startY);
doc.text(":", leftColonX, startY);
doc.text(dataResume.pekerjaan, leftValueX, startY);
doc.text("Tgl Masuk", rightLabelX, startY);
doc.text(":", rightColonX, startY);
doc.text(dataResume.tglMasuk, rightValueX, startY);
startY += 4;

// === Baris 5 ===
doc.text("Alamat", leftLabelX, startY);
doc.text(":", leftColonX, startY);
doc.text(dataResume.alamat, leftValueX, startY);
doc.text("Tgl Keluar", rightLabelX, startY);
doc.text(":", rightColonX, startY);
doc.text(dataResume.tglKeluar, rightValueX, startY);

const lineY = startY + 3; 
doc.line(margin, lineY, pageWidth - margin, lineY);


   // === LANJUT SETELAH DATA PASIEN ===
startY += 10;
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
const labelX = margin;
const colonX = labelX + 40; 
const valueX = colonX + 5;

doc.text("Diagnosa Awal", labelX, startY);
doc.text(":", colonX, startY);
doc.text(safe(dataResume.diagnosaAwal), valueX, startY);
startY += 6;

doc.text("Alasan masuk di rawat", labelX, startY);
doc.text(":", colonX, startY);
doc.text(safe(dataResume.alasan), valueX, startY);
startY += 6;

doc.text("Keluhan Utama Riwayat Penyakit :", labelX, startY);
startY += 6; 
const wrappedAlasan = doc.splitTextToSize(safe(dataResume.keluhanUtama), 100);
doc.text(wrappedAlasan, labelX + 8, startY );
startY += wrappedAlasan.length * 4 + 4; 
 

doc.text("Pemeriksaan Fisik :", labelX, startY);
startY += 6; 
const wrappedPemeriksaanFisik = doc.splitTextToSize(safe(dataResume.pemeriksaanFisik), 100);
doc.text(wrappedPemeriksaanFisik, labelX + 8, startY );
startY += wrappedPemeriksaanFisik.length * 4 + 4; 


doc.text("Jalannya Penyakit Selama Perawatan :", labelX, startY);
startY += 6; 
const wrappedpenyakit = doc.splitTextToSize(safe(dataResume.jalannyaPenyakit), 100);
doc.text(wrappedpenyakit, labelX + 8, startY );
startY += wrappedpenyakit.length * 4 + 4; 
 
doc.text("Pemeriksaan Penunjang Radiologi Terpenting :", labelX, startY);
startY += 6; 
const wrappedradiologi = doc.splitTextToSize(safe(dataResume.pemeriksaanPenunjang), 100);
doc.text(wrappedradiologi, labelX + 8, startY );
startY += wrappedradiologi.length * 4 + 4; 

doc.text("Pemeriksaan Penunjang Laboratorim Terpenting :", labelX, startY);
startY += 6; 
const wrappedlaboratorim = doc.splitTextToSize(safe(dataResume.pemeriksaanPenunjang), 100);
doc.text(wrappedlaboratorim, labelX + 8, startY );
startY += wrappedlaboratorim.length * 4 + 4; 

doc.text("Pemeriksaan Operasi Selama Perawatan :", labelX, startY);
startY += 6; 
const wrappedoperasi = doc.splitTextToSize(safe(dataResume.tindakanDanOperasi), 100);
doc.text(wrappedoperasi, labelX + 8, startY );
startY += wrappedoperasi.length * 4 + 4; 

doc.text("Obat-obatan Selama Perawatan :", labelX, startY);
startY += 6; 
const wrappedobat = doc.splitTextToSize(safe(dataResume.tindakanDanOperasi), 100);
doc.text(wrappedobat, labelX + 8, startY );
startY += wrappedobat.length * 4 + 4; 

const kodeIcdX = 200;

// === DIAGNOSA AKHIR ===
doc.text("Diagnosa Akhir :", margin, startY);
doc.text("Kode ICD", kodeIcdX, startY, { align: "right" });
startY += 5;

// --- Diagnosa Utama ---
doc.text("- Diagnosa Utama", labelX, startY);
doc.text(":", colonX +20, startY);
doc.text(safe(dataResume.diagnosaUtama), valueX+20, startY);
doc.text(`(${safe(dataResume.kdDiagnosaUtama)})`, kodeIcdX - 2, startY, { align: "right" });
startY += 5;

// --- Diagnosa Sekunder (rapi sejajar dengan Diagnosa Utama) ---
doc.text("- Diagnosa Sekunder", labelX, startY);
doc.text(":", colonX + 20, startY);

if (dataResume.diagnosaSekunder.length > 0) {
  const kode = safe(dataResume.kdDiagnosaSekunder[0]);
  doc.text(`1. ${safe(dataResume.diagnosaSekunder[0])}`, valueX + 20, startY);
  doc.text(`(${kode || ""})`, kodeIcdX - 2, startY, { align: "right" });
}
startY += 4;

for (let i = 1; i < dataResume.diagnosaSekunder.length; i++) {
  const kode = safe(dataResume.kdDiagnosaSekunder[i]);
  doc.text(`${i + 1}. ${safe(dataResume.diagnosaSekunder[i])}`, valueX + 20, startY);
  doc.text(`(${kode || ""})`, kodeIcdX - 2, startY, { align: "right" });
  startY += 4;
}


// === PROSEDUR / TINDAKAN ===
doc.text("- Prosedur / Tindakan Utama", labelX, startY);
doc.text(":", colonX +20, startY);
doc.text(safe(dataResume.prosedurUtama), valueX+20, startY);
doc.text(`(${safe(dataResume.kdProsedurUtama)})`, kodeIcdX - 2, startY, { align: "right" });
startY += 4;

doc.text("- Prosedur / Tindakan Sekunder", labelX, startY);
doc.text(":", colonX + 20, startY);

if (dataResume.prosedurSekunder.length > 0) {
  const kode = safe(dataResume.kdProsedurSekunder[0]);
  doc.text(`1. ${safe(dataResume.prosedurSekunder[0])}`, valueX + 20, startY);
  doc.text(`(${kode || ""})`, kodeIcdX - 2, startY, { align: "right" });
}
startY += 4;

// prosedur berikutnya ke bawah
for (let i = 1; i < dataResume.prosedurSekunder.length; i++) {
  const kode = safe(dataResume.kdProsedurSekunder[i]);
  doc.text(`${i + 1}. ${safe(dataResume.prosedurSekunder[i])}`, valueX + 20, startY);
  doc.text(`(${kode || ""})`, kodeIcdX - 2, startY, { align: "right" });
  startY += 6;
}

doc.text("Alergi Atau Reaksi Obat", labelX, startY);
doc.text(":", colonX, startY);
doc.text(safe(dataResume.alergi), valueX, startY);
startY += 6;

doc.text("Diet Selama Perawatan :", labelX, startY);
startY += 6; 
const wrappeddiet = doc.splitTextToSize(safe(dataResume.diet), 100);
doc.text(wrappeddiet, labelX + 8, startY );
startY += wrappeddiet.length * 4 + 4;

doc.text("Hasil Lab Yang Belum Selesai (Pending) :", labelX, startY);
startY += 6; 
const wrappedlab = doc.splitTextToSize(safe(dataResume.hasilLaborat), 100);
doc.text(wrappedlab, labelX + 8, startY );
startY += wrappedlab.length * 4 + 4;

doc.text("Intruksi/Anjuran Dan Edukasi (Follow Up) :", labelX, startY);
startY += 6; 
const wrappedintruksi = doc.splitTextToSize(safe(dataResume.edukasi), 100);
doc.text(wrappedintruksi, labelX + 8, startY );
startY += wrappedintruksi.length * 4 + 4;

// === Baris pertama ===
doc.text("Keadaan Pulang", leftLabelX -6, startY);
doc.text(":", leftColonX-6, startY);
doc.text(safe(dataResume.keadaan), leftValueX, startY);

doc.text("Cara Keluar", rightLabelX-6, startY);
doc.text(":", rightColonX-6, startY);
doc.text(safe(dataResume.caraKeluar), rightValueX, startY);

startY += 6;

// === Baris kedua ===
doc.text("Dilanjutkan", leftLabelX-6, startY);
doc.text(":", leftColonX-6, startY);
doc.text(safe(dataResume.dilanjutkan), leftValueX, startY);

doc.text("Tanggal Kontrol", rightLabelX-6, startY);
doc.text(":", rightColonX -6, startY);
doc.text(safe(dataResume.kontrol), rightValueX, startY);

startY += 6;

doc.text("Obat-obatan Saat Pulang :", labelX, startY);
startY += 6; 
const wrappedobatt = doc.splitTextToSize(safe(dataResume.obatPulang), 100);
doc.text(wrappedobatt, labelX + 8, startY );
startY += wrappedobatt.length * 4 + 4;

// === TANDA TANGAN DOKTER ===
startY += 6;
const qrImg = new Image();
qrImg.src = qrData;

// ukuran dan posisi QR
const qrSize = 25;
const qrX = 150;
const qrY = startY;
const qrCenter = qrX + qrSize / 2;

doc.text("Dokter Penanggung Jawab", qrCenter, startY, { align: "center" });

doc.addImage(qrImg, "PNG", qrX, qrY, qrSize, qrSize);

const namaY = qrY -2 + qrSize + 3;
doc.text(safe(dataResume.dokter), qrCenter, namaY, { align: "center" });

startY = namaY + 3;


      resolve(URL.createObjectURL(doc.output("blob")));
    };
  });
};
