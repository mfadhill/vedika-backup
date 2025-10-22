import jsPDF from "jspdf";

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
      const rowHeight11 = 8;
      const rowHeight12 = 8;
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
        rowHeight11 +
        rowHeight12;
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
      doc.text("II. PEMERIKSAAN FISIK", marginX + 3, pemeriksaanY);

      // === Baris baru (3 kolom) ===
      const kondisiY = pemeriksaanY + rowHeight8;
      const colWidth = tableWidth / 3;

      doc.text("Keadaan Umum : Sakit Sedang", marginX + 3, kondisiY);
      doc.text("Kesadaran : Compos Mentis", marginX + colWidth + 3, kondisiY);
      doc.text("GCS (E,V,M) : 15", marginX + colWidth * 2 + 3, kondisiY);


      const statusLokalisY = startY + totalHeight - rowHeight11;
      doc.line(marginX, statusLokalisY, marginX + tableWidth, statusLokalisY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const centerX = marginX + tableWidth / 2;
      const centerY = statusLokalisY + rowHeight11 / 2 + 1;
      doc.text("Tanda Vital:TD :120/80mmHg  N:96x/m  R:20x/m  S:36.3° SpO₂:98% BB:-Kg TB:-cm", centerX - 20, centerY, { align: "center" });

      // === DETAIL PEMERIKSAAN FISIK & LAB ===
      const rowDetailCount = 4;
      const rowDetailHeight = 8;
      const detailY = statusLokalisY + rowHeight11;
      const totalDetailHeight = rowDetailCount * rowDetailHeight;

      doc.rect(marginX, detailY, tableWidth, totalDetailHeight);

      // === Garis pemisah vertikal tengah ===
      doc.line(marginX + halfWidth, detailY, marginX + halfWidth, detailY + totalDetailHeight);

      // === Garis horizontal untuk baris-baris bagian kiri (Fisik) ===
      for (let i = 1; i < rowDetailCount; i++) {
        const yPos = detailY + i * rowDetailHeight;
        // hanya digambar di sisi kiri
        doc.line(marginX, yPos, marginX + halfWidth, yPos);
      }

      // === Teks bagian kiri (Detail Pemeriksaan Fisik) ===
      // === Pengaturan font dasar ===
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      // === Posisi kolom kiri dan kanan ===
      const leftColX = marginX + 3;
      const rightColX = marginX + halfWidth / 2 + 3;

      // === Data pemeriksaan fisik ===
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

      // === Output ===
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
  });
};
