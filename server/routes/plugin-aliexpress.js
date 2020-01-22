const express = require('express');
const User = require('../models/User');
const keys = require('../config/keys');
const secret = keys.secretJWT;
const router = express.Router();
const fetch = require('node-fetch');
const jwtAuth = require('express-jwt');
const InventoryItem = require('../models/InventoryItem');
const BolOffer = require('../models/BolOffer');
const { updateStock } = require('../services/bolServices');
const { getToken } = require('../services/accessToken');

router.get('/', jwtAuth({ secret }), async (req, res) => {
  const response = await fetch(
    `https://us-central1-thieve-co.cloudfunctions.net/api/thieve-products?sort=latest&type=main`,
    { method: 'GET' },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const data = await response.json();
  return res.json({ products: data.products });
});

module.exports = router;
