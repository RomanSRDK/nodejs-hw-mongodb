import { ContactsCollection } from '../models/contactSchema.js';

const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
}) => {
  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (typeof isFavourite === 'boolean') {
    filter.isFavourite = isFavourite;
  }

  const contactsQuery = ContactsCollection.find(filter);

  const [totalItems, contacts] = await Promise.all([
    // Если фильтрации нет, достаточно вызвать ContactsCollection.countDocuments()
    contactsQuery.clone().countDocuments(),
    contactsQuery
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
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
