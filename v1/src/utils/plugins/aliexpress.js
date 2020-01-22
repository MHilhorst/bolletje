import Cookies from 'js-cookie';
import config from '../../config';
export const getPluginAliExpressOffers = async () => {
  const jwt = Cookies.get('token');
  const response = await fetch(`${config.host}/api/plugin/aliexpress`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: jwt }
  });
  const data = await response.json();
  return data;
};
