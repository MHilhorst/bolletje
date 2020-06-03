const WooCommerceAPI = require('woocommerce-api');

const postOrderWooCommerce = async (order, wcConnection) => {
  const wooCommerce = new WooCommerceAPI({
    url: wcConnection.url,
    consumerKey: wcConnection.consumer_key,
    consumerSecret: wcConnection.consumer_secret,
    version: 'wc/v3',
    wpAPI: true,
  });

  const data = {
    set_paid: true,
    currency: 'EUR',
    status: 'pending',
    created_via: 'Snapse.nl | Bol.com',
    date_created: order.order_date,
    billing: {
      first_name: order.customer_details.billingDetails.firstName,
      last_name: order.customer_details.billingDetails.surName,
      address_1:
        order.customer_details.billingDetails.streetName +
        ' ' +
        order.customer_details.billingDetails.houseNumber,
      city: order.customer_details.billingDetails.city,
      postcode: order.customer_details.billingDetails.zipCode,
      country: order.customer_details.billingDetails.countryCode,
      email: order.customer_details.billingDetails.email,
    },
    shipping: {
      first_name: order.customer_details.shipmentDetails.firstName,
      last_name: order.customer_details.shipmentDetails.surName,
      address_1:
        order.customer_details.shipmentDetails.streetName +
        ' ' +
        order.customer_details.billingDetails.houseNumber,
      address_2: order.customer_details.shipmentDetails.houseNumberExtended,
      city: order.customer_details.shipmentDetails.city,
      postcode: order.customer_details.shipmentDetails.zipCode,
      country: order.customer_details.shipmentDetails.countryCode,
      email: order.customer_details.shipmentDetails.email,
    },
    currency_symbol: '€',

    line_items: order.order_items.map((item) => {
      return {
        // product_id: item.offerReference,
        product_id: 52549,
        quantity: item.quantity,
        name: item.title,
      };
    }),
  };
  wooCommerce.postAsync('orders', data).then(async (response) => {
    console.log(JSON.parse(response.body));
  });
};

module.exports.postOrderWooCommerce = postOrderWooCommerce;
