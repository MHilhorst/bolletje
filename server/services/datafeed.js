const csv = require('csv-parser');
const fs = require('fs');
const { getToken } = require('./accessToken');
const { updatePrice } = require('./bolServices');
const RepricerOffer = require('../models/RepricerOffer');

const syncOfferWithDataFeed = async (user) => {
  let offersInDataFeed = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(`uploads/csv/${user._id}.csv`)
      .pipe(csv())
      .on('data', async (row) => {
        const repricerOffer = await RepricerOffer.findOne(
          {
            ean: row.ean,
            user_id: user._id,
          },
          { updates: 0, offers_visible: 0 }
        ).exec();
        if (repricerOffer) {
          offersInDataFeed.push(row.ean);
          if (row.repricer_increment) {
            repricerOffer.repricer_increment = Number(row.repricer_increment);
          }
          if (row.active.toLowerCase() == 'true' && row.min_price) {
            repricerOffer.repricer_active = true;
            repricerOffer.min_price = row.min_price;
          }
          if (
            repricerOffer.repricer_active &&
            row.active == 'false' &&
            row.original_price
          ) {
            console.log('updating price with', row.original_price);
            repricerOffer.repricer_active = false;
            const token = await getToken(user._id);
            const data = await updatePrice(
              repricerOffer.offer_id,
              Number(row.original_price),
              token
            );
            if (data) {
              repricerOffer.price = Number(row.original_price);
            }
          }
          if (
            repricerOffer.price !== Number(row.original_price) &&
            row.active == 'false' &&
            row.original_price
          ) {
            repricerOffer.repricer_active = false;
            console.log('updating price with', row.original_price);
            const token = await getToken(user._id);
            const data = await updatePrice(
              repricerOffer.offer_id,
              Number(row.original_price),
              token
            );
            if (data) {
              repricerOffer.price = Number(row.original_price);
            }
          }
          await repricerOffer.save();
          resolve(offersInDataFeed);
        }
        reject();
      });
  });
};

module.exports.syncOfferWithDataFeed = syncOfferWithDataFeed;
