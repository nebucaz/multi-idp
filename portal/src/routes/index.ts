import { Router } from 'express';
import signRouter from './sign.js';
import authRouter from './auth.js';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/sign', signRouter);

export default routes;

