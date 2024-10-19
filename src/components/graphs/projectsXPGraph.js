import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getProjectsXP } from '../../services/graph';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

function ProjectsXPGraph({ userId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchProjectsXP() {
      try {
        const data = await getProjectsXP(userId);
        setChartData({
          labels: data.projectNames,
          datasets: [
            {
              data: data.xpValues,
              backgroundColor: [
                '#e94560',
                '#0f3460',
                '#16213e',
                '#1a1a2e',
                '#533483',
                '#ff5200',
                '#6a2c70',
                '#8fd6e1',
              ],
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch projects XP data:', error);
      }
    }
    fetchProjectsXP();
  }, [userId]);

  if (!chartData) return <p>Loading projects XP data...</p>;

  return <Pie data={chartData} />;
}

export default ProjectsXPGraph;
