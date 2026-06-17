import { Prisma, PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.auth.deleteMany();

  const adminPassword = await bcrypt.hash('123456', 10);

  const adminAuth = await prisma.auth.upsert({
    where: {
      email: 'admin@thesis.com',
    },
    update: {},
    create: {
      email: 'admin@thesis.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'admin@thesis.com',
    },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@thesis.com',
      authId: adminAuth.id,
    },
  });

  const userIds: string[] = [];

  for (let i = 0; i < 200; i++) {
    const email = faker.internet.email();

    const passwordHash = await bcrypt.hash('123456', 10);

    const auth = await prisma.auth.create({
      data: {
        email,
        passwordHash,
        role: Role.USER,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email,
        authId: auth.id,
      },
    });

    userIds.push(user.id);
  }

  const products: Prisma.ProductCreateManyInput[] = [];
  for (let i = 0; i < 10000; i++) {
    products.push({
      name: faker.commerce.productName(),

      description: faker.commerce.productDescription(),

      price: Number(
        faker.commerce.price({
          min: 5,
          max: 1000,
        }),
      ),
    });

    // productIds.push(product.id);

    if (i % 500 === 0) {
      console.log(`Products ${i}/10000`);
    }
  }

  await prisma.product.createMany({
    data: products,
  });

  const productsInDb = await prisma.product.findMany({
    select: {
      id: true,
      price: true,
    },
  });

  const orders: Prisma.OrderCreateManyInput[] = [];

  for (let i = 0; i < 50000; i++) {
    const product =
      productsInDb[Math.floor(Math.random() * productsInDb.length)];

    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    const quantity = Math.floor(Math.random() * 5) + 1;

    orders.push({
      userId,
      productId: product.id,
      quantity,
      totalPrice: Number(product.price) * quantity,
    });

    if (i % 5000 === 0) {
      console.log(`Orders ${i}/50000`);
    }
  }

  await prisma.order.createMany({
    data: orders,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
