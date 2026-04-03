import { validationResult, matchedData } from 'express-validator';
import newFolderValidator from '../validators/folders.validators.js';
import { getFolderById, insertFolder } from '../services/folders.services.js';
import { formatSize } from '../middleware/locals.middleware.js';

const newFolderGet = (req, res) => {
  res.render('index', { title: 'New Folder', showAddFolderDialog: true });
};

const newFolderPost = [
  newFolderValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('index', {
          title: 'New Folder',
          errors: errors.array(),
          formData: req.body,
          showAddFolderDialog: true,
        });
      }

      const { folder } = matchedData(req);
      const userId = req.user.id;
      await insertFolder(folder, userId);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
];

const getFolderFiles = async (req, res) => {
  const folder = await getFolderById(Number(req.params.id));

  const formattedFolderFiles = folder.files.map((file) => ({
    ...file,
    size: formatSize(file.size),
    createdAt: file.createdAt.toLocaleDateString('en-SG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  }));

  res.render('folders/folder', {
    title: 'Folder',
    files: formattedFolderFiles,
    folder: folder,
  });
};

export { newFolderGet, newFolderPost, getFolderFiles };
