import { prisma } from './config/prisma.js';

const resetDB = async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "File" RESTART IDENTITY CASCADE`
  );
};

const main = async () => {
  await resetDB();
  console.log('Reset DB!');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
