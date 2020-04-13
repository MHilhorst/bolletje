import config from '../config';
import { getSession } from './auth';

export const getUsers = async (query) => {
  const jwt = await getSession();
  if (query) {
  } else {
    query = '';
  }
  const response = await fetch(`${config.host}/api/admin/users${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const getProducts = async (query) => {
  const jwt = await getSession();
  if (query) {
  } else {
    query = '';
  }
  const response = await fetch(`${config.host}/api/admin/products${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const reloadAllProducts = async () => {
  const jwt = await getSession();
  await fetch(`${config.host}/api/admin/reload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
};

export const setBroadcast = async (title, message) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/broadcast`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ title, message }),
  });
  return await response.json();
};

export const reloadProduct = async (productId) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/reload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ productId }),
  });
  return await response.json();
};

export const getProduct = async (query) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/products/${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const getOffer = async (query) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/offers/${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const getUser = async (query) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/users/${query}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const getUserQuery = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${config.host}/api/admin/users?search=${query}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};

export const getProductQuery = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${config.host}/api/admin/products?search=${query}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};

export const startMonitor = async () => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/monitor`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ start: true }),
  });
  return await response.json();
};

export const stopMonitor = async () => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/monitor`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ stop: true }),
  });
  return await response.json();
};
export const getStatusMonitor = async () => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/admin/monitor-status`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};
