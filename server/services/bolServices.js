const fetch = require('node-fetch');
const csv = require('csvtojson');
const fs = require('fs');
const User = require('../models/User');
const { getToken } = require('../services/accessToken');
const postHeaders = (token) => {
  return {
    Authorization: token,
    Accept: 'application/vnd.retailer.v3+json',
    'Content-Type': 'application/vnd.retailer.v3+json',
  };
};
const getInventory = async (token) => {
  const response = await fetch('https://api.bol.com/retailer/inventory', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.retailer.v3+json',
      Authorization: token,
    },
  });
  const data = await response.json();
  return 'hi';
};

// API REQUESTS : 28 / Second
const getOffer = async (id, token) => {
  const response = await fetch(`https://api.bol.com/retailer/offers/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.retailer.v3+json',
      Authorization: token,
    },
  });
  return await response.json();
};

const getOffers = async (id, token) => {
  const myOffers = [];
  const response = await fetch(
    `https://api.bol.com/retailer/offers/export/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.retailer.v3+csv',
        Authorization: token,
      },
    }
  ).catch((err) => {
    console.log(err);
  });
  console.log(data);
  const data = await response.text();
  return csv().fromString(data);
};

const getOffersV2 = async (id, userId) => {
  const token = await getToken('5e024682eb7f3d01a4f1dd58');
  const response = await fetch(
    `https://api.bol.com/retailer/offers/export/${id}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.retailer.v3+csv',
        Authorization: token,
      },
    }
  ).catch((err) => {
    console.log(err);
  });
  const dest = fs.createWriteStream(`uploads/bol/${userId}.csv`);
  response.body.pipe(dest);
  return new Promise((resolve, reject) => {
    dest.on('finish', () => {
      resolve();
    });
    dest.on('error', (error) => {
      reject(error);
    });
  });
};

// const getOffersDemo = async (id) => {
//   const token = await getToken('5e024682eb7f3d01a4f1dd58');
//   const response = await fetch(
//     `https://api.bol.com/retailer-demo/offers/export/${id}`,
//     {
//       method: 'GET',
//       headers: {
//         Accept: 'application/vnd.retailer.v3+csv',
//         Authorization: token,
//       },
//     }
//   ).catch((err) => {
//     console.log(err);
//   });
//   const dest = fs.createWriteStream(`uploads/bol/${id}.csv`);
//   response.body.pipe(dest);
//   return new Promise((resolve, reject) => {
//     dest.on('finish', () => {
//       resolve();
//     });
//     dest.on('error', (error) => {
//       reject(error);
//     });
//   });
// };

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestProcessStatus = async (id, token, user, returnRequestId) => {
  let success = false;
  let retry = 0;
  let tokenTest;
  let dataEntityId;
  if (user) {
    tokenTest = await getToken(user._id); // Require a lot of calls to Mongoose
  }
  while (!success && retry < 20) {
    retry += 1;

    dataEntityId = await getProcessStatus(id, tokenTest || token);
    await sleep(500);
    if (
      dataEntityId.status === 'SUCCESS' &&
      dataEntityId.eventType === 'CREATE_OFFER_EXPORT'
    ) {
      if (user) {
        const updateExist = user.status.updates.findIndex((update) => {
          return update.id.toString() === id.toString();
        });
        if (updateExist !== -1) {
          User.findOneAndUpdate(
            { _id: user._id, 'status.updates.id': id.toString() },
            {
              $set: {
                'status.updates.$.status': dataEntityId.status,
                'status.updates.$.timestamp': Date.now(),
              },
            },
            { new: true },
            (err, doc) => {
              // console.log(doc.status.updates[updateExist]);
            }
          );
        } else {
          user.status.updates.push({
            id: id.toString(),
            status: dataEntityId.status,
            timestamp: Date.now(),
            entity_id: dataEntityId.entityId,
            total_items: null,
          });
        }
      }
      if (returnRequestId) {
        const { entityId } = dataEntityId;
        return { entityId, requestId: id };
      }
      const { entityId } = dataEntityId;
      return entityId;
    }
    if (
      dataEntityId.status === 'FAILURE' &&
      dataEntityId.eventType === 'CREATE_OFFER_EXPORT'
    ) {
      if (user) {
        const updateExist = user.status.updates.findIndex((update) => {
          return update.id.toString() === id.toString();
        });
        console.log(updateExist);
        if (updateExist !== -1) {
          User.findOneAndUpdate(
            { _id: user._id, 'status.updates.id': id.toString() },
            {
              $set: {
                'status.updates.$.status': dataEntityId.status,
                'status.updates.$.timestamp': Date.now(),
              },
            },
            { new: true }
          );
        } else {
          user.status.updates.push({
            id: id.toString(),
            status: dataEntityId.status,
            timestamp: Date.now(),
            entity_id: dataEntityId.entityId,
            total_items: null,
          });
        }
      }
      return false;
    }
    if (
      dataEntityId.eventType === 'UPDATE_OFFER_PRICE' &&
      dataEntityId.status === 'SUCCESS'
    ) {
      return dataEntityId.entityId;
    }
  }
  if (
    retry > 0 &&
    dataEntityId.status == 'PENDING' &&
    dataEntityId.eventType === 'CREATE_OFFER_EXPORT'
  ) {
    if (user) {
      const updateExist = user.status.updates.findIndex((update) => {
        return update.id.toString() === id.toString();
      });
      if (updateExist !== -1) {
        User.findOneAndUpdate(
          { _id: user._id, 'status.updates.id': id.toString() },
          {
            $set: {
              'status.updates.$.status': dataEntityId.status,
              'status.updates.$.timestamp': Date.now(),
            },
          },
          { new: true }
        );
      } else {
        user.status.updates.push({
          id: id.toString(),
          status: dataEntityId.status,
          timestamp: Date.now(),
          entity_id: dataEntityId.entityId,
          total_items: null,
        });
      }
      setTimeout(async () => {
        const token = await getToken(user._id);
        console.log('rerunning');
        const entityId = await requestProcessStatus(id, token, user);
      }, 1000 * 300);
    }
  }
  return false;
};

const getProcessStatus = async (id, token) => {
  const response = await fetch(
    // `https://api.bol.com/retailer/process-status/${3020364275}`,
    `https://api.bol.com/retailer/process-status/${id}`,

    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.retailer.v3+json',
        Authorization: token,
      },
    }
  );
  const data = await response.json();
  console.log(data.id, data.eventType, data.status);
  return data;
};
// e236fe2d-2506-4dfc-9dea-dc77dd4bb2f1

