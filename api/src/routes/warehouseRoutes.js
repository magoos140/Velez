const express = require('express');
const router = express.Router();
const { getProductsByWarehouse, getWarehousesByCity } = require('../controllers/warehouseController');
const authenticateToken = require('../middlewares/authMiddleware');


router.get('/products',authenticateToken, async (req, res) => {
  try {
    const data = await getProductsByWarehouse(req, res);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal server error', detalle: error.message });
  }
});

router.get('/:cityId/warehouses', authenticateToken, getWarehousesByCity);

module.exports = router;