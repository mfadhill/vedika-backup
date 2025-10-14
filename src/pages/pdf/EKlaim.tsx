import jsPDF from "jspdf";

export const generateEKlaim = async (claim_id: number ) => {
  const res = await fetch(`http://192.168.20.4:3000/grab/claimed/${claim_id}`);
  const apiData = await res.json();
  console.log(apiData);

  const pasienData = {
    claim_id,
    ...apiData,
    // ...pasienData
  };

  // Ambil gambar base64
  const getBase64Image = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const doc = new jsPDF();
  const imgBase64 = await getBase64Image("/kemkes.png");

  let y = 15;
  const labelX1 = 14;
  const valueX1 = 50;
  const labelX2 = 110;
  const valueX2 = 140;

  function formatDate(dateString: any) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  }

  const tglMasuk = formatDate(pasienData.tgl_masuk);
  const tglPulang = formatDate(pasienData.tgl_pulang);
  const createdAt = formatDate(pasienData.created_at);
  const tglLahir = formatDate(pasienData.tgl_lahir);

  // Hitung umur
  const calculateAge = (birthDateStr: string | undefined) => {
    if (!birthDateStr) return { ageYears: 0, ageDays: 0 };
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return { ageYears: 0, ageDays: 0 };

    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageYears--;
    }

    const diffTime = today.getTime() - birthDate.getTime();
    const ageDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return { ageYears, ageDays };
  };

  const umur = calculateAge(pasienData?.tgl_lahir);

  const writeTwoCols = (
    label1: string,
    value1: any,
    label2: string,
    value2: any
  ) => {
    const offset = 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(label1, labelX1, y);
    doc.text(":", valueX1, y);
    doc.text(String(value1 ?? "-"), valueX1 + offset, y);

    doc.text(label2, labelX2, y);
    doc.text(":", valueX2, y);
    doc.text(String(value2 ?? "-"), valueX2 + offset, y);

    y += 6;
  };

  // Header
  doc.addImage(imgBase64, "PNG", 15, y, 15, 15);

  const textY = y + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("KEMENTERIAN KESEHATAN REPUBLIK INDONESIA", labelX1 + 20, textY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(pasienData.payor_cd ?? "-", 196, textY, { align: "right" });

  y = textY + 5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Berkas Klaim Individual Pasien", labelX1 + 20, y);
  doc.text(createdAt, 196, y, { align: "right" });

  y += 8;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(labelX1, y, 196, y);

  y += 6;
  doc.line(labelX1 - 2, y - 6, 196, y - 6);

  // Data Pasien
  writeTwoCols("Kode Rumah Sakit", "3318110", "Kelas Rumah Sakit", "C");
  writeTwoCols(
    "Nama RS",
    "RSU FASTABIQ SEHAT",
    "Jenis Tarif",
    "TARIF RS KELAS C SWASTA"
  );
  doc.setLineWidth(0.1);
  doc.line(labelX1 - 2, y - 2, 196, y - 2);
  y += 4;

  writeTwoCols(
    "Nomor Peserta",
    pasienData.nomor_kartu,
    "Nomor SEP",
    pasienData.nomor_sep
  );
  writeTwoCols(
    "Nomor Rekam Medis",
    pasienData.no_rkm_medis,
    "Tanggal Masuk",
    tglMasuk
  );
  writeTwoCols("Umur Tahun", umur.ageYears, "Tanggal Keluar", tglPulang);
  writeTwoCols("Umur Hari", umur.ageDays, "Jenis Perawatan", pasienData.status);

  writeTwoCols(
    "Tanggal Lahir",
    tglLahir,
    "Cara Pulang",
    pasienData.cara_pulang
  );
  writeTwoCols(
    "Jenis Kelamin",
    pasienData.jk,
    "LOS",
    `${pasienData.icu_los ?? 0} hari`
  );
  writeTwoCols(
    "Kelas Perawatan",
    ` Kelas ${pasienData.kelas_rawat } hari`,
    "Berat Lahir",
    pasienData.birth_weight
  );
  doc.setLineWidth(0.1);
  doc.line(labelX1 - 2, y - 2, 196, y - 2);
  y += 6;

  // Diagnosa Utama
  doc.text("Diagnosa Utama", labelX1, y);
  if (pasienData.diagnosa_inacbg?.length > 0) {
    const utama = pasienData.diagnosa_inacbg[0];
    doc.text(`: ${utama.display}`, valueX1, y);
  } else {
    doc.text(": -", valueX1, y);
  }
  y += 10;

  // Diagnosa Sekunder
  doc.text("Diagnosa Sekunder", labelX1, y);
  if (pasienData.diagnosa_inacbg?.length > 1) {
    pasienData.diagnosa_inacbg.slice(1).forEach((d: any) => {
      doc.text(`: ${d.display}`, valueX1, y);
      y += 6;
    });
  } else {
    doc.text(": -", valueX1, y);
    y += 6;
  }

  y += 30;

  // Prosedur
  doc.text("Prosedur", labelX1, y);
  if (pasienData.prosedur_inacbg?.length > 0) {
    pasienData.prosedur_inacbg.forEach((p: any) => {
      doc.text(`: ${p.display}`, valueX1, y);
      y += 6;
    });
  } else {
    doc.text(": -", valueX1, y);
    y += 6;
  }

  y += 30;

  // ADL
  doc.text("ADL Sub Acute", labelX1, y);
  doc.text(`: ${pasienData.adl_sub_acute ?? "-"}`, valueX1, y);
  doc.text("ADL Chronic", labelX2, y);
  doc.text(`: ${pasienData.adl_chronic ?? "-"}`, valueX2, y);

  y += 20;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Hasil Grouping", labelX1, y);
  y += 4;
  doc.line(labelX1, y, 196, y);
  y += 6;

  doc.setFont("helvetica", "normal");

  const col1X = labelX1;
  const col2X = 45;
  const col3X = 60;
  const rpX = 170;
  const angkaX = 196;

  const renderRow = (
    title: string,
    code: string,
    description: string,
    tariff: number
  ) => {
    doc.text(title, col1X, y);
    doc.text(code || "-", col2X, y);
    doc.text(description || "-", col3X, y);
    doc.text("Rp.", rpX, y);
    doc.text(Number(tariff || 0).toLocaleString("id-ID"), angkaX, y, {
      align: "right",
    });
    y += 6;
  };


 // INA-CBG
if (pasienData.grouping_inacbg?.length > 0) {
  const cbg = pasienData.grouping_inacbg[0];
  renderRow("INA-CBG", cbg.cbg_code, cbg.cbg_description, cbg.tariff);
} else {
  renderRow("INA-CBG", "-", "-", 0);
}

// Sub Acute
renderRow("Sub Acute", "-", "-", 0);

// Chronic
renderRow("Chronic", "-", "-", 0);

// Special CMG
if (pasienData.special_cmg?.length > 0) {
  pasienData.special_cmg.forEach((s: any) => {
    renderRow("Special CMG", s.code, s.description, s.tariff);
  });
} else {
  renderRow("Special CMG", "-", "-", 0);
}


y += 1;
doc.line(labelX1, y, 196, y);
y += 6;


let totalTarif = 0;


if (pasienData.grouping_inacbg?.length > 0) {
  totalTarif += pasienData.grouping_inacbg[0].tariff || 0;
}


totalTarif += 0;
totalTarif += 0;

if (pasienData.special_cmg?.length > 0) {
  totalTarif += pasienData.special_cmg.reduce(
    (acc: number, item: any) => acc + (item.tariff || 0),
    0
  );
}

renderRow("TOTAL", "-", "-", totalTarif);

y += 1;
doc.line(labelX1, y, 196, y);
y += 6;


  doc.setFont("helvetica", "bold");
  doc.text("Total Tarif", labelX1, y);
  doc.text("Rp.", rpX, y);
  doc.text(totalTarif.toLocaleString("id-ID"), angkaX, y, { align: "right" });

  // Save
  const fileName = pasienData.nomor_sep
    ? `${pasienData.nomor_sep}.pdf`
    : "klaim-pasien.pdf";
  doc.save(fileName);
};
