import {
  insertNewFile,
  getFileFromId,
  deleteFileById,
} from '../services/files.services.js';
import newFileValidator from '../validators/files.validators.js';
import { validationResult } from 'express-validator';
import { getFolderById } from '../services/folders.services.js';
import { formatSize } from '../middleware/locals.middleware.js';

const newFileGet = async (req, res) => {
  const folderId = Number(req.params.id);
  if (folderId) {
    const folder = await getFolderById(folderId);
    const formattedFolderFiles = folder.files.map((file) => ({
      ...file,
      size: formatSize(file.size),
      createdAt: file.createdAt.toLocaleDateString('en-SG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }));
    return res.render('folders/folder', {
      title: 'Folder',
      files: formattedFolderFiles,
      folder: folder,
      showUploadDialog: true,
    });
  }
  res.render('index', { title: 'New File', showUploadDialog: true });
};

const newFilePost = [
  newFileValidator,
  async (req, res) => {
    const errors = validationResult(req);
    const folderId = req.params.id ? Number(req.params.id) : null;

    if (!errors.isEmpty()) {
      if (folderId) {
        const folder = await getFolderById(folderId);

        const formattedFolderFiles = folder.files.map((file) => ({
          ...file,
          size: formatSize(file.size),
          createdAt: file.createdAt.toLocaleDateString('en-SG', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
        }));
        return res.status(400).render('folders/folder', {
          title: 'Folder',
          errors: errors.array(),
          files: formattedFolderFiles,
          folder: folder,
          showUploadDialog: true,
        });
      }
      return res.status(400).render('index', {
        title: 'New File',
        errors: errors.array(),
        showUploadDialog: true,
      });
    }

    const { filename, size, path, mimetype } = req.file;
    const userId = req.user.id;
    await insertNewFile(filename, size, path, mimetype, userId, folderId);

    if (folderId) {
      return res.redirect(`/folders/${folderId}`);
    }
    res.redirect('/');
  },
];

const downloadFileGet = async (req, res) => {
  const fileId = Number(req.params.id);

  const file = await getFileFromId(fileId);

  if (!file) {
    return res.status(404).send('File not found');
  }

  if (file.userId !== req.user.id) {
    return res.status(403).send('Unauthorized');
  }

  res.download(file.path, file.filename);
};

const deleteFileGet = async (req, res) => {
  const folderId = req.params.folderId;
  const fileId = Number(req.params.fileId) || Number(req.params.id);

  const file = await getFileFromId(fileId);

  if (!file) {
    return res.status(404).send('File not found');
  }

  if (file.userId !== req.user.id) {
    return res.status(403).send('Unauthorized');
  }

  if (folderId) {
    const folder = await getFolderById(Number(folderId));

    const formattedFolderFiles = folder.files.map((file) => ({
      ...file,
      size: formatSize(file.size),
      createdAt: file.createdAt.toLocaleDateString('en-SG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }));
    return res.render('folders/folder', {
      title: 'Folder',
      files: formattedFolderFiles,
      folder: folder,
      showDeleteDialog: true,
      file: file,
    });
  }

  res.render('index', {
    title: 'New Title',
    showDeleteDialog: true,
    file: file,
  });
};

const deleteFilePost = async (req, res) => {
  console.log(req.params);
  const folderId = req.params.folderId;
  const fileId = Number(req.params.fileId) || Number(req.params.id);

  const file = await getFileFromId(fileId);

  if (!file) {
    return res.status(404).send('File not found');
  }

  if (file.userId !== req.user.id) {
    return res.status(403).send('Unauthorized');
  }

  await deleteFileById(fileId);

  if (folderId) {
    return res.redirect(`/folders/${folderId}`);
  }
  res.redirect('/');
};

export {
  newFileGet,
  newFilePost,
  downloadFileGet,
  deleteFileGet,
  deleteFilePost,
};
