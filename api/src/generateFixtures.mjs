// generateFixtures.js
import { faker } from '@faker-js/faker';
const prismaModule = await import('./db/prisma.js');
const prisma = prismaModule.default ?? prismaModule;

async function generateFixtures({
  cities = 5,
  products = 10,
  warehouses = 3,
  orders = 10,
  shipmentsPerOrder = 2,
  users = 3,
} = {}) {
  console.log('⚙️  Generando datos de prueba...');

  // 1. Cities
  const cityRecords = [];
  for (let i = 0; i < cities; i++) {
    const city = await prisma.city.create({
      data: {
        name: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
      },
    });
    cityRecords.push(city);
  }

  // 2. Products
  const productRecords = [];
  for (let i = 0; i < products; i++) {
    const product = await prisma.product.create({
      data: {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        skuName: faker.commerce.productAdjective(),
      },
    });
    productRecords.push(product);
  }

  // 3. Warehouses
  const warehouseRecords = [];
  for (let i = 0; i < warehouses; i++) {
    const warehouse = await prisma.warehouse.create({
      data: {
        id: `WH_${faker.string.alphanumeric(8)}`,
        name: faker.company.name(),
      },
    });
    warehouseRecords.push(warehouse);
  }

  // 4. Orders + Shipments
  for (let i = 0; i < orders; i++) {
    const orderId = faker.string.uuid();
    const order = await prisma.order.create({
      data: {
        id: orderId,
        creationDate: faker.date.past(),
        invoicedDate: faker.datatype.boolean() ? faker.date.recent() : null,
        totalValue: faker.number.float({ min: 1000, max: 100000 }),
        status: faker.helpers.arrayElement(['invoiced', 'pending', 'cancelled']),
      },
    });

    for (let j = 0; j < shipmentsPerOrder; j++) {
      const product = faker.helpers.arrayElement(productRecords);
      const warehouse = faker.helpers.arrayElement(warehouseRecords);
      const city = faker.helpers.arrayElement(cityRecords);

      await prisma.shipment.create({
        data: {
          orderId: order.id,
          productId: product.id,
          warehouseId: warehouse.id,
          cityId: city.id,
          invoicedDate: order.invoicedDate || order.creationDate,
        },
      });
    }
  }

  // 5. Users
  for (let i = 0; i < users; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(), // Solo para tests
        name: faker.person.fullName(),
        role: i === 0 ? 'ADMIN' : 'USER',
      },
    });
  }

  console.log('✅ Datos de prueba generados exitosamente.');
  process.exit(0);
}

generateFixtures().catch(e => {
  console.error(e);
  process.exit(1);
});
