import { Router } from 'express';
import { getIndexPage } from '../controllers/index.controllers.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', isAuth, getIndexPage);

export default router;
