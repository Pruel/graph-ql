// src/components/graphs/dailyXPGraph.js

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getDailyXP } from '../../services/graph';
import {
  Chart as ChartJS,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend);

function DailyXPGraph({ userId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchDailyXP() {
      try {
        const data = await getDailyXP(userId);
        setChartData({
          labels: data.dates,
          datasets: [
            {
              label: 'XP Gained',
              data: data.xpValues,
              backgroundColor: '#e94560',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch daily XP data:', error);
      }
    }
    fetchDailyXP();
  }, [userId]);

  if (!chartData) return <p>Loading daily XP data...</p>;

  const options = {
    scales: {
      x: {
        ticks: { color: '#fff' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default DailyXPGraph;
