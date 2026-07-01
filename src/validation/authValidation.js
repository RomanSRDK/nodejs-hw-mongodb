import Joi from 'joi';

const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).trim().required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  password: Joi.string().required(),
});

export { registerUserSchema };
