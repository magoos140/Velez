const prisma = require('../db/prisma');

const WarehouseRepository = {
  async getProductsPerWarehouse() {
    const result = await prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        shipments: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                skuName: true
              }
            }
          }
        }
      }
    });

    return result.map(warehouse => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      products: Object.values(
        warehouse.shipments.reduce((acc, shipment) => {
          const product = shipment.product;
          if (!acc[product.id]) {
            acc[product.id] = {
              productId: product.id,
              productName: product.name,
              skuName: product.skuName
            };
          }
          return acc;
        }, {})
      )
    }));
  },

  async getWarehousesByCity(cityId) {
    const warehouses = await prisma.warehouse.findMany({
      where: {
        shipments: {
          some: { cityId }
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    return warehouses.map(w => ({
      warehouseId: w.id,
      name: w.name
    }));
  }
};

module.exports = WarehouseRepository;