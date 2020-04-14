import Cookies from 'js-cookie';
import { getSession } from './auth';
const jwt = Cookies.get('token');

export const getUserInformation = async () => {
  return fetch(`${process.env.REACT_APP_API_HOST}/api/user`, {
    method: 'GET',
    headers: {
      Authorization: jwt,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data.user;
    });
};

export const updateUserInformation = async (data) => {
  return fetch(`${process.env.REACT_APP_API_HOST}/api/user`, {
    method: 'PUT',
    headers: {
      Authorization: jwt,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      return data.user;
    });
};

export const getMessages = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/user/timeline`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};

export const deleteMessage = async (messageId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/user/timeline/${messageId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return await response.json();
};
