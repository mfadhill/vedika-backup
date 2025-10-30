import jsPDF from "jspdf";
import QRCode from "qrcode";

export const generateKonsultasiMedik = async (): Promise<string> => {

  const data = {
    no_rkm_medis: "123456",
    pasien: {
      nama : "Salah",
      jk: "L",
      umur: "32 Th",
      nm_pasien: "BUDI SANTOSO",
      tgl_lahir: "15-01-1976",
      no_konsultasi : "KM202509170006",
      dr:"dr. Firman Muntaqo, Sp. KFR",
      diagnosa:"OA GENU DS"
    },
  };


  const qrDataUrl = await QRCode.toDataURL(data.pasien.dr);

  const doc = new jsPDF("p", "mm", "a4");
  const img = new Image();
  img.src = "/logo-rs.png";

  return await new Promise((resolve) => {
    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const centerX = pageWidth / 2;

      let y = 8;

      // === HEADER ===
      doc.addImage(img, "PNG", margin, y - 4, 15, 15);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, y, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      y += 4;
      doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", centerX, y, { align: "center" });
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, y, { align: "center" });
      y += 4;
      doc.text("Email: rsfastabiqsehat@gmail.com", centerX, y, { align: "center" });

      y += 4;
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      doc.setFontSize(10);
      doc.text("KONSULTASI INTERNAL/RUJUK INTERNAL", centerX, y, { align: "center" });
      y += 10;

      // === DATA PASIEN ===
      let startY = y;
      const leftLabelX = 15;
      const leftColonX = 50;
      const leftValueX = 55;
      const rightLabelX = pageWidth / 2 + 10;
      const rightColonX = rightLabelX + 30;
      const rightValueX = rightColonX + 5;

      function row(label1, value1, label2?, value2?) {
        doc.text(label1, leftLabelX, startY);
        doc.text(":", leftColonX, startY);
        doc.text(value1, leftValueX, startY);

        if (label2) {
          doc.text(label2, rightLabelX, startY);
          doc.text(":", rightColonX, startY);
          doc.text(value2, rightValueX, startY);
        }
        startY += 6;
      }

      row("Nama Pasien", "NGATRIPAH, NY", "Jenis Kelamin", "Perempuan");
      row("Tanggal Lahir", "15-01-1976", "Umur", data.pasien.umur);
      row("No. RM", data.no_rkm_medis, "No. Konsultasi", data.pasien.no_konsultasi);
      row("Permintaan", "Konsultasi");
      row("Kepada Yth. Teman", data.pasien.dr);
      row("Diagnosa Kerja", data.pasien.diagnosa);

      const ttdX = pageWidth - 70;
      let ttdY = startY + 10;

      doc.text(`Pati, 17 September 2025`, ttdX, ttdY);
      ttdY += 6;
      doc.text(`Dokter Yang Konsul`, ttdX, ttdY);
      ttdY += 4;

      doc.addImage(qrDataUrl, "PNG", ttdX, ttdY, 20, 20);
      ttdY += 28;

      doc.text(`${data.pasien.dr}`, ttdX, ttdY);

      ttdY += 10;



doc.setFont("helvetica", "normal");
doc.text("JAWABAN", centerX, ttdY, { align: "center" });
ttdY += 6;


// --- Kepada Yth ---
doc.text("Kepada Yth. Teman", leftLabelX, ttdY);
doc.text(":", leftColonX, ttdY);
doc.text("dr. Sunaryo, Sp.N", leftValueX, ttdY);
ttdY += 6;

// --- Diagnosa Kerja ---
doc.text("Diagnosa Kerja", leftLabelX, ttdY);
doc.text(":", leftColonX, ttdY);
doc.text("-", leftValueX, ttdY);
ttdY += 8;



const ttd2X = pageWidth - 70; 
let ttd2Y = ttdY;
ttd2Y += 12;

doc.text(`Pati, 01 January 1970`, ttd2X, ttd2Y);
ttd2Y += 6;
doc.text(`Dokter Yang Dikonsuli`, ttd2X, ttd2Y);
ttd2Y += 4;


doc.addImage(qrDataUrl, "PNG", ttd2X, ttd2Y, 20, 20);
ttd2Y += 28;

doc.text(`dr. Firman Muntaqo, Sp. KFR`, ttd2X, ttd2Y);

      const blob = doc.output("blob");
      resolve(URL.createObjectURL(blob));
    };

    img.onerror = () => {
      resolve(URL.createObjectURL(doc.output("blob")));
    };
  });
};
