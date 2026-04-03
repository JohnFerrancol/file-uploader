import { prisma } from '../config/prisma.js';

const getUserFiles = async (userId) => {
  const files = await prisma.file.findMany({
    where: { userId: userId },
  });
  return files;
};

const getFileFromId = async (fileId) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  return file;
};

const insertNewFile = async (filename, size, path, mimetype, userId) => {
  await prisma.file.create({
    data: {
      filename: filename,
      size: size,
      path: path,
      mimetype: mimetype,
      userId: userId,
    },
  });
};

const deleteFileById = async (fileId) => {
  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
};

export { getUserFiles, getFileFromId, insertNewFile, deleteFileById };
