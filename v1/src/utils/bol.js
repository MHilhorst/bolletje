import { getSession } from './auth';

export const createOffer = async (
  ean,
  condition,
  price,
  stockAmount,
  fulfilment
) => {
  const jwt = await getSession();
  const data = { ean, condition, price, stockAmount, fulfilment };
  if (jwt) {
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/api/bol/offer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    return responseData;
  }
};

// export const getOffer = (id) => {
//   const jwt = await getSession();
//   if (jwt) {
//     fetch(`${process.env.REACT_APP_API_HOST}/api/bol/offer/${id}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${jwt}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//       });
//   }
// };
export const getTrackedProducts = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/products`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const data = await response.json();
  return data.products;
};
export const getTrackedProduct = async (productId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/products/${productId}`,
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

export const trackNewProduct = async (productId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/products`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ productId }),
    }
  );
  return await response.json();
};

export const getOfferTrackInfo = async (id) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/offer/track/${id}`,
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

export const getOffersTrackInfoOfProduct = async (id) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/product/offers/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  const data = await response.json();
  return data.offers;
};

export const getAutoOfferInfo = async (autoOfferId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/track/offer/${autoOfferId}`,
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
export const getBolOfferInfo = async (bolOfferId) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/track/offer/${bolOfferId}`,
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

export const getBolOpenOrders = async () => {
  const jwt = await getSession();
  const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/order`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getBolOffers = async () => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/v2/offers`,
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

export const deleteBolProduct = async (product_id) => {
  const jwt = await getSession();
  const response = await fetch(
    `${process.env.REACT_APP_API_HOST}/api/bol/products/${product_id}`,
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

export const findSeller = (array, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i].seller.displayName === value.bol_shop_name) {
      return i;
    }
  }
  return -1;
};
