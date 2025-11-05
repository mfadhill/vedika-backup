import { useState } from 'react';

const UploadBerkas = () => {
  const [selectedOption, setSelectedOption] = useState('E-Klaim');
  const [file, setFile] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Silakan pilih file terlebih dahulu!');
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Berkas</h2>

        <div className="flex justify-center gap-6 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="E-Klaim"
              checked={selectedOption === 'E-Klaim'}
              onChange={handleOptionChange}
              className="w-5 h-5"
            />
            <span className="text-lg font-medium">E-Klaim</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="CPPT"
              checked={selectedOption === 'CPPT'}
              onChange={handleOptionChange}
              className="w-5 h-5"
            />
            <span className="text-lg font-medium">CPPT</span>
          </label>
        </div>

        {/* Dropzone Upload */}
        <div className="flex items-center justify-center w-full mb-6">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
              {file && <p className="mt-2 text-green-600">{file.name}</p>}
            </div>
            <input
              id="dropzone-file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadBerkas;
