import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTheme } from '../../contexts/ThemeContext';

export interface CandlestickDataPoint {
  x: number; // timestamp in ms
  y: [number, number, number, number]; // [open, high, low, close]
}

interface CandlestickChartProps {
  data: CandlestickDataPoint[];
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, height = 400 }) => {
  const { isDarkMode } = useTheme();

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height,
      background: 'transparent',
      foreColor: isDarkMode ? '#E5E7EB' : '#374151'
    },
    grid: {
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      strokeDashArray: 2
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22C55E',
          downward: '#EF4444'
        },
        wick: {
          useFillColor: true
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: '12px',
          colors: isDarkMode ? '#E5E7EB' : '#374151'
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        style: {
          colors: isDarkMode ? '#E5E7EB' : '#374151'
        }
      }
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      x: {
        format: 'MMM dd HH:mm'
      }
    },
    theme: {
      mode: isDarkMode ? 'dark' : 'light'
    }
  };

  const series = [
    {
      name: 'Price',
      data: data as CandlestickDataPoint[]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Price</h2>
        </div>
        {/* timeframe controls removed — managed by parent (Trade) */}
      </div>

      <ReactApexChart options={options} series={series} type="candlestick" height={height} />
    </div>
  );
};

export default CandlestickChart;