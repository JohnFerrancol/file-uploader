import { getUserFiles } from '../services/files.services.js';

const formatSize = (num) => {
  if (num === 0) return '0';
  const k = 1000;
  const bytes = ['B', 'KB', 'MB']; // kilo or mega
  // Calculate magnitude
  const i = Math.floor(Math.log10(Math.abs(num)) / 3);
  // Divide by 1000^i, fix to 2 decimals, and remove trailing zeros
  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + bytes[i];
};

const createLocals = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.links = [
      { href: '/', text: 'OdinFiles' },
      { href: '/auth/logout', text: 'Log Out' },
    ];
    const files = await getUserFiles(req.user.id);
    const formattedDataFiles = files.map((file) => ({
      ...file,
      size: formatSize(file.size),
      createdAt: file.createdAt.toLocaleDateString('en-SG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }));

    console.log(formattedDataFiles);
    res.locals.files = formattedDataFiles;
  } else {
    res.locals.links = [
      { href: '#', text: 'OdinFiles' },
      { href: '/auth/login', text: 'Log In' },
      { href: '/auth/register', text: 'Register' },
    ];
    res.locals.files = [];
  }

  res.locals.errors = [];
  res.locals.formData = [];

  next();
};

export default createLocals;
