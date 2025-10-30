   import jsPDF from "jspdf";
   import QRCode from "qrcode";

   export const generateTindakanMedis = async (): Promise<string> => {
   const doc = new jsPDF();
   const img = new Image();
   img.src = "/logo-rs.png";

   const qrDataUrl = await QRCode.toDataURL("dr. Dyah Ariyantini, Sp. OG.");

   return new Promise((resolve) => {
      img.onload = () => {
         const pageWidth = doc.internal.pageSize.getWidth();
         const margin = 10;
         const leftMargin = margin;
         const rightMargin = pageWidth - margin;
         const totalWidth = rightMargin - leftMargin;

         doc.addImage(img, "PNG", 15, 10, 18, 18);
         const centerX = pageWidth / 2;
         let y = 16;
         doc.setFont("helvetica", "bold");
         doc.setFontSize(13);
         doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, y, { align: "center" });
         doc.setFont("helvetica", "normal");
         doc.setFontSize(9);
         y += 4;
         doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", centerX, y, { align: "center" });
         y += 4;
         doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, y, { align: "center" });
         y += 4;
         doc.text("E-mail: rsfastabiqsehat@gmail.com", centerX, y, { align: "center" });
         const headerLineY = y + 3;
         doc.setLineWidth(0.5);
         doc.line(margin, headerLineY, pageWidth - margin, headerLineY);

         doc.setFont("helvetica", "bold");
         doc.setFontSize(12);
         doc.text("LAPORAN TINDAKAN MEDIS", centerX, headerLineY + 7, { align: "center" });

         doc.setFont("helvetica", "normal");
         doc.setFontSize(8);

         const startY = headerLineY + 17;
         const rightBoxWidth = 65;
         const valueOffset = 25;
         const valueOffsetRight = 14;
         const lineSpacing = 5;
         const leftX = leftMargin + 3;
         let rowY = startY;

         doc.text("No. RM", leftX, rowY);
         doc.text(": 2025/10/14/000130", leftX + valueOffset, rowY);
         rowY += lineSpacing;
         doc.text("Nama Pasien", leftX, rowY);
         doc.text(": ISTIQOMATUN NISA, NY", leftX + valueOffset, rowY);
         rowY += lineSpacing;
         doc.text("Alamat Pasien", leftX, rowY);
         doc.text(": REGALOH RT 2 RW 4", leftX + valueOffset, rowY);
         rowY += lineSpacing;

         const centerXLeft = leftX + 72;
         let centerY = startY;
         doc.text("Jenis Kelamin", centerXLeft, centerY);
         doc.text(": Perempuan", centerXLeft + valueOffset, centerY);
         centerY += lineSpacing;
         doc.text("Tanggal Lahir", centerXLeft, centerY);
         doc.text(": 2001-03-25", centerXLeft + valueOffset, centerY);
         centerY += lineSpacing;

         const rightX = pageWidth - rightBoxWidth - 6;
         let rightY = startY;
         doc.text("Tanggal", rightX, rightY);
         doc.text(": 2025-10-14", rightX + valueOffsetRight, rightY);
         rightY += lineSpacing;
         doc.text("Asal Poli", rightX, rightY);
         doc.text(": Unit IGD", rightX + valueOffsetRight, rightY);
         rightY += lineSpacing;
         doc.text("Dokter", rightX, rightY);
         doc.text(": dr. Dyah Ariyantini, Sp. OG.", rightX + valueOffsetRight, rightY);
         rightY += lineSpacing;
         doc.text("Asisten", rightX, rightY);
         doc.text(": Yusnia Wulandari, Amd. Keb (IKB)", rightX + valueOffsetRight, rightY);
         rightY += lineSpacing;

         const firstRowBottom = Math.max(rowY, rightY) + 4;

         const diagY = firstRowBottom + 5;
         doc.setFont("helvetica", "bold");
         doc.text("Diagnosis Assesmen", leftMargin + 3, diagY);
         doc.setFont("helvetica", "normal");

         const valueOffsetDiag = 30;
         const praX = leftMargin + 3;
         const paskaX = praX + 70;

         doc.text("Pra Tindakan", praX, diagY + 5);
         doc.text(": ruptur 4", praX + valueOffsetDiag, diagY + 5);
         doc.text("Paska Tindakan", paskaX, diagY + 5);
         doc.text(": ruptur 2", paskaX + valueOffsetDiag, diagY + 5);

         const diagBottom = diagY + 10;

         const tindakanY = diagBottom + 5;
         doc.setFont("helvetica", "bold");
         doc.text("Tindakan Medis", leftMargin + 3, tindakanY);
         doc.setFont("helvetica", "normal");
         doc.text(": Penjahitan Luka Perineum", leftMargin + 35, tindakanY);

         const tindakanBottom = tindakanY + 5;

         const uraianY = tindakanBottom + 5;
         doc.setFont("helvetica", "bold");
         doc.text("Uraian Tindakan", leftMargin + 3, uraianY);
         doc.setFont("helvetica", "normal");
         doc.text(
         ": Luka dijahit dengan teknik steril menggunakan benang vicryl 2.0.",
         leftMargin + 35,
         uraianY
         );

         const uraianBottom = uraianY + 8;

   const barisY = uraianBottom + 6;
   const colWidth = totalWidth / 2;

   doc.setFont("helvetica", "bold");
   doc.setFontSize(9);

   // === LABEL (bold) ===
   doc.setFont("helvetica", "bold");
   doc.text("Tanggal dan Jam", leftMargin + colWidth / 2, barisY + 4, { align: "center" });
   doc.text(
   "Nama Dokter & Tanda Tangan",
   leftMargin + colWidth + colWidth / 2,
   barisY + 4,
   { align: "center" }
   );

   // === VALUE (normal) ===
   doc.setFont("helvetica", "normal");
   doc.text(
   "27-05-2025 10:30:45 WIB",
   leftMargin + colWidth / 2,
   barisY + 20,
   { align: "center" }
   );

   // === QR & Nama Dokter ===
   const qrSize = 25;
   const qrX = leftMargin + colWidth + (colWidth / 2 - qrSize / 2);
   doc.addImage(qrDataUrl, "PNG", qrX, barisY + 6, qrSize, qrSize);

   doc.setFontSize(8);
   doc.text(
   "dr. Dyah Ariyantini, Sp. OG.",
   leftMargin + colWidth + colWidth / 2,
   barisY + qrSize + 15,
   { align: "center" }
   );


   const bottomY = barisY + qrSize + 20;

   // === BORDER ===
   const topY = startY - 6;
   doc.setLineWidth(0.3);
   doc.rect(leftMargin, topY, totalWidth, bottomY - topY);
   doc.line(pageWidth - rightBoxWidth - margin, topY, pageWidth - rightBoxWidth - margin, firstRowBottom);
   doc.line(leftMargin, firstRowBottom, pageWidth - margin, firstRowBottom);
   doc.line(leftMargin, diagBottom, pageWidth - margin, diagBottom);
   doc.line(leftMargin, tindakanBottom, pageWidth - margin, tindakanBottom);
   doc.line(leftMargin, uraianBottom, pageWidth - margin, uraianBottom);
   doc.line(leftMargin + colWidth, barisY - 3, leftMargin + colWidth, bottomY);


         // === OUTPUT ===
         const blob = doc.output("blob");
         const url = URL.createObjectURL(blob);
         resolve(url);
      };
   });
   };
