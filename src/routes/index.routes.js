import { Router } from 'express';
import { getIndexPage } from '../controllers/indexController.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', isAuth, getIndexPage);

export default router;
