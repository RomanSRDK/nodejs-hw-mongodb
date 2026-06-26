import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
} from '../controllers/contactsControllers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
