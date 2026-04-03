import { getUserFiles } from '../services/files.services.js';
import { getUserFolders } from '../services/folders.services.js';

export const formatSize = (num) => {
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

    const folders = await getUserFolders(req.user.id);
    const formattedDataFolders = folders.map((folder) => ({
      ...folder,
      createdAt: folder.createdAt.toLocaleDateString('en-SG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }));

    res.locals.files = formattedDataFiles;
    res.locals.folders = formattedDataFolders;
  } else {
    res.locals.links = [
      { href: '#', text: 'OdinFiles' },
      { href: '/auth/login', text: 'Log In' },
      { href: '/auth/register', text: 'Register' },
    ];
    res.locals.files = [];
    res.locals.folders = [];
  }

  res.locals.errors = [];
  res.locals.formData = [];
  res.locals.showUploadDialog = false;
  res.locals.showDeleteFileDialog = false;
  res.locals.showDeleteFolderDialog = false;
  res.locals.showAddFolderDialog = false;

  next();
};

export default createLocals;
