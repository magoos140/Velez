// src/services/syncService.js
const prisma = require('../db/prisma');
const { getInvoices, getOrderById } = require('../api/vtexService');
const promiseLimit = require('promise-limit');
const limit = promiseLimit(5);
const delay = ms => new Promise(res => setTimeout(res, ms));


async function processInvoice(orderId) {
  const orderData = await getOrderById(orderId);

  await prisma.order.upsert({
    where: { id: orderId },
    update: {
      creationDate: new Date(orderData.creationDate),
      invoicedDate: orderData.invoicedDate ? new Date(orderData.invoicedDate) : null,
      totalValue: orderData.value,
      status: orderData.status,
    },
    create: {
      id: orderId,
      creationDate: new Date(orderData.creationDate),
      invoicedDate: orderData.invoicedDate ? new Date(orderData.invoicedDate) : null,
      totalValue: orderData.value,
      status: orderData.status,
    },
  });

  const addr = orderData.shippingData.address;
  const city = await prisma.city.upsert({
    where: { name_state_country: {
      name: addr.city,
      state: addr.state,
      country: addr.country
    }},
    update: {},
    create: {
      name: addr.city,
      state: addr.state,
      country: addr.country
    }
  });

  for (const item of orderData.itemMetadata.Items) {
    await prisma.product.upsert({
      where: { id: item.ProductId },
      update: { name: item.Name, skuName: item.SkuName },
      create: { id: item.ProductId, name: item.Name, skuName: item.SkuName }
    });

    const logistics = orderData.shippingData.logisticsInfo.filter(
      l => l.itemIndex === item.Id || l.itemId === item.Id
    );

    for (const lg of logistics) {
      for (const sla of lg.slas) {
        for (const del of sla.deliveryIds) {
          const [, warehouseName] = del.warehouseId.split(/_(?!\d)/);
          await prisma.warehouse.upsert({
            where: { id: del.warehouseId },
            update: {},
            create: { id: del.warehouseId, name: warehouseName || del.warehouseId }
          });

          await prisma.shipment.create({
            data: {
              orderId,
              productId: item.ProductId,
              warehouseId: del.warehouseId,
              cityId: city.id,
              invoicedDate: orderData.invoicedDate
                ? new Date(orderData.invoicedDate)
                : new Date(orderData.creationDate),
            }
          });
        }
      }
    }
  }
}


async function syncInvoices() {
  const prog = await prisma.syncProgress.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, lastPage: 0 }
  });
  let currentPage = prog.lastPage + 1;
  let totalPages = Infinity;

  while (currentPage <= totalPages) {
    let resp;
    try {
      resp = await getInvoices(currentPage);
    } catch (e) {
      console.error(`Error HTTP página ${currentPage}:`, e.message);
      break;
    }
    if (!resp.paging || !Array.isArray(resp.list)) break;

    totalPages = resp.paging.pages;
    console.log(`Página ${currentPage}/${totalPages} → ${resp.list.length} facturas`);

    await Promise.all(
      resp.list.map(inv => limit(async () => {
        try {
          await processInvoice(inv.orderId);
        } catch (err) {
          console.error(`Error factura ${inv.orderId}:`, err.message);
          await prisma.syncError.create({
            data: { orderId: inv.orderId, page: currentPage, errorMsg: err.message }
          });
        }
      }))
    );

    await prisma.syncProgress.update({
      where: { id: 1 },
      data: { lastPage: currentPage }
    });

    await delay(200);
    currentPage++;
  }

  console.log('Sincronización completa');
  return { message: 'Sincronización finalizada' };
}

async function retryFailedInvoices() {
  const errors = await prisma.syncError.findMany();
  console.log(`Reintentando ${errors.length} facturas`);

  await Promise.all(
    errors.map(errRec => limit(async () => {
      try {
        await processInvoice(errRec.orderId);
        await prisma.syncError.delete({ where: { id: errRec.id } });
      } catch (e) {
        console.error(`Sigue fallando ${errRec.orderId}:`, e.message);
      }
    }))
  );

  console.log('Reintentos completos');
  return { message: 'Retry finalizado' };
}

module.exports = { syncInvoices, retryFailedInvoices };
