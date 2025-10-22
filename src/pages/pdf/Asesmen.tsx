import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateAsesmen = async (): Promise<string> => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = "/logo-rs.png";

  return new Promise((resolve) => {
    img.onload = () => {
      // === Header Rumah Sakit ===
      doc.addImage(img, "PNG", 15, 5, 18, 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      const pageWidth = doc.internal.pageSize.getWidth();
      const textXCenter = pageWidth / 2;
      let y = 11;

      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", textXCenter, y, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      y += 4;
      doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", textXCenter, y, { align: "center" });
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", textXCenter, y, { align: "center" });
      y += 4;
      doc.text("E-mail: rsfastabiqsehat@gmail.com", textXCenter, y, { align: "center" });

      // === Garis bawah header ===
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(10, y + 3, pageWidth - 10, y + 3);

      // === Table Body ===
      const marginX = 4;
      const tableWidth = pageWidth - marginX * 2;
      const col1Width = tableWidth * 0.6;
      const rowHeight1 = 10; // judul
      const rowHeight2 = 25; // data pasien
      const rowHeight3 = 8;  // I. Riwayat Kesehatan
      const rowHeight4 = 10; // Keluhan Utama
      const rowHeight5 = 16; // Riwayat Penyakit Sekarang
      const rowHeight6 = 10; // Riwayat Dahulu & Keluarga
      const rowHeight7 = 10; // Riwayat Pengobatan & Alergi
      const rowHeight8 = 8;  // II. Pemeriksaan Fisik (judul)
      const rowHeight9 = 8;  // Keadaan Umum / Kesadaran / GCS
      const rowHeight10 = 8;
      const totalHeight =
        rowHeight1 +
        rowHeight2 +
        rowHeight3 +
        rowHeight4 +
        rowHeight5 +
        rowHeight6 +
        rowHeight7 +
        rowHeight8 +
        rowHeight9 +
        rowHeight10 ;
      const startY = y + 8;

      // === Kotak luar total ===
      doc.rect(marginX, startY, tableWidth, totalHeight);

      let currentY = startY + rowHeight1;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      doc.line(
        marginX + col1Width,
        startY + rowHeight1,
        marginX + col1Width,
        startY + rowHeight1 + rowHeight2
      );

      currentY += rowHeight2;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      currentY += rowHeight3;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      currentY += rowHeight4;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      currentY += rowHeight5;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      currentY += rowHeight6;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      const halfWidth = tableWidth / 2;
      doc.line(marginX + halfWidth, currentY - rowHeight6, marginX + halfWidth, currentY);

      doc.line(marginX + halfWidth, currentY, marginX + halfWidth, currentY + rowHeight7);

      currentY += rowHeight7;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      currentY += rowHeight8;
      doc.line(marginX, currentY, marginX + tableWidth, currentY);

      const thirdWidth = tableWidth / 3;
      doc.line(marginX + thirdWidth, currentY, marginX + thirdWidth, currentY + rowHeight9);
      doc.line(marginX + thirdWidth * 2, currentY, marginX + thirdWidth * 2, currentY + rowHeight9);


      doc.line(marginX, startY + totalHeight, marginX + tableWidth, startY + totalHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PENILAIAN AWAL MEDIS IGD", textXCenter, startY + 6, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let textY = startY + rowHeight1 + 6;
      const labelX = marginX + 3;
      const valueX = marginX + 38;

      doc.text("No. RM", labelX, textY);
      doc.text(": 163842", valueX, textY);

      textY += 6;
      doc.text("Nama Pasien", labelX, textY);
      doc.text(": REGINA PINGKAN APRILIA, NY", valueX, textY);

      textY += 6;
      doc.text("Tanggal Lahir", labelX, textY);
      doc.text(": 04-04-2003", valueX, textY);

      textY += 6;
      doc.text("Jenis Kelamin", labelX, textY);
      doc.text(": Perempuan", valueX, textY);

      let rightXLabel = marginX + col1Width + 3;
      let rightXValue = rightXLabel + 35;
      let rightY = startY + rowHeight1 + 6;

      doc.text("Tanggal", rightXLabel, rightY);
      doc.text(": 18-10-2025 20:25:07", rightXValue, rightY);

      rightY += 6;
      doc.text("Anamnesis", rightXLabel, rightY);
      doc.text(": Autoanamnesis ()", rightXValue, rightY);

      // === I. RIWAYAT KESEHATAN ===
      const riwayatHeaderY = startY + rowHeight1 + rowHeight2 + 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("I. RIWAYAT KESEHATAN", marginX + 3, riwayatHeaderY);

      const keluhanY = startY + rowHeight1 + rowHeight2 + rowHeight3 + 6;
      doc.text("Keluhan Utama", labelX, keluhanY);
      doc.text(": kenceng kenceng", valueX, keluhanY);

      const riwayatY =
        startY + rowHeight1 + rowHeight2 + rowHeight3 + rowHeight4 + 6;
      const riwayatText =
        "pasien datang dengan keluhan lemas, kenceng kenceng dan terdapat tanda tanda persalinan, DJJ: 147x/menit, TFU: 27 cm, TBJ: 2700 gram, VT: 0 cm";
      const wrappedText = doc.splitTextToSize(riwayatText, tableWidth - 40);
      doc.text("Riwayat Penyakit Sekarang", labelX, riwayatY);
      doc.text(`: ${wrappedText.join("\n  ")}`, valueX + 5, riwayatY);

      const row6Y =
        startY + rowHeight1 + rowHeight2 + rowHeight3 + rowHeight4 + rowHeight5 + 6;
      doc.text("Riwayat Penyakit Dahulu", marginX + 3, row6Y);
      doc.text(": -", marginX + 43, row6Y);

      doc.text("Riwayat Penyakit dalam Keluarga", marginX + halfWidth + 3, row6Y);
      doc.text(": -", marginX + halfWidth + 55, row6Y);

      const row7Y = row6Y + rowHeight6;
      doc.text("Riwayat Pengobatan", marginX + 3, row7Y);
      doc.text(": -", marginX + 40, row7Y);

      doc.text("Riwayat Alergi", marginX + halfWidth + 3, row7Y);
      doc.text(": -", marginX + halfWidth + 30, row7Y);

      // === II. PEMERIKSAAN FISIK ===
      const pemeriksaanY =
        startY +
        rowHeight1 +
        rowHeight2 +
        rowHeight3 +
        rowHeight4 +
        rowHeight5 +
        rowHeight6 +
        rowHeight7 +
        6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("II. PEMERIKSAAN FISIK", marginX +3, pemeriksaanY);

      // === Baris baru (3 kolom) ===
      const kondisiY = pemeriksaanY + rowHeight8;
      const colWidth = tableWidth / 3;

      doc.text("Keadaan Umum : Sakit Sedang", marginX +3 , kondisiY);
      doc.text("Kesadaran : Compos Mentis", marginX + colWidth +3 , kondisiY);
      doc.text("GCS (E,V,M) : 15", marginX + colWidth * 2 +3, kondisiY);

   const statusLokalisY = kondisiY + 3.5;
doc.line(marginX, statusLokalisY, marginX + tableWidth, statusLokalisY);

doc.setFont("helvetica", "normal");
doc.setFontSize(7);
const centerX = marginX + tableWidth / 2;
const centerY = statusLokalisY + rowHeight10 / 2 + 1;
doc.text(
  "Tanda Vital:TD :120/80mmHg  N:96x/m  R:20x/m  S:36.3° SpO₂:98% BB:-Kg TB:-cm",
  centerX - 20,
  centerY,
  { align: "center" }
);

const rowDetailCount = 4;
const rowDetailHeight = 8;
const detailY = statusLokalisY + rowHeight10 -1.5;
const totalDetailHeight = rowDetailCount * rowDetailHeight;

doc.rect(marginX, detailY, tableWidth, totalDetailHeight);
doc.line(marginX + halfWidth, detailY, marginX + halfWidth, detailY + totalDetailHeight);

for (let i = 1; i < rowDetailCount; i++) {
  const yPos = detailY + i * rowDetailHeight;
  doc.line(marginX, yPos, marginX + halfWidth, yPos);
}

doc.setFont("helvetica", "normal");
doc.setFontSize(9);

const leftColX = marginX + 3;
const rightColX = marginX + halfWidth / 2 + 3;

const rows = [
  ["Kepala : Normal", "Thoraks : Normal"],
  ["Mata : Normal", "Abdomen : Normal"],
  ["Gigi & Mulut : Normal", "Genital & Anus : Normal"],
  ["Leher : Normal", "Ekstremitas : Normal"],
];

rows.forEach(([left, right], i) => {
  const y = detailY + i * rowDetailHeight + 5.5;
  doc.text(left, leftColX, y);
  doc.text(right, rightColX, y);
});

const labTextX = marginX + halfWidth + 3;
const labTextY = detailY + 5.5;
doc.text("Detail Pemeriksaan Fisik :", labTextX, labTextY);
const detailValue =
  "Kepala: CA - / - , SI (-/-), Mata cowong (- ) Leher: Pembesaran KGB (-) Thorax: SDVes (+/+), Rh - /- Wh (- /- ), Retraksi (-/-) Bj 1 & 2: reguler, murmur (-), gallop (-) Abd : supel, bu (-) , nyeri + epigastric, hipocondriaca sinistra Adp ; sedang Turgor +";

const wrappedDetail = doc.splitTextToSize(detailValue, halfWidth - 8);

const detailValueY = labTextY + 4;
doc.text(wrappedDetail, labTextX, detailValueY);

/// === III. STATUS LOKALIS ===
const statusLokalisY3 = detailY + totalDetailHeight; // Lanjutan langsung dari tabel II
const rowStatusLokalisHeight = 8; // Tinggi baris judul

// Garis atas (nyambung dari tabel sebelumnya sudah ada)
doc.line(marginX, statusLokalisY3, marginX + tableWidth, statusLokalisY3);

// Isi teks judul
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("III. STATUS LOKALIS", marginX + 3, statusLokalisY3 + 6);

// Garis bawah judul
const keteranganY = statusLokalisY3 + rowStatusLokalisHeight;
doc.line(marginX, keteranganY, marginX + tableWidth, keteranganY);

// === Baris KETERANGAN ===
const rowKeteranganHeight = 10;
const keteranganTextY = keteranganY + 6;
doc.text(
  "Keterangan : Pemeriksaan dilakukan dengan persetujuan pasien.",
  marginX + 3,
  keteranganTextY
);

// Garis bawah keterangan
const keteranganBottomY = keteranganY + rowKeteranganHeight;
doc.line(marginX, keteranganBottomY, marginX + tableWidth, keteranganBottomY);

// === Border kiri-kanan untuk area status & keterangan ===
doc.line(marginX, statusLokalisY3, marginX, keteranganBottomY); // kiri
doc.line(marginX + tableWidth, statusLokalisY3, marginX + tableWidth, keteranganBottomY); // kanan

// === IV. PEMERIKSAAN PENUNJANG ===
const pemeriksaanPenunjangY = keteranganBottomY; // langsung nyambung dari bawah III
const rowIVHeaderHeight = 8; // tinggi baris judul

// Garis atas (sudah nyambung dari bawah III)
doc.line(marginX, pemeriksaanPenunjangY, marginX + tableWidth, pemeriksaanPenunjangY);

// Teks judul IV
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("IV. PEMERIKSAAN PENUNJANG", marginX + 3, pemeriksaanPenunjangY + 6);

// Garis bawah untuk baris judul IV
const ivContentY = pemeriksaanPenunjangY + rowIVHeaderHeight;
doc.line(marginX, ivContentY, marginX + tableWidth, ivContentY);

// === Baris isi 3 kolom (EKG, Radologi, Laboratorium) ===
const rowIVContentHeight = 10;
const colIVWidth = tableWidth / 3;

// Garis vertikal antar kolom
doc.line(marginX + colIVWidth, ivContentY, marginX + colIVWidth, ivContentY + rowIVContentHeight);
doc.line(marginX + colIVWidth * 2, ivContentY, marginX + colIVWidth * 2, ivContentY + rowIVContentHeight);

// Isi teks per kolom
doc.text("EKG : +", marginX + 3, ivContentY + 6);
doc.text("Radologi : thorax, abdomen 3 posisi", marginX + colIVWidth + 3, ivContentY + 6);
doc.text("Laboratorium : dr, gds, ur, cr", marginX + colIVWidth * 2 + 3, ivContentY + 6);

// Garis bawah baris isi
const ivBottomY = ivContentY + rowIVContentHeight;
doc.line(marginX, ivBottomY, marginX + tableWidth, ivBottomY);

// === Border kiri-kanan untuk seluruh area IV ===
doc.line(marginX, pemeriksaanPenunjangY, marginX, ivBottomY); // kiri
doc.line(marginX + tableWidth, pemeriksaanPenunjangY, marginX + tableWidth, ivBottomY); // kanan


// === V. DIAGNOSIS ===
const diagnosisY = ivBottomY; // lanjutan langsung dari bawah IV
const rowVHeaderHeight = 8;

// Garis atas (nyambung dari IV)
doc.line(marginX, diagnosisY, marginX + tableWidth, diagnosisY);

// Judul V
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("V. DIAGNOSIS", marginX + 3, diagnosisY + 6);

// Garis bawah header V
const diagnosisContentY = diagnosisY + rowVHeaderHeight;
doc.line(marginX, diagnosisContentY, marginX + tableWidth, diagnosisContentY);

// === Isi diagnosis (1 baris, 1 kolom) ===
const rowDiagnosisHeight = 10;
doc.text(
  "obs abdominal pain , vomitus profuse dd ileus",
  marginX + 3,
  diagnosisContentY + 6
);

// Garis bawah isi diagnosis
const diagnosisBottomY = diagnosisContentY + rowDiagnosisHeight;
doc.line(marginX, diagnosisBottomY, marginX + tableWidth, diagnosisBottomY);

// === Border kiri-kanan untuk area diagnosis ===
doc.line(marginX, diagnosisY, marginX, diagnosisBottomY); // kiri
doc.line(marginX + tableWidth, diagnosisY, marginX + tableWidth, diagnosisBottomY); // kanan

// === VI. TATALAKSANA ===
const tatalaksanaY = diagnosisBottomY; // lanjutan langsung dari bawah V
const rowVIHeaderHeight = 8;

// Garis atas (nyambung dari V)
doc.line(marginX, tatalaksanaY, marginX + tableWidth, tatalaksanaY);

// Judul VI
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("VI. TATALAKSANA", marginX + 3, tatalaksanaY + 6);

// Garis bawah header VI
const tatalaksanaContentY = tatalaksanaY + rowVIHeaderHeight;
doc.line(marginX, tatalaksanaContentY, marginX + tableWidth, tatalaksanaContentY);

// === Isi tatalaksana (1 baris, 1 kolom, bisa wrap text) ===
const tatalaksanaText =
  "Inf RL 20 tpm Inj pantoprazole 1a/24 jam Inj ketorolac 1a/8 jam kp nyeri " +
  "inj ondan 1a/8 jam Po: Sukralfat syr 3x10 ml";
const wrappedTatalaksana = doc.splitTextToSize(tatalaksanaText, tableWidth - 10);
doc.text(wrappedTatalaksana, marginX + 3, tatalaksanaContentY + 6);

// Hitung tinggi teks agar border bawah pas
const tatalaksanaTextHeight = wrappedTatalaksana.length * 4 + 6;
const tatalaksanaBottomY = tatalaksanaContentY + tatalaksanaTextHeight;

// Garis bawah isi tatalaksana
doc.line(marginX, tatalaksanaBottomY, marginX + tableWidth, tatalaksanaBottomY);

// === Border kiri-kanan untuk area tatalaksana ===
doc.line(marginX, tatalaksanaY, marginX, tatalaksanaBottomY); // kiri
doc.line(marginX + tableWidth, tatalaksanaY, marginX + tableWidth, tatalaksanaBottomY); // kanan

// === Baris Akhir: Tanggal dan Jam | Nama Dokter & Tanda Tangan ===
const footerRowY = tatalaksanaBottomY;
const footerRowHeight = 10;

// Garis atas baris footer
doc.line(marginX, footerRowY, marginX + tableWidth, footerRowY);

// Kolom kiri dan kanan
const footerColWidth = tableWidth / 2;

// Teks label kiri & kanan
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("Tanggal dan Jam :", marginX + 3, footerRowY + 7);
doc.text("Nama Dokter & Tanda Tangan :", marginX + footerColWidth + 3, footerRowY + 7);

// Garis pemisah vertikal tengah
doc.line(marginX + footerColWidth, footerRowY, marginX + footerColWidth, footerRowY + footerRowHeight);

// Garis bawah & border kanan kiri
doc.line(marginX, footerRowY + footerRowHeight, marginX + tableWidth, footerRowY + footerRowHeight); // bawah
doc.line(marginX, footerRowY, marginX, footerRowY + footerRowHeight); // kiri
doc.line(marginX + tableWidth, footerRowY, marginX + tableWidth, footerRowY + footerRowHeight); // kanan

const footerValueY = footerRowY + footerRowHeight; // mulai tepat di bawah baris sebelumnya
const footerValueHeight = 20; // beri ruang untuk QR code dan teks

// Garis atas
doc.line(marginX, footerValueY, marginX + tableWidth, footerValueY);

// Bagi dua kolom
const footerValueColWidth = tableWidth / 2;

// Kolom kiri: tanggal & jam
doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text("22-10-2025 08:19:37 WIB", marginX + 3, footerValueY + 8);

// Kolom kanan: QR code + nama dokter
const qrData = "dr. Agista Khoirul Mahendra | 22-10-2025 08:19:37 WIB";

// Generate QR secara async
QRCode.toDataURL(qrData, { width: 80 }, (err, qrUrl) => {
  if (!err) {
    const qrSize = 12;
    const qrX = marginX + footerValueColWidth + 3;
    const qrY = footerValueY + 3;
    doc.addImage(qrUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // Nama dokter di samping QR
    doc.text("dr. Agista Khoirul Mahendra", qrX + qrSize + 4, footerValueY + 10);

    // Garis vertikal tengah
    doc.line(
      marginX + footerValueColWidth,
      footerValueY,
      marginX + footerValueColWidth,
      footerValueY + footerValueHeight
    );

    // Border bawah & sisi
    doc.line(marginX, footerValueY + footerValueHeight, marginX + tableWidth, footerValueY + footerValueHeight);
    doc.line(marginX, footerValueY, marginX, footerValueY + footerValueHeight);
    doc.line(marginX + tableWidth, footerValueY, marginX + tableWidth, footerValueY + footerValueHeight);
  }
});



      // === Output ===
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
  });
};
