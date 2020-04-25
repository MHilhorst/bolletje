import Cookies from 'js-cookie';

export const getSession = async () => {
  const jwt = Cookies.get('token');
  if (jwt) {
    return jwt;
  } else {
    return false;
  }
};

export const setToken = async (token) => {
  try {
    const cookie = Cookies.set('token', token);
    return cookie;
  } catch (error) {
    throw error;
  }
};

export const userLogout = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/auth/logout`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};

export const userLogin = async (data) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    }
  );
  return await response.json();
};

export const checkOffer = async (offer) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/auth/offer/${offer}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const checkInventoryItem = async (id) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/auth/inventory/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const data = await response.json();
  return { ...data };
};

export const upgradeAccount = async (query) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/payment/upgrade`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(query),
    }
  );
  const data = await response.json();
  return data;
};

export const resendEmailVerification = async () => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/auth/email/resend`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};
