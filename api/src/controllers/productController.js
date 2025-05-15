const ProductRepository = require('../repositories/productRepository');

async function getCitiesByProduct(req, res) {
  const { productId } = req.params;
  try {
    const cities = await ProductRepository.getDestinationCities(productId);
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', detalle: err.message });
  }
}

module.exports = { getCitiesByProduct };
