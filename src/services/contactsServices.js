import { ContactsCollection } from '../models/contactSchema.js';

const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
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
