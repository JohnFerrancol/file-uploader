import { prisma } from '../config/prisma.js';

const getUserByName = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
};

const insertUser = async (username, password) => {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      files: {},
    },
  });
};

export { getUserByName, getUserById, insertUser };
