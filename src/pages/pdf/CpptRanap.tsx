import jsPDF from "jspdf";
import QRCode from "qrcode";

const pasien = {
  no_rm: "123456",
  nama: "Budi Santoso",
  tgl_lahir: "12-03-1990",
};

const dokter = {
  nama: "dr. Ahmad Sulaiman",
};


const catatanList = [
  {
    tanggal: "14-10-2025",
    jam: "08:30",
    profesi: "Bidan",
    isi: `Subyektif : pasien mengatakan nyeri jahitan post SC.
Obyektif : Kesadaran : Compos Mentis GCS(E,V,M) : 4,6,5 Berat : 76Kg 
Tensi : 100/80mmHg Nadi : 86/menit Tinggi : 160cm 
Respirasi : 19x/menit Suhu : 36,5°C SpO2 : 99 mmHg 
KU : Baik PPV : DBN Kontraksi : keras TFU : 2 jari di bawah pusat Lochea : Rubra 
Assesment : P2A0 Post SC H1 jam 21.00 WIB 
Planning : Observasi KU, TTV, PPV, Kontraksi, mobilisasi bertahap, TL 
Instruksi : 
Evaluasi : KU baik, TTV stabil, PPV DBN, Kontraksi keras, mobilisasi baik, melanjutkan asuhan.`,
  },
  {
    tanggal: "15-10-2025",
    jam: "09:15",
    profesi: "Perawat",
    isi: `Subyektif : pasien tampak lebih nyaman.
Obyektif : TTV stabil, luka operasi kering.
Assesment : Perbaikan kondisi pasca operasi.
Planning : Lanjut observasi dan pemberian obat.`,
  },
  {
    tanggal: "16-10-2025",
    jam: "10:00",
    profesi: "Dokter",
    isi: `Subyektif : pasien tidak mengeluh nyeri.
Obyektif : Luka sembuh baik, tanda vital stabil.
Assesment : Proses penyembuhan berjalan normal.
Planning : Edukasi pasien, rencana pulang.`,
  },
  {
    tanggal: "17-10-2025",
    jam: "08:20",
    profesi: "Bidan",
    isi: `Subyektif : pasien siap mobilisasi.
Obyektif : PPV baik, kontraksi uterus keras.
Assesment : Kondisi stabil.
Planning : Anjurkan mobilisasi lanjut.`,
  },
  {
    tanggal: "18-10-2025",
    jam: "09:00",
    profesi: "Perawat",
    isi: `Subyektif : pasien tampak ceria.
Obyektif : Luka operasi menutup sempurna.
Assesment : Pasien siap kontrol rawat jalan.
Planning : Persiapan pulang.`,
  },
];

export const generateCpptRanap = async () => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = "/logo-rs.png";

  return new Promise((resolve) => {
    img.onload = async () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 8;

      // === HEADER RUMAH SAKIT ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.addImage(img, "PNG", 15, 6, 18, 18);

      const centerX = pageWidth / 2 - 5;
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

      // === DATA PASIEN ===
      const rightX = pageWidth - 55;
      const topY = 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const pasienY = topY;
      doc.text(`No. RM      : ${pasien?.no_rm || "-"}`, rightX, pasienY);
      doc.text(`Nama        : ${pasien?.nama || "-"}`, rightX, pasienY + 5);
      doc.text(`Tgl. Lahir  : ${pasien?.tgl_lahir || "-"}`, rightX, pasienY + 10);

// === GARIS PEMBATAS & JUDUL ===
doc.setDrawColor(0);
doc.setLineWidth(0.2);
const garisY = y + 6; 
doc.line(margin, garisY, pageWidth - margin, garisY);

// === JUDUL UTAMA ===
doc.setFont("helvetica", "bold");
doc.setFontSize(12);

const judulY = garisY + 6; 
doc.text("CATATAN PERKEMBANGAN PASIEN TERINTEGRASI", pageWidth / 2, judulY, { align: "center" });

// Garis tipis dekoratif di bawah judul
doc.setLineWidth(0.3);
doc.line(margin, judulY + 2.5, pageWidth - margin, judulY + 2.5);


      // === HEADER TABEL ===
      const colWidths = [20, 12, 18, 100, 40];
      const headers = ["Tanggal", "Jam", "Profesi", "Catatan Kemajuan, Rencana & Terapi", "Nama Terang & Tanda Tangan"];
      const rowHeight = 10;
      let tableTop = judulY + 10;

      // Header
      let x = margin;
      doc.setFontSize(9);
      doc.setLineWidth(0.2);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, i) => {
        const colWidth = colWidths[i];
        doc.rect(x, tableTop, colWidth, rowHeight);
        if (header === "Nama Terang & Tanda Tangan") {
          doc.text("Nama Terang", x + colWidth / 2, tableTop + 4, { align: "center" });
          doc.text("& Tanda Tangan", x + colWidth / 2, tableTop + 8, { align: "center" });
        } else {
          doc.text(header, x + colWidth / 2, tableTop + 6, { align: "center" });
        }
        x += colWidth;
      });

      let yPos = tableTop + rowHeight;

      for (const catatan of catatanList) {
        const tinggiBaris = 60;

        if (yPos + tinggiBaris > 280) {
          doc.addPage();
          yPos = margin;
        }

        let xPos = margin;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        // === Kolom 1: Tanggal ===
        doc.rect(xPos, yPos, colWidths[0], tinggiBaris);
        doc.text(catatan.tanggal, xPos + colWidths[0] / 2, yPos + 6, { align: "center" });
        xPos += colWidths[0];

        // === Kolom 2: Jam ===
        doc.rect(xPos, yPos, colWidths[1], tinggiBaris);
        doc.text(catatan.jam, xPos + colWidths[1] / 2, yPos + 6, { align: "center" });
        xPos += colWidths[1];

        // === Kolom 3: Profesi ===
        doc.rect(xPos, yPos, colWidths[2], tinggiBaris);
        doc.text(catatan.profesi, xPos + colWidths[2] / 2, yPos + 6, { align: "center" });
        xPos += colWidths[2];

      // === Kolom 4: Catatan ===
doc.rect(xPos, yPos, colWidths[3], tinggiBaris);
const lines = doc.splitTextToSize(catatan.isi.trim(), colWidths[3] - 6);
doc.text(lines, xPos + 3, yPos + 6);
xPos += colWidths[3];


        // === Kolom 5: QR + Nama ===
        doc.rect(xPos, yPos, colWidths[4], tinggiBaris);
        const qrDataUrl = await QRCode.toDataURL(dokter.nama);
        doc.addImage(qrDataUrl, "PNG", xPos + colWidths[4] / 2 - 10, yPos + 10, 20, 20);
        doc.text(dokter.nama, xPos + colWidths[4] / 2, yPos + 35, { align: "center" });

        yPos += tinggiBaris; // pindah ke baris berikutnya
      }

      const blob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(blob);
      resolve(pdfUrl);
    };
  });
};
