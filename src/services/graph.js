import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://01.kood.tech/api';
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || '/graphql-engine/v1/graphql';
const GRAPHQL_URL = `${API_BASE_URL}${GRAPHQL_ENDPOINT}`;

export const getUserData = async () => {
  const token = getToken();
  const query = `
    query {
      user {
        id
        login
      }
    }
  `;

  const response = await axios.post(
    GRAPHQL_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.user[0];
};

export const getTotalXP = async (userId) => {
  const token = getToken();
  const query = `
    query {
      transaction_aggregate(where: { userId: { _eq: ${userId} }, type: { _eq: "xp" } }) {
        aggregate {
          sum {
            amount
          }
        }
      }
    }
  `;

  const response = await axios.post(
    GRAPHQL_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const amount = response.data.data.transaction_aggregate.aggregate.sum.amount;
  return amount || 0;
};

export const getProjectStats = async (userId) => {
  const token = getToken();
  const query = `
    query {
      passed: progress_aggregate(where: { userId: { _eq: ${userId} }, grade: { _eq: 1 } }) {
        aggregate {
          count
        }
      }
      failed: progress_aggregate(where: { userId: { _eq: ${userId} }, grade: { _eq: 0 } }) {
        aggregate {
          count
        }
      }
    }
  `;

  const response = await axios.post(
    GRAPHQL_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const passed = response.data.data.passed.aggregate.count || 0;
  const failed = response.data.data.failed.aggregate.count || 0;

  return { passed, failed };
};

export const getXPHistory = async (userId) => {
  const token = getToken();
  const query = `
    query {
      transaction(where: { userId: { _eq: ${userId} }, type: { _eq: "xp" } }, order_by: { createdAt: asc }) {
        amount
        createdAt
      }
    }
  `;

  const response = await axios.post(
    GRAPHQL_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data.transaction;
};
