import { useState } from "react";
import jsPDF from "jspdf";

export const usePdf = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const pasienData = {
    kodeRS: "3318110",
    kelasRS: "C",
    namaRS: "RSU FASTABIQ SEHAT",
    jenisTarif: "TARIF RS KELAS C SWASTA",
    nomorPeserta: "0000876526007",
    nomorSEP: "0158R0100725V000370",
    nomorRM: "051188",
    tanggalMasuk: "01/07/2025",
    umurTahun: "53",
    tanggalKeluar: "01/07/2025",
    umurHari: "19679",
    jenisPerawatan: "2 - Rawat Jalan",
    tanggalLahir: "15/08/1971",
    caraPulang: "1 - Atas Persetujuan Dokter",
    jenisKelamin: "Perempuan",
    los: "1 hari",
    kelasPerawatan: "Regular",
    beratLahir: "-",
    diagnosaUtama: "R10.4 Other and unspecified abdominal pain",
    diagnosaSekunder: "-",
    prosedur: "89.07 Consultation, described as comprehensive",
    adlSubAcute: "-",
    adlChronic: "-"
  };

  const tableData = [
    ["INA-CBG", "Q-5-25-0 GASTROINTESTINAL AKUT", "Rp 164,100.00"],
    ["Sub Acute", "- -", "Rp 0.00"],
    ["Chronic", "- -", "Rp 0.00"],
    ["Special CMG", "- -", "Rp 0.00"],
    ["Total Tarif", "", "Rp 164,100.00"],
  ];

  const getBase64Image = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF = async (isDownload: boolean) => {
    const doc = new jsPDF();
    const imgBase64 = await getBase64Image("/kemkes.png");

    let y = 15;
    const labelX1 = 14;
    const valueX1 = 50;
    const labelX2 = 100;
    const valueX2 = 130;

    const writeTwoCols = (
      label1: string,
      value1: string,
      label2: string,
      value2: string
    ) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(label1, labelX1, y);
      doc.text(`: ${value1}`, valueX1, y);

      doc.text(label2, labelX2, y);
      doc.text(`: ${value2}`, valueX2, y);

      y += 6;
    };

    doc.setFontSize(12);
    doc.addImage(imgBase64, "PNG", 15, y, 15, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("KEMENTERIAN KESEHATAN REPUBLIK INDONESIA", labelX1 + 20, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("JKN", 196, y + 5, { align: "right" });

    y += 11;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Berkas Klaim Individual Pasien", labelX1 + 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("01/07/2025", 196, y, { align: "right" });

    y += 8;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(labelX1, y, 196, y);

    y += 6;
    const boxStartY = y;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(labelX1 - 2, boxStartY - 6, 196, boxStartY - 6);

    writeTwoCols("Kode Rumah Sakit", pasienData.kodeRS, "Kelas Rumah Sakit", pasienData.kelasRS);
    writeTwoCols("Nama RS", pasienData.namaRS, "Jenis Tarif", pasienData.jenisTarif);

    doc.setLineWidth(0.3);
    doc.line(labelX1 - 2, y - 2, 196, y - 2);

    y += 6;

    writeTwoCols("Nomor Peserta", pasienData.nomorPeserta, "Nomor SEP", pasienData.nomorSEP);
    writeTwoCols("Nomor Rekam Medis", pasienData.nomorRM, "Tanggal Masuk", pasienData.tanggalMasuk);
    writeTwoCols("Umur Tahun", pasienData.umurTahun, "Tanggal Keluar", pasienData.tanggalKeluar);
    writeTwoCols("Umur Hari", pasienData.umurHari, "Jenis Perawatan", pasienData.jenisPerawatan);
    writeTwoCols("Tanggal Lahir", pasienData.tanggalLahir, "Cara Pulang", pasienData.caraPulang);
    writeTwoCols("Jenis Kelamin", pasienData.jenisKelamin, "LOS", pasienData.los);
    writeTwoCols("Kelas Perawatan", pasienData.kelasPerawatan, "Berat Lahir", pasienData.beratLahir);

    y += 4;
    doc.line(labelX1, y, 196, y);
    y += 6;

    doc.setFontSize(10);
    doc.text("Diagnosa Utama", labelX1, y);
    doc.text(`: ${pasienData.diagnosaUtama}`, valueX1, y);
    y += 6;

    doc.text("Diagnosa Sekunder", labelX1, y);
    doc.text(`: ${pasienData.diagnosaSekunder}`, valueX1, y);
    y += 8;

    y += 20;
    doc.text("Prosedur", labelX1, y);
    doc.text(`: ${pasienData.prosedur}`, valueX1, y);
    y += 20;

    doc.text("ADL Sub Acute", labelX1, y);
    doc.text(`: ${pasienData.adlSubAcute}`, valueX1, y);
    doc.text("ADL Chronic", labelX2, y);
    doc.text(`: ${pasienData.adlChronic}`, valueX2, y);

    y += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Hasil Grouping", labelX1, y);
    y += 4;
    doc.setLineWidth(0.5);
    doc.line(labelX1, y, 196, y);
    y += 6;

    doc.setFontSize(10);
    tableData.forEach((row) => {
      const [col1, col2, col3] = row;

      if (col1 === "Total Tarif") {
        y += 2;
        doc.setLineWidth(0.3);
        doc.line(labelX1, y, 196, y);
        y += 5;
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }

      doc.text(col1, labelX1, y);
      doc.text(col2, valueX1, y);
      doc.text(col3, 196, y, { align: "right" });

      y += 6;
    });

    const fileName = pasienData.nomorSEP
      ? `${pasienData.nomorSEP}.pdf`
      : "klaim-pasien.pdf";

    if (isDownload) {
      doc.save(fileName);
    } else {
      const blob = doc.output("blob");
      const pdfBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfBlobUrl);
    }
  };

  return { generatePDF, pdfUrl };
};
