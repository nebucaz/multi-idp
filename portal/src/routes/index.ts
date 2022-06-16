import { Router } from 'express';
import signRouter from './sign.js';
import authRouter from './auth.js';
import resourcesRouter from './resources.js';
import chargeRouter from './charge.js';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/resources', resourcesRouter);
routes.use('/sign', signRouter);
routes.use('/charge', chargeRouter);

export default routes;

