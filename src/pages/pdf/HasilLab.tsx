import jsPDF from "jspdf";

export const generateHASILLAB = (): Promise<string> => {
  const doc = new jsPDF();
  const img = new Image();
  img.src = "/logo-rs.png";

  // contoh dummy data
  const regPeriksa = {
    no_rkm_medis: "123456",
    pasien: {
      jk: "L",
      umur: "35 Tahun",
      nm_pasien: "Budi Santoso",
      alamat: "Jl. Merdeka No. 45, Pati",
    },
  };

  const periksaLab = [
    {
      detail_periksa_lab: [
        {
          template_laboratorium: {
            Pemeriksaan: "Hemoglobin",
            satuan: "g/dL",
          },
          nilai: "13.5",
          nilai_rujukan: "13.0 - 17.0",
          keterangan: "-",
        },
        {
          template_laboratorium: {
            Pemeriksaan: "Leukosit",
            satuan: "10³/uL",
          },
          nilai: "7.2",
          nilai_rujukan: "4.0 - 10.0",
          keterangan: "-",
        },
      ],
    },
  ];

  return new Promise((resolve) => {
    img.onload = () => {
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
      doc.setLineWidth(0.3);
      doc.line(10, y + 3, pageWidth - 10, y + 3);

      doc.setFontSize(12);
      doc.text("HASIL PEMERIKSAAN LABORATORIUM", 105, 38, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      let startY = 50;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const leftLabelX = 15;
      const leftColonX = 50;
      const leftValueX = 55;

      const rightLabelX = pageWidth / 2 + 5;
      const rightColonX = rightLabelX + 35;
      const rightValueX = rightColonX + 5;

      const tanggalPemeriksaan = "08/10/2025";

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
      startY += 6;

      // ===== Baris 3 =====
      doc.text("Tanggal Pemeriksaan", leftLabelX, startY);
      doc.text(":", leftColonX, startY);
      doc.text(tanggalPemeriksaan, leftValueX, startY);

      startY += 10;
      doc.setFont("helvetica", "bold");

      const tableX = 10;
      let currentY = startY;
      const rowHeight = 8;


      const colWidths = [55, 25, 25, 45, 35];
      const headers = ["Pemeriksaan", "Hasil", "Satuan", "Nilai Rujukan", "Keterangan"];


      const tableWidth = colWidths.reduce((a, b) => a + b, 0);


      let xPos = tableX;
      headers.forEach((h, idx) => {

        doc.rect(xPos, currentY, colWidths[idx], rowHeight);


        const textX = xPos + colWidths[idx] / 2;
        doc.text(h, textX, currentY + 5, { align: "center" });

        xPos += colWidths[idx];
      });

      doc.setFont("helvetica", "normal");


      const detail_periksa_lab = [
        { Pemeriksaan: "Gula Darah Sewaktu", nilai: "120", satuan: "mg/dL", nilai_rujukan: "< 140", keterangan: "Normal" },
        { Pemeriksaan: "HBsAg", nilai: "Negatif", satuan: "", nilai_rujukan: "Negatif", keterangan: "-" },
        { Pemeriksaan: "Hemoglobin", nilai: "13.5", satuan: "g/dL", nilai_rujukan: "12 - 16", keterangan: "Normal" },
        { Pemeriksaan: "Hematokrit", nilai: "41", satuan: "%", nilai_rujukan: "37 - 47", keterangan: "Normal" },
        { Pemeriksaan: "Leukosit", nilai: "8.000", satuan: "/µL", nilai_rujukan: "4.000 - 10.000", keterangan: "Normal" },
        { Pemeriksaan: "Trombosit", nilai: "250.000", satuan: "/µL", nilai_rujukan: "150.000 - 400.000", keterangan: "Normal" },
        { Pemeriksaan: "Eritrosit", nilai: "4.8", satuan: "juta/µL", nilai_rujukan: "4.0 - 5.2", keterangan: "Normal" },
        { Pemeriksaan: "Anti HIV", nilai: "Non Reaktif", satuan: "", nilai_rujukan: "Non Reaktif", keterangan: "-" },
        { Pemeriksaan: "Sifilis Program Khusus", nilai: "Negatif", satuan: "", nilai_rujukan: "Negatif", keterangan: "-" },
      ];

      // === Isi tabel ===
      currentY += rowHeight;
      detail_periksa_lab.forEach((item) => {
        let xPos = tableX;
        const rowTop = currentY;

        // Gambar border tiap kolom
        colWidths.forEach((w) => {
          doc.rect(xPos, rowTop, w, rowHeight);
          xPos += w;
        });

        // Isi teks per kolom (rata tengah semua)
        xPos = tableX;
        const rowY = currentY + 5;

        doc.text(item.Pemeriksaan, xPos + 2, rowY, { align: "left" });
        xPos += colWidths[0];

        doc.text(item.nilai, xPos + colWidths[1] / 2, rowY, { align: "center" });
        xPos += colWidths[1];

        doc.text(item.satuan, xPos + colWidths[2] / 2, rowY, { align: "center" });
        xPos += colWidths[2];

        doc.text(item.nilai_rujukan, xPos + colWidths[3] / 2, rowY, { align: "center" });
        xPos += colWidths[3];

        doc.text(item.keterangan, xPos + colWidths[4] / 2, rowY, { align: "center" });

        currentY += rowHeight;
      });

      // === Output PDF ===
      const blob = doc.output("blob");
      resolve(URL.createObjectURL(blob));
    };

    img.onerror = () => {
      console.error("Logo gagal dimuat dari /public");
      resolve("");
    };
  });
};
