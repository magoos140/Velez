const express = require('express');
const router = express.Router();
const { getMovements } = require('../controllers/shipmentController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/movements', authenticateToken, getMovements);

module.exports = router;