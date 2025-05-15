// src/repositories/productRepository.js
const prisma = require('../db/prisma');

const ProductRepository = {
  async getDestinationCities(productId) {
    const shipments = await prisma.shipment.findMany({
      where: { productId },
      select: {
        city: {
          select: {
            id: true,
            name: true,
            state: true,
            country: true
          }
        }
      }
    });

    const cityMap = shipments.reduce((map, { city }) => {
      if (!map.has(city.id)) {
        map.set(city.id, {
          cityId: city.id,
          name: city.name,
          state: city.state,
          country: city.country
        });
      }
      return map;
    }, new Map());

    return Array.from(cityMap.values());
  }
};

module.exports = ProductRepository;
