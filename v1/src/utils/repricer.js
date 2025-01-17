import { getSession } from './auth';

export const reloadOffers = async (query) => {
  const jwt = await getSession();
  if (jwt) {
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/repricer/offers/update${query}`,
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
  } else {
    return { error: true };
  }
};

export const getRepricerOffer = async (id) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offers/${id}`,
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

export const createRepricerStrategy = async (query) => {
  console.log(query);
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/strategy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(query),
    }
  );
  return await response.json();
};

export const updateRepricerOffer = async (query, id) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offers/${id}`,
    {
      method: 'PUT',
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

export const updateOffers = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offers/update`,
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

export const updateAutoOffer = async (bodyData) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(bodyData),
    }
  );
  const data = await response.json();
  return data;
};
export const getUserOwnOffers = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offers`,
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

export const getCommission = async (ean, price) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/commission`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ean, price }),
    }
  );
  const data = await response.json();
  return data;
};

export const setSpreadSheetImportUrl = async (url) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/upload/csv`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        url,
      }),
    }
  );
  const data = await response.json();
  return data;
};

export const setSelectedOffers = async (offers) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/offers/activate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        offers,
      }),
    }
  );
  return await response.json();
};

export const getStrategies = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/strategy`,
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

export const setStrategyForOffers = async (
  selectedExistingOffers,
  selectedStrategy
) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/strategy`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        selectedExistingOffers,
        selectedStrategy,
      }),
    }
  );
  return await response.json();
};

export const activateStrategy = async (selectedStrategy, activation) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/strategy/activate`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        selectedStrategy,
        activation,
      }),
    }
  );
  return await response.json();
};

export const deleteStrategies = async (strategies) => {
  console.log('yes');
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/repricer/strategy`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        strategies,
      }),
    }
  );
  return await response.json();
};
