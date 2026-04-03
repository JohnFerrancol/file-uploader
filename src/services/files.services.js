import { prisma } from '../config/prisma.js';

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

export { insertNewFile };
