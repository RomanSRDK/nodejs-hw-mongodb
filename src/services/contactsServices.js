import { ContactsCollection } from '../models/contactSchema.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const totalContacts = await ContactsCollection.countDocuments();

  const contacts = await ContactsCollection.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(totalContacts, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};

const updateContact = async (contactId, payload, options = {}) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
    },
  );
  return contact;
};

export {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
};
