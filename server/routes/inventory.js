const express = require('express');
const User = require('../models/User');
const keys = require('../config/keys');
const secret = keys.secretJWT;
const router = express.Router();
const jwtAuth = require('express-jwt');
const InventoryItem = require('../models/InventoryItem');
const BolOffer = require('../models/BolOffer');
const { updateStock } = require('../services/bolServices');
const { getToken } = require('../services/accessToken');
router.get('/', jwtAuth({ secret }), async (req, res) => {
  const items = await InventoryItem.find({ user_id: req.user._id }).exec();
  return res.json({ items });
});

router.post('/', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    console.log(req.body.productName);
    const newInventoryItem = new InventoryItem({
      user_id: req.user._id,
      product_name: req.body.productName,
      stock: req.body.stock,
      platform_available: req.body.platforms
    });
    newInventoryItem.save({}, (err, doc) => {
      return res.json({ doc });
    });
  }
});

router.put('/:id', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const inventoryItemIns = await InventoryItem.findById(req.params.id).exec();
    if (req.body.bolId) {
      inventoryItemIns.bol_id = req.body.bolId;
      const bolOffer = await BolOffer.findById(req.body.bolId).exec();
      bolOffer.linked_to_inventory_item = true;
      const token = await getToken(req.user._id);
      const data = await updateStock(
        bolOffer.offer_id,
        inventoryItemIns.stock,
        token
      );
      bolOffer.save();
    }
    if (req.body.removeBolId) {
      const bolOffer = await BolOffer.findById(inventoryItemIns.bol_id).exec();
      bolOffer.linked_to_inventory_item = false;
      inventoryItemIns.bol_id = '';
      bolOffer.save();
    }
    if (req.body.productName)
      inventoryItemIns.product_name = req.body.productName;
    if (req.body.stock) {
      inventoryItemIns.stock = req.body.stock;
      const bolOffer = await BolOffer.findById(inventoryItemIns.bol_id).exec();
      const token = await getToken(req.user._id);
      const data = await updateStock(
        bolOffer.offer_id,
        inventoryItemIns.stock,
        token
      );
    }
    inventoryItemIns.save();
    return res.json({ inventoryItem: inventoryItemIns });
  }
});

router.delete('/:id', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    InventoryItem.findOneAndDelete(
      { user_id: req.user._id, _id: req.params.id },
      async (err, doc) => {
        if (err) console.log(err);
        if (doc.bol_id) {
          const bolOffer = await BolOffer.findOne({ _id: doc.bol_id }).exec();
          bolOffer.linked_to_inventory_item = false;
          bolOffer.save();
        }
        return res.json({ success: true });
      }
    );
  }
});
module.exports = router;
