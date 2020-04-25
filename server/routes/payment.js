const express = require('express');
const { createMollieClient } = require('@mollie/api-client');
const auth = require('../services/authMiddleware');
const User = require('../models/User');
const router = express.Router();

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

const getFormattedDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return (
    yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd)
  );
};

const addMonths = (date, months) => {
  const d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return getFormattedDate(date);
};

router.post('/webhook', async (req, res) => {
  const orderId = req.body.id;
  const payment = await mollieClient.payments.get(orderId).catch((err) => {
    console.error(err);
  });
  if (payment.isPaid()) {
    const user = await User.findById(payment.metadata.userId).exec();
    const subscription = payment.metadata.subscription;
    if (subscription === 'SMALL') {
      user.subscription.account_type = 'SMALL';
      user.subscription.max_track_items = 30;
      user.subscription.repricer_enabled = false;
      user.subscription.repricer_max_track_items = 0;
    }
    if (subscription === 'MEDIUM') {
      user.subscription.account_type = 'MEDIUM';
      user.subscription.max_track_items = 40;
      user.subscription.repricer_enabled = true;
      user.subscription.repricer_max_track_items = 30;
    }
    const historyPayments = await mollieClient.customers_payments.all({
      count: 50,
      customerId: payment.customerId,
    });
    const mandate = await mollieClient.customers_mandates.get(
      payment.mandateId,
      { customerId: payment.customerId }
    );
    user.subscription.mollie_mandate = mandate;
    user.subscription.payment_history = historyPayments;
    const subscriptionCreate = await mollieClient.customers_subscriptions.create(
      {
        customerId: payment.customerId,
        amount: { value: payment.amount.value, currency: 'EUR' },
        startDate: addMonths(new Date(), 1),
        interval: '1 month',
        description: `Monthly Subscription Snapse subscription : ${subscription}`,
        webhookUrl: 'http://ce05dd6e.ngrok.io/api/payment/webhook',
      }
    );
    user.subscription.mollie_subscription = subscriptionCreate;
    user.save();
    if (subscriptionCreate) {
      console.log('subscription created');
      res.status(200).send('ok');
    }
  }
});

router.post('/upgrade', auth, async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).exec();
    if (user.subscription.account_type !== req.body.accountType) {
      if (req.body.accountType === 'SMALL') {
        let customerId;
        if (!user.subscription.mollie_customer) {
          customer = await mollieClient.customers.create({
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            metadata: {
              id: user._id,
            },
          });
          user.subscription.mollie_customer = customer;
          customerId = customer.id;
          await user.save();
        } else {
          customerId = user.subscription.mollie_customer.id;
        }
        mollieClient.customers_payments
          .create({
            amount: { value: '5.00', currency: 'EUR' },
            description: 'Snapse.nl | SMALL Abonnement',
            redirectUrl: 'http://ce05dd6e.ngrok.io/dashboard',
            webhookUrl: 'http://ce05dd6e.ngrok.io/api/payment/webhook',
            metadata: { userId: user._id, subscription: 'SMALL' },
            sequenceType: 'first',
            customerId,
          })
          .then((payment) => {
            res.json({ url: payment.getCheckoutUrl() });
          });
      }
      if (req.body.accountType === 'MEDIUM') {
        let customerId;
        if (!user.subscription.mollie_customer) {
          customer = await mollieClient.customers.create({
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            metadata: {
              id: user._id,
            },
          });
          user.subscription.mollie_customer = customer;
          customerId = customer.id;
          await user.save();
        } else {
          customerId = user.subscription.mollie_customer.id;
        }
        mollieClient.customers_payments
          .create({
            amount: { value: '10.00', currency: 'EUR' },
            description: 'Snapse.nl | MEDIUM Abonnement',
            redirectUrl: 'http://ce05dd6e.ngrok.io/dashboard',
            webhookUrl: 'http://ce05dd6e.ngrok.io/api/payment/webhook',
            metadata: { userId: user._id, subscription: 'MEDIUM' },
            sequenceType: 'first',
            customerId,
          })
          .then((payment) => {
            console.log(payment);
            res.json({ url: payment.getCheckoutUrl() });
          });
      }
    } else {
      res.json({
        error: true,
        description: 'You already have this subscription',
      });
    }
  }
});

module.exports = router;
