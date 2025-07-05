import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' },
  });
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('devpass', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      isAdmin: true,
      payRate: 0,
    },
  });
  console.log('Admin user created');
  
  await prisma.payPeriod.create({
    data: {
      startDate: '2025-06-15T07:00:00.000Z',
      endDate: '2025-06-29T06:59:00.000Z'
    }
  });
  console.log("Default pay period created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });