
import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface AbsensiStatsProps {
  attendanceData: {
    hadir: number;
    telat: number;
    cuti: number;
    sakit: number;
    tanpaIzin: number;
  };
  departmentData: {
    name: string;
    hadir: number;
    telat: number;
    cuti: number;
  }[];
}

export const AbsensiStats: React.FC<AbsensiStatsProps> = ({ 
  attendanceData, 
  departmentData 
}) => {
  const pieData = [
    { name: 'Hadir', value: attendanceData.hadir, color: '#22c55e' },
    { name: 'Telat', value: attendanceData.telat, color: '#eab308' },
    { name: 'Cuti', value: attendanceData.cuti, color: '#3b82f6' },
    { name: 'Sakit/Izin', value: attendanceData.sakit, color: '#9333ea' },
    { name: 'Tanpa Izin', value: attendanceData.tanpaIzin, color: '#ef4444' },
  ];
  
  const total = pieData.reduce((acc, item) => acc + item.value, 0);
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Statistik Absensi</h3>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} hari (${((value/total) * 100).toFixed(1)}%)`, '']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(value, entry, index) => (
                  <span style={{ color: pieData[index].color }}>
                    {value} {((pieData[index].value / total) * 100).toFixed(0)}%
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Kehadiran per Departemen</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hadir" name="Hadir" fill="#22c55e" />
              <Bar dataKey="telat" name="Telat" fill="#eab308" />
              <Bar dataKey="cuti" name="Cuti" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
