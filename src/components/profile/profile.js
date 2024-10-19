// src/components/profile/profile.js

import React, { useEffect, useState } from 'react';
import { getUserData, getTotalXP } from '../../services/graph';
import { useUserId } from '../../services/auth';
import './profile.css';
import DailyXPGraph from '../graphs/dailyXPGraph'; // Новый график
import ProjectsXPGraph from '../graphs/projectsXPGraph';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [totalXP, setTotalXP] = useState(0);
  const userId = useUserId();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getUserData();
        setUserData(user);

        const xp = await getTotalXP(user.id);
        setTotalXP(xp);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [userId]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Learning Progress</h2>
      <p>Hello, {userData.login}!</p>
      <div className="stats">
        <p>Total XP: {totalXP}</p>
      </div>
      {/* Отображение графиков */}
      <div className="graphs">
        <div className="graph">
          <h3>Daily XP Gain</h3> {/* Изменённый заголовок */}
          <DailyXPGraph userId={userId} /> {/* Новый график */}
        </div>
        <div className="graph">
          <h3>Projects XP Distribution</h3>
          <ProjectsXPGraph userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
