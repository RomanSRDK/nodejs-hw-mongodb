import createHttpError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';

const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    const error = createHttpError(404, 'Contact not found');
    throw error;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export { getContactsController, getContactByIdController };
