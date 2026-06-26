import { model, Schema } from 'mongoose';

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
      enum: ['work', 'home', 'personal'],
    },
  },
  {
    timestamps: true,
  },
);

export const ContactsCollection = model('contacts', contactSchema);