const requestOffersList = async (token, user, returnRequestId) => {
  const response = await fetch('https://api.bol.com/retailer/offers/export', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.retailer.v3+json',
      'Content-Type': 'application/vnd.retailer.v3+json',
      Authorization: token,
    },
    body: JSON.stringify({ format: 'CSV' }),
  });
  const data = await response.json();
  const rateLimit = response.headers.get('x-ratelimit-limit');
  const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
  const ratelimitReset = response.headers.get('x-ratelimit-reset');
  console.log('requesting', data.id);
  if (data.id) {
    return await requestProcessStatus(data.id, token, user, returnRequestId);
  } else {
    return false;
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
      name: condition,
    },
    pricing: {
      bundlePrices: [
        {
          quantity: 1,
          price: price,
        },
      ],
    },
    stock: {
      amount: stockAmount,
      managedByRetailer: false,
    },
    fulfilment: {
      type: 'FBR',
      deliveryCode: fulfilment,
    },
  };
  const response = await fetch('https://api.bol.com/retailer/offers', {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/vnd.retailer.v3+json',
      'Content-Type': 'application/vnd.retailer.v3+json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  } else {
    return { error: true };
  }
};

const updatePrice = async (offerId, price, token) => {
  const response = await fetch(
    `https://api.bol.com/retailer/offers/${offerId}/price`,
    {
      method: 'PUT',
      headers: {
        Authorization: token,
        Accept: 'application/vnd.retailer.v3+json',
        'Content-Type': 'application/vnd.retailer.v3+json',
      },
      body: JSON.stringify({
        pricing: { bundlePrices: [{ quantity: 1, price }] },
      }),
    }
  );
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  }
};

const updateStock = async (offerId, amount, token) => {
  const response = await fetch(
    `https://api.bol.com/retailer/offers/${offerId}/stock`,
    {
      method: 'PUT',
      headers: {
        Authorization: token,
        Accept: 'application/vnd.retailer.v3+json',
        'Content-Type': 'application/vnd.retailer.v3+json',
      },
      body: JSON.stringify({
        amount,
        managedByRetailer: false,
      }),
    }
  );
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  }
};

const updateAvailability = async (offerId, onHold, token) => {
  const response = await fetch(
    `https://api.bol.com/retailer/offers/${offerId}/stock`,
    {
      method: 'PUT',
      headers: {
        Authorization: token,
        Accept: 'application/vnd.retailer.v3+json',
        'Content-Type': 'application/vnd.retailer.v3+json',
      },
      body: JSON.stringify({
        onHoldByRetailer: onHold,
      }),
    }
  );
  const data = await response.json();
  if (data.id) {
    return await requestProcessStatus(data.id, token);
  }
};

const getCommission = async (ean, price, token) => {
  console.log(ean);
  const response = await fetch('https://api.bol.com/retailer/commission', {
    method: 'POST',
    headers: postHeaders(token),
    body: JSON.stringify({
      commissionQueries: [
        {
          ean,
          condition: 'NEW',
          price,
        },
      ],
    }),
  });
  const data = await response.json();
  if (data.commissions) {
    return data.commissions[0];
  } else {
    return { error: true };
  }
};
const getOpenOrders = async (token) => {
  const response = await fetch(
    'https://api.bol.com/retailer-demo/orders?fulfilment-method=FBR',
    {
      method: 'GET',
      headers: {
        Authorization: token,
        Accept: 'application/vnd.retailer.v3+json',
        'Content-Type': 'application/vnd.retailer.v3+json',
      },
    }
  );
  const data = await response.json();
  return data;
};

const getDetailedOrder = async (orderId, token) => {
  const response = await fetch(
    `https://api.bol.com/retailer-demo/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        Authorization: token,
        Accept: 'application/vnd.retailer.v3+json',
        'Content-Type': 'application/vnd.retailer.v3+json',
      },
    }
  );
  const data = await response.json();
  return data;
};

module.exports.getInventory = getInventory;
module.exports.createOffer = createOffer;
module.exports.getOffer = getOffer;
module.exports.requestOffersList = requestOffersList;
module.exports.getOffers = getOffers;
module.exports.requestProcessStatus = requestProcessStatus;
module.exports.updatePrice = updatePrice;
module.exports.updateStock = updateStock;
module.exports.getCommission = getCommission;
module.exports.getOpenOrders = getOpenOrders;
module.exports.updateAvailability = updateAvailability;
module.exports.getDetailedOrder = getDetailedOrder;
// module.exports.getOffersDemo = getOffersDemo;
module.exports.getOffersV2 = getOffersV2;
