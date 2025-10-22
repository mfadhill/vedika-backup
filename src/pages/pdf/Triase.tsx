import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateTRIASE = async (): Promise<string> => {
  const doc = new jsPDF("p", "mm", "a4");
  const img = new Image();
  img.src = "/logo-rs.png";

  const d = {
    pasien: {
      noRm: "123456",
      nama: "Budi Santoso",
      tglLahir: "1990-01-01",
      jk: "L",
    },
  };

function drawTwoColumnRow(
  doc: jsPDF,
  marginX: number,
  pageWidth: number,
  y: number,
  label: string,
  value: string,
  col1Width: number
): number {
  const rowHeight = 7;

  // Tentukan highlight center untuk KETERANGAN / PEMERIKSAAN
  const isCenterHighlight =
    (label === "KETERANGAN" && value === "TRIASE SEKUNDER") ||
    (label === "PEMERIKSAAN" && value === "URGENSI");

  // Tentukan soft highlight untuk value saja
  const softHighlightLabels = ["JALAN NAFAS", "SIRKULASI DEWASA", "ASSESMENT TRIASE", "PLAN"];

  // Draw background
  if (isCenterHighlight) {
    doc.setFillColor(255, 255, 200); // kuning terang
    doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight, "F");
  } else if (softHighlightLabels.includes(label)) {
    const col2X = marginX + col1Width;
    const col2Width = pageWidth - marginX * 2 - col1Width;
    doc.setFillColor(255, 255, 50); // soft kuning
    doc.rect(col2X, y, col2Width, rowHeight, "F");
  }

  // Draw border
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight);

  // Draw vertical separator
  doc.line(marginX + col1Width, y, marginX + col1Width, y + rowHeight);

  // Text
  doc.setFontSize(7.5);
  const textY = y + rowHeight / 2 + 1;

  if (isCenterHighlight) {
    // center label & value
    const labelX = marginX + col1Width / 2;
    doc.text(label, labelX, textY, { align: "center" });

    const valueX = marginX + col1Width + (pageWidth - marginX * 2 - col1Width) / 2;
    doc.text(value, valueX, textY, { align: "center" });
  } else {
    // default kiri
    doc.text(label, marginX + 2, textY);
    doc.text(value, marginX + col1Width + 2, textY);
  }

  return y + rowHeight;
}



