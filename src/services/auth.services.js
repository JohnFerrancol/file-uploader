import { prisma } from '../config/prisma.js';
import bcrypt, { hash } from 'bcryptjs';

const normalizeUsername = (username) => username.trim().toLowerCase();

const getUserByName = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: normalizeUsername(username),
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
  const normalizedUsername = normalizeUsername(username);
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await prisma.user.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
        files: {},
      },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new Error('Username is in use');
    }
    throw err;
  }
};

export { getUserByName, getUserById, insertUser };
