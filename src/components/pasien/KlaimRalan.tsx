import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import IDRG from "./Idrg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { klaimRalan, type KlaimRalan } from "./schemaRalan";
import { differenceInDays } from "date-fns";
import axios from "axios";
import { useMemo } from "react";
import { FaChevronRight } from "react-icons/fa";

type Dokter = {
  nama: string;
};

interface Pasien {
  kd_poli?: string;
  nm_pasien: string;
  no_rkm_medis: string;
  tgl_lahir: string;
  jk: string;
  no_sep: string;
  no_kartu: string;
  tgl_registrasi?: string;
  tb?: number;
  berat?: number;
  kelas?: string;
  dokter?: string;
  td?: string;
  claim_id?: number | null;
  status_claim: number | null;
  status?: string;
}

type TarifRs = {
  prosedur_non_bedah: string;
  prosedur_bedah: string;
  konsultasi: string;
  tenaga_ahli: string;
  keperawatan: string;
  penunjang: string;
  radiologi: string;
  laboratorium: string;
  pelayanan_darah: string;
  rehabilitasi: string;
  kamar: string;
  rawat_intensif: string;
  obat: string;
  obat_kronis: string;
  obat_kemoterapi: string;
  alkes: string;
  bmhp: string;
  sewa_alat: string;
};

