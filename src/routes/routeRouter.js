import { Router } from 'express';
import { getRoutePage } from '../controllers/routeController.js';

const routeRouter = Router();

routeRouter.get('/', getRoutePage);

export default routeRouter;
