import { prisma } from '../config/prisma.js';

const getUserFolders = async (userId) => {
  const folders = prisma.folder.findMany({
    where: {
      userId: userId,
    },
  });

  return folders;
};

const getFolderById = async (folderId) => {
  const folder = prisma.folder.findUnique({
    where: {
      id: folderId,
    },
    include: {
      files: true,
    },
  });

  return folder;
};

const insertFolder = async (folder, userId) => {
  await prisma.folder.create({
    data: {
      name: folder,
      userId: userId,
      files: {},
    },
  });
};

const deleteFolderById = async (folderId) => {
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  });
};

export { getUserFolders, getFolderById, insertFolder, deleteFolderById };
