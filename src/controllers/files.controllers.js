import {
  insertNewFile,
  getFileFromId,
  deleteFileById,
} from '../services/files.services.js';
import newFileValidator from '../validators/files.validators.js';
import { validationResult } from 'express-validator';
import { getFolderById } from '../services/folders.services.js';
import { formatSize } from '../middleware/locals.middleware.js';
import { supabase } from '../config/supabase.js';

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

    const { originalname, size, mimetype, buffer } = req.file;
    const userId = req.user.id;
    const filename = `${Date.now()}-${originalname}`;
    const fileKey = `file/${Date.now()}-${originalname}`;

    const { error } = await supabase.storage
      .from('files')
      .upload(fileKey, buffer, { contentType: mimetype });

    if (error) {
      console.error(error);
      return res.status(500).send('Error uploading file to cloud storage');
    }

    await insertNewFile(filename, size, fileKey, mimetype, userId, folderId);

    if (folderId) {
      return res.redirect(`/folders/${folderId}`);
    }
    res.redirect('/');
  },
];

const downloadFileGet = async (req, res) => {
  try {
    const fileId = Number(req.params.id);

    const file = await getFileFromId(fileId);

    if (!file) return res.status(404).send('File not found');

    // Authorization: ensure the user owns the file
    if (file.userId !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    // Download the file from Supabase bucket
    const { data, error } = await supabase.storage
      .from('files')
      .download(file.path);

    if (error) throw error;

    // Convert the Blob to a Node.js Buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // Tell the browser to treat it as a download
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`
    );
    res.setHeader('Content-Type', file.mimetype);

    // Send the file
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error downloading file');
  }
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
      showDeleteFileDialog: true,
      file: file,
    });
  }

  res.render('index', {
    title: 'New Title',
    showDeleteFileDialog: true,
    file: file,
  });
};

const deleteFilePost = async (req, res) => {
  const folderId = req.params.folderId;
  const fileId = Number(req.params.fileId) || Number(req.params.id);

  const file = await getFileFromId(fileId);

  if (!file) {
    return res.status(404).send('File not found');
  }

  if (file.userId !== req.user.id) {
    return res.status(403).send('Unauthorized');
  }

  // Delete File from supabase storage
  const { data, error } = await supabase.storage
    .from('files')
    .remove(file.path);

  if (error) {
    console.error('Supabase deletion error:', error);
    return res.status(500).send('Could not delete physical file in supabase');
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
