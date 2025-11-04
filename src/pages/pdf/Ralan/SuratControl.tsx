import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateSuratControl = async (): Promise<string> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // === HEADER ===
  const img = new Image();
  img.src = "/logo-bpjs.png";

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  doc.addImage(img, "PNG", 6, 10, 45, 8);

  doc.setFontSize(13);
  doc.text("SURAT RENCANA CONTROL", pageWidth / 2, 14, { align: "center" });
  doc.setFontSize(11);
  doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", pageWidth / 2, 19, { align: "center" });

  doc.setFontSize(10);
  const rightBlockX = pageWidth - 44;
  doc.text("No. SPRI/001/2025", rightBlockX, 14);
  doc.text("Tgl. 08 Oktober 2025", rightBlockX, 19);

  let startY = 40;
  const leftX = 15;

  doc.setFontSize(11);
  doc.text("Kepada Yth", leftX, startY);
  doc.text("dr. Ahmad Sulaiman", leftX + 25, startY);
  startY += 6;
  doc.text("Poli Penyakit Dalam", leftX + 25, startY);
  startY += 10;

  doc.text("Mohon Pemeriksaan dan Penanganan Lebih Lanjut:", leftX, startY);
  startY += 8;

  const data = [
    ["No. Kartu", "0001234567890"],
    ["Nama Pasien", "Muhammad Salah (LAKI-LAKI)"],
    ["Tgl. Lahir", "14 Mei 1998"],
    ["Diagnosa Awal", "Demam Dengue"],
    ["Tgl. Entri", "08 Oktober 2025"],
  ];

  const labelWidth = 35;
  const valueStartX = leftX + labelWidth;
  let tglLahirY = 0;

  data.forEach(([label, value]) => {
    doc.text(label, leftX, startY);
    doc.text(":", leftX + labelWidth - 5, startY);
    doc.text(value, valueStartX, startY);

    if (label === "Tgl. Lahir") tglLahirY = startY;

    startY += 6;
  });

  startY += 10;
  doc.text(
    "Demikian atas bantuannya diucapkan banyak terima kasih.",
    leftX,
    startY
  );

  const qrText = `Dikeluarkan di RSU Fastabiq Sehat PKU Muhammadiyah, Kabupaten/Kota Pati
Ditandatangani secara elektronik oleh dr. Ahmad Sulaiman
ID D00123
08-10-2025`;

  const qrDataUrl = await QRCode.toDataURL(qrText);

  const qrSize = 20;
  const qrX = pageWidth - qrSize - 20;
  const qrY = tglLahirY - 1;

  doc.setFontSize(10);
  doc.text("Mengetahui", qrX + qrSize / 2, qrY - 6, { align: "center" });

  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  doc.text("dr. Ahmad Sulaiman", qrX + qrSize / 2, qrY + qrSize + 6, { align: "center" });

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
