const User = require('../models/User');
const fetch = require('node-fetch');

const getUser = async (id) => {
  return await User.findOne({ _id: id }).exec();
};

const updateUserAccessToken = (access_token, user) => {
  User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        access_token: access_token,
        last_update_access_token: Date.now(),
      },
    },
    { new: true },
    (err, user) => {
      if (err) console.log(err);
    }
  );
};

const getNewToken = async (id) => {
  const user = await getUser(id);
  const response = await fetch(
    `https://login.bol.com/token?grant_type=client_credentials`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${user.bol_client_id}:${user.bol_client_secret}`
        ).toString('base64')}`,
      },
    }
  );
  const data = await response.json();
  const { access_token } = data;
  updateUserAccessToken(access_token, user);
  return `Bearer ${access_token}`;
};

const getToken = async (id) => {
  const user = await getUser(id);
  const timeDifference = (Date.now() - user.last_update_access_token) / 1000;
  if (timeDifference < 240) {
    return `Bearer ${user.access_token}`;
  } else {
    return getNewToken(id);
  }
};

module.exports.getToken = getToken;
