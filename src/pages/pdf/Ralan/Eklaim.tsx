import jsPDF from "jspdf";

export const generateEklaim = async (): string => {
  const doc = new jsPDF();

  const pasienData = {
    nomor_sep: "1234567890",
    nomor_kartu: "000111222333",
    no_rkm_medis: "RM12345",
    payor_cd: "BPJS",
    jk: "L",
    status: "Rawat Inap",
    kelas_rawat: "III",
    cara_pulang: "Sembuh",
    tgl_lahir: "1980-05-12",
    tgl_masuk: "2025-10-10",
    tgl_pulang: "2025-10-15",
    created_at: "2025-10-16",
    birth_weight: "3200",
    createdAt: "27/10/2025",
    diagnosa_inacbg: [{ display: "Demam Berdarah Dengue" }],
    prosedur_inacbg: [{ display: "Pemeriksaan Darah Lengkap" }],
    grouping_inacbg: [
      { cbg_code: "C-01-001", cbg_description: "DBD tanpa komplikasi", tariff: 4500000 },
    ],
    special_cmg: [],
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const calculateAge = (birthDateStr: string) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ageYears--;
    return ageYears;
  };
  const getBase64Image = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };
  const imgBase64 = await getBase64Image("/kemkes.png");

  const umur = calculateAge(pasienData.tgl_lahir);

  const labelX1 = 14;
  const valueX1 = 50;
  const labelX2 = 110;
  const valueX2 = 140;
  let y = 20;

  const writeTwoCols = (label1: string, val1: any, label2: string, val2: any) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const pad = 4;
    doc.text(label1, labelX1, y);
    doc.text(":", valueX1, y);
    doc.text(String(val1 ?? "-"), valueX1 + pad, y);

    doc.text(label2, labelX2, y);
    doc.text(":", valueX2, y);
    doc.text(String(val2 ?? "-"), valueX2 + pad, y);

    y += 6;
  };

  const logoSize = 15;
  const logoX = 10;
  const logoY = 10;
  const titleX = logoX + logoSize + 5;
  const rightMargin = 196;

  doc.addImage(imgBase64, "PNG", logoX, logoY, logoSize, logoSize);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("KEMENTERIAN KESEHATAN REPUBLIK INDONESIA", titleX, logoY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(pasienData.payor_cd ?? "-", rightMargin, logoY + 6, { align: "right" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Berkas Klaim Individual Pasien", titleX, logoY + 12);

  doc.text(formatDate(pasienData.created_at), rightMargin, logoY + 12, { align: "right" });

  const garisY = logoY + 18;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(logoX, garisY, rightMargin, garisY);

  y = garisY + 8;

  writeTwoCols("Kode Rumah Sakit", "3318110", "Kelas Rumah Sakit", "C");
  writeTwoCols(
    "Nama RS",
    "RSU FASTABIQ SEHAT",
    "Jenis Tarif",
    "TARIF RS KELAS C SWASTA"
  );
  doc.setLineWidth(0.1);
  doc.line(labelX1 - 2, y - 2, 196, y - 2);
  doc.setFont("helvetica", "normal");
  y += 8;
  writeTwoCols("Kode Rumah Sakit", "3318110", "Kelas Rumah Sakit", "C");
  writeTwoCols("Nama RS", "RSU FASTABIQ SEHAT", "Jenis Tarif", "Tarif RS Swasta C");
  writeTwoCols("Nomor Peserta", pasienData.nomor_kartu, "Nomor SEP", pasienData.nomor_sep);
  writeTwoCols("Nomor RM", pasienData.no_rkm_medis, "Tanggal Masuk", formatDate(pasienData.tgl_masuk));
  writeTwoCols("Tanggal Pulang", formatDate(pasienData.tgl_pulang), "Jenis Kelamin", pasienData.jk);
  writeTwoCols("Umur (Tahun)", umur, "Cara Pulang", pasienData.cara_pulang);

  y += 6;
  doc.line(labelX1, y, 196, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const singleColStartX = labelX1;
  const colonAlignX = singleColStartX + 36;
  const valueStartX = colonAlignX + 4;

  const dataList = [
    { label: "Diagnosa Utama", value: pasienData.diagnosa_inacbg?.[0]?.display || "-" },
    { label: "Diagnosa Sekunder", value: pasienData.diagnosa_inacbg?.[1]?.display || "-" },
    { label: "Prosedur", value: pasienData.prosedur_inacbg?.[0]?.display || "-" },
  ];

  dataList.forEach((item) => {
    doc.text(item.label, singleColStartX, y);
    doc.text(":", colonAlignX, y);
    doc.text(String(item.value), valueStartX, y);
    y += 20;
  });

  writeTwoCols("ADL Sub Acute", umur, "ADL Cronic", pasienData.cara_pulang);
  y += 2;
  doc.setLineWidth(0.1);
  doc.line(labelX1, y, 196, y);
  y += 8;


  const cbg = pasienData.grouping_inacbg[0];
  doc.setFont("helvetica", "bold");
  doc.text("HASIL GROUPING", labelX1, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("INA-CBG", labelX1, y);
  doc.text(cbg.cbg_code, 45, y);
  doc.text(cbg.cbg_description, 70, y);
  doc.text("Rp.", 170, y);
  doc.text(cbg.tariff.toLocaleString("id-ID"), 196, y, { align: "right" });
  y += 10;

  doc.line(labelX1, y, 196, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Total Tarif", labelX1, y);
  doc.text("Rp.", 170, y);
  doc.text(cbg.tariff.toLocaleString("id-ID"), 196, y, { align: "right" });

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};
