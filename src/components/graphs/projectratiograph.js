// src/components/graphs/projectratiograph.js

import React, { useEffect, useState } from 'react';
import { getProjectStats } from '../../services/graph';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './projectratiograph.css';

function ProjectRatioGraph({ userId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchProjectStats() {
      const stats = await getProjectStats(userId);
      const chartData = [
        { name: 'Passed', value: stats.passed },
        { name: 'Failed', value: stats.failed },
      ];
      setData(chartData);
    }
    fetchProjectStats();
  }, [userId]);

  const COLORS = ['#000', '#ccc']; // Black and light grey

  return (
    <PieChart width={400} height={400} className="pie-chart">
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#000"
        dataKey="value"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default ProjectRatioGraph;
