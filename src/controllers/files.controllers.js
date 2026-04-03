import { insertNewFile } from '../services/files.services.js';

const newFileGet = (req, res) => {
  res.render('files/newFile', { title: 'New File' });
};

const newFilePost = async (req, res) => {
  try {
    console.log(req.body);
    const { filename, size, path, mimetype } = req.file;
    const userId = req.user.id;
    await insertNewFile(filename, size, path, mimetype, userId);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
};

export { newFileGet, newFilePost };
