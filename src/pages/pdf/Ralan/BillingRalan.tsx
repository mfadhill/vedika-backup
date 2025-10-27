import jsPDF from "jspdf";

export const generateBillingRalan = (): Promise<string> => {
  return new Promise((resolve) => {
    const doc = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = "/logo-rs.png";

    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const leftX = 10;
      const colonX = 50;
      const rightX = pageWidth - 20;
      const centerX = pageWidth / 2;
      let y = 8;
      const lineHeight = 4;

      // === HEADER RUMAH SAKIT ===
      doc.addImage(img, "PNG", margin, y - 4, 15, 15);

      doc.setFont("helvetica");
      doc.setFontSize(10);
      doc.text("RSU Fastabiq Sehat PKU Muhammadiyah", centerX, y, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      y += 4;
      doc.text("Jl. Pati - Tayu Km. 03, Tambaharjo, Kec. Pati, Pati, Jawa Tengah", centerX, y, {
        align: "center",
      });
      y += 4;
      doc.text("(0295) 4199008, Fax (0295) 4101177", centerX, y, {
        align: "center",
      });
      y += 4;
      doc.text("Email: rsfastabiqsehat@gmail.com", centerX, y, {
        align: "center",
      });

      // Garis pembatas bawah header
      y += 4;
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // === DATA PASIEN ===
      const drawLabelValue = (label: string, value: string | number) => {
        doc.text(label, leftX, y);
        doc.text(":", colonX, y);
        doc.text(`${value}`, colonX + 3, y);
        y += lineHeight;
      };

      doc.setFontSize(8);
      const data = {
        noNota: "21323123213",
        bangsal: "310 Rawat Inap",
        tglPerawatan: "19 September 2025",
        noRM: "029343",
        namaPasien: "Candara Putri",
        alamat: "Ds. Mulyoharjo",
        dokter: ["dr. Imron", "dr. Yuniarsih"],
        registrasi: 15000,
        ruang: [
          { nama: "310 Inpatru C T, Kamar Kelas II", biaya: 140000, subtotal: 280000 },
          { total_kamar: "Total Kamar", subtotal: 280000 },
        ],
        rincianBiaya: [
          {
            kategori: "Perawatan",
            items: [
              { nama: "Konsul Phone Dokter Spesialis", harga: 45000, jumlah: 2, subtotal: 90000 },
              { nama: "Askep / Askeb", harga: 47000, jumlah: 1, subtotal: 47000 },
              { nama: "Redressing / Perawatan Infus", harga: 13400, jumlah: 1, subtotal: 13400 },
            ],
            total: 150400,
          },
          {
            kategori: "Pemeriksaan Lab",
            items: [
              { nama: "BT (Bleeding Time)", harga: 15000, jumlah: 1, subtotal: 15000 },
              { nama: "CT (Clotting Time)", harga: 15000, jumlah: 1, subtotal: 15000 },
              { nama: "GOLONGAN DARAH", harga: 20000, jumlah: 1, subtotal: 20000 },
              { nama: "GULA DARAH SEWAKTU", harga: 29000, jumlah: 1, subtotal: 29000 },
              { nama: "HBsAg (STICK)", harga: 41500, jumlah: 1, subtotal: 41500 },
              { nama: "DARAH RUTIN", harga: 74500, jumlah: 1, subtotal: 74500 },
              { nama: "ANTI HIV RAPID", harga: 92000, jumlah: 1, subtotal: 92000 },
              { nama: "Sifilis Program Khusus", harga: 25000, jumlah: 1, subtotal: 25000 },
            ],
            total: 312000,
          },
          {
            kategori: "Operasi",
            items: [{ nama: "Operasi Kecil CITO", harga: 2568999, jumlah: 1, subtotal: 2568999 }],
            total: 2568999,
          },
          {
            kategori: "Obat & BHP",
            items: [
              { nama: "Inj Ondansetron 4 Mg/2 ML (-)", harga: 1263, jumlah: 1, subtotal: 1263 },
              { nama: "Inj Proanes 1% 5`S (Propofol) (-)", harga: 85087, jumlah: 1, subtotal: 85087 },
              { nama: "Tab Bledstop (Methylergometrine) 100s (-)", harga: 745, jumlah: 20, subtotal: 14900 },
              { nama: "Spuit Nipro 10 CC (-)", harga: 3139, jumlah: 2, subtotal: 6278 },
              { nama: "Inf RL 500 ML (-)", harga: 6274, jumlah: 7, subtotal: 43918 },
              { nama: "GAMMEX 6.5 (-)", harga: 12893, jumlah: 4, subtotal: 51572 },
            ],
            total: 352713,
          },
        ],
      };

      // --- Pasien info ---
      drawLabelValue("No. Nota", data.noNota);
      drawLabelValue("Bangsal/Kamar", data.bangsal);
      drawLabelValue("Tgl. Perawatan", data.tglPerawatan);
      drawLabelValue("No. RM", data.noRM);
      drawLabelValue("Nama Pasien", data.namaPasien);
      drawLabelValue("Alamat", data.alamat);

      // Dokter
      doc.text("Dokter", leftX, y);
      doc.text(":", colonX, y);
      y += lineHeight;
      data.dokter.forEach((d) => {
        doc.text(`- ${d}`, colonX + 3, y);
        y += lineHeight;
      });

      // Registrasi
         doc.text("Registrasi", leftX, y);
      doc.text(":", colonX, y);
      doc.text(`Rp ${data.registrasi.toLocaleString("id-ID")}`, rightX, y, { align: "right" });
      y += lineHeight + 1;

      // --- Ruang ---
      doc.setFont("helvetica");
      doc.text("Ruang ", leftX, y);
      doc.text(":", colonX, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");

      data.ruang.forEach((r) => {
        if (r.nama) {
          doc.text(r.nama, colonX + 3, y);
          doc.text(`Rp ${r.biaya?.toLocaleString("id-ID") ?? ""}`, rightX - 30, y, { align: "right" });
          doc.text("2", rightX - 15, y, { align: "right" });
          doc.text(`Rp ${r.subtotal?.toLocaleString("id-ID") ?? ""}`, rightX, y, { align: "right" });
          y += lineHeight;
        }
      });

      doc.setFont("helvetica");
      doc.text(`Total Kamar : Rp ${data.ruang[1].subtotal.toLocaleString("id-ID")}`, colonX + 3, y);
      y += 5;

      // --- RINCIAN BIAYA ---
      let totalKeseluruhan = 0;
      doc.setFontSize(8);
      data.rincianBiaya.forEach((kategori) => {
        doc.setFont("helvetica");
        doc.text(":", colonX, y);
        doc.text(`${kategori.kategori} `, leftX, y);
        y += lineHeight;
        doc.setFont("helvetica", "normal");

        kategori.items.forEach((item) => {
          doc.text(item.nama, colonX + 3, y);
          doc.text(`Rp ${item.harga.toLocaleString("id-ID")}`, rightX - 30, y, { align: "right" });
          doc.text(`${item.jumlah}`, rightX - 15, y, { align: "right" });
          doc.text(`Rp ${item.subtotal.toLocaleString("id-ID")}`, rightX, y, { align: "right" });
          y += lineHeight - 1;
        });

        doc.setFont("helvetica");
        doc.text(`Total ${kategori.kategori} : Rp ${kategori.total.toLocaleString("id-ID")}`, colonX + 3, y);
        y += 4;
        totalKeseluruhan += kategori.total;
      });

      const tambahan = {
        resepPulang: 0,
        tambahanBiaya: 0,
        potonganBiaya: 0,
        jasaService: 0,
        total: totalKeseluruhan,
      };

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const drawTambahan = (label: string, value: number) => {
        doc.text(label, leftX, y);
        doc.text(":", colonX, y);

        if (value !== 0) {
          doc.text(`Rp ${value.toLocaleString("id-ID")}`, rightX, y, { align: "right" });
        }

        y += lineHeight;
      };


      drawTambahan("Resep Pulang", tambahan.resepPulang);
      drawTambahan("Tambahan Biaya", tambahan.tambahanBiaya);
      drawTambahan("Potongan Biaya", tambahan.potonganBiaya);
      drawTambahan("Jasa Service", tambahan.jasaService);
      y += 2;
      doc.setFont("helvetica");
      doc.setFontSize(9);
      doc.text("Total", leftX, y);
      doc.text(":", colonX, y);
      doc.text(`Rp ${totalKeseluruhan.toLocaleString("id-ID")}`, rightX, y, { align: "right" });
      // === OUTPUT ===
      const blob = doc.output("blob");
      resolve(URL.createObjectURL(blob));
    };

    img.onerror = () => resolve(URL.createObjectURL(new jsPDF().output("blob")));
  });
};
