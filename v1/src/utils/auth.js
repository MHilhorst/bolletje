import Cookies from 'js-cookie';
import config from '../config';

// export const getSession = async () => {
//   const jwt = Cookies.get('token');
//   try {
//     if (jwt) {
//       fetch(`${config.host}/api/user`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${jwt}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log(data.user);
//           return data.user;
//         });
//     }
//   } catch (error) {
//     console.log(error);
//     return { error: true };
//   }
// };

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
  const response = await fetch(`${config.host}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  return await response.json();
};

export const userLogin = async (data) => {
  const response = await fetch(`${config.host}/api/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });
  return await response.json();
};

export const checkOffer = async (offer) => {
  const jwt = await getSession();
  const response = await fetch(`${config.host}/api/auth/offer/${offer}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await response.json();
  return data;
};

export const checkInventoryItem = async (id) => {
  const jwt = Cookies.get('token');
  const response = await fetch(`${config.host}/api/auth/inventory/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await response.json();
  return { ...data };
};

export const upgradeAccount = async () => {
  const jwt = Cookies.get('token');
  const response = await fetch(`${config.host}/api/auth/upgrade`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await response.json();
  return data;
};
