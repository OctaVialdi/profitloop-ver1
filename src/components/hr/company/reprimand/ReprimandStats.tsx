
import React, { useState, useEffect } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { Card } from '@/components/ui/card';
import { getReprimandStats } from '@/services/reprimandService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReprimandStatsProps {
  refreshTrigger: number;
}

const ReprimandStats: React.FC<ReprimandStatsProps> = ({ refreshTrigger }) => {
  const { organization } = useOrganization();
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    resolved: number;
    appealed: number;
    byType: Record<string, number>;
    byMonth: Record<string, number>;
  }>({
    total: 0,
    active: 0,
    resolved: 0,
    appealed: 0,
    byType: {},
    byMonth: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (organization?.id) {
        setIsLoading(true);
        try {
          const data = await getReprimandStats(organization.id);
          setStats(data);
        } catch (error) {
          console.error('Error fetching reprimand stats:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
  }, [organization?.id, refreshTrigger]);

  // Prepare data for charts
  const prepareTypeData = () => {
    return Object.entries(stats.byType).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };

  const prepareMonthlyData = () => {
    return Object.entries(stats.byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6) // Show only last 6 months
      .map(([month, count]) => ({
        month: month.substring(5), // Show only MM part
        count
      }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const statusData = [
    { name: 'Active', value: stats.active },
    { name: 'Resolved', value: stats.resolved },
    { name: 'Appealed', value: stats.appealed },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Reprimand Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-2xl font-bold">{stats.total}</div>
          <div className="text-gray-500 text-sm">Total Reprimands</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 text-2xl font-bold">{stats.active}</div>
          <div className="text-gray-500 text-sm">Active</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-2xl font-bold">{stats.resolved}</div>
          <div className="text-gray-500 text-sm">Resolved</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 text-2xl font-bold">{stats.appealed}</div>
          <div className="text-gray-500 text-sm">Appealed</div>
        </div>
      </div>
      
      {stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-semibold mb-2">Reprimands by Type</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareTypeData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-2">Monthly Trends</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prepareMonthlyData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Reprimands" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {stats.total === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reprimand data available yet. Create some reprimands to see statistics.
        </div>
      )}
    </Card>
  );
};

export default ReprimandStats;
