import { Router } from 'express';
import contactsRouter from './contactsRoutes.js';
import authRouter from './authRoutes.js';

export const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
