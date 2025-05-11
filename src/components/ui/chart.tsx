
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  config?: {
    value?: {
      theme?: {
        light?: string;
        dark?: string;
      };
    };
  };
}

interface ChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  className, 
  config
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <RechartsBarChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#3B82F6" />
    </RechartsBarChart>
  );
};

export const LineChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <RechartsLineChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#3B82F6" activeDot={{ r: 8 }} />
    </RechartsLineChart>
  );
};
