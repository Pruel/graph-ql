// src/components/header/header.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import { getUserData } from '../../services/graph';
import './header.css';

function Header() {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getUserData();
        setUserData(user);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    }
    fetchUserData();
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo" />
      </div>
      <div className="header-right">
        <div className="profile-menu">
          <button onClick={toggleProfileMenu} className="profile-link">
            Profile
          </button>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="user-info">
                {userData ? (
                  <>
                    <p>ID: {userData.id}</p>
                    <p>Login: {userData.login}</p>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
