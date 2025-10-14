import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Pasien } from "./KlaimRanap";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface Option {
  value: string;
  display: string;
  label: string;
  valueInput?: number;
  code?:string;
  code2?: string;
  system?: string;
  validcode?: number;
  isDisabled?: boolean;
}

interface Metadata {
  code: string;
  error_no?: string;
  message: string;
}

interface ICD10Item extends Option {
  valueInput: number;
  metadata?: Metadata;
}

interface ICD9Item extends Option {
  valueInput: number;
  count: number;
  metadata?: Metadata;
}

interface InacbgProps {
  pasien: Pasien;
  onChangePasien: (pasien: Pasien) => void;
}

interface InacbgField {
  label: string;
  code: string;
  nominal: string;
}

interface ICDItem {
  code: string;
  description: string;
  code2?: string;
  system?: string;
  validcode: number | string;
}
interface Cbg {
  code: string;
  description: string;
}
interface SubAcuteChronic {
  code: string;
  description: string;
  tariff: number;
}

interface GroupingResultInacbg {
  info: string;
  cbg: Cbg;
  base_tariff: string;
  tariff: string;
  kelas: string;
  inacbg_version: string;
  special_cmg?: SpecialCmg[];
  sub_acute?: SubAcuteChronic;
  chronic?: SubAcuteChronic;
}

interface SpecialCmg {
  code: string;
  description: string;
  tariff?: number;
  type: string;
}

const fetchICD = (type: "9" | "10") => {
  return async (inputValue: string): Promise<Option[]> => {
    if (!inputValue) return [];

    try {
      const res = await axios.get<{ data: ICDItem[] }>(
        `http://192.168.20.4:3000/grab/icd/${type}/inacbg`,
        { params: { keyword: inputValue } }
      );

      return res.data.data.map(
        (item: ICDItem): Option => ({
          value: item.code,
          label: `${item.code} - ${item.description}`,
          display: `${item.code} - ${item.description}`,
          code2: item.code2,
          system: item.system,
          validcode: Number(item.validcode),
          isDisabled: Number(item.validcode) === 0,
        })
      );
    } catch (err) {
      console.error(`Error fetching ICD${type}:`, err);
      return [];
    }
  };
};

const getPdf = async (no_sep:string) => {
  const getUrl = await axios.get(`http://192.168.20.114:3000/grab/berkas/${no_sep}`)
  if(getUrl.data.url){
    window.open(getUrl.data.url,'_blank', 'noopener,noreferrer')
  }else{
    toast.error("Berkas klaim tidak ada!");
  }
}

