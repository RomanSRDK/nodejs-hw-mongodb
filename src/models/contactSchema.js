import { model, Schema } from 'mongoose';
import { typeList } from '../constants/contactConstants.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      default: 'personal',
      enum: typeList,
    },
  },
  {
    timestamps: true,
  },
);

export const ContactsCollection = model('contacts', contactSchema);
