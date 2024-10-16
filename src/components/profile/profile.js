import React, { useEffect, useState } from 'react';
import { getUserData, getTotalXP } from '../../services/graph';
import { useUserId } from '../../services/auth';
import './profile.css';
import XPGraph from '../graphs/xpgraph';
import ProjectRatioGraph from '../graphs/projectratiograph';

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
  }, [setUserData, setTotalXP, userId]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>Learning Progress</h2>
      <p>Welcome, {userData.login}!</p>
      <div className="stats">
        <p>Total XP: {totalXP}</p>
      </div>
      {/* Отображение графиков */}
      <div className="graphs">
        <div className="graph">
          <h3>XP Progress</h3>
          <XPGraph userId={userId} />
        </div>
        <div className="graph">
          <h3>Project Ratio</h3>
          <ProjectRatioGraph userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
