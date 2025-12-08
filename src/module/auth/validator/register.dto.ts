import Joi from 'joi';

// لیست مجاز برای interests
const allowedInterests = [
  "Financial Literacy",
  "Critical Thinking",
  "Time Management",
  "Communication Skills",
  "Self-Care & Wellness",
  "Digital Literacy",
  "Interpersonal Skills",
  "Making Loan Payments",
  "Adaptability & Resilience"
];

// لیست مجاز برای skills
const allowedSkills = ["parent", "teachers", "learner"];

const registerSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .message('Username can only contain letters, numbers, and underscores')
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 2 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).')
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 30 characters'
    }),

  age: Joi.number()
    .integer()
    .min(1)
    .max(150)
    .required()
    .messages({
      'number.base': 'Age must be a number',
      'number.empty': 'Age is required',
      'number.min': 'Age must be at least 1',
      'number.max': 'Age cannot exceed 150'
    }),

  interests: Joi.array()
    .items(Joi.string().valid(...allowedInterests))
    .min(2)
    .max(4)
    .required()
    .messages({
      'array.base': 'Interests must be an array',
      'array.min': 'You must choose at least 2 interests',
      'array.max': 'You can choose at most 4 interests',
      'any.only': 'Invalid interest selected'
    }),

  skills: Joi.string()
    .valid(...allowedSkills)
    .required()
    .messages({
      'any.only': 'Skills must be either parent, child, or teacher',
      'string.empty': 'Skills is required'
    })
});

export default registerSchema;
