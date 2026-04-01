import { Router } from 'express';
import {
  registerUserGet,
  registerUserPost,
  loginUserGet,
  loginUserPost,
  logoutUsersGet,
} from '../controllers/auth.controllers.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/register', registerUserGet);
router.post('/register', registerUserPost);

router.get('/login', loginUserGet);
router.post('/login', loginUserPost);

router.get('/logout', isAuth, logoutUsersGet);

export default router;
