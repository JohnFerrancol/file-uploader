import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { handleMulterError } from '../config/multer.js';
import {
  newFolderGet,
  newFolderPost,
  getFolderFiles,
} from '../controllers/folders.controllers.js';
import {
  newFileGet,
  newFilePost,
  deleteFileGet,
  deleteFilePost,
} from '../controllers/files.controllers.js';

const router = Router();

router.get('/new', isAuth, newFolderGet);
router.post('/new', isAuth, newFolderPost);

router.get('/:id', isAuth, getFolderFiles);

router.get('/:id/files/new', isAuth, newFileGet);
router.post('/:id/files/new', isAuth, handleMulterError, newFilePost);

router.get('/:folderId/files/:fileId/delete', isAuth, deleteFileGet);
router.post('/:folderId/files/:fileId/delete', isAuth, deleteFilePost);

export default router;
