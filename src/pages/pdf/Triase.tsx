import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateTRIASE = async () => {
  const d = {
    pasien: {
      noRm: "123456",
      nama: "Budi Santoso",
      tglLahir: "1990-01-01",
      jk: "L",
    },
    triase: {
      tglKunjungan: "2025-09-15 10:30:00",
      caraMasuk: "Datang Sendiri",
      macamKasus: "Gawat Darurat",
      suhu: 36.7,
      nyeri: "Ringan",
      tekananDarah: "120/80",
      nadi: 80,
      saturasiO2: 98,
      pernapasan: 18,
      triaseSekunder: {
        plan: "Observasi & Stabilitas",
        tanggalTriase: "2025-09-15 11:00:00",
        catatan: "Pasien stabil, observasi 1 jam",
        petugas: "Dr. Ahmad",
        id: "DOC001",
      },
    },
  };

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 10;
  const startX = 10;
  const pageWidth = 190; // A4 minus margin 10+10
  const borderHeight = 280; // tinggi kotak besar
  const headerHeight = 40;
  const colWidths = [40, 100, 50];

  // Border luar (atas, kanan, kiri, bawah)
  pdf.setLineWidth(0.5);
  pdf.rect(startX, y, pageWidth, borderHeight);

  // HEADER 3 kolom
  // garis vertikal kolom
  pdf.line(startX + colWidths[0], y, startX + colWidths[0], y + headerHeight);
  pdf.line(startX + colWidths[0] + colWidths[1], y, startX + colWidths[0] + colWidths[1], y + headerHeight);

  // Kolom 1: Logo
  pdf.addImage("/fastabiq-logo.png", "PNG", startX + 5, y + 5, 30, 30);

  // Kolom 2: Info RSU
  pdf.setFontSize(12);
  pdf.setFont(undefined, "bold");
  pdf.text("RSU Fastabiq Sehat PKU Muhammadiyah", startX + colWidths[0] + 5, y + 10);
  pdf.setFontSize(9);
  pdf.setFont(undefined, "normal");
  pdf.text("Jl. Pati - Tayu Km.03, Tambaharjo, Pati", startX + colWidths[0] + 5, y + 16);
  pdf.text("Telp. (0295) 4199008, Fax (0295) 4101177", startX + colWidths[0] + 5, y + 22);
  pdf.text("E-mail: rsfastabiqsehat@gmail.com", startX + colWidths[0] + 5, y + 28);

  // Kolom 3: Data pasien
  const col3X = startX + colWidths[0] + colWidths[1] + 2;
  pdf.setFontSize(10);
  pdf.text(`Nomor RM: ${d.pasien.noRm}`, col3X, y + 8);
  pdf.text(`Nama: ${d.pasien.nama}`, col3X, y + 14);
  pdf.text(`Tanggal Lahir: ${d.pasien.tglLahir}`, col3X, y + 20);
  pdf.text(`Jenis Kelamin: ${d.pasien.jk === "L" ? "Laki-laki" : "Perempuan"}`, col3X, y + 26);

  y += headerHeight + 5;

  // Judul TRIASE (di bawah kolom 1+2)
  const titleX = startX;
  const titleWidth = colWidths[0] + colWidths[1];
  const titleHeight = 8;
  pdf.setFillColor(200, 200, 0);
  pdf.rect(titleX, y, titleWidth, titleHeight, "F");
  pdf.setFont(undefined, "bold");
  pdf.setFontSize(10);
  pdf.text("TRIASE PASIEN GAWAT DARURAT", titleX + titleWidth / 2, y + titleHeight / 2 + 3, { align: "center" });
  y += titleHeight + 5;

  // Fungsi buat row label/value (label 1/4, value 2/3 dari content area)
  const addRow = (label: string, value: string) => {
    const labelWidth = 40;
    const valueWidth = 100;
    const rowHeight = 8;
    pdf.rect(startX, y, labelWidth, rowHeight);
    pdf.rect(startX + labelWidth, y, valueWidth, rowHeight);
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(10);
    pdf.text(label, startX + 2, y + 6);
    pdf.setFont(undefined, "normal");
    pdf.text(value, startX + labelWidth + 2, y + 6);
    y += rowHeight + 2;
  };

  // Info Kunjungan
  addRow("Tanggal Kunjungan", d.triase.tglKunjungan.split(" ")[0]);
  addRow("Pukul", d.triase.tglKunjungan.split(" ")[1]);
  addRow("Cara Masuk", d.triase.caraMasuk);
  addRow("Macam Kasus", d.triase.macamKasus);

  // TANDA VITAL
  addRow("Suhu", d.triase.suhu.toString());
  addRow("Nyeri", d.triase.nyeri);
  addRow("TD", d.triase.tekananDarah);
  addRow("Nadi", d.triase.nadi.toString());
  addRow("O₂", d.triase.saturasiO2.toString());
  addRow("RR", d.triase.pernapasan.toString());

  // TRIASE SEKUNDER
  addRow("Plan", d.triase.triaseSekunder.plan);
  addRow("Tanggal & Jam", d.triase.triaseSekunder.tanggalTriase);
  addRow("Catatan", d.triase.triaseSekunder.catatan);
  addRow("Petugas", d.triase.triaseSekunder.petugas);

  // QR Code
  const qrData = `Ditandatangani oleh ${d.triase.triaseSekunder.petugas} (${d.triase.triaseSekunder.id})`;
  const qrImage = await QRCode.toDataURL(qrData, { width: 50 });
  pdf.addImage(qrImage, "PNG", startX + 150, y - 8, 40, 40);

  return pdf.output("bloburl"); 
};
