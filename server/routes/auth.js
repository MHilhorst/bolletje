const express = require('express');
const User = require('../models/User');
const jwtAuth = require('express-jwt');
const BolOffer = require('../models/BolOffer');
const InventoryItem = require('../models/InventoryItem');
const { createMollieClient } = require('@mollie/api-client');
const bcrypt = require('bcryptjs');
const auth = require('../services/authMiddleware');
const router = express.Router();
const secret = process.env.JWT_KEY;

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

// router.post('/register', (req, res) => {
//   User.findOne(
//     {
//       email: req.body.email,
//     },
//     (err, user) => {
//       if (user) {
//         res.json({
//           error: 'User already exists',
//         });
//       } else {
//         const newUser = new User({
//           email: req.body.email,
//           password: req.body.password,
//         });
//         bcrypt.genSalt(10, (err, salt) => {
//           if (err) throw err;
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then((user) => {
//                 return res.status(200).json(user);
//               })
//               .catch((err) => {
//                 console.log(err);
//                 return res.status(400).json(err);
//               });
//           });
//         });
//       }
//     }
//   );
// });

router.post('/register', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ token, user: user });
  } catch (error) {
    res.status(400).send(error);
    throw error;
  }
});

// router.get('/profile', jwtAuth({ secret: secret }), (req, res) => {
//   console.log(req.headers);
//   if (req.user) {
//     const { user } = req;
//     res.send({ user });
//   } else {
//     res.json({ error: 'No user logged in' });
//   }
// });

// router.post('/login', (req, res) => {
//   let data = { email: req.body.email };
//   User.findOne(data)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ error: 'No account found' });
//       } else {
//         bcrypt.compare(req.body.password, user.password).then((isMatch) => {
//           if (isMatch) {
//             const payload = {
//               _id: user._id,
//               email: user.email,
//               driver: user.driver,
//             };
//             jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
//               if (err) {
//                 res
//                   .status(500)
//                   .json({ error: 'Error signing token', raw: err });
//               } else {
//                 return res.status(200).json({
//                   success: true,
//                   token: `Bearer ${token}`,
//                   user: user,
//                 });
//               }
//             });
//           } else {
//             res.status(400).json({ error: 'Password is incorrect' });
//           }
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

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

router.get('/upgrade', jwtAuth({ secret }), async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).exec();
    if (user.premium_account) {
      mollieClient.payments
        .create({
          amount: { value: '5.00', currency: 'EUR' },
          description: 'Premium Abbonement',
          redirectUrl: ' http://720f33ed.ngrok.io/dashboard',
          webhookUrl: ' http://720f33ed.ngrok.io/webhook',
        })
        .then((payment) => {
          console.log(payment);
          res.json({ url: payment.getCheckoutUrl() });
        });
    }
  }
});

module.exports = router;
