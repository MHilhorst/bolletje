import Cookies from 'js-cookie';
import config from '../config';
const jwt = Cookies.get('token');

export const getUserInformation = async () => {
  return fetch(`${config.host}/api/user`, {
    method: 'GET',
    headers: {
      Authorization: jwt
    }
  })
    .then(res => res.json())
    .then(data => {
      return data.user;
    });
};

export const updateUserInformation = async data => {
  return fetch(`${config.host}/api/user`, {
    method: 'PUT',
    headers: {
      Authorization: jwt,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      return data.user;
    });
};
