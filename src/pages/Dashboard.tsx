import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { FiUser, FiUsers, FiInfo, FiCheckCircle } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const pieData = [
  { name: "Sudah Dikirim", value: 530 },
  { name: "Belum Dikirim", value: 210 },
];

const COLORS = ["#10b981", "#045674"];



export default function Dashboard() {
 const today = new Date();
const currentMonth = today.toISOString().slice(0, 7); 

const [month, setMonth] = useState(currentMonth);

const formatMonthYear = (value:string) => {
  const date = new Date(value + "-01"); 
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};


  return (
    
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="w-full bg-sky-500 text-white text-lg font-mono px-4 py-2 rounded-lg shadow-md">
        Selamat Datang, Admin
      </div>

      <div className="w-full bg-white px-2 py-2 rounded-lg shadow-md">
        <div className="inline-block bg-white px-4 py-2 rounded-md shadow-sm">
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-[2.5]">
          <Card>
            <CardContent>
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Prosentase Pengiriman Berkas {formatMonthYear(month)}
              </h2>
              <div className="w-full h-96">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
       <div className="flex-[1.2] flex flex-col gap-6">
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">530</h2>
        <p className="text-blue-600 font-semibold">Pasien Ralan</p>
      </div>
      <div className="p-3 bg-blue-100 rounded-full">
        <FiUser className="text-blue-600" size={22} />
      </div>
    </CardContent>
  </Card>

  {/* Pasien Ranap */}
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">210</h2>
        <p className="text-purple-600 font-semibold">Pasien Ranap</p>
      </div>
      <div className="p-3 bg-purple-100 rounded-full">
        <FiUsers className="text-purple-600" size={22} />
      </div>
    </CardContent>
  </Card>

  {/* Belum Dikirim */}
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">120 (36.8%)</h2>
        <p className="text-yellow-600 font-semibold">Belum Dikirim</p>
      </div>
      <div className="p-3 bg-yellow-100 rounded-full">
        <FiInfo className="text-yellow-600" size={22} />
      </div>
    </CardContent>
  </Card>

  {/* Sudah Dikirim */}
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">410 (36.8%)</h2>
        <p className="font-medium">Rajal: 2281</p>
        <p className="font-medium">Ranap: 0</p>
        <p className="text-green-600 font-semibold">Sudah Dikirim</p>
      </div>
      <div className="p-3 bg-green-100 rounded-full">
        <FiCheckCircle className="text-green-600" size={22} />
      </div>
    </CardContent>
  </Card>
</div>

      </div>
    </div>
  );
}
