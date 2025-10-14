
const Pdf = () => {
  return (
    <div className="min-h-screen font-sans p-6">
      <h1 className="text-xl font-bold mb-8 text-gray-800">
        Berkas Klaim | 125585 - ZHAFI KALIEF IBRAHIM - Rawat Jalan
      </h1>

      <div className="bg-white rounded-2xl shadow-xl p-4 w-full space-y-1">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Resume Medis</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm ">
          <div className="flex items-center text-sm mb-1">
            <span className="font-medium text-gray-700 w-40">Nomor Rekam Medis</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">125585</span>
          </div>
          <div className="flex items-center text-sm mb-1">
            <span className="font-medium text-gray-700 w-40">Ruang</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">Kamar Kelas VIP</span>
          </div>

          <div className="flex items-center text-sm mb-1">
            <span className="font-medium text-gray-700 w-40">Nama</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">ZHAFI KALIEF IBRAHIM, AN</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 w-40">Kelas</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">Kelas VIP</span>
          </div>

          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 w-40">Tanggal Lahir / Umur</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">29-08-2023 / 2 Tahun</span>
          </div>

          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 w-40">DPJP</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">dr. Ari Jaka Setiawan, Sp. B.</span>
          </div>

          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 w-40">Jenis Kelamin</span>
            <span className="mr-2">:</span>
            <span className="text-gray-500">Laki-laki</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pdf;
