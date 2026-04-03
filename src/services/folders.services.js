import { prisma } from '../config/prisma.js';

const getUserFolders = async (userId) => {
  const folders = prisma.folder.findMany({
    where: {
      userId: userId,
    },
  });

  return folders;
};

const insertFolder = async (folder, userId) => {
  await prisma.folder.create({
    data: {
      name: folder,
      userId: userId,
    },
  });
};

export { getUserFolders, insertFolder };
