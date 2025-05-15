const WarehouseRepository = require('../repositories/warehouseRepository');

async function getProductsByWarehouse(req, res) {
  try {
    const data = await WarehouseRepository.getProductsPerWarehouse();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getWarehousesByCity(req, res) {
  const cityId = parseInt(req.params.cityId, 10);
  if (isNaN(cityId)) {
    return res.status(400).json({ error: 'cityId inválido' });
  }

  try {
    const result = await WarehouseRepository.getWarehousesByCity(cityId);
    res.json(result);
  } catch (err) {
    console.error('[Controller] getWarehousesByCity error:', err);
    res.status(500).json({ error: 'Internal server error', detalle: err.message });
  }
}

module.exports = { getProductsByWarehouse, getWarehousesByCity };