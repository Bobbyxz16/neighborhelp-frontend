import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import { API_ENDPOINTS } from '../../../utils/constants';

const AnalyticsChart = ({ analyticsData }) => {
  const [chartType, setChartType] = useState('views');
  const [timeRange, setTimeRange] = useState('7days');

  const chartConfigs = {
    views: {
      title: 'Resource Views',
      icon: 'Eye',
      color: '#2563EB',
      dataKey: 'views'
    },
    contacts: {
      title: 'Contact Inquiries',
      icon: 'MessageSquare',
      color: '#059669',
      dataKey: 'contacts'
    }
  };

  const timeRanges = {
    '7days': { label: '7 Days', data: analyticsData?.weekly },
    '30days': { label: '30 Days', data: analyticsData?.monthly },
    '90days': { label: '90 Days', data: analyticsData?.quarterly }
  };

  const currentConfig = chartConfigs?.[chartType];
  const currentData = timeRanges?.[timeRange]?.data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-3">
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            {currentConfig?.title}: {payload?.[0]?.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const getTotalValue = () => {
    return Array.isArray(currentData)
      ? currentData.reduce((sum, item) => sum + (item?.[currentConfig?.dataKey] ?? 0), 0)
      : 0;
  };

  const getGrowthRate = () => {
    if (currentData?.length < 2) return 0;
    const latest = currentData?.[currentData?.length - 1]?.[currentConfig?.dataKey];
    const previous = currentData?.[currentData?.length - 2]?.[currentConfig?.dataKey];
    return previous > 0 ? Math.round(((latest - previous) / previous) * 100) : 0;
  };

  const growthRate = getGrowthRate();

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
          <div className="flex items-center space-x-2">
            {Object.entries(timeRanges)?.map(([key, range]) => (
              <Button
                key={key}
                variant={timeRange === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(key)}
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {Object.entries(chartConfigs)?.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setChartType(key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                chartType === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon name={config?.icon} size={16} />
              <span className="text-sm font-medium">{config?.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              {getTotalValue()?.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">
              Total {currentConfig?.title?.toLowerCase()} in {timeRanges?.[timeRange]?.label?.toLowerCase()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon 
              name={growthRate >= 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className={growthRate >= 0 ? 'text-green-500' : 'text-red-500'} 
            />
            <span className={`text-sm font-medium ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(growthRate)}%
            </span>
            <span className="text-sm text-muted-foreground">vs previous period</span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bookings' ? (
              <BarChart data={currentData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={currentConfig?.dataKey} 
                  fill={currentConfig?.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={currentData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey={currentConfig?.dataKey} 
                  stroke={currentConfig?.color}
                  strokeWidth={2}
                  dot={{ fill: currentConfig?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentConfig?.color, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-foreground">
              {currentData?.length ? Math.round(getTotalValue() / currentData.length) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Daily Average</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-foreground">
              {currentData && currentData.length
                ? Math.max(...currentData.map(item => item?.[currentConfig?.dataKey] ?? 0))
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Peak Day</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-foreground">
              {Array.isArray(currentData)
                ? currentData.filter(item => (item?.[currentConfig?.dataKey] ?? 0) > 0).length
                : 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;