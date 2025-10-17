import QRCode from "qrcode";
import jsPDF from "jspdf";

export const generateRadiologi = async (): Promise<string> => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = "/logo-rs.png"; 

  const regPeriksa = {
    no_rkm_medis: "123456",
    pasien: {
      jk: "L",
      umur: "35 Tahun",
      nm_pasien: "Budi Santoso",
      alamat: "Jl. Merdeka No. 45, Pati",
    },
  };

  return new Promise((resolve) => {
    img.onload = async () => {
      doc.addImage(img, "PNG", 15, 10, 18, 18); 
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);

      const pageWidth = doc.internal.pageSize.getWidth();
      const textXCenter = pageWidth / 2;

      // === Header Rumah Sakit ===
      let y = 16;
      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", textXCenter, y, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      y += 4;
      doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", textXCenter, y, { align: "center" });
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", textXCenter, y, { align: "center" });
      y += 4;
      doc.text("E-mail: rsfastabiqsehat@gmail.com", textXCenter, y, { align: "center" });

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, y + 3, pageWidth - 10, y + 3);

      doc.setFontSize(12);
      doc.setFont("helvetica");
      doc.text("HASIL PEMERIKSAAN RADIOLOGI", 105, 38, { align: "center" });

      // === Data Pasien ===
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      let startY = 50;

      const leftLabelX = 15;
      const leftColonX = 50;
      const leftValueX = 55;

      const rightLabelX = pageWidth / 2 + 5;
      const rightColonX = rightLabelX + 35;
      const rightValueX = rightColonX + 5;

      doc.text("No. RM", leftLabelX, startY);
      doc.text(":", leftColonX, startY);
      doc.text(regPeriksa.no_rkm_medis, leftValueX, startY);

      doc.text("JK / Umur", rightLabelX, startY);
      doc.text(":", rightColonX, startY);
      doc.text(`${regPeriksa.pasien.jk} / ${regPeriksa.pasien.umur}`, rightValueX, startY);
      startY += 6;

      doc.text("Nama Pasien", leftLabelX, startY);
      doc.text(":", leftColonX, startY);
      doc.text(regPeriksa.pasien.nm_pasien, leftValueX, startY);

      doc.text("Alamat", rightLabelX, startY);
      doc.text(":", rightColonX, startY);
      doc.text(regPeriksa.pasien.alamat, rightValueX, startY);
      startY += 14;

      // === Hasil Pemeriksaan ===
      doc.setFont("helvetica");
      doc.text("Hasil Pemeriksaan", leftLabelX, startY);
      doc.text(":", leftColonX, startY);
      startY += 6; 

      // === Kotak hasil pemeriksaan ===
     const boxX = leftLabelX;   
const boxY = startY;       
const boxWidth = 180;      
const boxHeight = 50;      // 🔹 tinggi kotak dibuat fix
const boxPadding = 4;      

doc.setFont("helvetica", "normal");
doc.setFontSize(10);

const paragraphText = 
  "Pasien menunjukkan hasil pemeriksaan dengan kondisi stabil. " +
  "Tekanan darah dalam batas normal, denyut jantung teratur, " +
  "dan tidak ditemukan keluhan berarti saat observasi. " +
  "Saran: tetap menjaga pola makan dan istirahat cukup.";

// potong teks agar pas dalam kotak
const maxTextWidth = boxWidth - boxPadding * 2;
const textLines = doc.splitTextToSize(paragraphText, maxTextWidth);

// hitung posisi awal teks agar tidak terlalu mepet atas
const textStartY = boxY + boxPadding + 5;

// gambar kotak
doc.rect(boxX, boxY, boxWidth, boxHeight);

// render teks tapi hanya sampai batas kotak
let currentY = textStartY;
const lineHeight = 5;
for (const line of textLines) {
  if (currentY > boxY + boxHeight - boxPadding) break; // 🔹 stop kalau sudah sampai bawah
  doc.text(line, boxX + boxPadding, currentY);
  currentY += lineHeight;
}


      startY += boxHeight + 10; 
     const qrSize = 25;
const qrMargin = 60; // jarak antar QR
const bottomY = 144; // posisi vertikal (atur sesuai panjang dokumen)

// teks QR
const qrText1 = "https://example.com/verifikasi/penanggung-jawab";
const qrText2 = "https://example.com/verifikasi/petugas-radiologi";

const qrDataUrl1 = await QRCode.toDataURL(qrText1);
const qrDataUrl2 = await QRCode.toDataURL(qrText2);

const centerX = pageWidth / 2;
const qr1X = centerX - qrSize - qrMargin / 2; // kiri
const qr2X = centerX + qrMargin / 2;          // kanan
const qrY = bottomY;

const now = new Date();
const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
const tglCetak = now.toLocaleDateString("id-ID", options);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text(`Tgl. Cetak : ${tglCetak}`, qr2X + qrSize / 2, qrY - 8, { align: "center" });

// === Label di atas QR ===
doc.text("Penanggung Jawab", qr1X + qrSize / 2, qrY - 2, { align: "center" });
doc.text("Petugas Radiologi", qr2X + qrSize / 2, qrY - 2, { align: "center" });

// === QR Code ===
doc.addImage(qrDataUrl1, "PNG", qr1X, qrY, qrSize, qrSize);
doc.addImage(qrDataUrl2, "PNG", qr2X, qrY, qrSize, qrSize);

// === Nama di bawah QR ===
doc.text("dr. Ahmad Sulaiman", qr1X + qrSize / 2, qrY + qrSize + 6, { align: "center" });
doc.text("dr. Rina Kartika", qr2X + qrSize / 2, qrY + qrSize + 6, { align: "center" });


      // === Output PDF ===
      const blob = doc.output("blob");
      resolve(URL.createObjectURL(blob));
    };

    img.onerror = () => {
      console.error("Logo gagal dimuat");
      resolve("");
    };
  });
};
