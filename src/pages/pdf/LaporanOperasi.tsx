import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export const generateLaporanOperasi = async (): Promise<string> => {
const doc = new jsPDF();
const img = new Image();
img.src = "/logo-rs.png";

const regPeriksa = {
no_rkm_medis: "123456",
pasien: {
jk: "L",
umur: "35 Tahun",
nm_pasien: "Budi Santoso",
ruang: "ABC",
tgl_lahir: "12-01-2000",
},
};

const postSurgicalData = {
tanggalWaktu: "15-10-2025 20:00:16",
dokterBedah: "dr. Ari Jaka Setiawan, Sp. B.",
asistenBedah: "Sri Wijayanti, A.Md. Kep.",
dokterBedah2: "-",
asistenBedah2: "-",
perawatResusitas: "-",
dokterAnestesi: "dr. Haris Lutfi, Sp. An.",
instrumen: "-",
asistenAnestesi: "Akhsanul Fikri, Amd. Kep (IBS)",
dokterAnak: "-",
bidan: "-",
dokterUmum: "-",
omloop: "Suharto, A.Md.Kep (IBS)",
jenisAnestesi: "SPINAL",
pemeriksaanPA: "Tidak",
kategoriOperasi: "Sedang",
selesaiOperasi: "15-10-2025 20:45:16",
diagnosaPreOp: "ULKUS DM PEDIS SINISTRA",
jaringanEksisi: "-",
diagnosaPostOp: "ULKUS DM PEDIS SINISTRA",
};

const qrDataUrl = await QRCode.toDataURL(postSurgicalData.dokterBedah);

return new Promise((resolve) => {
img.onload = () => {
const pageWidth = doc.internal.pageSize.getWidth();
const margin = 8;
const centerX = pageWidth / 2;


  // === HEADER RS ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const judulY = garisY + 6;
  doc.text("LAPORAN OPERASI", centerX, judulY, { align: "center" });
  doc.line(margin, judulY + 2.5, pageWidth - margin, judulY + 2.5);

  // === DATA PASIEN ===
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let startY = 40;
  const leftLabelX = 15;
  const leftColonX = 50;
  const leftValueX = 55;
  const rightLabelX = pageWidth / 2 + 5;
  const rightColonX = rightLabelX + 35;
  const rightValueX = rightColonX + 5;

  const jk = regPeriksa.pasien.jk === "L" ? "Laki-laki" : "Perempuan";

  doc.text("Nama Pasien", leftLabelX, startY);
  doc.text(":", leftColonX, startY);
  doc.text(regPeriksa.pasien.nm_pasien, leftValueX, startY);
  doc.text("No. Rekam Medis", rightLabelX, startY);
  doc.text(":", rightColonX, startY);
  doc.text(regPeriksa.no_rkm_medis, rightValueX, startY);
  startY += 6;

  doc.text("Umur", leftLabelX, startY);
  doc.text(":", leftColonX, startY);
  doc.text(regPeriksa.pasien.umur, leftValueX, startY);
  doc.text("Ruang", rightLabelX, startY);
  doc.text(":", rightColonX, startY);
  doc.text(regPeriksa.pasien.ruang, rightValueX, startY);
  startY += 6;

  doc.text("Tgl Lahir", leftLabelX, startY);
  doc.text(":", leftColonX, startY);
  doc.text(regPeriksa.pasien.tgl_lahir, leftValueX, startY);
  doc.text("Jenis Kelamin", rightLabelX, startY);
  doc.text(":", rightColonX, startY);
  doc.text(jk, rightValueX, startY);
  startY += 10;

const tableWidth = pageWidth - margin * 2;
const colLeftWidth = tableWidth * 0.65;
const headerHeight = 8;
const tableHeight = 100;
const padding = 4;
const lineHeight = 5; 
let tableY = startY;


doc.setFillColor(220, 220, 220); 
doc.rect(margin, tableY, tableWidth, headerHeight, "F"); 
doc.setDrawColor(0);
doc.rect(margin, tableY, tableWidth, headerHeight); 
doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.text("POST SURGICAL ASSESSMENT", pageWidth / 2, tableY + 5.5, { align: "center" });

tableY += headerHeight;

doc.rect(margin, tableY, tableWidth, tableHeight);
doc.line(margin + colLeftWidth, tableY, margin + colLeftWidth, tableY + tableHeight);

// ==== KOLOM KIRI ====
const leftTextLines = [
  `Tanggal & Waktu   : ${postSurgicalData.tanggalWaktu}`,
  `Dokter Bedah      : ${postSurgicalData.dokterBedah}`,
  `Asisten Bedah     : ${postSurgicalData.asistenBedah}`,
  `Dokter Bedah 2    : ${postSurgicalData.dokterBedah2}`,
  `Asisten Bedah 2   : ${postSurgicalData.asistenBedah2}`,
  `Perawat Resusitas : ${postSurgicalData.perawatResusitas}`,
  `Dokter Anestesi   : ${postSurgicalData.dokterAnestesi}`,
  `Instrumen         : ${postSurgicalData.instrumen}`,
  `Asisten Anestesi  : ${postSurgicalData.asistenAnestesi}`,
  `Dokter Anak       : ${postSurgicalData.dokterAnak}`,
  `Bidan             : ${postSurgicalData.bidan}`,
  `Dokter Umum       : ${postSurgicalData.dokterUmum}`,
  `Omloop            : ${postSurgicalData.omloop}`,
];

const diagnosaLines: string[] = [
  `Diagnosa Pre-Op / Pre Operation Diagnosis`,
  `${postSurgicalData.diagnosaPreOp}`,
  `Jaringan Yang di-Eksisi/-Insisi`,
  `${postSurgicalData.jaringanEksisi}`,
  `Diagnosa Post-Op / Post Operation Diagnosis`,
  `${postSurgicalData.diagnosaPostOp}`,
];

let leftY = tableY + padding;
doc.setFont("courier", "normal");
doc.setFontSize(8);


leftTextLines.forEach(line => {
  doc.text(line, margin + padding, leftY, { align: "left" });
  leftY += lineHeight;
});

for (let i = 0; i < diagnosaLines.length; i += 2) {
  doc.text(diagnosaLines[i], margin + padding, leftY, { align: "left" }); 
  leftY += lineHeight;
  doc.text(diagnosaLines[i + 1], margin + padding, leftY, { align: "left" });
  leftY += lineHeight;
}

const rightText =
  `Tipe/Jenis Anestesi\nSPINAL\n\n` +
  `Dikirim ke Pemeriksaan PA\nTidak\n\n` +
  `Tipe/Kategori Operasi\nSedang\n\n` +
  `Selesai Operasi\n15-10-2025 20:45:16`;

const rightLines = rightText.split("\n");
const textHeight = rightLines.length * lineHeight;

let rightStartY = tableY + padding + (tableHeight - textHeight) / 2;

rightLines.forEach(line => {
  doc.text(line, margin + colLeftWidth + padding, rightStartY, { align: "left" });
  rightStartY += lineHeight;
});

const laporanY = tableY + tableHeight;
  doc.setFillColor(220, 220, 220);
  doc.rect(margin, laporanY, tableWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.text("REPORT (PROCEDURES, SPECIFIC FINDINGS AND COMPLICATIONS)", pageWidth / 2, laporanY + 5.5, { align: "center" });

  const isiLaporan =
    `TINDAKAN OPERASI: DEBRIDEMENT NECROTOMI\n\n` +
    `Laporan Operasi:\n` +
    `1. Pasien posisi supine dalam anastesi spinal Anastesi\n` +
    `2. Dilakukan aseptik dan antiseptik medan operasi\n` +
    `3. Medan operasi dipersempit dengan duk steril\n` +
    `4. Dilakukan nekrotomi pada jaringan yang tidak viabel 15 cm\n` +
    `5. Masukkan kasa tampon\n` +
    `6. Tutup luka operasi\n` +
    `7. Operasi selesai`;

  const textY = laporanY + 14;
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(isiLaporan, margin + 2, textY, { maxWidth: tableWidth - 4, lineHeightFactor: 1.4 });

  const lineCount = isiLaporan.split("\n").length;
  const laporanHeight = lineCount * 5.5;

  doc.setDrawColor(0);
  doc.rect(margin, laporanY, tableWidth, laporanHeight + 45);

const qrSize = 23;
const textX = pageWidth - margin - 5 - 10; 
const textAlign = { align: "right" };
const baseY = laporanY + laporanHeight + 2;

doc.setFontSize(9);
doc.text(postSurgicalData.tanggalWaktu.split(" ")[0], textX, baseY, textAlign);
doc.text("Dokter Bedah", textX, baseY + 6, textAlign);
doc.addImage(qrDataUrl, "PNG", textX - qrSize, baseY + 10, qrSize, qrSize);
doc.text(postSurgicalData.dokterBedah, textX + 15, baseY + 6 + qrSize + 6, textAlign);


  const blob = doc.output("blob");
  resolve(URL.createObjectURL(blob));
};

});
};
