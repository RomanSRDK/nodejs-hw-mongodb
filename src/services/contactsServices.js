import { ContactsCollection } from '../models/contactsSchema.js';

const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
  userId,
}) => {
  const filter = {
    userId,
  };
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

const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

const updateContact = async (contactId, userId, payload) => {
  const contact = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
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
