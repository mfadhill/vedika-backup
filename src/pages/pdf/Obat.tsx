import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Format angka ke Rupiah
const formatRupiah = (angka: number): string => {
  return "Rp" + angka.toLocaleString("id-ID");
};

export const generateOBAT = (): string => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", 105, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", 105, 21, { align: "center" });
  doc.text("(0295) 4199008, Fax (0295) 4101177", 105, 26, { align: "center" });
  doc.text("E-mail : rsfastabiqsehat@gmail.com", 105, 31, { align: "center" });
  doc.line(10, 37, 200, 37);

  doc.setFontSize(13);
  doc.text("OBAT", 105, 43, { align: "center" });
  doc.line(10, 48, 200, 45);

  const rawData = [
    { tanggal: "08-10-2025 08:00", nama: "Paracetamol 500mg", harga: 1500, qty: 10 },
    { tanggal: "08-10-2025 08:00", nama: "Amoxicillin 500mg", harga: 2000, qty: 5 },
    { tanggal: "08-10-2025 08:00", nama: "Vitamin C 500mg", harga: 2500, qty: 4 },
    { tanggal: "08-10-2025 09:00", nama: "Ibuprofen 200mg", harga: 1800, qty: 3 },
    { tanggal: "08-10-2025 09:00", nama: "Cetirizine 10mg", harga: 2200, qty: 2 },
  ];

  let lastTanggal = "";
  const data = rawData.map((item) => {
    const total = item.harga * item.qty;
    const tanggal =
      item.tanggal === lastTanggal ? "" : item.tanggal;
    lastTanggal = item.tanggal;

    return [
      tanggal,
      item.nama,
      formatRupiah(item.harga),
      item.qty.toString(),
      formatRupiah(total),
    ];
  });

  const totalKeseluruhan = rawData.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );

autoTable(doc, {
  startY: 55,
  theme: "grid",
  margin: { left: 10, right: 10 },
  tableWidth: 190,                
  head: [["Tanggal", "Nama Obat", "Harga Satuan", "Qty", "Total"]],
  body: data,
  foot: [
    [
      {
        content: "TOTAL",
        colSpan: 4,
        styles: { halign: "center", fontStyle: "bold" },
      },
      {
        content: formatRupiah(totalKeseluruhan),
        styles: { halign: "right", fontStyle: "bold" },
      },
    ],
  ],
  styles: {
    fontSize: 9,
    lineWidth: 0.3,
    lineColor: [0, 0, 0],
    halign: "center",
  },
  headStyles: {
    fillColor: [255, 255, 0],
    textColor: [0, 0, 0],
    fontStyle: "bold",
    halign: "center",
    lineColor: [0, 0, 0],
    lineWidth: 0.3,
  },
  bodyStyles: {
    lineColor: [0, 0, 0],
    lineWidth: 0.3,
  },
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    lineColor: [0, 0, 0],
    lineWidth: 0.3,
    fontStyle: "bold",
  },
  columnStyles: {
    0: { cellWidth: 35 },
    1: { cellWidth: 70, halign: "left" },
    2: { cellWidth: 25, halign: "right" },
    3: { cellWidth: 15 },
    4: { cellWidth: 45, halign: "right" },
  },
});

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
