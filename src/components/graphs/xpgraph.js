// src/components/graphs/xpgraph.js

import React, { useEffect, useState } from 'react';
import { getXPHistory } from '../../services/graph';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './xpgraph.css';

function XPGraph({ userId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchXPData() {
      const xpData = await getXPHistory(userId);
      // Convert data to cumulative XP
      const cumulativeXP = [];
      let totalXP = 0;
      xpData.forEach((item) => {
        totalXP += item.amount;
        cumulativeXP.push({
          date: new Date(item.createdAt).toLocaleDateString(),
          xp: totalXP,
        });
      });
      setData(cumulativeXP);
    }
    fetchXPData();
  }, [userId]);

  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      className="line-chart"
    >
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" stroke="#000" />
      <YAxis stroke="#000" />
      <Tooltip />
      <Line type="monotone" dataKey="xp" stroke="#000" />
    </LineChart>
  );
}

export default XPGraph;
