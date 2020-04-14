import Cookies from 'js-cookie';
export const getOrder = async (id) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/order/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
    }
  );
  const data = await response.json();
  return data;
};
