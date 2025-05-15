
const prisma = require('../db/prisma');

const ShipmentRepository = {
  async getMovementsByPeriod(startDate, endDate) {
    const from = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const to   = typeof endDate   === 'string' ? new Date(endDate)   : endDate;

    const shipments = await prisma.shipment.findMany({
      where: {
        invoicedDate: {
          gte: from,
          lte: to
        }
      },
      orderBy: { invoicedDate: 'asc' },
      select: {
        product: {
          select: { id: true, name: true, skuName: true }
        },
        warehouse: {
          select: { id: true, name: true }
        },
        city: {
          select: { id: true, name: true, state: true, country: true }
        },
        invoicedDate: true
      }
    });

    return shipments.map(s => ({
      productId:     s.product.id,
      productName:   s.product.name,
      skuName:       s.product.skuName,
      warehouseId:   s.warehouse.id,
      warehouseName: s.warehouse.name,
      cityId:        s.city.id,
      cityName:      s.city.name,
      state:         s.city.state,
      country:       s.city.country,
      invoicedDate:  s.invoicedDate
    }));
  }
};

module.exports = ShipmentRepository;
