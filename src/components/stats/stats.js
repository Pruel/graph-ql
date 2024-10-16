import React from 'react';
import XPGraph from '../graphs/xpgraph';
import ProjectRatioGraph from '../graphs/projectRatioGraph';
import { useUserId } from '../../services/auth';
import './stats.css';

function Stats() {
  const userId = useUserId();

  return (
    <div className="stats-container">
      <h2>Статистика</h2>
      <div className="graph">
        <h3>Прогресс XP</h3>
        <XPGraph userId={userId} />
      </div>
      <div className="graph">
        <h3>Соотношение проектов</h3>
        <ProjectRatioGraph userId={userId} />
      </div>
    </div>
  );
}

export default Stats;
