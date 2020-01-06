import Cookies from "js-cookie";
import config from "../config";

export const reloadOffers = async () => {
  const jwt = Cookies.get("token");
  if (jwt) {
    const response = await fetch(`${config.host}/api/bol/offers/update`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: jwt }
    });
    const data = await response.json();
    return data;
  } else {
    return { error: true };
  }
};

export const createOffer = async (
  ean,
  condition,
  price,
  stockAmount,
  fulfilment
) => {
  const jwt = Cookies.get("token");
  const data = { ean, condition, price, stockAmount, fulfilment };
  if (jwt) {
    const response = await fetch(`${config.host}/api/bol/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: jwt },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return responseData;
  }
};

export const getOffer = id => {
  const jwt = Cookies.get("token");
  if (jwt) {
    fetch(`${config.host}/api/bol/offer/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: jwt }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }
};
export const getTrackedProducts = async () => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/products`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: jwt }
  });
  const data = await response.json();
  return data.products;
};
export const getTrackedProduct = async productId => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/products/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: jwt }
  });
  const data = await response.json();
  return data;
};

export const trackNewProduct = async productId => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ productId })
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getOfferTrackInfo = async id => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/offer/track/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: jwt }
  });
  const data = await response.json();
  return data;
};

export const getOffersTrackInfoOfProduct = async id => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/product/offers/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: jwt }
  });
  const data = await response.json();
  return data.offers;
};

export const updateAutoOffer = async bodyData => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/track/offer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify(bodyData)
  });
  const data = await response.json();
  return data;
};

export const getAutoOfferInfo = async autoOfferId => {
  const jwt = Cookies.get("token");
  const response = await fetch(
    `${config.host}/api/track/offer/${autoOfferId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: jwt }
    }
  );
  const data = await response.json();
  return data;
};

export const getUserOwnOffers = async () => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/bol/offers`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: jwt }
  });
  const data = await response.json();
  return data;
};

export const getCommission = async (ean, price) => {
  const jwt = Cookies.get("token");
  const response = await fetch(`${config.host}/api/track/commission`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: jwt },
    body: JSON.stringify({ ean, price })
  });
  const data = await response.json();
  return data;
};
