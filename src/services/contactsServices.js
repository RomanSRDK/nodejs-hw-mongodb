import { ContactsCollection } from '../models/contactSchema.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const getAllContacts = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery.skip(skip).limit(limit).exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
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
