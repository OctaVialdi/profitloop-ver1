
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Legend,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface ChartContainerProps {
  children: React.ReactElement;
  className?: string;
  config?: {
    value?: {
      theme?: {
        light?: string;
        dark?: string;
      };
    };
    revenue?: {
      theme?: {
        light?: string;
        dark?: string;
      };
    };
    expenses?: {
      theme?: {
        light?: string;
        dark?: string;
      };
    };
    profit?: {
      theme?: {
        light?: string;
        dark?: string;
      };
    };
    income?: {
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
    [key: string]: any;
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

// Add the missing ChartTooltipContent component
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    payload: any;
    // Add the color property to fix the TypeScript error
    color?: string;
    stroke?: string;
    fill?: string;
  }>;
  label?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2 border border-gray-200 rounded-md shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
            // Use stroke, fill or color, whichever is available
            style={{ backgroundColor: entry.color || entry.stroke || entry.fill || '#cccccc' }}
          />
          <span className="font-medium">{entry.name}:</span>
          <span>{typeof entry.value === 'number' ? 
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(entry.value) : 
            entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Add additional chart components that are being imported elsewhere
export const ChartTooltip = Tooltip;
export const ChartLegend = Legend;
export const ChartLegendContent = Legend;
