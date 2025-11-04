import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatRupiah = (angka: number): string => {
  return "Rp" + angka.toLocaleString("id-ID");
};

export const generateTindakanRalan = async (): Promise<string> => {
  const doc = new jsPDF();


  const margin = 4; 
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;


  const img = new Image();
  img.src = "/logo-rs.png";
  await new Promise<void>((resolve) => (img.onload = () => resolve()));

  // === HEADER ===
  doc.addImage(img, "PNG", margin + 5, 6, 18, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", centerX, 14, { align: "center" });
  doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, 18, { align: "center" });
  doc.text("E-mail: rsfastabiqsehat@gmail.com", centerX, 22, { align: "center" });

  // Garis horizontal header
  doc.line(margin, 26, pageWidth - margin, 26);

  doc.setFontSize(11);
  doc.text("TINDAKAN RAWAT JALAN", centerX, 32, { align: "center" });
  doc.line(margin, 35, pageWidth - margin, 35);

 
  const body: any[][] = [];

  body.push([
    {
      content: "Tindakan Rawat Jalan Dokter",
      colSpan: 5,
      styles: {
        fillColor: [255, 255, 0],
        fontStyle: "bold",
        halign: "left",
      },
    },
  ]);

  body.push([
    "Tanggal",
    "Nama Tindakan",
    {
      content: "Dokter",
      colSpan: 2,
      styles: { halign: "left" },
    },
    "Biaya",
  ]);
  body.push([
    "08-10-2025 08:00",
    "Pemeriksaan Umum",
    {
      content: "dr. Agista Khoirul Mahendra",
      colSpan: 2,
      styles: { halign: "left" },
    },
    formatRupiah(50000),
  ]);
  body.push([
    "08-10-2025 09:00",
    "Konsultasi Spesialis",
    {
      content: "dr. Dina Rahmawati, Sp.PD",
      colSpan: 2,
      styles: { halign: "left" },
    },
    formatRupiah(75000),
  ]);

  body.push([
    {
      content: "Tindakan Rawat Jalan Paramedis",
      colSpan: 5,
      styles: {
        fillColor: [255, 255, 0],
        fontStyle: "bold",
        halign: "left",
      },
    },
  ]);
  body.push([
    {
      content: "-",
      colSpan: 5,
      styles: { halign: "left" },
    },
  ]);

  body.push([
    {
      content: "Tindakan Rawat Jalan Dokter & Paramedis",
      colSpan: 5,
      styles: {
        fillColor: [255, 255, 0],
        fontStyle: "bold",
        halign: "left",
      },
    },
  ]);
  body.push(["Tanggal", "Nama Tindakan", "Dokter", "Paramedis", "Biaya"]);
  body.push([
    "08-10-2025 10:00",
    "Tindakan Luka Ringan",
    "dr. Agista Khoirul Mahendra",
    "Perawat Rina",
    formatRupiah(65000),
  ]);
  body.push([
    "08-10-2025 11:00",
    "Nebulizer Anak",
    "dr. Dina",
    "Perawat Rudi",
    formatRupiah(80000),
  ]);

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    margin: { left: margin, right: margin },
    head: [],
    body,
    styles: {
      fontSize: 8,
      halign: "left",
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 65 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25 },
    },
  });

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