const KlaimRalanPage: React.FC = () => {
  const { no_rawat } = useParams<{ no_rawat: string }>();
  const [showIDRG, setShowIDRG] = useState(false);
  const [noSitbCheck, setNoSitbCheck] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [kelasEksekutifCheck, setKelasEksekutifCheck] = useState(false);
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [pasien, setPasien] = useState<Pasien | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const defaultTarif: TarifRs = {
    prosedur_non_bedah: "0",
    prosedur_bedah: "0",
    konsultasi: "0",
    tenaga_ahli: "0",
    keperawatan: "0",
    penunjang: "0",
    radiologi: "0",
    laboratorium: "0",
    pelayanan_darah: "0",
    rehabilitasi: "0",
    kamar: "0",
    rawat_intensif: "0",
    obat: "0",
    obat_kronis: "0",
    obat_kemoterapi: "0",
    alkes: "0",
    bmhp: "0",
    sewa_alat: "0",
  };

  useEffect(() => {
    if (no_rawat) getData();
  }, [no_rawat]);

  const fetchDokter = async () => {
    try {
      const res = await fetch("http://192.168.20.4:3000/grab/dokter");
      const data = await res.json();
      setDokterList(data.data);
    } catch (err) {
      console.error("Gagal fetch dokter:", err);
    }
  };
  useEffect(() => {
    fetchDokter();
  }, []);

  const umur = useMemo(() => {
    if (!pasien?.tgl_lahir) return "";
    const lahir = new Date(pasien.tgl_lahir);
    const sekarang = new Date();
    let age = sekarang.getFullYear() - lahir.getFullYear();

    const m = sekarang.getMonth() - lahir.getMonth();
    if (m < 0 || (m === 0 && sekarang.getDate() < lahir.getDate())) {
      age--;
    }
    return age.toString();
  }, [pasien?.tgl_lahir]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<KlaimRalan>({
    resolver: zodResolver(klaimRalan),
    shouldUnregister: false,
    defaultValues: {
      nomor_sep: "",
      nomor_kartu: "",
      cara_masuk: "gp",
      cara_pulang: "1",
      tgl_masuk: "",
      kd_poli:"2",
      jenis_rawat:"2",
      kelas_rawat: "",
      icu_los: "0",
      kode_tarif: "AP",
      sistole: 0,
      diastole: 0,
      tarif_poli_eks: "0",
      tgl_pulang: "",
      adl_sub_acute: "-",
      adl_chronic: "-",
      birth_weight: "",
      nama_dokter: "",
      payor_cd: "JKN",
      cob_cd: "-",
      tarif_rs: defaultTarif,
      ext: {
        no_sitb: "",
      },
    },
  });

  const tglMasuk = watch("tgl_masuk");
  const tglPulang = watch("tgl_pulang");
  const tarifPoliEks = watch("tarif_poli_eks");

  const formatRupiah = (value: number | undefined) => {
    if (!value) return "Rp. 0";
    return "Rp. " + value.toLocaleString("id-ID");
  };

  useEffect(() => {
    if (tglMasuk && tglPulang) {
      const masuk = new Date(tglMasuk);
      const pulang = new Date(tglPulang);

      let diff = differenceInDays(pulang, masuk) + 1;
      if (diff < 1) diff = 1;

      setValue("icu_los", String(diff));
    }
  }, [tglMasuk, tglPulang, setValue]);

  const formData = watch();
  const totalTarif = Object.values(formData.tarif_rs || {}).reduce(
    (acc, val) => acc + Number(val),
    0
  );

  const formatToApiDate = (value?: string) => {
    if (!value) return undefined;
    return value.replace("T", " ") + ":00";
  };
  
  const onSubmit = async (formValues: KlaimRalan) => {
    if (isSubmitted) return;
    if (!isChecked) {
      toast.warning(
        "Silakan centang persetujuan terlebih dahulu sebelum submit."
      );
      return;
    }

    if (!pasien || !pasien.no_kartu || !pasien.no_sep) {
      console.warn("Tidak bisa buat klaim baru: no_kartu/no_sep kosong.");
      return;
    }

    if (pasien.claim_id === null) {
      const newClaimPayload = {
        data: {
          nomor_kartu: String(pasien.no_kartu),
          nomor_sep: String(pasien.no_sep),
          nomor_rm: String(pasien.no_rkm_medis),
          nama_pasien: String(pasien.nm_pasien),
          tgl_lahir: pasien.tgl_lahir
            ? pasien.tgl_lahir.replace("T", " ").slice(0, 19)
            : "",
          gender: pasien.jk === "L" ? "1" : "2",
        },
      };

      try {
        await axios.post(
          "http://192.168.20.4:3000/send/new-claim",
          newClaimPayload
        );
      } catch (err) {
        console.error("Gagal buat new claim:", err);
        toast.error("Gagal buat Klaim baru!");
        return;
      }
    }
    // --- Format data klaim untuk submit ---
    const formattedTarifRs: KlaimRalan["tarif_rs"] = {
      prosedur_non_bedah: String(formValues.tarif_rs.prosedur_non_bedah ?? "0"),
      prosedur_bedah: String(formValues.tarif_rs.prosedur_bedah ?? "0"),
      konsultasi: String(formValues.tarif_rs.konsultasi ?? "0"),
      tenaga_ahli: String(formValues.tarif_rs.tenaga_ahli ?? "0"),
      keperawatan: String(formValues.tarif_rs.keperawatan ?? "0"),
      penunjang: String(formValues.tarif_rs.penunjang ?? "0"),
      radiologi: String(formValues.tarif_rs.radiologi ?? "0"),
      laboratorium: String(formValues.tarif_rs.laboratorium ?? "0"),
      pelayanan_darah: String(formValues.tarif_rs.pelayanan_darah ?? "0"),
      rehabilitasi: String(formValues.tarif_rs.rehabilitasi ?? "0"),
      kamar: String(formValues.tarif_rs.kamar ?? "0"),
      rawat_intensif: String(formValues.tarif_rs.rawat_intensif ?? "0"),
      obat: String(formValues.tarif_rs.obat ?? "0"),
      obat_kronis: String(formValues.tarif_rs.obat_kronis ?? "0"),
      obat_kemoterapi: String(formValues.tarif_rs.obat_kemoterapi ?? "0"),
      alkes: String(formValues.tarif_rs.alkes ?? "0"),
      bmhp: String(formValues.tarif_rs.bmhp ?? "0"),
      sewa_alat: String(formValues.tarif_rs.sewa_alat ?? "0"),
    };

    const tglMasuk = formValues.tgl_masuk
      ? formatToApiDate(formValues.tgl_masuk)
      : undefined;
    const tglPulang = formValues.tgl_pulang
      ? formatToApiDate(formValues.tgl_pulang)
      : undefined;

    const formattedData: Partial<KlaimRalan> = {
      ...formValues,
      tarif_rs: formattedTarifRs,
      tgl_masuk: tglMasuk,
      tgl_pulang: tglPulang,
      payor_id: "3",
      tarif_poli_eks: String(kelasEksekutifCheck)
        ? String(formValues.tarif_poli_eks ?? 0)
        : "0",
    };

    const payload =
      pasien && pasien.kd_poli === "HDL"
        ? { data: { ...formattedData, dializer_single_use: "1" } }
        : { data: formattedData };

    try {
      const res = await axios.post(
        "http://192.168.20.4:3000/send/set-claim-data",
        payload
      );
      if(res.data.metadata.code === 200){
        toast.success("Klaim baru berhasil dibuat!", {
          position: "top-right",
          autoClose: 3000,
        });
        setPasien({
          ...pasien,
          claim_id: res.data.claim_id,
          status_claim: 1,
        });
        setTimeout(() => {
          setShowIDRG(true);
        }, 100);
      } else {
        toast.error(res.data.metadata.message);
      }
    } catch (err) {
      console.error("Set klaim error:", err);
      toast.error("Gagal set klaim!");
    }
  };
  useEffect(() => {
    if (pasien?.no_sep) {
      setValue("nomor_sep", pasien.no_sep);
    }
    if (pasien?.no_kartu) {
      setValue("nomor_kartu", pasien.no_kartu);
    }
    if (pasien?.tgl_registrasi) {
      setValue(
        "tgl_masuk",
        pasien.tgl_registrasi.replace("T", " ").slice(0, 16)
      );
      setValue(
        "tgl_pulang",
        pasien.tgl_registrasi.replace("T", " ").slice(0, 16)
      );
    }
    if (pasien?.tb === 1) {
      setNoSitbCheck(true);
    }
    if (pasien?.berat) {
      setValue("birth_weight", pasien.berat.toString());
    }
    if (pasien?.kelas) {
      setValue("kelas_rawat", pasien.kelas);
    }
    if (pasien?.dokter) {
      setValue("nama_dokter", pasien.dokter);
    }
    if(Number(pasien?.status_claim) >1){
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false)
    }
    if (pasien?.td) {
      const td = pasien?.td?.split("/");
      if (td.length === 2) {
        setValue("sistole", Number(td[0]));
        setValue("diastole", Number(td[1]));
      } else {
        setValue("sistole", 0);
        setValue("diastole", 0);
      }
    }
    // newClaim();
    if (Number(pasien?.status_claim)>0) {
      setShowIDRG(true);
    }
  }, [pasien, dokterList, setValue]);

  const getData = async () => {
    if (!no_rawat) return;
    const formattedNoRawat = no_rawat.replace(/-/g, "/");
    try {
      const res = await axios.get(
        `http://192.168.20.4:3000/grab/pasien/${formattedNoRawat}`
      );
      const apiData = res.data.data[0];

      setPasien({
        nm_pasien: apiData.nm_pasien,
        no_rkm_medis: apiData.no_rkm_medis,
        tgl_lahir: apiData.tgl_lahir,
        jk: apiData.jk,
        no_sep: apiData.no_sep,
        no_kartu: apiData.no_kartu,
        tgl_registrasi: apiData.tgl_registrasi,
        tb: apiData.tb,
        berat: apiData.berat,
        kelas: apiData.klsrawat,
        dokter: apiData.dokter,
        kd_poli: apiData.kd_poli,
        claim_id: apiData.claim_id,
        status_claim: apiData.status_claim,
        status: apiData.status,
        td: apiData.td,
      });

      const tarifApi: TarifRs = {
        prosedur_non_bedah: String(apiData.prosedur_non_bedah || 0),
        prosedur_bedah: String(apiData.prosedur_bedah || 0),
        konsultasi: String(apiData.konsultasi || 0),
        tenaga_ahli: String(apiData.tenaga_ahli || 0),
        keperawatan: String(apiData.keperawatan || 0),
        penunjang: String(apiData.penunjang || 0),
        radiologi: String(apiData.radiologi || 0),
        laboratorium: String(apiData.laboratorium || 0),
        pelayanan_darah: String(apiData.pelayanan_darah || 0),
        rehabilitasi: String(apiData.rehabilitasi || 0),
        kamar: String(apiData.kamar || 0),
        rawat_intensif: String(apiData.rawat_intensif || 0),
        obat: String(apiData.obat || 0),
        obat_kronis: String(apiData.obat_kronis || 0),
        obat_kemoterapi: String(apiData.obat_kemoterapi || 0),
        alkes: String(apiData.alkes || 0),
        bmhp: String(apiData.bmhp || 0),
        sewa_alat: String(apiData.sewa_alat || 0),
      };

      reset({ tarif_rs: tarifApi });

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (no_rawat) getData();
  }, [no_rawat]);

  const handleUpdatePasien = (dataBaru:Pasien):void => {
    setPasien(dataBaru); // update state di parent
  };

  const handleValidateSitb = async (nomorSitb: string) => {
    try {
      if (!nomorSitb) {
        toast.error("Nomor SITB tidak boleh kosong");
        return;
      }

      const res = await axios.post(
        "http://192.168.20.4:3000/send/sitb-validate",
        {
          data: { no_sitb: nomorSitb },
        }
      );

      const { response, validation } = res.data;

      if (response.status === "VALID" && validation.success) {
        toast.success(response.detail);
        setValue("ext.no_sitb", nomorSitb);
      } else {
        toast.error(response.detail || "Nomor SITB tidak valid");
      }
    } catch (err) {
      console.error("Error validasi SITB:", err);
      toast.error("Gagal validasi SITB");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-[95%] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-500 text-xl font-medium pt-1">
            Rawat Jalan
          </span>
          <FaChevronRight className="text-gray-400 text-sm mt-2" />
          <h1 className="text-xl font-bold text-gray-800 pt-1">Proses Klaim</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden mt-6">
            <div className="bg-sky-800 text-white px-6 py-3 font-bold">
              Data Pasien
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <>
                  <div className="flex border rounded overflow-hidden hover:bg-gray-50">
                    <span className="w-40 bg-green-500 font-bold p-2">
                      Nama Pasien
                    </span>
                    <span className="flex-1 pt-2 pl-2 font-semibold bg-gray-400">
                      {pasien?.nm_pasien}
                    </span>
                  </div>
                  <div className="flex border rounded overflow-hidden hover:bg-gray-50">
                    <span className="w-40 bg-green-500 font-bold p-2">
                      No. RM
                    </span>
                    <span className="flex-1 pt-2 pl-2 font-semibold bg-gray-400">
                      {pasien?.no_rkm_medis}
                    </span>
                  </div>
                  <div className="flex border rounded overflow-hidden hover:bg-gray-50">
                    <span className="w-40 bg-green-500 font-bold p-2">
                      Tanggal Lahir
                    </span>
                    <span className="flex-1 pt-2 pl-2 font-semibold bg-gray-400">
                      {pasien?.tgl_lahir
                        ? new Date(pasien.tgl_lahir).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </span>
                  </div>

                  <div className="flex border rounded overflow-hidden hover:bg-gray-50">
                    <span className="w-40 bg-green-500 font-bold p-2">
                      Jenis Kelamin
                    </span>
                    <span className="flex-1 pt-2 pl-2 font-semibold bg-gray-400">
                      {pasien?.jk}
                    </span>
                  </div>
                </>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">
                    Jaminan / Cara Bayar
                  </label>
                  {errors.payor_cd && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.payor_cd.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    {...register("payor_cd")}
                    className="p-2 border rounded-md border-black bg-white"
                  >
                    <option disabled>Pilih Rekanan</option>
                    <option value="JKN">JKN</option>
                    <option value="JAMINAN_COVID19">JAMINAN COVID 19</option>
                    <option value="JAMINAN_KIPI">JAMINAN KIPI</option>
                    <option value="JAMINAN_BBL">JAMINAN BAYI BARU LAHIR</option>
                    <option value="JAMINAN_PERPANJANG">
                      JAMINAN PERPANJANG MASA RAWAT
                    </option>
                    <option value="JAMINAN_COINSIDENSE">
                      JAMINAN CO-INSIDENSE
                    </option>
                    <option value="JAMPERSAL_JAMKESDA">
                      JAMPERSAL JAMKESDA
                    </option>
                    <option value="PASIEN_BAYAR">PASIEN BAYAR</option>
                  </select>
                </div>
                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">No SEP</label>
                  {errors.nomor_sep && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.nomor_sep.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    {...register("nomor_sep")}
                    className="p-2 border rounded-md border-black"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Nomor Kartu</label>
                  {errors.nomor_kartu && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.nomor_kartu.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    {...register("nomor_kartu")}
                    className="p-2 border rounded-md border-black"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">COB</label>
                  {errors.cob_cd && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.cob_cd.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    value="-"
                    {...register("cob_cd")}
                    className="p-2 border rounded-md border-black"
                    min={0}
                  />
                </div>

                <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">Tanggal Masuk</label>
                  {errors.tgl_masuk && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.tgl_masuk.message}
                    </p>
                  )}
                  <div className="flex items-center">
                    <input
                      disabled={isSubmitted}
                      type="datetime-local"
                      {...register("tgl_masuk")}
                      className="p-2 border rounded-md border-black flex-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">Tanggal Pulang</label>
                  {errors.tgl_pulang && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.tgl_pulang.message}
                    </p>
                  )}
                  <div className="flex items-center">
                    <input
                      disabled={isSubmitted}
                      type="datetime-local"
                      {...register("tgl_pulang")}
                      className="p-2 border rounded-md border-black flex-1"
                    />
                  </div>
                </div>

                

                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Cara Masuk</label>
                  {errors.cara_masuk && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.cara_masuk.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    {...register("cara_masuk")}
                    className="p-2 border rounded-md border-black"
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    <option value="gp">Rujukan FKTP</option>
                    <option value="hosp-trans">Rujukan FKRTL</option>
                    <option value="mp">Rujukan Spesialis</option>
                    <option value="outp">Dari Rawat Jalan</option>
                    <option value="inp">Dari Rawat Inap</option>
                    <option value="emd">Dari Rawat Darurat</option>
                    <option value="born">Lahir di RS</option>
                    <option value="nursing">Rujukan Panti Jompo</option>
                    <option value="psych">Rujukan dari RS Jiwa</option>
                    <option value="rehab">Rujukan Fasilitas Rehab</option>
                    <option value="other">Lain-lain</option>
                  </select>
                </div>
                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Cara Pulang</label>
                  {errors.cara_pulang && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.cara_pulang.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    {...register("cara_pulang")}
                    className="p-2 border rounded-md border-black"
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    <option value="1">Atas Persetujuan Dokter</option>
                    <option value="2">Dirujukan</option>
                    <option value="3">Atas Permintaan Sendiri</option>
                    <option value="4">Meninggal</option>
                    <option value="5">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Umur</label>
                  <input
                    disabled={isSubmitted}
                    type="text"
                    className="p-2 border rounded-md border-black"
                    value={umur ? `${umur} tahun` : ""}
                    readOnly
                  />
                </div>

                <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">Jenis Tarif</label>
                  {errors.kode_tarif && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.kode_tarif.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    {...register("kode_tarif")}
                    className="p-2 border rounded-md border-black"
                  >
                    <option value="" disabled>
                      Pilih Jenis Rawat
                    </option>
                    <option value="AP">TARIF RS KELAS C SWASTA</option>
                    <option value="D">TARIF RS KELAS D SWASTA</option>
                  </select>
                </div>

                <div className="flex flex-col relative w-full max-w-md">
                  <label className="font-medium mb-1 text-black">
                    Dokter DPJP
                  </label>

                  {errors.nama_dokter && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.nama_dokter.message}
                    </p>
                  )}

                  <select
                    disabled={isSubmitted}
                    {...register("nama_dokter", {
                      required: "Pilih dokter dulu!",
                    })}
                    defaultValue=""
                    className="
                  p-2 border border-black rounded-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  transition
                  duration-150
                  text-gray-700
                "
                  >
                    <option value="" disabled>
                      Pilih Dokter
                    </option>
                    {Array.isArray(dokterList) &&
                      dokterList.map((d, idx) => (
                        <option key={idx} value={d.nama}>
                          {d.nama}
                        </option>
                      ))}
                  </select>
                </div>
                  <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">Jenis Tarif</label>
                  {errors.kd_poli && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.kd_poli.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    {...register("kd_poli", {
                      required: "Pilih kelas terlebih dahulu",
                    })}
                    className="mt-1 p-2 border rounded-md border-black bg-white"
                  >
                    <option disabled>
                    Kode Poli
                    </option>
                    <option value="1">Rawat Inap</option>
                    <option value="2">Rawat Jalan</option>
                    <option value="3">Rawat Igd</option>
                  </select>
                </div>
                <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">LOS</label>
                  <input
                    disabled={isSubmitted}
                    type="number"
                    {...register("icu_los")}
                    readOnly
                    className="p-2 border rounded-md border-black bg-gray-100 "
                  />
                </div>
                <div className="flex flex-col relative">
                  <label className="font-medium">Hak Kelas</label>
                  {errors.kelas_rawat && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.kelas_rawat.message}
                    </p>
                  )}

                  <input
                    disabled={isSubmitted}
                    type="text"
                    value="-"
                    readOnly
                    {...register("kelas_rawat")}
                    className="mt-1 p-2 border rounded-md border-black bg-gray-100 text-gray-600"
                  />
                </div>
                 <div className="flex flex-col col-span-1 relative">
                  <label className="font-medium mb-1">Jenis Tarif</label>
                  {errors.jenis_rawat && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.jenis_rawat.message}
                    </p>
                  )}
                  <select
                    disabled={isSubmitted}
                    defaultValue={"2"}
                    {...register("jenis_rawat", {
                      required: "Pilih kelas terlebih dahulu",
                    })}
                    className="mt-1 p-2 border rounded-md border-black bg-white"
                  >
                    <option disabled>
                    Jenis Rawat
                    </option>
                    <option value="1">Rawat Inap</option>
                    <option value="2">Rawat Jalan</option>
                    <option value="3">Rawat Igd</option>
                  </select>
                </div>

                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Sub Acute</label>

                  {errors.adl_sub_acute && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.adl_sub_acute.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    value="-"
                    readOnly
                    {...register("adl_sub_acute")}
                    className="p-2 border rounded-md border-black"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Chronic</label>
                  {errors.adl_chronic && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.adl_chronic.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    value="-"
                    {...register("adl_chronic")}
                    className="p-2 border rounded-md border-black"
                  />
                </div>
                <div className="flex flex-col relative">
                  <label className="font-medium mb-1">Berat Lahir (gram)</label>
                  {errors.birth_weight && (
                    <p className="text-red-500 text-sm absolute top-0 right-0">
                      {errors.birth_weight.message}
                    </p>
                  )}
                  <input
                    disabled={isSubmitted}
                    type="text"
                    value="-"
                    {...register("birth_weight")}
                    className="p-2 border rounded-md border-black"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1 relative">
                    <label className="font-medium mb-1">Sistole</label>
                    <input
                      disabled={isSubmitted}
                      type="number"
                      placeholder="Sistole"
                      {...register("sistole", { valueAsNumber: true })}
                      className="w-full p-2 border rounded-md border-black"
                    />
                    {errors.sistole && (
                      <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                        {errors.sistole.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 relative">
                    <label className="font-medium mb-1">Diastole</label>
                    <input
                      disabled={isSubmitted}
                      type="number"
                      placeholder="Diastole"
                      {...register("diastole", { valueAsNumber: true })}
                      className="w-full p-2 border rounded-md border-black"
                    />
                    {errors.diastole && (
                      <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                        {errors.diastole.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      disabled={isSubmitted}
                      type="hidden"
                      {...register("ext.no_sitb")}
                    />

                    <input
                      disabled={isSubmitted}
                      type="checkbox"
                      checked={noSitbCheck}
                      onChange={(e) => setNoSitbCheck(e.target.checked)}
                    />
                  </label>
                  <span className="font-medium w-32">Pasien TB</span>

                  {noSitbCheck && (
                    <div className="flex items-center w-1/3 gap-2 ml-8">
                      <input
                        disabled={isSubmitted}
                        type="text"
                        {...register("ext.no_sitb", {
                          required: noSitbCheck ? "No SITB wajib diisi" : false,
                        })}
                        className="p-1 border rounded-md border-black w-1/2 h-8"
                        placeholder="No Registrasi SITB"
                      />
                      <button
                        onClick={() =>
                          handleValidateSitb(watch("ext.no_sitb") || "")
                        }
                        type="button"
                        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      >
                        Validasi
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1">
                      <input
                        disabled={isSubmitted}
                        type="checkbox"
                        checked={kelasEksekutifCheck}
                        onChange={(e) =>
                          setKelasEksekutifCheck(e.target.checked)
                        }
                      />
                    </label>
                    <span className="font-medium w-40">Kelas Eksekutif</span>

                    {kelasEksekutifCheck && (
                      <div className="flex items-center w-1/2 gap-2">
                        <input
                          disabled={isSubmitted}
                          type="number"
                          {...register("tarif_poli_eks", {
                            valueAsNumber: true,
                          })}
                          className="p-1 border rounded-md border-black w-1/3 h-8"
                          placeholder="Tarif Poli Eks"
                        />
                        <span className="text-lg font-semibold ml-4">
                          {formatRupiah(Number(tarifPoliEks))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden mt-6">
            <div className="bg-sky-800 text-white px-6 py-3 font-bold flex justify-between items-center">
              <span>Tarif Rumah Sakit</span>
              <span className="text-white text-lg">
                Rp. {totalTarif.toLocaleString()}
              </span>
            </div>

            <div className="p-6 grid grid-cols-4 gap-4">
              {Object.keys(watch("tarif_rs")).map((key) => {
                const keyStr = key as keyof TarifRs;
                const label = keyStr
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                return (
                  <div key={keyStr} className="flex flex-col relative">
                    <label className="font-medium mb-1">{label}</label>
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black bg-gray">
                        Rp
                      </span>
                      <Controller
                        name={`tarif_rs.${keyStr}`}
                        control={control}
                        render={({ field }) => (
                          <input
                            disabled={isSubmitted}
                            type="text"
                            {...field}
                            value={Number(field.value || 0).toLocaleString(
                              "id-ID"
                            )}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              field.onChange(raw);
                            }}
                            className="p-2 border rounded-md border-black pl-10 w-full"
                          />
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pl-6 pb-4">
              <input
                disabled={isSubmitted}
                type="checkbox"
                id="confirmTarif"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="confirmTarif" className="text-gray-700">
                Menyatakan benar bahwa data tarif yg tersebut di atas adalah
                benar sesuai dengan kondisi yang sesungguhnya
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={
                "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition transform duration-150 shadow-md" +
                (isSubmitted ? " opacity-50 cursor-not-allowed" : "")
              }
            >
              Submit
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      {showIDRG && pasien && <IDRG pasien={pasien} onChangePasien={handleUpdatePasien}/>}
    </div>
  );
};

export default KlaimRalanPage;
