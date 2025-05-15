const prisma = require("../db/prisma");
const { getInvoices, getOrderById } = require("../api/vtexService");

async function syncInvoices() {
  const invoices = await getInvoices();

  for (const inv of invoices) {
    const orderId = inv.orderId;

    const orderData = await getOrderById(orderId);

    await prisma.order.upsert({
      where: { id: orderId },
      update: {
        creationDate: new Date(orderData.creationDate),
        invoicedDate: orderData.invoicedDate
          ? new Date(orderData.invoicedDate)
          : null,
        totalValue: orderData.value,
        status: orderData.status,
      },
      create: {
        id: orderId,
        creationDate: new Date(orderData.creationDate),
        invoicedDate: orderData.invoicedDate
          ? new Date(orderData.invoicedDate)
          : null,
        totalValue: orderData.value,
        status: orderData.status,
      },
    });

    const addr = orderData.shippingData.address;
    const city = await prisma.city.upsert({
      where: {
        name_state_country: {
          name: addr.city,
          state: addr.state,
          country: addr.country,
        },
      },
      update: {},
      create: {
        name: addr.city,
        state: addr.state,
        country: addr.country,
      },
    });

    for (const itemMeta of orderData.itemMetadata.Items) {
      await prisma.product.upsert({
        where: { id: itemMeta.ProductId },
        update: {
          name: itemMeta.Name,
          skuName: itemMeta.SkuName,
        },
        create: {
          id: itemMeta.ProductId,
          name: itemMeta.Name,
          skuName: itemMeta.SkuName,
        },
      });

      const logistics = orderData.shippingData.logisticsInfo.filter(
        (l) => l.itemIndex === 0
      );

      for (const lg of logistics) {
        for (const sla of lg.slas) {
          for (const del of sla.deliveryIds) {
            const warehouseId = del.warehouseId;
            const parts = warehouseId.split(/_(?!\d)/);
            const warehouseName = parts[1] ?? parts[0];
            const wh = await prisma.warehouse.upsert({
              where: { id: del.warehouseId },
              update: {},
              create: { 
                id: del.warehouseId ,
                name: warehouseName,},
            });

            await prisma.shipment.create({
              data: {
                orderId,
                productId: itemMeta.ProductId,
                warehouseId: del.warehouseId,
                cityId: city.id,
                invoicedDate: orderData.invoicedDate
                  ? new Date(orderData.invoicedDate)
                  : new Date(orderData.creationDate),
              },
            });
          }
        }
      }
    }
  }

  return { message: "Invoices synced and data saved successfully" };
}

module.exports = { syncInvoices };
