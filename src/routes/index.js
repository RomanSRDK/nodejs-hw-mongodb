import { Router } from 'express';
import { authRouter } from './authRoutes.js';
import { authenticate } from '../middlewares/authenticate.js';
import { contactsRouter } from './contactsRoutes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', authenticate, contactsRouter);
