import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InacbgPage from "./Inacbg";
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
  accpdx?: string;
  validcode?: number;
  isDisabled?: boolean;
}

interface ICDItem {
  code: string;
  description: string;
  code2?: string;
  system?: string;
  accpdx?: string;
  validcode: number | string;
}

interface IDRGProps {
  pasien: Pasien | null ;
  onChangePasien: (pasien: Pasien) => void;
}

interface ICD10Item extends Option {
  valueInput: number;
}

interface ICD9Item extends Option {
  valueInput: number;
  multiplicity?: number;
  count: number;
}

interface GroupingResultIdrg {
  info: string;
  mdc_number: string;
  mdc_description: string;
  drg_code: string;
  drg_description: string;
}

const fetchICD = (type: "9" | "10") => {
  return async (inputValue: string): Promise<Option[]> => {
    if (!inputValue) return [];

    try {
      const res = await axios.get(
        `http://192.168.20.4:3000/grab/icd/${type}/idrg`,
        {
          params: {
            keyword: inputValue,
          },
        }
      );

      return res.data.data.map(
        (item: ICDItem): Option => ({
          value: item.code,
          label: `${item.code} - ${item.description}`,
          display: `${item.code} - ${item.description}`,
          code2: item.code2,
          system: item.system,
          accpdx: item.accpdx,
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
const IdrgPage: React.FC<IDRGProps> = ({ pasien, onChangePasien }) => {
  const loadOptionsICD9 = fetchICD("9");
  const loadOptionsICD10 = fetchICD("10");
  const [selectedICD10, setSelectedICD10] = useState<ICD10Item[]>([]);
  const [selectedICD9, setSelectedICD9] = useState<ICD9Item[]>([]);
  const [groupingResultIdrg, setGroupingResultIdrg] =
    useState<GroupingResultIdrg | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errors, setErrors] = useState<{ icd10?: string; icd9?: string }>({});
  // const [showReEditIdrg, setShowReEditIdrg] = useState(false);
  const ref = useAutoScroll();
  const idrgData = async (claim_id: number) => {
    if (
      Number(pasien?.status_claim) > 1
    ) {
      const res = await axios.get(
        `http://192.168.20.4:3000/grab/idrg/${claim_id}`
      );

      setSelectedICD10(
        res.data.diagnosa_idrg.map((item: ICD10Item) => ({
          ...item,
          value: item.code,
          label: item.display,
        }))
      );
      setSelectedICD9(
        res.data.prosedur_idrg.map((item: ICD9Item) => ({
          ...item,
          value: item.code,
          label: item.display,
          valueInput: item.multiplicity,
        }))
      );

      if (
        Number(pasien?.status_claim) >2
      ) {
        // setShowINACBG(true);
        // setShowReEditIdrg(true);
        setGroupingResultIdrg(res.data.grouping_idrg);
      } 
    }
  };

  const handleInputChange = <T extends { valueInput: number }>(
    val: number,
    idx: number,
    selectedState: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    const updated = [...selectedState];
    updated[idx] = { ...updated[idx], valueInput: val };
    setter(updated);
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

  const handleGrouping = async () => {
    const newErrors: { icd10?: string; icd9?: string } = {};
    if (selectedICD10.length === 0) {
      newErrors.icd10 = "Minimal pilih 1 diagnosis ICD-10!";
    } else if (selectedICD10[0].accpdx === "N") {
      newErrors.icd10 = `${selectedICD10[0].label} tidak boleh jadi Primary!`;
    }

    if (selectedICD9.length === 0) {
      newErrors.icd9 = "Minimal pilih 1 prosedur ICD-9!";
    } else if (
      selectedICD9.some((item) => !item.valueInput || item.valueInput <= 0)
    ) {
      newErrors.icd9 = "Semua prosedur ICD-9 harus punya jumlah > 0!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payloadICD10 = {
      data: selectedICD10.map((d, idx) => ({
        code: d.value,
        display: d.label,
        no: idx + 1,
        validcode: d.validcode,
      })),
    };

    // --- Payload ICD-9 ---
    const payloadICD9 = {
      data: selectedICD9.map((d, idx) => ({
        code: d.value,
        display: d.label,
        multiplicity: d.valueInput,
        no: idx + 1,
        validcode: d.validcode,
      })),
    };
    const payload = {
      claim_id: pasien?.claim_id,
      nomor_sep: pasien?.no_sep,
      diagnosa: payloadICD10.data,
      procedure: payloadICD9.data,
    };
    try {
      const res = await axios.post(
        "http://192.168.20.4:3000/send/grouping-idrg",
        payload
      );
      if (res.data.metadata.code !== 200) {
        toast.error(res.data.metadata.message, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      toast.success("Grouping iDRG berhasil!", {
        position: "top-right",
        autoClose: 3000,
      });
      onChangePasien({...pasien,status_claim:2})
      if(res.data.response_idrg.mdc_number!=="36"){
        setIsDisabled(true);
      }
      setGroupingResultIdrg(res.data.response_idrg);
    } catch (err) {
      console.error("Grouping iDRG error:", err);
      toast.error("Gagal set klaim!");
    }
  };

  useEffect(() => {
    if(pasien){
      if (pasien.claim_id) {
        idrgData(pasien?.claim_id);
      }
    }
  }, [pasien]);

  const handleFinalGrouping = async () => {
    try {
      const payload = {
        claim_id: pasien?.claim_id,
        data: {
          nomor_sep: pasien?.no_sep,
        },
      };
      const res = await axios.post(
        "http://192.168.20.4:3000/send/final-idrg",
        payload
      );
      if (res.data.metadata.code !== 200) {
        toast.error(res.data.metadata.message, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      onChangePasien({...pasien,status_claim:3})
      toast.success("Finalisasi Grouping berhasil", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Finalisasi error:", error);
    }
  };

  const handleReEditIdrg = async() => {
    await axios.post(
        "http://192.168.20.4:3000/send/re-edit-idrg",
        {claim_id:pasien?.claim_id, nomor_sep:pasien?.no_sep}
      );
      onChangePasien({...pasien,status_claim:2})
  };

  const handleEditIdrg = () => {
    // setIdrgLocked(false);
    onChangePasien({...pasien, status_claim:1})
    setIsDisabled(false);
  };

  return (
    <div ref={ref} className="min-h-screen p-6 space-y-6">
      <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
        <div className="text-center font-bold text-xl mb-6">
          <h2>IDRG</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="w-full">
            <h2 className="font-semibold mb-2 text-gray-700 text-lg">
              Diagnosis (ICD-10)
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
                      Tidak valid untuk diagnosis
                    </span>
                  )}
                  {option.accpdx === "N" && (
                    <span className="text-xs text-orange-500">
                      Tidak boleh jadi Primary
                    </span>
                  )}
                </div>
              )}
              isOptionDisabled={(option) => !!option.isDisabled || Number(pasien?.status_claim)>1} // disable select jika sudah grouped
              onChange={(val) => {
                if (!val) return;
                const alreadyExist = selectedICD10.some(
                  (item) => item.value === val.value
                );
                if (!alreadyExist) {
                  if (selectedICD10.length === 0 && val.accpdx === "N") {
                    toast.error(`${val.value} tidak boleh jadi Primary!`, {
                      position: "top-right",
                      autoClose: 3000,
                    });
                    return;
                  }
                  if (selectedICD10[0]?.accpdx === "N") {
                    if (val.accpdx === "N") {
                      toast.error(`${val.value} tidak boleh jadi Primary!`, {
                        position: "top-right",
                        autoClose: 3000,
                      });
                      return;
                    }
                    setSelectedICD10([
                      { ...val, valueInput: 0 },
                      ...selectedICD10,
                    ]);
                  } else {
                    setSelectedICD10([
                      ...selectedICD10,
                      { ...val, valueInput: 0 },
                    ]);
                  }
                }
              }}
              className="mb-4"
              isDisabled={Number(pasien?.status_claim)>1}
            />

            <div className="space-y-2">
              {selectedICD10.map((item, idx) => (
                <div
                  key={item.value}
                  className="flex items-center justify-between gap-3 border p-2 rounded-md"
                >
                  <span className="font-semibold text-sm w-20">
                    {idx === 0 ? "Primary" : "Secondary"}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.accpdx === "N" && idx === 0 && (
                    <>
                      <br />
                      <span className="text-xs text-orange-500 mr-2">
                        Tidak boleh jadi Primary
                      </span>
                    </>
                  )}

                  {Number(pasien?.status_claim)===1 && (
                    <button
                      onClick={() =>
                        handleDelete(idx, selectedICD10, setSelectedICD10)
                      }
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <h2 className="font-semibold mb-2 text-gray-700 text-lg">
              Prosedur (ICD-9)
            </h2>
            {errors.icd9 && (
              <p className="text-red-500 text-sm mt-1">{errors.icd9}</p>
            )}

            <AsyncSelect<Option>
              cacheOptions
              defaultOptions
              value={null}
              loadOptions={loadOptionsICD9}
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
              isOptionDisabled={(option) => !!option.isDisabled || Number(pasien?.status_claim)>1} // disable select jika sudah grouped
              onChange={(val) => {
                if (!val) return;

                setSelectedICD9((prev) => {
                  const newList = [
                    ...prev,
                    { ...val, valueInput: 1, count: 1 },
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
              isDisabled={Number(pasien?.status_claim)>1} // disable select kalau sudah grouped
            />

            <div className="space-y-2">
              {selectedICD9.map((item, idx) => (
                <div
                  key={`${item.value}-${idx}`}
                  className="relative flex items-center justify-between gap-3 border p-2 rounded-md"
                >
                  <span className="font-semibold text-sm w-20">
                    {idx === 0 ? "Primary" : "Secondary"}
                  </span>

                  <div className="flex-1 relative">
                    <div className="relative inline-block bg-gray-300 text-gray-900 px-3 py-1 rounded-md font-medium">
                      {item.label}

                      {item.count > 1 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-xs px-1.5 py-0.5 rounded-full shadow">
                          x{item.count}
                        </span>
                      )}
                    </div>
                  </div>

                  <input
                    type="number"
                    className="w-20 border rounded-md p-1 text-center"
                    value={item.valueInput || 0}
                    onChange={(e) =>
                      handleInputChange(
                        Number(e.target.value),
                        idx,
                        selectedICD9,
                        setSelectedICD9
                      )
                    }
                    disabled={Number(pasien?.status_claim)>1}
                  />

                  {Number(pasien?.status_claim)===1 && (
                    <button
                      onClick={() =>
                        handleDelete(idx, selectedICD9, setSelectedICD9)
                      }
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          {Number(pasien?.status_claim)===1 ? (
            <button
              onClick={handleGrouping}
              disabled={isDisabled}
              className={`px-6 py-2 font-semibold rounded-lg transition 
            ${
              isDisabled
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            >
              Grouping
            </button>
          ) : (
            <button
              onClick={handleEditIdrg}
              disabled={Number(pasien?.status_claim)>2}
              className={`px-6 py-2 font-semibold rounded-lg bg-blue-500 text-white ${
                Number(pasien?.status_claim) > 2 ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
              }`}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {Number(pasien?.status_claim) >1  && groupingResultIdrg && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
          <h2 className="font-bold text-lg mb-4 text-center">
            Hasil Grouping iDRG
          </h2>

          <table
            className={`w-full border-collapse border border-gray-300 ${
              Number(pasien?.status_claim) > 2 ? "bg-sky-200" : "bg-white"
            }`}
          >
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50 w-40 border-r">
                  Info
                </td>
                <td className="p-3">{groupingResultIdrg.info}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50 w-40 border-r">
                  Jenis Rawat
                </td>
                <td className="p-3">{pasien?.status}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50 border-r">MDC</td>
                <td className="p-3">{groupingResultIdrg.mdc_description}</td>
                <td className="p-3 text-center">
                  {groupingResultIdrg.mdc_number}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50 border-r">DRG</td>
                <td className="p-3">{groupingResultIdrg.drg_description}</td>
                <td className="p-3 text-center">
                  {groupingResultIdrg.drg_code}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-50 border-r">
                  Status
                </td>
                <td
                  className={`p-3 font-bold ${
                    groupingResultIdrg.mdc_number === "36"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {groupingResultIdrg.mdc_number === "36" ? "Invalid" : "Valid"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mt-6 mb-6">
            {Number(pasien?.status_claim)===2 ? (
              <button
                onClick={handleFinalGrouping}
                disabled={groupingResultIdrg.mdc_number === "36"}
                className={`px-6 py-2 font-semibold rounded-lg transition 
        ${
           groupingResultIdrg.mdc_number === "36"
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-sky-600 text-white hover:bg-sky-800"
                  } `}
              >
                Final iDRG
              </button>
            ) : (
              <button
                onClick={handleReEditIdrg}
                  disabled={Number(pasien?.status_claim) >3}
                  className={`px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg ${Number(pasien?.status_claim) > 3 ? " cursor-not-allowed opacity-50" : "hover:bg-yellow-600"
              }`}
              >
                Re-Edit iDRG
              </button>
            )}
          </div>
        </div>
      )}

      {Number(pasien?.status_claim) > 2 && pasien && <InacbgPage pasien={pasien} onChangePasien={onChangePasien} />}

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

export default IdrgPage;
