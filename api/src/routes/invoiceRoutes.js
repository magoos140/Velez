const express = require('express');
const router = express.Router();
const { syncInvoices } = require('../controllers/invoiceController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const result = await syncInvoices();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error syncing invoices', detalle: error.message });
  }
});

module.exports = router;