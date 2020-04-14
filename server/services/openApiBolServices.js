const fetch = require('node-fetch');
const keys = require('../config/keys');
const Product = require('../models/Product');
const baseUrl = 'https://api.bol.com';
const apiKey = keys.bol.apiAcces;
const queryApi = `?apikey=${apiKey}`;

let totalRequests = 0;

const countCalls = (amount) => {
  totalRequests += amount;
};
const showTotalCalls = () => {
  console.log(totalRequests);
  return totalRequests;
};
const resetTotalCalls = () => {
  totalRequests = 0;
};
const getOtherOffers = async (ean) => {
  const productId = await getProductIdWithEAN(ean);
  const response = await fetch(
    `${baseUrl}/catalog/v4/offers/${productId}${queryApi}&offers=all`,
    { method: 'GET' }
  );
  const data = await response.json();
  countCalls(1);
  return data;
};

const getProductIdWithEAN = async (ean) => {
  const response = await fetch(
    `${baseUrl}/catalog/v4/search/${queryApi}&q=${ean}`
  );
  const data = await response.json();
  countCalls(1);
  return data.products[0].id;
};

const getSession = async () => {
  const response = await fetch(`${baseUrl}/accounts/v4/sessions${queryApi}`, {
    method: 'GET',
  });
  const data = await response.json();
  countCalls(1);
  return { 'X-OpenAPI-Session-ID': data.sessionId };
};

const getStock = async (publicOfferId, quantity) => {
  const sessionHeader = await getSession();
  await fetch(
    `${baseUrl}/checkout/v4/baskets/${publicOfferId}/${quantity}/217.103.151.153/${queryApi}&format=json`,
    {
      method: 'POST',
      headers: {
        ...sessionHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  countCalls(1);
  const cartItemResponse = await fetch(
    `${baseUrl}/checkout/v4/baskets/${queryApi}`,
    {
      method: 'GET',
      headers: { ...sessionHeader },
    }
  );
  countCalls(1);
  const data = await cartItemResponse.json();
  if (data.totalAmountArticles === 0) {
    return false;
  } else {
    if (data.basketItems[0]) {
      return data.basketItems[0];
    }
  }
};

const getPriceOneItem = async (publicOfferId) => {
  const sessionHeader = await getSession();
  await fetch(
    `${baseUrl}/checkout/v4/baskets/${publicOfferId}/${1}/217.103.151.153/${queryApi}&format=json`,
    {
      method: 'POST',
      headers: {
        ...sessionHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  countCalls(1);
  const cartItemResponse = await fetch(
    `${baseUrl}/checkout/v4/baskets/${queryApi}`,
    {
      method: 'GET',
      headers: { ...sessionHeader },
    }
  );
  countCalls(1);
  const data = await cartItemResponse.json();
  if (data.total === 0) {
    return false;
  }
  return data.basketItems[0].price;
};

const filterOffers = async (offerData, product, max) => {
  let maxLength = max;
  const condition = ['Als nieuw', 'Nieuw', 'Goed'];
  const preSortOffers = [];
  const bolOffer = [];
  const bannedSellers = ['916223'];
  offerData.offers.forEach((offer) => {
    if (offer.seller.id === '0') {
      bolOffer.push(offer);
    } else if (bannedSellers.includes(offer.seller.id)) {
      return;
    } else if (!condition.includes(offer.condition)) {
      return;
    } else {
      preSortOffers.push(offer);
    }
  });
  const sortedOffers = preSortOffers
    .sort((a, b) => {
      return a.price - b.price;
    })
    .slice(0, maxLength || preSortOffers.length - 1);
  const finalOffers =
    bolOffer.length > 0 ? sortedOffers.concat(bolOffer) : sortedOffers;
  product.offer_ids = finalOffers || [];
  product.active_offers = finalOffers.map((offer) => {
    return offer.id;
  });
  return product;
};

const updateProductOffers = async (id, product) => {
  const response = await fetch(
    `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
  );
  const data = await response.json();
  countCalls(1);
  try {
    const { offerData } = data.products[0];
    if (offerData.offers) {
      await filterOffers(offerData, product, 5);
    } else {
      product.offer_ids = [];
      product.active_offers = [];
    }
    product.last_offer_check = Date.now();
    await product.save().then(() => {});
    return product;
  } catch (error) {
    console.log('error updateProductOffers');
    console.log(error);
    return false;
  }
};

// const updateProduct = async (id) => {
//   const response = await fetch(
//     `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
//   );
//   countCalls(1);
//   const data = await response.json();
//   if (data.products[0]) {
//     const { ean, title, rating, urls, images, offerData } = data.products[0];
//     Product.findOneAndUpdate(
//       { product_id: id },
//       {
//         $set: {
//           title,
//           ean,
//           rating,
//           url: urls[0].value,
//           img: images[3].url,
//         },
//         $addToSet: {
//           offer_ids: offerData.offers,
//         },
//       },
//       { new: true },
//       (err, doc) => {
//         return doc;
//       }
//     );
//   }
// };

// Add Bol.com if it is not in the top 5 as it will always be the buyblock.
const saveProduct = async (id) => {
  const productExist = await Product.findOne({
    product_id: id.toString(),
  }).exec();
  if (!productExist) {
    const response = await fetch(
      `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
    );
    countCalls(1);
    const data = await response.json();
    if (data.products[0]) {
      const { ean, title, rating, urls, images, offerData } = data.products[0];
      const newProduct = new Product({
        product_id: id,
        ean,
        title,
        rating,
        url: urls[0].value,
        img: images[3].url,
      });
      if (offerData.offers) {
        await filterOffers(offerData, newProduct, 5);
      } else {
        newProduct.offer_ids = [];
        newProduct.active_offers = [];
      }
      await newProduct.save();
      return { product: newProduct, newProduct: true };
    } else {
      console.trace('Error');
      return { error: true };
    }
  } else {
    return { product: productExist, newProduct: false };
    // const response = await fetch(
    //   `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
    // );
    // countCalls(1);
    // const data = await response.json();
    // if (data.products[0]) {
    //   const { ean, title, rating, urls, images, offerData } = data.products[0];
    //   Product.findOneAndUpdate(
    //     { product_id: id },
    //     {
    //       $set: {
    //         title,
    //         ean,
    //         rating,
    //         url: urls[0].value,
    //         img: images[3].url,
    //       },
    //       $addToSet: {
    //         offer_ids: offerData.offers,
    //       },
    //     },
    //     { new: true },
    //     (err, doc) => {
    //       return doc;
    //     }
    //   );
    // } else {
    //   console.trace('Error');
    //   return { error: true };
    // }
  }
};
module.exports.getOtherOffers = getOtherOffers;
module.exports.getSession = getSession;
module.exports.getStock = getStock;
module.exports.getProductIdWithEAN = getProductIdWithEAN;
module.exports.saveProduct = saveProduct;
module.exports.getPriceOneItem = getPriceOneItem;
module.exports.updateProductOffers = updateProductOffers;
module.exports.showTotalCalls = showTotalCalls;
module.exports.resetTotalCalls = resetTotalCalls;
module.exports.totalRequests = totalRequests;
