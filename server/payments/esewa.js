// eSewa verification helper for Node.js (axios + querystring required)
const axios = require('axios');
const qs = require('querystring');

const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || process.env.ESEWA_SCD; // scd param
const ESEWA_VERIFY_URL =
  process.env.ESEWA_VERIFY_URL || 'https://esewa.com.np/epay/transrec'; // default production verify endpoint

if (!ESEWA_MERCHANT_CODE) {
  console.warn('ESEWA_MERCHANT_CODE (scd) is not set. eSewa verification will likely fail until configured.');
}

/**
 * Verify eSewa payment on server
 * @param {string} pid - payment id / order id received from client (oid/pid)
 * @param {string|number} amt - amount as string or number (must match original amount)
 * @param {string} scd - merchant code (optional; default from env)
 * @returns {Promise<{success:boolean, raw:string}>}
 */
async function verifyEsewa(pid, amt, scd = ESEWA_MERCHANT_CODE) {
  if (!pid || !amt) {
    throw new Error('pid and amt are required for eSewa verification');
  }
  if (!scd) {
    throw new Error('Merchant code (scd) is required for eSewa verification');
  }

  const payload = { pid, amt, scd };
  try {
    // eSewa expects form-encoded POST
    const res = await axios.post(ESEWA_VERIFY_URL, qs.stringify(payload), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
    });

    const body = res.data;
    // eSewa responses are usually HTML/XML with "Success" or "Failed"
    const success = typeof body === 'string' && /Success/i.test(body);
    return { success, raw: body };
  } catch (err) {
    const payloadErr = err.response?.data || { message: err.message || 'eSewa verification failed' };
    throw payloadErr;
  }
}

module.exports = { verifyEsewa };