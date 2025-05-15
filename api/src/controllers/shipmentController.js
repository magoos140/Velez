const ShipmentRepository = require('../repositories/shipmentRepository');

async function getMovements(req, res) {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'Debe enviar los parámetros from y to (YYYY-MM-DD)' });
  }

  try {
    const movements = await ShipmentRepository.getMovementsByPeriod(from, to);
    res.json(movements);
  } catch (err) {
    console.error('[Controller] getMovements error:', err);
    res.status(500).json({ error: 'Internal server error', detalle: err.message });
  }
}

module.exports = { getMovements };