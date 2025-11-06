// Express router with endpoints for Khalti and eSewa verification
const express = require('express');
const router = express.Router();

const { verifyKhalti } = require('../payments/khalti');
const { verifyEsewa } = require('../payments/esewa');

/**
 * POST /api/payments/khalti/verify
 * Body: { token: string, amount: number, orderId?: string }
 * amount should be in paisa (i.e., NPR*100) according to Khalti docs
 */
router.post('/payments/khalti/verify', async (req, res) => {
  try {
    const { token, amount, orderId } = req.body;
    if (!token || !amount) return res.status(400).json({ error: 'token and amount are required' });

    // Verify with Khalti
    const data = await verifyKhalti(token, amount);

    // TODO: check data.amount / data.idx / order id according to your flow, persist transaction
    // Example check (adjust based on actual data shape from Khalti):
    // if (data.amount !== amount) return res.status(400).json({ ok:false, error: 'amount mismatch' });

    return res.json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err });
  }
});

/**
 * POST /api/payments/esewa/verify
 * Body: { pid: string, amt: string, scd?: string, orderId?: string }
 * eSewa usually redirects back to your success URL with params; client should forward those to this endpoint.
 */
router.post('/payments/esewa/verify', async (req, res) => {
  try {
    const { pid, amt, scd } = req.body;
    if (!pid || !amt) return res.status(400).json({ error: 'pid and amt are required' });

    const result = await verifyEsewa(pid, amt, scd);
    // Persist transaction and handle business logic
    if (result.success) {
      return res.json({ ok: true, result });
    } else {
      return res.status(400).json({ ok: false, result });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: err });
  }
});

module.exports = router;