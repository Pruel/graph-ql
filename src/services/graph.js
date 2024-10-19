// src/services/graph.js

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

export const getProjectsXP = async (userId) => {
  const token = getToken();
  const query = `
    query {
      transaction(
        where: {
          userId: { _eq: ${userId} },
          type: { _eq: "xp" },
          object: { type: { _eq: "project" } }
        }
      ) {
        amount
        object {
          name
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.errors) {
      console.error('GraphQL errors:', JSON.stringify(response.data.errors, null, 2));
      throw new Error('GraphQL query failed');
    }

    const transactions = response.data.data.transaction;

    const xpByProject = {};

    transactions.forEach((tx) => {
      const projectName = tx.object.name;
      if (!xpByProject[projectName]) {
        xpByProject[projectName] = 0;
      }
      xpByProject[projectName] += tx.amount;
    });

    const projectNames = Object.keys(xpByProject);
    const xpValues = Object.values(xpByProject);

    return { projectNames, xpValues };
  } catch (error) {
    console.error('Error in getProjectsXP:', error);
    throw error;
  }
};

export const getDailyXP = async (userId) => {
  const token = getToken();
  const query = `
    query {
      transactions: transaction(
        where: {
          userId: { _eq: ${userId} },
          type: { _eq: "xp" }
        },
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
      }
    }
  `;

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.errors) {
      console.error('GraphQL errors:', JSON.stringify(response.data.errors, null, 2));
      throw new Error('GraphQL query failed');
    }

    const transactions = response.data.data.transactions;

    // Обработка транзакций для суммирования XP по дням
    const xpPerDay = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt).toISOString().split('T')[0]; // Получаем дату в формате YYYY-MM-DD
      if (!xpPerDay[date]) {
        xpPerDay[date] = 0;
      }
      xpPerDay[date] += tx.amount;
    });

    const dates = Object.keys(xpPerDay).sort();
    const xpValues = dates.map((date) => xpPerDay[date]);

    return { dates, xpValues };
  } catch (error) {
    console.error('Error in getDailyXP:', error);
    throw error;
  }
};
