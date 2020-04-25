const express = require('express');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const jwtAuth = require('express-jwt');
const BolOffer = require('../models/BolOffer');
const { verificationEmail } = require('../services/email');
const InventoryItem = require('../models/InventoryItem');
const crypto = require('crypto');
const auth = require('../services/authMiddleware');
const router = express.Router();
const secret = process.env.JWT_KEY;

router.post('/register', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    });
    await user.save();
    const emailVerifyToken = new VerificationToken({
      userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    });
    emailVerifyToken.save(async (err) => {
      if (err) res.status(400).send({ error: true });
      const data = await verificationEmail(user, emailVerifyToken.token);
      if (data) {
        res.status(200).json({ user });
      }
    });
  } catch (error) {
    res.status(400).send({ error: true });
    throw error;
  }
});

router.get('/email/confirmation/:id', (req, res) => {
  const token = req.params.id;
  VerificationToken.findOne({ token }, (err, token) => {
    if (!token)
      return res.status(400).json({ error: true, message: 'not verified' });
    User.findOne({ _id: token.userId }, (err, user) => {
      if (err)
        return res.status(400).json({ error: true, message: 'user not found' });
      if (user.activated)
        return res.status(400).json({ message: 'user already activated' });
      user.activated = true;
      user.save((err) => {
        if (err)
          return res
            .status(500)
            .json({ error: true, message: 'could not save user' });
        res.redirect('https://app.snapse.nl/login');
      });
    });
  });
});

router.post('/email/resend', auth, async (req, res) => {
  const user = await User.findOne({
    _id: req.user._id,
    activated: false,
  }).exec();
  if (user) {
    const emailVerifyToken = new VerificationToken({
      userId: req.user._id,
      token: crypto.randomBytes(16).toString('hex'),
    });
    emailVerifyToken.save(async (err) => {
      if (err) res.status(400).send({ error: true });
      const data = await verificationEmail(user, emailVerifyToken.token);
      if (data) {
        res.status(200).json({ user });
      }
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: 'user already verified' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: true });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post('/logout', auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.token = '';
    await req.user.save();
    console.log(req.user);
    res.status(201).json({ success: 1 });
  } catch (error) {
    res.status(500).send(error);
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
