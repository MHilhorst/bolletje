const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const keys = require('../config/keys');
const jwtAuth = require('express-jwt');
const BolOffer = require('../models/BolOffer');
const InventoryItem = require('../models/InventoryItem');
const secret = keys.secretJWT;

router.post('/register', (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (user) {
        res.json({
          error: 'User already exists'
        });
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                return res.status(200).json(user);
              })
              .catch(err => {
                console.log(err);
                return res.status(400).json(err);
              });
          });
        });
      }
    }
  );
});

router.get('/profile', jwtAuth({ secret: secret }), (req, res) => {
  console.log(req.headers);
  if (req.user) {
    const { user } = req;
    res.send({ user });
  } else {
    res.json({ error: 'No user logged in' });
  }
});

router.post('/login', (req, res) => {
  let data = { email: req.body.email };
  User.findOne(data)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'No account found' });
      } else {
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
          if (isMatch) {
            const payload = {
              _id: user._id,
              email: user.email,
              driver: user.driver
            };
            jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
              if (err) {
                res
                  .status(500)
                  .json({ error: 'Error signing token', raw: err });
              } else {
                res.status(200).json({
                  success: true,
                  token: `Bearer ${token}`,
                  user: user
                });
              }
            });
          } else {
            res.status(400).json({ error: 'Password is incorrect' });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/logout', jwtAuth({ secret }), (req, res) => {
  if (req.user) {
    req.logout();
    res.status(200).json({ success: 'You succesfully logged out' });
  }
});

router.get('/offer/:id', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).exec();
    const userOffer = await BolOffer.findById(req.params.id).exec();
    if (req.user._id === userOffer.user_id) return res.json({ userOffer });
  }
});
router.get('/inventory/:id', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).exec();
    const inventoryOffer = await InventoryItem.findById(req.params.id).exec();
    if (req.user._id === inventoryOffer.user_id)
      return res.json({ ...inventoryOffer._doc });
  }
});

module.exports = router;
