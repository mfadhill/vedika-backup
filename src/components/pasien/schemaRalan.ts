import { z } from "zod";

const wajibDiIsi = () => z.string().min(1, "Wajib diisi");

export const klaimRalan = z.object({
   nomor_sep: wajibDiIsi(),
   nomor_kartu: wajibDiIsi(),
   tgl_masuk: wajibDiIsi(),
   tgl_pulang: wajibDiIsi(),
   kelas_rawat: z.string().optional(),
   cara_masuk: wajibDiIsi(),
   jenis_rawat: wajibDiIsi(),
   kd_poli: wajibDiIsi(),
   cara_pulang: wajibDiIsi(),
   kode_tarif: wajibDiIsi(),
   sistole: z.number().min(0, "Wajib diisi"),
   diastole: z.number().min(0, "Wajib diisi"),
   icu_los: z.string().optional(),
   adl_sub_acute: z.literal("-").optional(),
   adl_chronic: z.literal("-").optional(),
   birth_weight: z.string().optional(),
   nama_dokter: wajibDiIsi(),
   tarif_poli_eks: z.string().optional(),
   payor_id: z.string().optional(),
   payor_cd: wajibDiIsi(),
   cob_cd: z.string().optional(),
   dializer_single_use: z.string().optional(),
   no_kartu_dialyzer: z.string().optional(),
   nama_perusahaan: z.string().optional(),
   tarif_rs: z.object({
      prosedur_non_bedah: z.string(),
      prosedur_bedah: z.string(),
      konsultasi: z.string(),
      tenaga_ahli: z.string(),
      keperawatan: z.string(),
      penunjang: z.string(),
      radiologi: z.string(),
      laboratorium: z.string(),
      pelayanan_darah: z.string(),
      rehabilitasi: z.string(),
      kamar: z.string(),
      rawat_intensif: z.string(),
      obat: z.string(),
      obat_kronis: z.string(),
      obat_kemoterapi: z.string(),
      alkes: z.string(),
      bmhp: z.string(),
      sewa_alat: z.string(),
   }),
   ext: z.object({
      no_sitb: z.string().optional(),
   }),

});


export type KlaimRalan = z.infer<typeof klaimRalan>;