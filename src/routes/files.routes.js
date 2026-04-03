import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import {
  newFileGet,
  newFilePost,
  downloadFileGet,
} from '../controllers/files.controllers.js';
import { handleMulterError } from '../config/multer.js';

const router = Router();

router.get('/new', isAuth, newFileGet);
router.post('/new', isAuth, handleMulterError, newFilePost);

router.get('/:id/download', isAuth, downloadFileGet);

export default router;
