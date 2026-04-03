import { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { newFileGet, newFilePost } from '../controllers/files.controllers.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/new', isAuth, newFileGet);
router.post('/new', isAuth, upload.single('file'), newFilePost);

export default router;
