const express = require('express');
const router = express.Router();
const { getCitiesByProduct } = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/:productId/cities', authenticateToken, getCitiesByProduct);

module.exports = router;