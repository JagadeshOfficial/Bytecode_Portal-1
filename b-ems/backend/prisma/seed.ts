import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@123', salt);

  // 1. Create Branches
  const hydBranch = await prisma.branch.create({
    data: { name: 'Hyderabad Main', address: 'Madhapur, Hyderabad' },
  });

  const blrBranch = await prisma.branch.create({
    data: { name: 'Bangalore Hub', address: 'Indiranagar, Bangalore' },
  });

  // 2. Create Demo Users
  await prisma.user.upsert({
    where: { email: 'super@bytecode.dev' },
    update: {},
    create: {
      fullName: 'Super Admin',
      email: 'super@bytecode.dev',
      password: passwordHash,
      role: 'SUPER_ADMIN',
      branchId: hydBranch.id,
      status: 'ACTIVE',
    },
  });

  await prisma.user.upsert({
    where: { email: 'ceo@bytecode.dev' },
    update: {},
    create: {
      fullName: 'CEO Jagadesh',
      email: 'ceo@bytecode.dev',
      password: passwordHash,
      role: 'CEO',
      branchId: hydBranch.id,
      status: 'ACTIVE',
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
