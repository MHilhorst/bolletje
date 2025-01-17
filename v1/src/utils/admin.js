import { getSession } from './auth';

export const updateMaxItems = async (userId, maxItems) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ maxItems }),
    }
  );
  return await response.json();
};

export const getUsers = async (query) => {
  const jwt = await getSession();
  if (query) {
  } else {
    query = '';
  }
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/users${query}`,
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

export const getProducts = async (query) => {
  const jwt = await getSession();
  if (query) {
  } else {
    query = '';
  }
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/products${query}`,
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

export const reloadAllProducts = async () => {
  const jwt = await getSession();
  await fetch(`${process.env.REACT_APP_API_HOST}/api/admin/reload`, {
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
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/broadcast`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ title, message }),
    }
  );
  return await response.json();
};

export const reloadProduct = async (productId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/reload`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ productId }),
    }
  );
  return await response.json();
};

export const getProduct = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/products/${query}`,
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

export const getOffer = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/offers/${query}`,
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

export const getUser = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/users/${query}`,
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
export const getRepricerOffer = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/repricer-offers/${query}`,
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

export const getUserQuery = async (query) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/users?search=${query}`,
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
    `${process.env.REACT_APP_API_HOST}/api/admin/products?search=${query}`,
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
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ start: true }),
    }
  );
  return await response.json();
};

export const stopMonitor = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ stop: true }),
    }
  );
  return await response.json();
};
export const getStatusMonitor = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor-status`,
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

export const startMonitorRepricer = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor-repricer`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ start: true }),
    }
  );
  return await response.json();
};

export const stopMonitorRepricer = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor-repricer`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ stop: true }),
    }
  );
  return await response.json();
};
export const getStatusMonitorRepricer = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/admin/monitor-status-repricer`,
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
