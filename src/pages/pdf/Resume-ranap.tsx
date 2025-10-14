import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

export interface ResumeData {
  namaPasien: string;
  noRm: string;
  umur: string;
  ruang: string;
  tglLahir: string;
  jk: string;
  pekerjaan: string;
  tglMasuk: string;
  alamat: string;
  tglKeluar: string;
  diagnosaAwal: string;
  alasan: string;
  keluhanUtama: string;
  pemeriksaanFisik: string;
  jalannyaPenyakit: string;
  pemeriksaanPenunjang: string;
  hasilLaborat: string;
  tindakanDanOperasi: string;
  obatDiRs: string;
  diagnosaUtama: string;
  kdDiagnosaUtama: string;
  diagnosaSekunder: string[];
  kdDiagnosaSekunder: string[];
  prosedurUtama: string;
  kdProsedurUtama: string;
  prosedurSekunder: string[];
  kdProsedurSekunder: string[];
  alergi: string;
  diet: string;
  labBelum: string;
  edukasi: string;
  keadaan: string;
  caraKeluar: string;
  dilanjutkan: string;
  kontrol: string;
  obatPulang: string;
  dokter: string;
}

export const generateResumeRanap = async (): Promise<string> => {
  const d: ResumeData = {
    namaPasien: "Ahmad Fadhil",
    noRm: "00123",
    umur: "35 Tahun",
    ruang: "Poli Penyakit Dalam",
    tglLahir: "01-01-1990",
    jk: "Laki-laki",
    pekerjaan: "Pegawai Swasta",
    tglMasuk: "12-09-2025",
    alamat: "Jl. Contoh No.1",
    tglKeluar: "15-09-2025",
    diagnosaAwal: "Demam Tinggi",
    alasan: "Demam 3 hari",
    keluhanUtama: "Demam tinggi, mual, pusing",
    pemeriksaanFisik: "Tekanan darah normal, nadi 80x/menit",
    jalannyaPenyakit: "Dirawat di ruang isolasi, diberikan cairan IV dan obat penurun panas",
    pemeriksaanPenunjang: "X-Ray: Normal",
    hasilLaborat: "HB: 13 g/dL, Leukosit: 7000/mm³",
    tindakanDanOperasi: "Tidak ada operasi, hanya tindakan medis rutin",
    obatDiRs: "Paracetamol, Vitamin C, Infus Ringer Laktat",
    diagnosaUtama: "Demam Tertentu",
    kdDiagnosaUtama: "A00",
    diagnosaSekunder: ["Infeksi Saluran Pernapasan", "Dehidrasi"],
    kdDiagnosaSekunder: ["J06", "E86"],
    prosedurUtama: "Pemasangan infus",
    kdProsedurUtama: "P01",
    prosedurSekunder: ["Pemeriksaan laboratorium", "Foto thorax"],
    kdProsedurSekunder: ["L01", "R01"],
    alergi: "Tidak ada",
    diet: "Diet tinggi kalori dan cairan cukup",
    labBelum: "Hasil kultur darah masih pending",
    edukasi: "Kontrol kembali jika demam >38°C, minum obat sesuai anjuran dokter",
    keadaan: "Sehat",
    caraKeluar: "Pulang dengan pengawasan keluarga",
    dilanjutkan: "Kontrol Poli Penyakit Dalam",
    kontrol: "22-09-2025",
    obatPulang: "Paracetamol 500mg, 3x sehari",
    dokter: "Dr. Budi"
  };

  const safe = (val?: string) => val || "-";

  // Generate QR code
  const qrCode = await QRCode.toDataURL(d.noRm, { width: 80 });

  // Create hidden div
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  tempDiv.style.top = "0";
  tempDiv.style.backgroundColor = "#fff";
  tempDiv.style.width = "800px";
  tempDiv.style.fontFamily = "Arial, Helvetica, sans-serif";
  tempDiv.style.padding = "10px";
  tempDiv.style.fontSize = "8pt";
  document.body.appendChild(tempDiv);

  tempDiv.innerHTML = `
    <!-- HEADER -->
    <table style="width:100%; margin-bottom:8px;">
      <tr>
        <td style="width:15%"><img src="/fastabiq-logo.png" style="width:60px;" /></td>
        <td style="text-align:center">
          <p style="font-size:14pt;margin:0;">RSU Fastabiq Sehat PKU Muhammadiyah</p>
          <p style="margin:0;">Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati</p>
          <p style="margin:0;">(0295) 4199008, Fax (0295) 4101177</p>
          <p style="margin:0;">E-mail : rsfastabiqsehat@gmail.com</p>
        </td>
      </tr>
    </table>
   <hr style="border:1px solid black; margin:0;" />
<p style="text-align:center; font-size:14pt; margin:2px 0 4px 0;">RESUME MEDIS PASIEN</p>
<hr style="border:1px solid black; margin:20px 0 0 0;" />

    <!-- DATA PASIEN -->
    <table style="width:100%; margin-bottom:4px;">
      <tr>
        <td>Nama Pasien</td><td>:</td><td>${safe(d.namaPasien)}</td>
        <td>No. RM</td><td>:</td><td>${safe(d.noRm)}</td>
      </tr>
      <tr>
        <td>Umur</td><td>:</td><td>${safe(d.umur)}</td>
        <td>Ruang</td><td>:</td><td>${safe(d.ruang)}</td>
      </tr>
      <tr>
        <td>Tgl Lahir</td><td>:</td><td>${safe(d.tglLahir)}</td>
        <td>Jenis Kelamin</td><td>:</td><td>${safe(d.jk)}</td>
      </tr>
      <tr>
        <td>Pekerjaan</td><td>:</td><td>${safe(d.pekerjaan)}</td>
        <td>Tanggal Masuk</td><td>:</td><td>${safe(d.tglMasuk)}</td>
      </tr>
      <tr>
        <td>Alamat</td><td>:</td><td>${safe(d.alamat)}</td>
        <td>Tanggal Keluar</td><td>:</td><td>${safe(d.tglKeluar)}</td>
      </tr>
    </table>
<hr style="border:1px solid black; margin:20px 0 0 0;" />

<table style="width:100%;">
  <tr><td colspan="2">Diagnosa Awal Masuk: ${safe(d.diagnosaAwal)}</td></tr>
  <tr><td colspan="2">Alasan Masuk Dirawat: ${safe(d.alasan)}</td></tr>
  <tr><td colspan="2">Keluhan Utama Riwayat Penyakit:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.keluhanUtama)}</td></tr>
  <tr><td colspan="2">Pemeriksaan Fisik:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.pemeriksaanFisik)}</td></tr>
  <tr><td colspan="2">Jalannya Penyakit Selama Perawatan:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.jalannyaPenyakit)}</td></tr>
  <tr><td colspan="2">Pemeriksaan Penunjang Radiologi Terpenting:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.pemeriksaanPenunjang)}</td></tr>
  <tr><td colspan="2">Pemeriksaan Penunjang Laboratorium Terpenting:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.hasilLaborat)}</td></tr>
  <tr><td colspan="2">Tindakan Operasi Selama Perawatan:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.tindakanDanOperasi)}</td></tr>
  <tr><td colspan="2">Obat-obatan Selama Perawatan:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px;">${safe(d.obatDiRs)}</td></tr>
</table>

    <!-- DIAGNOSA & PROSEDUR -->
    <table style="width:100%; border-collapse: collapse;">
      <tr>
        <th style="text-align:left;">Diagnosa Akhir</th>
        <th style="text-align:right;">Kode ICD</th>
      </tr>
      <tr>
        <td colspan="2">
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="width:25%;">- Diagnosa Utama</td>
              <td style="width:5%;">:</td>
              <td style="width:60%;">${safe(d.diagnosaUtama)}</td>
              <td style="width:10%; text-align:right;">${safe(d.kdDiagnosaUtama)}</td>
            </tr>
            ${d.diagnosaSekunder.map((sec, i) => `
              <tr>
                <td style="width:25%;">${i === 0 ? '- Diagnosa Sekunder' : '&nbsp;'}</td>
                <td style="width:5%;">:</td>
                <td style="width:60%;">${i + 1}. ${safe(sec)}</td>
                <td style="width:10%; text-align:right;">${safe(d.kdDiagnosaSekunder[i])}</td>
              </tr>
            `).join('')}
          </table>
        </td>
      </tr>
    </table>

    <table style="width:100%; border-collapse: collapse; margin-top: 8px;">
      <tr>
        <td style="width:25%;">- Prosedur/Tindakan Utama</td>
        <td style="width:5%;">:</td>
        <td style="width:60%;">${safe(d.prosedurUtama)}</td>
        <td style="width:10%; text-align:right;">${safe(d.kdProsedurUtama)}</td>
      </tr>
      ${d.prosedurSekunder.map((proc, i) => `
        <tr>
          <td style="width:25%;">${i === 0 ? '- Prosedur/Tindakan Sekunder' : '&nbsp;'}</td>
          <td style="width:5%;">:</td>
          <td style="width:60%;">${i + 1}. ${safe(proc)}</td>
          <td style="width:10%; text-align:right;">${safe(d.kdProsedurSekunder[i])}</td>
        </tr>
      `).join('')}
    </table>

    <!-- LAB, EDUKASI, OBAT -->

  <table style="width:100%; border-collapse: collapse;">
  <tr><td colspan="2">Alergi / Reaksi Obat: ${safe(d.alergi)}</td></tr>
  <tr><td colspan="2">Diet Selama Perawatan:</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px; vertical-align:top;">${safe(d.diet)}</td></tr>
  <tr><td colspan="2">Hasil Lab Yang Belum Selesai (Pending) :</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px; vertical-align:top;">${safe(d.labBelum)}</td></tr>
  <tr><td colspan="2">Instruksi/Anjuran Dan Edukasi (Follow Up) :</td></tr>
  <tr><td colspan="2" style="height:50px; padding-left:16px; vertical-align:top;">${safe(d.edukasi)}</td></tr>

</table>
<table style="width:100%; border-collapse: collapse; table-layout: auto; font-family: Arial, sans-serif;">
  <tr>
    <td style="padding:0; white-space:nowrap;">Keadaan Pulang </td>
    <td style="padding:0 5px 0 2px;">: ${safe(d.keadaan)}</td>
    <td style="padding:0; white-space:nowrap;">Cara Keluar </td>
    <td style="padding:0 5px 0 2px;">: ${safe(d.caraKeluar)}</td>
  </tr>
  <tr>
    <td style="padding:0; white-space:nowrap;">Dilanjutkan </td>
    <td style="padding:0 5px 0 2px;"> : ${safe(d.dilanjutkan)}</td>
    <td style="padding:0; white-space:nowrap;">Tanggal Kontrol </td>
    <td style="padding:0 5px 0 2px;"> : ${safe(d.kontrol)}</td>
  </tr>
  <tr><td style="padding-top:4px;" colspan="4">Obat-obatan waktu pulang: ${safe(d.obatPulang)}</td></tr>
</table>

    <!-- QR & TTD -->
 <div style="width:100%; margin-top:20px; display:flex; justify-content:flex-end;">
  <div style="display:flex; flex-direction:column; align-items:center;">
    <p style="margin:0 0 4px 0; font-size:10pt; text-align:center;">Dokter Penanggung Jawab</p>
    <img src="${qrCode}" style="width:70px; height:70px; margin:4px 0;" />
    <p style="margin:0; font-size:10pt; text-align:center;">${safe(d.dokter)}</p>
  </div>
</div>


  `;
 const images = tempDiv.querySelectorAll<HTMLImageElement>("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((res) => {
          if (img.complete) return res();
          img.onload = () => res();
          img.onerror = () => res();
        })
    )
  );

  const canvas = await html2canvas(tempDiv, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", [210, 370]);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  document.body.removeChild(tempDiv);

  return URL.createObjectURL(pdf.output("blob"));
};
