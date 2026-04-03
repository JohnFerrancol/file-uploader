import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import {
  newFileGet,
  newFilePost,
  downloadFileGet,
  deleteFileGet,
  deleteFilePost,
} from '../controllers/files.controllers.js';
import { handleMulterError } from '../config/multer.js';

const router = Router();

router.get('/new', isAuth, newFileGet);
router.post('/new', isAuth, handleMulterError, newFilePost);

router.get('/:id/download', isAuth, downloadFileGet);

router.get('/:id/delete', isAuth, deleteFileGet);
router.post('/:id/delete', isAuth, deleteFilePost);

export default router;
