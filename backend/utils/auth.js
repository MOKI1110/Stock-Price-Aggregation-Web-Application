const axios = require('axios');
require('dotenv').config();

let tokenCache = {
  accessToken: null,
  expiry: 0
};

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  if (tokenCache.accessToken && now < tokenCache.expiry) {
    return tokenCache.accessToken;
  }

  const response = await axios.post(process.env.AUTH_URL, {
    email: process.env.EMAIL,
    name: process.env.NAME,
    rollNo: process.env.ROLL,
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  const { access_token, expires_in } = response.data;
  tokenCache.accessToken = access_token;
  tokenCache.expiry = expires_in;

  return access_token;
}

module.exports = { getAccessToken };
