import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { handleMulterError } from '../config/multer.js';
import {
  newFolderGet,
  newFolderPost,
} from '../controllers/folders.controllers.js';

const router = Router();

router.get('/new', isAuth, newFolderGet);
router.post('/new', isAuth, newFolderPost);

export default router;
