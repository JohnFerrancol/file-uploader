import { prisma } from './config/prisma.js';

const resetDB = async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "File" RESTART IDENTITY CASCADE`
  );
};

const main = async () => {
  await resetDB();
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      username: 'JohnFerrancol',
      password: 'password',
      files: {
        create: {
          filename: 'Hello World',
          size: 1,
          path: 'Documents/Project/',
          mimetype: 'pdf',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
    include: {
      files: true,
    },
  });
  console.log('Created user:', user);
  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      files: true,
    },
  });
  console.log('All users:', JSON.stringify(allUsers, null, 2));
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