const InacbgPage: React.FC<InacbgProps> = ({ pasien, onChangePasien }) => {
  const loadOptionsICD9 = fetchICD("9");
  const loadOptionsICD10 = fetchICD("10");
  const [selectedICD10Inacbg, setSelectedICD10Inacbg] = useState<ICD10Item[]>(
    []
  );
  const [selectedICD9Inacbg, setSelectedICD9Inacbg] = useState<ICD9Item[]>([]);
  const [specialCmgOptions, setSpecialCmgOptions] = useState<SpecialCmg[]>([]);
  const [specialCmg, setSpecialCmg] = useState<SpecialCmg[]>([]);
  const [pasienDatas, setPasienData] = useState<any>(null);
  // const [groupingResultInacbg, setGroupingResultInacbg] =
  //   useState<GroupingResultInacbg | null>(null);
  const [errors, setErrors] = useState<{ icd10?: string; icd9?: string }>({});
  const ref = useAutoScroll();


  const optionsDrug: InacbgField[] = [];
  const [groupingResultInacbg, setGroupingResultInacbg] = useState<GroupingResultInacbg>();

  const dataPrint = async () => {
    const res = await axios.get(
      `http://192.168.20.4:3000/grab/claimed/${pasien.claim_id}`
    );
    const mergedData = {
      ...pasien,
      ...res.data,
    };
    setPasienData(mergedData)
  };
  const getInacbg = async () => {
    const res = await axios.get(`http://192.168.20.4:3000/grab/inacbg/${pasien.claim_id}`)
    setGroupingResultInacbg(res.data.grouping_inacbg)
    setSelectedICD10Inacbg(res.data.diagnosa_inacbg.map(item=>{
      item.label=item.code + '-' + item.display
      item.value=item.code
      return item
    }))
    setSelectedICD9Inacbg(res.data.prosedur_inacbg.map(item=>{
      item.label = item.code + '-' + item.display
      item.value=item.code
      return item
    }))
    setSpecialCmgOptions(res.data.special_cmg_option)
  }
  useEffect(() => {
    if (pasien) {
      if(Number(pasien.status_claim)>3&&!groupingResultInacbg){
        getInacbg()
      }
    }
  }, [pasien]);

  const importInacbg = async () => {
    const payload = {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
    };
    const inacbg = await axios.post(
      "http://192.168.20.4:3000/send/idrg-to-inacbg-import",
      payload
    );
    setSelectedICD10Inacbg(
      inacbg.data.data.diagnosa.expanded.map((d: ICD10Item) => ({
        ...d,
        value: d.code,
        label: `${d.code} - ${d.display}`,
      }))
    );
    setSelectedICD9Inacbg(
      inacbg.data.data.procedure.expanded.map((d: ICD9Item) => ({
        ...d,
        value: d.code,
        label: `${d.code} - ${d.display}`,
      }))
    );
  };

  const handleGroupingInacbg = async () => {
    const newErrors: { icd10?: string; icd9?: string } = {};

    if (selectedICD10Inacbg.length === 0) {
      newErrors.icd10 = "Minimal pilih 1 diagnosis ICD-10!";
    }

    if (selectedICD9Inacbg.length === 0) {
      newErrors.icd9 = "Minimal pilih 1 prosedur ICD-9!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    toast.success("Fetching berhasil dikirim!", {
      position: "top-right",
      autoClose: 3000,
    });
    onChangePasien({...pasien, status_claim:4})

    // --- Payload ICD-10 ---
    const payloadICD10 = selectedICD10Inacbg.map((d, idx) => ({
      code: d.value,
      display: d.display,
      no: idx + 1,
      validcode: Number(d.validcode),
    }));

    // --- Payload ICD-9 ---
    const payloadICD9 = selectedICD9Inacbg.map((d, idx) => ({
      code: d.value,
      display: d.display,
      no: idx + 1,
      validcode: Number(d.validcode),
    }));

    // --- Gabung jadi payload API ---
    const payloadAPI = {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
      diagnosa: payloadICD10,
      procedure: payloadICD9,
    };

    try {
      const res = await fetch(
        "http://192.168.20.4:3000/send/grouping-inacbg-stage-1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadAPI),
        }
      );
      const result = await res.json();
     setGroupingResultInacbg({
        info: result.info,
        ...result.response_inacbg,
        special_cmg: result.special_cmg || [],
      });

      if (result.special_cmg_option && Array.isArray(result.special_cmg_option)) {
        setSpecialCmgOptions(result.special_cmg_option);
      }

    } catch (err) {
      console.error("Error grouping:", err);
    }
  };
   useEffect(() => {
    if (specialCmg.length > 0 && groupingResultInacbg) {
      const newGroup:GroupingResultInacbg = {
        ...groupingResultInacbg,
        special_cmg: specialCmg,
      }
      setGroupingResultInacbg(newGroup);
    }
  }, [specialCmg]);

  const getGroupingStage2 = async () => {
    const payload = {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
      special_cmg: specialCmg,
    };
    try {
      const res = await axios.post(
        `http://192.168.20.4:3000/send/grouping-inacbg-stage-2`,
        payload
      );
      if (res.data?.metadata?.code === 200) {
        setGroupingResultInacbg({
          info: groupingResultInacbg?.info,
          ...res.data.response_inacbg,
        });
      }
    } catch (err) {
      console.error("Error grouping stage 2:", err);
    }
  };
  useEffect(() => {
    const uniqueTypes = new Set(specialCmgOptions.map((item) => item.type));
    const uniqueTypeCount = uniqueTypes.size;
    if (specialCmgOptions.length > 0 && uniqueTypeCount <= specialCmg.length) {
      getGroupingStage2();
    }
  }, [specialCmg]);

  const handleFinalInacbg = async () => {
    const res = await axios.post("http://192.168.20.4:3000/send/final-inacbg", {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
    });
    if (res.data?.metadata?.code === 200) {
      toast.success("Finalisasi INACBG berhasil ", { autoClose: 3000 });
      onChangePasien({...pasien,status_claim:5})
    } else {
      toast.error(res.data?.metadata?.message || "Finalisasi gagal ", {
        autoClose: 3000,
      });
    }
  };
  
  const handleDelete = <T extends { value: string }>(
    idx: number,
    selectedState: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const updated = [...selectedState];
    updated.splice(idx, 1);
    setter(updated);
  };

  const handleEditInacbg = async() => {
    await fetch("http://192.168.20.4:3000/send/re-edit-inacbg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim_id:pasien.claim_id, nomor_sep: pasien.no_sep }),
        });
    onChangePasien({...pasien, status_claim:3})
  };

  const handleFinalKlaim = async () => {
    const res = await axios.post("http://192.168.20.4:3000/send/claim-final", {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
    });
    if(res.data.metadata.code!==200){
      toast.error(res.data.metadata.message, {
        position: "top-right",
        autoClose: 3000,})
    }
    onChangePasien({ ...pasien, status_claim: 6 })
    toast.success("Final klaim berhasil!", {
      position: "top-right",
      autoClose: 3000,
    });
    // dataPrint();
    onChangePasien({...pasien,status_claim:6})
  };
  const handleKirim = async () => {
    await axios.post("http://192.168.20.4:3000/send/claim-send", {
      claim_id: pasien.claim_id,
      nomor_sep: pasien?.no_sep,
    });
    onChangePasien({ ...pasien, status_claim: 7 })

    toast.success("Final klaim berhasil!", {
      position: "top-right",
      autoClose: 3000,
    });
    dataPrint();
  };

  const handleReEditUlangKlaim = async() => {
    await axios.post(
      "http://192.168.20.4:3000/send/claim-re-edit",
      { claim_id: pasien?.claim_id, nomor_sep: pasien?.no_sep }
    );
    onChangePasien({ ...pasien, status_claim: 5 })
  };

 

  const handleEditInacbgFinal =  async () => {
    await axios.post(
        "http://192.168.20.4:3000/send/re-edit-inacbg",
        {claim_id:pasien?.claim_id, nomor_sep:pasien?.no_sep}
      );
      onChangePasien({...pasien,status_claim:4})
  };

  return (
    <div ref={ref} className="min-h-screen p-6 space-y-6">
      <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center font-bold text-xl mb-6">
          <h2>INACBG</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2 text-gray-700 text-lg">
              Diagnosis (ICD-10 INACBG)
            </h2>
            {errors.icd10 && (
              <p className="text-red-500 text-sm mt-1">{errors.icd10}</p>
            )}
            <AsyncSelect<Option>
              cacheOptions
              defaultOptions
              value={null}
              loadOptions={loadOptionsICD10}
              placeholder="Cari diagnosis..."
              formatOptionLabel={(option) => (
                 <div
                  className={`flex flex-col p-2 rounded ${
                    option.validcode === 0
                      ? "bg-red-300 text-black"
                      : option.system === "N"
                      ? "bg-orange-100"
                      : ""
                  }`}
                >
                  <span>{option.label}</span>
                  {option.validcode === 0 && (
                    <span className="text-xs text-red-500">
                      Tidak valid untuk prosedur
                    </span>
                  )}
                </div>
              )}
              isOptionDisabled={(option) => !!option.isDisabled}
              onChange={(val) => {
                if (!val) return;

                const alreadyExist = selectedICD10Inacbg.some(
                  (item) => item.value === val.value
                );
                if (!alreadyExist) {
                  setSelectedICD10Inacbg([
                    ...selectedICD10Inacbg,
                    { ...val, valueInput: 0 },
                  ]);
                }
              }}
              className="mb-4"
            />

            <div className="space-y-2">
              {selectedICD10Inacbg.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 border p-2 rounded-md"
                >
                  <span className="font-semibold text-sm w-20">
                    {idx === 0 ? "Primary" : "Secondary"}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.metadata && item.metadata.code !== "200" && (
                    <>
                      <br />
                      <span className="text-xs text-orange-500 mr-2">
                        {item.metadata.message}
                      </span>
                    </>
                  )}
                  {/* {(!item.metadata||(item.metadata&&item?.metadata.code!=="200"))&&(<button
                    onClick={() =>
                      handleDelete(
                        idx,
                        selectedICD10Inacbg,
                        setSelectedICD10Inacbg
                      )
                    }
                    className={`p-2 ${
                      isInacbgGrouped
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    }`}
                    disabled={isInacbgGrouped}
                  >
                    <FaTrash />
                  </button>
                  )} */}
                  <button
                    onClick={() =>
                      handleDelete(
                        idx,
                        selectedICD10Inacbg,
                        setSelectedICD10Inacbg
                      )
                    }
                    className={`p-2 ${
                      Number(pasien.status_claim) > 3
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    }`}
                    disabled={Number(pasien.status_claim) > 3}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-2 text-gray-700 text-lg">
              Prosedur (ICD-9 INACBG)
            </h2>
            {/* <div>sep : {pasien.no_sep}</div> */}
            {errors.icd9 && (
              <p className="text-red-500 text-sm mt-1">{errors.icd9}</p>
            )}

            <AsyncSelect<Option>
              cacheOptions
              defaultOptions
              value={null}
              loadOptions={loadOptionsICD9}
              placeholder="Cari Prosedur..."
              formatOptionLabel={(option) => (
                <div
                  className={`flex flex-col p-2 rounded ${
                    option.validcode === 0
                      ? "bg-red-300 text-black"
                      : option.system === "N"
                      ? "bg-orange-100"
                      : ""
                  }`}
                >
                  <span>{option.label}</span>
                  {option.validcode === 0 && (
                    <span className="text-xs text-red-500">
                      Tidak valid untuk prosedur
                    </span>
                  )}
                </div>
              )}
              isOptionDisabled={(option) => !!option.isDisabled}
              onChange={(val) => {
                if (!val) return;

                setSelectedICD9Inacbg((prev) => {
                  const newList = [
                    ...prev,
                    { ...val, valueInput: 0, count: 1 },
                  ];

                  const counts: Record<string, number> = {};
                  newList.forEach((item) => {
                    counts[item.value] = (counts[item.value] || 0) + 1;
                  });

                  return newList.map((item) => ({
                    ...item,
                    count: counts[item.value],
                  }));
                });
              }}
              className="mb-4"
            />

            <div className="space-y-2">
              {selectedICD9Inacbg.map((item, idx) => (
                <div
                  key={`${item.value}-${idx}`}
                  className="relative flex items-center justify-between gap-3 border p-2 rounded-md"
                >
                  <span className="font-semibold text-sm w-20">
                    {idx === 0 ? "Primary" : "Secondary"}
                  </span>

                  <div className="flex-1 relative">
                    <div className="inline-block bg-gray-200 px-2 py-1 rounded relative">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.metadata && item.metadata.code !== "200" && (
                        <>
                          <br />
                          <span className="text-xs text-orange-500 mr-2">
                            {item.metadata.message}
                          </span>
                        </>
                      )}
                      {item.count > 1 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                          x{item.count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* {(!item.metadata||(item.metadata&&item?.metadata.code!=="200"))&&(<button
                    onClick={() =>
                      handleDelete(
                        idx,
                        selectedICD9Inacbg,
                        setSelectedICD9Inacbg
                      )
                    }
                    className={`p-2 ${
                      isInacbgGrouped
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    }`}
                    disabled={isInacbgGrouped}
                  >
                    <FaTrash />
                  </button>)} */}
                  <button
                    onClick={() =>
                      handleDelete(
                        idx,
                        selectedICD9Inacbg,
                        setSelectedICD9Inacbg
                      )
                    }
                    className={`p-2 ${
                      Number(pasien.status_claim) > 3
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    }`}
                    disabled={Number(pasien.status_claim) > 3}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
        <div className="flex justify-end mt-6 mr-4 space-x-3">
          {Number(pasien.status_claim) === 3 && (
            <button
              className={`px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg transition hover:bg-yellow-700 ${
                Number(pasien.status_claim) > 3 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={Number(pasien.status_claim) > 3}
              onClick={importInacbg}
            >
              Import INACBG
            </button>
          )}

          {Number(pasien.status_claim) === 3 ? (
            <button
              onClick={handleGroupingInacbg}
              className={`px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg transition hover:bg-sky-600 ${
                Number(pasien.status_claim) > 3 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={Number(pasien.status_claim) > 3}
            >
              Grouping INACBG
            </button>
          ) : (
            <button
              onClick={handleEditInacbg}
                disabled={Number(pasien.status_claim) > 4} 
              className={`px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg transition hover:bg-blue-600 ${
                Number(pasien.status_claim) > 4 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Edit INACBG
            </button>
          )}
        </div>
      </div>

      {Number(pasien.status_claim) >3 && groupingResultInacbg && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
          <h2 className="font-bold text-lg mb-4 text-center">
            Hasil Grouping INACBG
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 w-48 border-r">
                  Info
                </td>
                <td className="p-2">{groupingResultInacbg.info}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Jenis Rawat
                </td>
                <td className="p-2">
                  {pasien.status}{" "}
                  {groupingResultInacbg.kelas
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase()) || ""}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r w-1/6">
                  Group
                </td>
                <td className="p-2 border-r w-3/6">
                  {groupingResultInacbg.cbg?.description}
                </td>
                <td className="p-2 border-r w-1/6">
                  {groupingResultInacbg.cbg?.code}
                </td>
                <td className="p-2 border-r text-center w-2/6">
                  {(
                    Number(groupingResultInacbg.base_tariff) || 0
                  ).toLocaleString("id-ID")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Sub Acute
                </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.sub_acute?.description || "-"}
                </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.sub_acute?.code || "-"}
                </td>
                <td className="p-2 border-r text-center">
                  {groupingResultInacbg.sub_acute?.tariff || "0"}
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Chronic
                </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.chronic?.description || "-"}
                </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.chronic?.code || "-"}
                </td>
                {/* <td className="p-2 border-r text-center">
                  {groupingResultInacbg.chronic?.tariff || "0"}
                </td> */}
                <td className="p-2 border-r text-center w-2/6">
                  {(
                    Number(groupingResultInacbg.chronic?.tariff) || 0
                  ).toLocaleString("id-ID")}
                </td>
              </tr>

              {/* Spesial Procedure */}
              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Spesial Procedure
                </td>

                 <td className="p-2 border-r">
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                const selected = specialCmgOptions.find(
                                  (opt) => opt.code === e.target.value
                                );
                                if (selected) {
                                  const updated = [
                                    ...specialCmg.filter(
                                      (item) => item.type !== "Special Procedure"
                                    ),
                                    selected,
                                  ];
                                  setSpecialCmg(updated);

                                }
                              }}
                              className="border rounded-md p-2 w-full"
                              disabled={
                                specialCmgOptions.filter(
                                  (item) => item.type === "Special Procedure"
                                ).length === 0
                              }
                            >
                <option value="">None</option>
                {specialCmgOptions
                  .filter((item) => item.type === "Special Procedure")
                  .map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.description}
                    </option>
                  ))}
              </select>
            </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.special_cmg?.find(
                    (item) => item.type === "Special Procedure"
                  )?.code || "-"}
                </td>
                <td className="p-2 border-r text-center">
                  {Number(
                    groupingResultInacbg.special_cmg?.find(
                      (item) => item.type === "Special Procedure"
                    )?.tariff || 0
                  ).toLocaleString("id-ID")}
                </td>
                {/* <td className="p-2 border-r text-center">
              {(
                tempTariff ??
                Number(
                  groupingResultInacbg.special_cmg?.find(
                    (item) => item.type === "Special Procedure"
                  )?.tariff || 0
                )
              ).toLocaleString("id-ID")}
            </td> */}
              </tr>

              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Spesial Prosthesis
                </td>
                <td className="p-2 border-r">
                  <select
                    // defaultValue={groupingResultInacbg.special_cmg ? groupingResultInacbg.special_cmg?.find(item=>item.type==="Spesial Prosthesis")?.code : specialCmgOptions.find(item=>item.type==="Spesial Prosthesis")?.code || ""}
                    defaultValue={""}
                    onChange={(e) => {
                      const selected = specialCmgOptions.find(
                        (opt) => opt.code === e.target.value
                      );
                      
                      if (selected) {
                        setSpecialCmg([
                          ...specialCmg.filter(
                            (item) => item.type !== "Special Prosthesis"
                          ),
                          selected,
                        ]);
                      }
                    }}
                    className="border rounded-md p-2 w-full"
                    disabled={
                      specialCmgOptions.filter(
                        (item) => item.type === "Special Prosthesis"
                      ).length === 0
                    }
                  >
                    <option value="">None</option>
                    {specialCmgOptions
                      .filter((item) => item.type === "Special Prosthesis")
                      .map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.description}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="p-2 border-r">
                  {groupingResultInacbg.special_cmg?.find(
                    (item) => item.type === "Special Prosthesis"
                  )?.code || "-"}
                </td>
                {/* <td className="p-2 border-r text-center">
                  {groupingResultInacbg.special_cmg?.find(
                    (item) => item.type === "Spesial Prosthesis"
                  )?.tariff || "0"}
                </td> */}
                <td className="p-2 border-r text-center">
                  {Number(
                    groupingResultInacbg.special_cmg?.find(
                      (item) => item.type === "Special Prosthesis"
                    )?.tariff || 0
                  ).toLocaleString("id-ID")}
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Spesial Investigation
                </td>
                <td className="p-2 border-r">
                  <select
                    defaultValue={""}
                    // defaultValue={
                    //   groupingResultInacbg.special_cmg ? groupingResultInacbg.special_cmg?.find(item=>item.type==="Spesial Investigation")?.code : specialCmgOptions.find(item=>item.type==="Spesial Investigation")?.code || ""
                    // }
                    onChange={(e) => {
                      const selected = specialCmgOptions.find(
                        (opt) => {
                          return opt.code === e.target.value}
                        );
                      if (selected) {
                        setSpecialCmg([
                          ...specialCmg.filter(
                            (item) => item.type !== "Special Investigation"
                          ),
                          selected,
                        ]);
                      }
                    }}
                    className="border rounded-md p-2 w-full"
                    disabled={
                      specialCmgOptions.filter(
                        (item) => item.type === "Special Investigation"
                      ).length === 0
                    }
                  >
                    <option value="">None</option>
                    {specialCmgOptions
                      .filter((item) => item.type === "Special Investigation")
                      .map((opt) => (
                        <option key={opt.code} value={opt.code}>
                          {opt.description}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="p-2 border-r">
                  {specialCmg.find(
                    (item) => item.type === "Special Investigation"
                  )?.code || "-"}
                </td>
                {/* <td className="p-2 border-r text-center">
                  {specialCmg.find(
                    (item) => item.type === "Spesial Investigation"
                  )?.tariff || "0"}
                </td> */}
                <td className="p-2 border-r text-center">
                  {Number(
                    specialCmg.find(
                      (item) => item.type === "Spesial Investigation"
                    )?.tariff || 0
                  ).toLocaleString("id-ID")}
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Spesial Drug
                </td>
                <td className="p-2 border-r">
                  <select
                    defaultValue={""}
                    // defaultValue={groupingResultInacbg.special_cmg ? groupingResultInacbg.special_cmg?.find(item=>item.type==="Spesial Drug")?.code : specialCmgOptions.find(item=>item.type==="Spesial Drug")?.code || ""}
                    onChange={(e) => {
                      const selected = specialCmgOptions.find(
                        (opt) => opt.code === e.target.value
                      );
                      if (selected) {
                        setSpecialCmg([
                          ...specialCmg.filter(
                            (item) => item.type !== "Special Drug"
                          ),
                          selected,
                        ]);
                      }
                    }}
                    className="border rounded-md p-2 w-full"
                    disabled={
                      specialCmgOptions.filter(
                        (item) => item.type === "Special Drug"
                      ).length === 0
                    }
                  >
                    <option value="">None</option>
                    {optionsDrug.map((opt) => (
                      <option key={opt.code} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border-r">
                  {specialCmg.find((item) => item.type === "Special Drug")
                    ?.code || "-"}
                </td>
                <td className="p-2 border-r text-center">
                  {Number(
                    specialCmg.find((item) => item.type === "Special Drug")
                      ?.tariff || 0
                  ).toLocaleString("id-ID")}
                </td>
              </tr>

              <tr className="border-b">
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Total Klaim
                </td>
                <td className="p-2"></td>
                <td className="p-2 text-end font-bold"></td>
             <td className="p-2 center font-bold text-center">
              {groupingResultInacbg?.tariff
                ? Number(groupingResultInacbg.tariff).toLocaleString("id-ID")
                : "0"}
            </td>
              </tr>
              {/* <tr>
                <td className="p-2 font-semibold bg-gray-50 border-r">
                  Status
                </td>
                <td
                  className={`p-3 font-bold ${
                    groupingResultInacbg.status === "Valid"
                      ? "text-green-600"
                      : groupingResultInacbg.status === "Error"
                      ? "text-red-600"
                      : "text-gray-800"
                  }`}
                >
                  {groupingResultInacbg.status}
                </td>
              </tr> */}
            </tbody>
          </table>
          {/* <div className="w-full flex justify-end mb-4 mt-4 gap-3">
            
              <button
                onClick={handleFinalInacbg}
                className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
              >
                FINAL INACBG
              </button>
        
              <button
                onClick={handleEditInacbgFinal}
                disabled={isFinalKlaim}
                className={`px-6 py-2 font-semibold rounded-lg transition ${
                  isFinalKlaim
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                EDIT INACBG
              </button>
          </div> */}
          <div className="w-full flex justify-end mb-4 mt-4 gap-3">
            {Number(pasien.status_claim) === 4 ? (
    <button
      onClick={handleFinalInacbg}
      className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition"
    >
      FINAL INACBG
    </button>
  ) : (
    <button
      onClick={handleEditInacbgFinal}
      disabled={Number(pasien.status_claim) > 5}
      className={`px-6 py-2 font-semibold rounded-lg transition ${
        Number(pasien.status_claim) > 5
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-yellow-500 hover:bg-yellow-600 text-white"
      }`}
    >
      EDIT INACBG
    </button>
  )}
</div>

        </div>
      )}
      {Number(pasien.status_claim) === 5 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6 flex justify-end">
          <button
            onClick={handleFinalKlaim}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 transition"
          >
            FINAL KLAIM
          </button>
        </div>
      )}

      {Number(pasien.status_claim) > 5 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
          <h2 className="font-bold text-lg mb-4 text-center">Status Klaim</h2>

          <table className="w-full border-collapse border border-gray-300 mb-6">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50 w-48 border-r">
                  Status Klaim
                </td>
                <td className="p-3">Final</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-50 border-r">
                  Status DC Kemkes
                </td>
                <td className="p-3 text-red-800">
                  Klaim terkirim ke pusat data Kementerian Kesehatan
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-center gap-3">
            <button
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
              // onClick={() => generatePDF(pasien.claim_id!)}
              onClick={() => {
                // if (pasien.no_sep != null) {
                  // generatePDF(pasien.claim_id);
                  getPdf(pasien.no_sep);
              //   }   else {
              //     toast.error("Claim ID belum tersedia!", {
              //       position: "top-right",
              //       autoClose: 3000,
              //     });
              // }
              //   if (pasien.claim_id != null) {
              //     generatePDF(pasien.claim_id);
              //   }   else {
              //     toast.error("Claim ID belum tersedia!", {
              //       position: "top-right",
              //       autoClose: 3000,
              //     });
              // }
            }}
            >
              Cetak Klaim
            </button>
            <button 
            onClick={handleKirim}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 transition">
              Kirim Klaim Online
            </button>
            <button
              onClick={handleReEditUlangKlaim}
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
            >
              Edit Ulang Klaim
            </button>
          </div>
        </div>
      )}

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
  );
};

export default InacbgPage;
