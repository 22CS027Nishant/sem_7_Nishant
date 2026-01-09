import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useMarketData from '../../hooks/useMarketData';
import ApexCharts from 'apexcharts';

interface MarketDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const PriceChart: React.FC = () => {
  const { marketData, loading, error } = useMarketData();
  const [timeframe, setTimeframe] = useState('1D');

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error loading chart: {error}</div>;

  const series = [{
    data: marketData.map((dataPoint: MarketDataPoint) => ({
      x: new Date(dataPoint.time).getTime(),
      y: [dataPoint.open, dataPoint.high, dataPoint.low, dataPoint.close]
    }))
  }];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 400,
      animations: {
        enabled: false
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    title: {
      text: 'Market Price Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#26a69a',
          downward: '#ef5350'
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Price Chart</h2>
        <div className="flex space-x-2">
          {['1H', '1D', '1W', '1M'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded ${
                timeframe === tf
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={400}
      />
    </div>
  );
};

export default PriceChart;