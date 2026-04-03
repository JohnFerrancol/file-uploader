import { insertNewFile, getFileFromId } from '../services/files.services.js';
import newFileValidator from '../validators/files.validators.js';
import { validationResult } from 'express-validator';

const newFileGet = (req, res) => {
  res.render('files/newFile', { title: 'New File' });
};

const newFilePost = [
  newFileValidator,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('files/newFile', {
        title: 'New File',
        errors: errors.array(),
      });
    }

    const { filename, size, path, mimetype } = req.file;
    const userId = req.user.id;
    await insertNewFile(filename, size, path, mimetype, userId);

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

export { newFileGet, newFilePost, downloadFileGet };
