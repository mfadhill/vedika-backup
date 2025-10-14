import { z } from "zod";

const wajibDiIsi = () => z.string().min(1, "Wajib diisi");

export const klaimFormDataSchema = z.object({
   no_sep: wajibDiIsi(),
   nomor_kartu: wajibDiIsi(),
   tgl_masuk: wajibDiIsi(),
   tgl_pulang: wajibDiIsi(),
   kelas_rawat: wajibDiIsi(),
   cara_masuk: wajibDiIsi(),
   cara_pulang: wajibDiIsi(),
   icu_los: z.string().optional(),
   kode_tarif: z.string().optional(),
   jenis_rawat: wajibDiIsi(),
   adl_sub_acute: z.literal("-").optional(),
   adl_chronic: z.literal("-").optional(),
   birth_weight: z.string().optional(),
   sistole: z.number().min(0, "Wajib diisi"),
   diastole: z.number().min(0, "Wajib diisi"),
   nama_dokter: wajibDiIsi(),
   payor_cd: wajibDiIsi(),
   cob_cd: z.string().optional(),
   upgrade_class_ind: z.string().optional(),
   upgrade_class_class: z.string().optional(),
   upgrade_class_los: z.number().optional(),
   tarif_rs: z.object({
      prosedur_non_bedah: wajibDiIsi(),
      prosedur_bedah: wajibDiIsi(),
      konsultasi: wajibDiIsi(),
      tenaga_ahli: wajibDiIsi(),
      keperawatan: wajibDiIsi(),
      penunjang: wajibDiIsi(),
      radiologi: wajibDiIsi(),
      laboratorium: wajibDiIsi(),
      pelayanan_darah: wajibDiIsi(),
      rehabilitasi: wajibDiIsi(),
      kamar: wajibDiIsi(),
      rawat_intensif: wajibDiIsi(),
      obat: wajibDiIsi(),
      obat_kronis: wajibDiIsi(),
      obat_kemoterapi: wajibDiIsi(),
      alkes: wajibDiIsi(),
      bmhp: wajibDiIsi(),
      sewa_alat: wajibDiIsi(),
   }),
   ventilator_hour: z.string().optional(),
   ventilator: z.object({
      use_ind: z.string().optional(),
      start_dttm: z.string().optional(),
      stop_dttm: z.string().optional(),
   }).optional(),
   ext: z.object({
      no_sitb: z.string().optional(),
      no_covid: z.string().optional(),
   })
});

export type KlaimFormData = z.infer<typeof klaimFormDataSchema>;