async function drawRowWithQR(
  doc: jsPDF,
  marginX: number,
  pageWidth: number,
  y: number,
  label: string,
  doctorName: string,
  col1Width: number
): Promise<number> {
  const rowHeight = 27;
  const col2X = marginX + col1Width;
  const col2Width = pageWidth - marginX * 2 - col1Width;


  doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight);
  doc.line(col2X, y, col2X, y + rowHeight);

  doc.setFontSize(7.5);
  doc.text(label, marginX + 2, y + 4);

  const qrSize = rowHeight * 0.8;
  const nameWidth = col2Width - qrSize - 10; 


 doc.text(doctorName, col2X + 2, y + 4);

  const qrDataUrl = await QRCode.toDataURL(doctorName, { width: qrSize });
  doc.addImage(qrDataUrl, "PNG", col2X + 2 + nameWidth, y + 1, qrSize, qrSize);

  return y + rowHeight;
}



  return new Promise((resolve) => {
    img.onload = async () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 5;
      const headerY = 4;
      const headerHeight = 24;

      // ===== HEADER =====
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(marginX, headerY, pageWidth - marginX * 2, headerHeight);

      const colLogoWidth = 25;
      const colInfoWidth = (pageWidth - marginX * 2) * 0.55;
      const col1X = marginX + colLogoWidth;
      const col2X = marginX + colLogoWidth + colInfoWidth;

      doc.line(col1X, headerY, col1X, headerY + headerHeight);
      doc.line(col2X, headerY, col2X, headerY + headerHeight);

      // Logo
      doc.addImage(img, "PNG", marginX + 3, headerY + 4, 18, 18);

      // Info RS
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const centerX = marginX + colLogoWidth + colInfoWidth / 2 - 4;
      let y = headerY + 7;
      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, y, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      y += 4;
      doc.text(
        "Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah",
        centerX,
        y,
        { align: "center" }
      );
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, y, {
        align: "center",
      });
      y += 4;
      doc.text("E-mail: rsfastabiqsehat@gmail.com", centerX, y, {
        align: "center",
      });

      // Data pasien
      const pasienX = col2X + 4;
      const labelX = pasienX;
      const valueX = pasienX + 23;
      const pasienY = headerY + 5;
      const lineHeight = 5;

      doc.setFontSize(9.5);
      const dataPasien = [
        ["No. RM", d.pasien.noRm],
        ["Nama", d.pasien.nama],
        ["Tgl. Lahir", d.pasien.tglLahir],
        ["Jenis Kelamin", d.pasien.jk === "L" ? "Laki-laki" : "Perempuan"],
      ];

      dataPasien.forEach(([label, value], i) => {
        const posY = pasienY + i * lineHeight;
        doc.text(label, labelX, posY);
        doc.text(`: ${value}`, valueX, posY);
      });

      // ===== JUDUL =====
      const titleY = headerY + headerHeight;
      const titleHeight = 10;
      doc.rect(marginX, titleY, pageWidth - marginX * 2, titleHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        "TRIASE PASIEN GAWAT DARURAT",
        pageWidth / 2,
        titleY + titleHeight / 2 + 1,
        { align: "center" }
      );

      // ===== SUBJUDUL =====
      const subTitleY = titleY + titleHeight;
      const subTitleHeight = 10;
      doc.rect(marginX, subTitleY, pageWidth - marginX * 2, subTitleHeight);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "Triase dilakukan segera setelah pasien datang dan sebelum/keluarga mendaftar di TPP IGD.",
        pageWidth / 2,
        subTitleY + subTitleHeight / 2 + 1,
        { align: "center" }
      );

      // ===== ISI BARIS 2 KOLOM =====
      let currentY = subTitleY + subTitleHeight;
      const rows = [
        { label: "Tanggal Kunjungan : 10-09-2025", value: "Pukul :09:00:03", col1: 100 },
        { label: "Cara Datang", value: "Kursi Roda", col1: 50 },
        { label: "Macam Kasus", value: "Non Trauma", col1: 50 },
        { label: "KETERANGAN", value: "TRIASE SEKUNDER", col1: 50 },
        { label: "ANAMNESA SINGKAT", value: "pasien datang ke IGD dengan keluhan ketuban rembes", col1: 50 },
        { label: "TANDA VITAL", value: "suhu (C) : 36,5, Nyeri : 4, Tensi : 130/80, Nadi (/menit) : 108, Saturasi O2 (%) : 98, Respirasi : (/menit) : 20", col1: 50 },
       { label: "PEMERIKSAAN", value: "URGENSI", col1: 50 },
        { label: "JALAN NAFAS", value: "Bebas", col1: 50 },
  { label: "SIRKULASI DEWASA", value: "Akral hangat", col1: 50 },
  { label: "ASSESMENT TRIASE", value: "Urgent / Mendesak", col1: 50 },
  { label: "PLAN", value: "Zona Kuning", col1: 50 },
{ label: "", value: "Petugas Triase Sekunder", col1: 50 },
{ label: "Tanggal & Jam", value: "10-09-2025 09:00:03", col1: 50 },
  { label: "Catatan", value: "ketuban rembes", col1: 50 },

      ];

      rows.forEach((row) => {
        currentY = drawTwoColumnRow(
          doc,
          marginX,
          pageWidth,
          currentY,
          row.label,
          row.value,
          row.col1
        );
      });

      currentY = await drawRowWithQR(
  doc,
  marginX,
  pageWidth,
  currentY,
  "Dokter/Petugas Jaga IGD",
  "Novriska Fatima, Amd. Keb (IGD)",
  50
);

      resolve(doc.output("datauristring"));
    };
  });
};
