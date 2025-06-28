// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'testpassword123';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'testuser@example.com',
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      middleName: 'T',
      image: null,
      emailVerified: true,
      birthDate: new Date('1995-01-01'),
      registrationDate: new Date(), // Let PostgreSQL default override if needed
    },
  });

  console.log('Seeded user:', user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error seeding:', e);
    prisma.$disconnect();
    process.exit(1);
  });
