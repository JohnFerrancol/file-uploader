import { validationResult, matchedData } from 'express-validator';
import newFolderValidator from '../validators/folders.validators.js';
import { insertFolder } from '../services/folders.services.js';

const newFolderGet = (req, res) => {
  res.render('index', { title: 'New Folder', showAddFileDialog: true });
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
          showAddFileDialog: true,
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

export { newFolderGet, newFolderPost };
