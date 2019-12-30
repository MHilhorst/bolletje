const fetch = require("node-fetch");
const fs = require("fs");
const csv = require("csvtojson");

const getInventory = async token => {
  const response = await fetch("https://api.bol.com/retailer/inventory", {
    method: "GET",
    headers: {
      Accept: "application/vnd.retailer.v3+json",
      Authorization: token
    }
  });
  const data = await response.json();
  return "hi";
};

const getOffer = async (token, id) => {
  const response = await fetch(`https://api.bol.com/retailer/offers/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.retailer.v3+json",
      Authorization: token
    }
  });
  const data = await response.json();
  return data;
};

const getOffers = async (token, id, user) => {
  const myOffers = [];
  const response = await fetch(
    `https://api.bol.com/retailer/offers/export/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.retailer.v3+csv",
        Authorization: token
      }
    }
  ).catch(err => {
    console.log(err);
  });
  const data = await response.text();
  return csv().fromString(data);
};

const slowCall = async (id, token) => {
  return setTimeout(async () => {
    return await fetch(`https://api.bol.com/retailer/process-status/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/vnd.retailer.v3+json",
        Authorization: token
      }
    });
  }, 1000);
};

const requestProcessStatus = async (id, token) => {
  let success = false;
  let retry = 0;

  while (!success && retry < 200) {
    retry += 1;
    const entityIdResponse = await fetch(
      `https://api.bol.com/retailer/process-status/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.retailer.v3+json",
          Authorization: token
        }
      }
    );
    const dataEntityId = await entityIdResponse.json();
    if (dataEntityId.status === "SUCCESS") {
      success = true;
      const { entityId } = dataEntityId;
      return entityId;
    }
    if (dataEntityId.status === "FAILURE") {
      break;
    }
  }
  return { error: true };
};

const requestOffersList = async token => {
  const response = await fetch("https://api.bol.com/retailer/offers/export", {
    method: "POST",
    headers: {
      Accept: "application/vnd.retailer.v3+json",
      "Content-Type": "application/vnd.retailer.v3+json",
      Authorization: token
    },
    body: JSON.stringify({ format: "CSV" })
  });
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  } else {
    return { error: true };
  }
};

const createOffer = async (
  token,
  ean,
  condition,
  price,
  stockAmount,
  fulfilment
) => {
  body = {
    ean: ean,
    condition: {
      name: condition
    },
    pricing: {
      bundlePrices: [
        {
          quantity: 1,
          price: price
        }
      ]
    },
    stock: {
      amount: stockAmount,
      managedByRetailer: false
    },
    fulfilment: {
      type: "FBR",
      deliveryCode: fulfilment
    }
  };
  const response = await fetch("https://api.bol.com/retailer/offers", {
    method: "POST",
    headers: {
      Authorization: token,
      Accept: "application/vnd.retailer.v3+json",
      "Content-Type": "application/vnd.retailer.v3+json"
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  } else {
    return { error: true };
  }
};

module.exports.getInventory = getInventory;
module.exports.createOffer = createOffer;
module.exports.getOffer = getOffer;
module.exports.requestOffersList = requestOffersList;
module.exports.getOffers = getOffers;
module.exports.requestProcessStatus = requestProcessStatus;
