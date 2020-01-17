const fetch = require('node-fetch');
const keys = require('../config/keys');
const ip = require('ip');
const Product = require('../models/Product');
const { trackNewOffer } = require('./productChecker');

const baseUrl = 'https://api.bol.com';
const apiKey = keys.bol.apiAcces;
const queryApi = `?apikey=${apiKey}`;

const getOtherOffers = async ean => {
  const productId = await getProductIdWithEAN(ean);
  const response = await fetch(
    `${baseUrl}/catalog/v4/offers/${productId}${queryApi}&offers=all`,
    { method: 'GET' }
  );
  const data = await response.json();
  return data;
};

const getProductIdWithEAN = async ean => {
  const response = await fetch(
    `${baseUrl}/catalog/v4/search/${queryApi}&q=${ean}`
  );
  const data = await response.json();
  return data.products[0].id;
};

const getSession = async () => {
  const response = await fetch(`${baseUrl}/accounts/v4/sessions${queryApi}`, {
    method: 'GET'
  });
  const data = await response.json();
  return { 'X-OpenAPI-Session-ID': data.sessionId };
};

const getStock = async (publicOfferId, quantity) => {
  const sessionHeader = await getSession();
  const response = await fetch(
    `${baseUrl}/checkout/v4/baskets/${publicOfferId}/${quantity}/217.103.151.153/${queryApi}&format=json`,
    {
      method: 'POST',
      headers: {
        ...sessionHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  const cartItemResponse = await fetch(
    `${baseUrl}/checkout/v4/baskets/${queryApi}`,
    {
      method: 'GET',
      headers: { ...sessionHeader }
    }
  );
  const data = await cartItemResponse.json();
  if (data.totalAmountArticles === 0) {
    return false;
  } else {
    if (data.basketItems[0]) {
      return data.basketItems[0];
    }
  }
};

const getPriceOneItem = async publicOfferId => {
  const sessionHeader = await getSession();
  const response = await fetch(
    `${baseUrl}/checkout/v4/baskets/${publicOfferId}/${1}/217.103.151.153/${queryApi}&format=json`,
    {
      method: 'POST',
      headers: {
        ...sessionHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  const cartItemResponse = await fetch(
    `${baseUrl}/checkout/v4/baskets/${queryApi}`,
    {
      method: 'GET',
      headers: { ...sessionHeader }
    }
  );
  const data = await cartItemResponse.json();
  return data.basketItems[0].price;
};

const updateProductOffers = async (id, product) => {
  const response = await fetch(
    `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
  );
  const data = await response.json();
  const { offerData } = data.products[0];
  product.offer_ids = offerData.offers || [];
  product.last_offer_check = Date.now();
  return product.save();
};

const saveProduct = async id => {
  const productExist = await Product.findOne({
    product_id: id.toString()
  }).exec();
  if (!productExist) {
    const response = await fetch(
      `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
    );
    const data = await response.json();
    const { ean, title, rating, urls, images, offerData } = data.products[0];
    if (data.products[0]) {
      const newProduct = new Product({
        product_id: id,
        ean,
        title,
        rating,
        url: urls[0].value,
        img: images[3].url,
        offer_ids: offerData.offers
      });
      console.log(newProduct.id);
      newProduct.save();
      return newProduct;
    }
  } else {
    const response = await fetch(
      `${baseUrl}/catalog/v4/products/${id}${queryApi}&offers=all`
    );
    const data = await response.json();
    const { ean, title, rating, urls, images, offerData } = data.products[0];
    Product.findOneAndUpdate(
      { product_id: id },
      {
        $set: {
          title,
          ean,
          rating,
          url: urls[0].value,
          img: images[3].url,
          offer_ids: offerData.offers
        }
      },
      { new: true },
      (err, doc) => {
        return doc;
      }
    );
  }
};
module.exports.getOtherOffers = getOtherOffers;
module.exports.getSession = getSession;
module.exports.getStock = getStock;
module.exports.getProductIdWithEAN = getProductIdWithEAN;
module.exports.saveProduct = saveProduct;
module.exports.getPriceOneItem = getPriceOneItem;
module.exports.updateProductOffers = updateProductOffers;
