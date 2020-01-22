import Cookies from 'js-cookie';
import config from '../config';
export const getOrder = async id => {
  const jwt = Cookies.get('token');
  const response = await fetch(`${config.host}/api/order/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: jwt }
  });
  const data = await response.json();
  return data;
};
