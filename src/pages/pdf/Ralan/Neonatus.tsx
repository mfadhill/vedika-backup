import jsPDF from "jspdf";

export const generateNeonatus = async (): Promise<string> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [210, 330]
  });
  const img = new Image();
  img.src = "/logo-rs.png";

  const data = {
    noRawat: "2025/10/25/000125, 164086 - BY NY ALSA",
    namaBayi: "RUSMA PRACHATIWI",
    jkBayi: "Laki-laki",
    tglLahirBayi: "2025-10-25",
    umur: "0 Hr",
    tglRegistrasi: "2025-10-25",
    nikBayi: "-",
    dokter: "0166, dr. Dyah Ariyantini, Sp. OG",
    namaIbu: "006113, ALSA RUSMA PRACHATIWI, NY",
    tglLahirIbu: "1990-11-20",
    nikIbu: "3318106011900007",
    g: 5,
    p: 3,
    a: 1,
    anakHidup: 3,
    usiaKehamilan: 38,
  };
  const checkAddPage = (doc, sectionY, marginBottom = 15) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (sectionY >= pageHeight - marginBottom) {
      doc.addPage();
      return 20;
    }
    return sectionY;
  };

  return new Promise((resolve) => {
    img.onload = () => {
      doc.addImage(img, "PNG", 15, 5, 18, 18);

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", pageWidth / 2, y, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      y += 4;
      doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", pageWidth / 2, y, { align: "center" });
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", pageWidth / 2, y, { align: "center" });
      y += 4;
      doc.text("E-mail: rsfastabiqsehat@gmail.com", pageWidth / 2, y, { align: "center" });

      doc.setLineWidth(0.3);
      doc.line(10, y + 3, pageWidth - 10, y + 3);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("PENILAIAN MEDIS NEONATUS", pageWidth / 2, 30, { align: "center" });

      let startY = 38;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      const leftLabelX = 10;
      const leftColonX = 40;
      const leftValueX = 45;

      const rightLabelX = pageWidth / 2 + 5;
      const rightColonX = rightLabelX + 30;
      const rightValueX = rightColonX + 5;

      const noRawatLines = doc.splitTextToSize(data.noRawat, 90);

      doc.text("No. Rawat", leftLabelX, startY);
      doc.text(":", leftColonX, startY);
      doc.text(noRawatLines, leftValueX, startY);

      startY += (noRawatLines.length * 6);

      const leftEntries = [
        ["Tanggal Lahir", `${data.tglLahirBayi}  (Umur ${data.umur})`],
        ["Tanggal Registrasi", data.tglRegistrasi],
        ["Dokter", data.dokter],
        ["Tgl Lahir Ibu", data.tglLahirIbu],
      ];

      for (const [label, value] of leftEntries) {
        doc.text(label, leftLabelX, startY);
        doc.text(":", leftColonX, startY);
        doc.text(value, leftValueX, startY);
        startY += 6;
      }

      // === Kolom KANAN Data ===
      let rightY = 38;
      const rightEntries = [
        ["Nama Bayi", data.namaBayi],
        ["Jenis Kelamin", data.jkBayi],
        ["NIK Bayi", data.nikBayi],
        ["Ibu Bayi", data.namaIbu],
        ["NIK Ibu", data.nikIbu],
      ];

      for (const [label, value] of rightEntries) {
        doc.text(label, rightLabelX, rightY);
        doc.text(":", rightColonX, rightY);
        doc.text(value, rightValueX, rightY);
        rightY += 6;
      }
      const bottomY = Math.max(startY, rightY);
      doc.setLineWidth(0.3);
      doc.line(10, bottomY + 2, pageWidth - 10, bottomY + 2);

      let sectionY = bottomY + 8;

      // === I. ANAMNESIS ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("I. ANAMNESIS", 10, sectionY);
      sectionY += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Riwayat Persalinan & Nifas Ibu:", 15, sectionY);
      sectionY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const parts = [
        `G : ${data.g}`,
        `P : ${data.p}`,
        `A : ${data.a}`,
        `Anak Hidup : ${data.anakHidup}`,
        `Usia Kehamilan : ${data.usiaKehamilan} minggu`
      ];
      const startX = 15;
      const endX = pageWidth - 15;

      const totalTextWidth = parts.reduce((sum, txt) => sum + doc.getTextWidth(txt), 0);

      const space = (endX - startX - totalTextWidth) / (parts.length - 1);

      let curX = startX;
      parts.forEach(txt => {
        doc.text(txt, curX, sectionY);
        curX += doc.getTextWidth(txt) + space;
      });
      sectionY += 6;

      const tableData = [
        ["1", "2025-10-25", "RSU Fastabiq", "38 minggu", "SC (Sectio)", "Dokter", "-", "L", "2900g", "Hidup"],
        ["2", "2023-07-12", "RSU Fastabiq", "39 minggu", "Normal", "Bidan", "-", "P", "3100g", "Hidup"],
        ["3", "2021-04-09", "RS Swasta", "37 minggu", "Normal", "Dokter", "KPD", "P", "2800g ", "Hidup"],
      ];

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);

      const headers = [
        "No", "Tgl/Thn", "Tempat Persalinan", "Usia Hamil", "Jenis Persalinan",
        "Penolong", "Penyulit", "Jenis Kelamin", "BB/PB", "Keadaan"
      ];

      const colWidths = [8, 18, 28, 20, 25, 17, 17, 24, 20, 20];
      const rowHeight = 6;
      let tableX = 10;

      headers.forEach((h, i) => {
        const cellWidth = colWidths[i];
        const textWidth = doc.getTextWidth(h);
        const textX = tableX + (cellWidth - textWidth) / 2;
        doc.text(h, textX, sectionY + rowHeight - 2);
        doc.rect(tableX, sectionY, cellWidth, 8);
        tableX += cellWidth;
      });
      sectionY += 8;

      // === Draw Body Rows (CENTER TEXT) ===
      doc.setFont("helvetica", "normal");
      tableData.forEach(row => {
        tableX = 10;
        row.forEach((cell, i) => {
          const cellWidth = colWidths[i];
          const textWidth = doc.getTextWidth(cell);
          const textX = tableX + (cellWidth - textWidth) / 2;
          doc.text(cell, textX, sectionY + rowHeight);
          doc.rect(tableX, sectionY, cellWidth, 8);
          tableX += cellWidth;
        });
        sectionY += 8;
      });

      // === SKRINING IBU ===
      sectionY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Skrining Ibu:", 10, sectionY);
      sectionY += 8;

      const scr = [
        { label: "HbsAg", value: "Negatif (-)" },
        { label: "HIV", value: "Negatif (-)" },
        { label: "Syphilis", value: "Negatif (-)" },
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const colWidth = (pageWidth - 20) / 3;

      const labelOffset = 0;
      const colonOffset = 30;
      const valueOffset = colonOffset + 4;

      scr.forEach((item, i) => {
        let xBase = 10 + (colWidth * i);
        doc.text(item.label, xBase + labelOffset, sectionY);
        doc.text(":", xBase + colonOffset, sectionY);
        doc.text(item.value, xBase + valueOffset, sectionY);
      });

      const riwayatColonX = 10 + colonOffset;
      const riwayatValueX = 10 + valueOffset;

      sectionY += 5;
      const riwayat = [
        { label: "Riwayat Obstetri Ibu", value: "Tidak ada" },
        { label: "Faktor Resiko", value: "Tidak ada" },
        { label: "Neonatal", value: "Tidak ada" }
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      riwayat.forEach((item) => {
        doc.text(item.label, 10, sectionY);
        doc.text(":", riwayatColonX, sectionY);
        doc.text(item.value, riwayatValueX, sectionY);
        sectionY += 6;
      });

      // === II. PEMERIKSAAN FISIK ===
      sectionY += 4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("II. PEMERIKSAAN FISIK", 10, sectionY);

      sectionY += 6;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Persalinan & Penilaian Awal Lahir:", 10, sectionY);
      sectionY += 6;

      // ==== DATA DUMMY ====
      const fisik = {
        tglJamBersalin: "2025-10-25 14:01:22",
        bersalinDi: "RSU Fastabiq Sehat",
        inisiasiMenyusuDini: "Ya",
        jenisPersalinan: "Spontan / Normal",
        indikasiKeterangan: "-",
      };
      const colWidth2 = (pageWidth - 20) / 2;
      const col1LabelX = 10;
      const col1ColonX = col1LabelX + 45;
      const col1ValueX = col1ColonX + 4;
      const col2LabelX = col1LabelX + colWidth2;
      const col2ColonX = col2LabelX + 45;
      const col2ValueX = col2ColonX + 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      doc.text("Tanggal & Jam Bersalin", col1LabelX, sectionY);
      doc.text(":", col1ColonX, sectionY);
      doc.text(fisik.tglJamBersalin, col1ValueX, sectionY);

      doc.text("Bersalin Di", col2LabelX, sectionY);
      doc.text(":", col2ColonX, sectionY);
      doc.text(fisik.bersalinDi, col2ValueX, sectionY);

      sectionY += 6;

      // ==== Baris 2 ====
      doc.text("Inisiasi Menyusui Dini", col1LabelX, sectionY);
      doc.text(":", col1ColonX, sectionY);
      doc.text(fisik.inisiasiMenyusuDini, col1ValueX, sectionY);

      doc.text("Jenis Persalinan", col2LabelX, sectionY);
      doc.text(":", col2ColonX, sectionY);
      doc.text(fisik.jenisPersalinan, col2ValueX, sectionY);

      sectionY += 6;

      // ==== Baris 3 (1 kolom penuh) ====
      doc.text("Indikasi / Keterangan", col1LabelX, sectionY);
      doc.text(":", col1ColonX, sectionY);
      doc.text(fisik.indikasiKeterangan, col1ValueX, sectionY);

      sectionY += 10;

      // === PENILAIAN AWAL AKHIR ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Penilaian Awal Akhir :", 10, sectionY);
      sectionY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const penilaian = [
        { label: "Aterm ?", value: "Ya" },
        { label: "Bernafas/Menangis?", value: "Ya" },
        { label: "Tonus Otot Baik?", value: "Ya" },
        { label: "Cairan Amnion Jernih?", value: "Ya" }
      ];

      const colWidth3 = (pageWidth - 20) / 3;

      // spacing lebih rapat
      const pLabelX = 10;
      const pColonOffset = 2;   // jarak ":" dekat label
      const pValueOffset = 4;   // jarak value dekat ":"

      // loop data
      penilaian.forEach((item, i) => {
        if (i > 0 && i % 3 === 0) {
          sectionY += 6; // turun baris bila lebih dari 3 kolom
        }
        const offset = (i % 3) * colWidth3;

        const labelWidth = doc.getTextWidth(item.label);

        doc.text(item.label, pLabelX + offset, sectionY);
        doc.text(":", pLabelX + offset + labelWidth + pColonOffset, sectionY);
        doc.text(item.value, pLabelX + offset + labelWidth + pColonOffset + pValueOffset, sectionY);
      });

      sectionY += 10;

      // === APGAR SCORE ===

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("APGAR SCORE", pageWidth / 2, sectionY, { align: "center" });
      sectionY += 2;

      const tableStartX = 10;
      const tableWidth = pageWidth - 20; // full page margin 10 kiri-kanan
      const apColWidths = [
        tableWidth * 0.35, // Tanda (35%)
        tableWidth * 0.21, // 0 (21%)
        tableWidth * 0.22, // 1 (22%)
        tableWidth * 0.22, // 2 (22%)
      ];

      const apCellH = 8;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const apgarHeader = ["Tanda Frekuensi Jantung", "0 Tidak Ada", "1 > 100", "2 > 100"];
      let colX = tableStartX;
      apgarHeader.forEach((h, i) => {
        doc.rect(colX, sectionY, apColWidths[i], apCellH);
        const centerX = colX + (apColWidths[i] / 2);
        doc.text(h, centerX, sectionY + (apCellH / 2) + 2, { align: "center" });
        colX += apColWidths[i];
      });

      sectionY += apCellH;
      // === Data APGAR ===
      doc.setFont("helvetica", "normal");

      const apgarRows = [
        ["Usaha Nafas", "Tidak Ada", "Lambat / Tidak Teratur", "Menangis Kuat"],
        ["Tonus Otot", "Lumpuh", "Ext Fleksi Sedikit", "Gerakan Aktif"],
      ];

      apgarRows.forEach(row => {
        colX = tableStartX;
        row.forEach((cell, i) => {
          doc.rect(colX, sectionY, apColWidths[i], apCellH);
          doc.text(cell, colX + 2, sectionY + 5);
          colX += apColWidths[i];
        });
        sectionY += apCellH;
      });

   // === DOWN SCORE ===
sectionY += 8;
sectionY = checkAddPage(doc, sectionY);

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.text("Down Score:", 10, sectionY);
sectionY += 8;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);

const downScore = [
  { label: "Frekuensi Nafas", value: "< 60", score: "0" },
  { label: "Jalan Masuk Udara", value: "Baik", score: "0" },
  { label: "Retraksi", value: "Tidak Ada", score: "0" },
  { label: "Grunting", value: "Tidak Ada", score: "0" },
  { label: "Sianosis", value: "Tidak Ada", score: "0" },
  { label: "Total Nilai & Keterangan", value: "0", score: "" }
];

// 2 kolom
const downColWidth = (pageWidth - 20) / 2; 


// Tentukan posisi titik dua agar rata
const maxLabelWidth = Math.max(...downScore.map(i => doc.getTextWidth(i.label)));
const colonPos = 10 + maxLabelWidth + 2; // posisi titik dua setelah label
const valuePos = colonPos + 3; // setelah ": "

downScore.forEach((item, i) => {
  sectionY = checkAddPage(doc, sectionY);

  const xBase = (i % 2 === 0) ? 10 : 10 + downColWidth; // kolom kiri / kanan

  // label
  doc.text(item.label, xBase, sectionY);

  // titik dua
  doc.text(":", xBase + (colonPos - 10), sectionY);

  // value
  doc.text(item.value, xBase + (valuePos - 10), sectionY);

  // score opsional
  if (item.score !== "") {
    const scoreX = xBase + (valuePos - 10) + doc.getTextWidth(item.value) + 6;
    doc.text(item.score, scoreX, sectionY);
  }

  // pindah baris hanya jika kolom kanan
  if (i % 2 === 1) sectionY += 6;
});

sectionY += 4;




      const blob = doc.output("blob");
      resolve(URL.createObjectURL(blob));
    };
  });
};
