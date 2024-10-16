// src/services/auth.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Adjust based on your jwt-decode version

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://01.kood.tech/api';
const AUTH_ENDPOINT = process.env.REACT_APP_AUTH_ENDPOINT || '/auth/signin';

export const login = async (usernameOrEmail, password) => {
  const credentials = btoa(`${usernameOrEmail}:${password}`);
  const response = await axios.post(
    `${API_BASE_URL}${AUTH_ENDPOINT}`,
    {},
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );
  const token = response.data;
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

// Custom hook to get user ID from JWT token
export const useUserId = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    return decoded.sub || decoded.id || decoded.user_id; // Adjust based on your token structure
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};
