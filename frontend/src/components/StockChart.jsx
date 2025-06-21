import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function StockChart({ data }) {
  const labels = data.priceHistory.map(p => new Date(p.lastUpdatedAt).toLocaleTimeString());
  const prices = data.priceHistory.map(p => p.price);

  const chartData = {
    labels,
    datasets: [{
      label: 'Stock Price',
      data: prices,
      fill: false,
      borderColor: 'blue',
      tension: 0.1
    }]
  };

  return <Line data={chartData} />;
}
