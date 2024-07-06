const SSLCommerzPayment = require('sslcommerz-lts');

const store_id =process.env.STORE_ID
const store_passwd = process.env.STORE_ID
const is_live = false; // true for live, false for sandbox

module.exports = new SSLCommerzPayment(store_id, store_passwd, is_live);
