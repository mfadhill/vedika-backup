import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateHemodialisasi = async (): Promise<string> => {
  const doc = new jsPDF({
    orientation: "landscape", 
    unit: "mm",
    format: [330, 210],
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // === HEADER ===
  const img = new Image();
  img.src = "/logo-rs.png";

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  doc.addImage(img, "PNG", 12, 15, 15, 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", pageWidth / 2, 16, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", pageWidth / 2, 21, { align: "center" });

  doc.setFontSize(9);
  doc.text("(0295) 4199008, Fax (0295) 4101177", pageWidth / 2, 26, { align: "center" });
  doc.text("E-mail : rsfastabiqsehat@gmail.com", pageWidth / 2, 30, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(10, 34, pageWidth - 10, 34);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MONITORI HEMODIALISASI", pageWidth / 2, 41, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(10, 45, pageWidth - 10, 45);

  const data = {
    noRawat: "2025/09/18/000277",
    noRM: "155857",
    nama: "YASRI, NY",
    umur: "53 Th 1 Bl 12 Hr",
    jk: "P",
    tanggal: "2025-09-18 21:52:48",
    lama: "5",
    akses: "CDL",
    dialist: "Bicarbonat",
    transfusi: "0",
    penarikanCairan: "1500",
    qb: "200",
    qd: "500",
    ureum: "-",
    hb: "-",
    hbsAg: "-",
    creatinin: "-",
    hiv: "-",
    hcv: "-",
    lain: "-",
    diagnosa: "N18",
  };

  const headers = [
    [
      "No. Rawat",
      "No. RM",
      "Nama Pasien",
      "Umur",
      "JK",
      "Tanggal",
      "Lama",
      "Akses",
      "Dialist",
      "Transfusi",
      "Penarikan Cairan",
      "QB",
      "QD",
      "Ureum",
      "Hb",
      "HbsAg",
      "Creatinin",
      "HIV",
      "HCV",
      "Lain",
      "Diagnosa",
    ],
  ];

  const rows = [
    [
      data.noRawat,
      data.noRM,
      data.nama,
      data.umur,
      data.jk,
      data.tanggal,
      data.lama,
      data.akses,
      data.dialist,
      data.transfusi,
      data.penarikanCairan,
      data.qb,
      data.qd,
      data.ureum,
      data.hb,
      data.hbsAg,
      data.creatinin,
      data.hiv,
      data.hcv,
      data.lain,
      data.diagnosa,
    ],
  ];

  // === POSISI TABEL DIPINDAH KE BAWAH JUDUL ===
  autoTable(doc, {
    startY: 52, 
    head: headers,
    body: rows,
    tableWidth: pageWidth - 20,
    margin: { left: 10, right: 10 },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      textColor: 255,
    },
    columnStyles: {
      2: { halign: "left" },
    },
  });

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
