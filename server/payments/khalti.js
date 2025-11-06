// Simple Khalti verification helper for Node.js (axios required)
const axios = require('axios');

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY; // server secret key (Key ...)
if (!KHALTI_SECRET_KEY) {
  console.warn('KHALTI_SECRET_KEY is not set. Khalti verification will fail until configured.');
}

const KHALTI_VERIFY_URL = process.env.KHALTI_VERIFY_URL || 'https://khalti.com/api/v2/payment/verify/';

/**
 * Verify Khalti payment token on server
 * @param {string} token - checkout token returned by Khalti client
 * @param {number} amount - amount in paisa (e.g., NPR 10.00 => 1000)
 * @returns {Promise<object>} verification data from Khalti
 */
async function verifyKhalti(token, amount) {
  if (!token || !amount) {
    throw new Error('token and amount are required for Khalti verification');
  }

  try {
    const res = await axios.post(
      KHALTI_VERIFY_URL,
      { token, amount },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    // Khalti returns a JSON object. Caller should verify amount/order id and persist.
    return res.data;
  } catch (err) {
    // Normalize error
    const payload = err.response?.data || { message: err.message || 'Khalti verification failed' };
    throw payload;
  }
}

module.exports = { verifyKhalti };