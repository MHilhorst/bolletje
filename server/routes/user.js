const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../config/keys');
const jwtAuth = require('express-jwt');
const fetch = require('node-fetch');

const secret = keys.secretJWT;

router.get('/', jwtAuth({ secret }), (req, res) => {
  User.findOne(
    { _id: req.user._id },
    { password: 0, email: 0 },
    (err, user) => {
      if (err) console.log(err);
      return res.json({ user });
    }
  );
});

router.post('/', jwtAuth({ secret }), (req, res) => {
  const toUpdate = {};
  if (req.body.bol_client_id) toUpdate.bol_client_id = req.body.bol_client_id;
  if (req.body.bol_client_secret)
    toUpdate.bol_client_secret = req.body.bol_client_secret;
  if (req.body.bol_shop_name) toUpdate.bol_shop_name = req.body.bol_shop_name;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: toUpdate },
    { new: true },
    (err, user) => {
      console.log(user);
      return res.json({ user });
    }
  );
});

router.put('/', jwtAuth({ secret }), (req, res) => {
  const toUpdate = {};
  if (req.body.firstName) toUpdate.first_name = req.body.firstName;
  if (req.body.lastName) toUpdate.last_name = req.body.lastName;
  if (req.body.address) toUpdate.address = req.body.address;
  if (req.body.zip) toUpdate.zip = req.body.zip;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: toUpdate },
    { new: true },
    (err, user) => {
      console.log(user);
      return res.json({ user });
    }
  );
});

router.get('/bol/auth', (req, res) => {
  fetch(`https://login.bol.com/token?grant_type=client_credentials`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(
        `${keys.bol.clientId}:${keys.bol.secret}`
      ).toString('base64')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      res.json({ succes: 'gang!' });
    })
    .catch(err => {
      console.log(err);
      return res.json({ error: 'helaas' });
    });
});

module.exports = router;
