import Cookies from 'js-cookie';

export const getUserInventoryItems = async () => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
    }
  );
  const data = await response.json();
  return data;
};

export const setNewInventoryItem = async (body) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return data;
};

export const deleteInventoryItem = async (id) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
    }
  );
  const data = await response.json();
  return data;
};

export const setBolOfferOfInventoryItem = async (inventoryItemId, bolId) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/${inventoryItemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
      body: JSON.stringify({ bolId: bolId }),
    }
  );
  const data = await response.json();
  return data;
};

export const setStockOfInventoryItem = async (inventoryItemId, stock) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/${inventoryItemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
      body: JSON.stringify({ stock }),
    }
  );
  const data = await response.json();
  return data;
};

export const setProductNameOfInventoryItem = async (
  inventoryItemId,
  productName
) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/${inventoryItemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
      body: JSON.stringify({ productName }),
    }
  );
  const data = await response.json();
  return data;
};

export const deleteBolOfferOfInventoryItem = async (inventoryItemId) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/inventory/${inventoryItemId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
      body: JSON.stringify({ removeBolId: true }),
    }
  );
  const data = await response.json();
  return data;
};

export const getBolOfferOfInventoryItem = async (bolId) => {
  const jwt = Cookies.get('token');
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/offer/${bolId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: jwt },
    }
  );
  const data = await response.json();
  return data;
};
