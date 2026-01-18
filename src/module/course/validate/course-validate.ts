import Joi from 'joi';

// Schema for course validation
export const courseSchema = Joi.object({
  name: Joi.string().min(3).max(200).required().messages({
    'string.empty': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters long',
    'string.max': 'Course name cannot exceed 200 characters',
  }),
  description: Joi.string().min(10).required().messages({
    'string.empty': 'Course description is required',
    'string.min': 'Course description must be at least 10 characters long',
  }),
  subject: Joi.string().allow(''),
  materialType: Joi.string().valid('course', 'pages', 'quiz').default('course'),
  materialCount: Joi.string().allow(''),
  firstRecommendation: Joi.string().allow(''),
  secondRecommendation: Joi.string().allow(''),
  trainer: Joi.string().allow(''),
  dialog: Joi.string().allow(null, ''),
  nextStep: Joi.string().allow(null, ''),
  topic: Joi.string().allow(null, ''),
  content: Joi.string().allow(null, ''),
  contentType: Joi.string().allow(null, ''),
  points: Joi.string().allow(null, ''),
  passingPoints: Joi.string().allow(null, ''),
  quizTotalScore: Joi.number().optional(),
  quizPassingScore: Joi.number().optional(),
  status: Joi.string().valid('notStarted', 'inProgress', 'completed').default('notStarted'),
  materialStatusType: Joi.string().allow(null, '').optional(),
  isCertified: Joi.boolean().default(false),
  type: Joi.string().allow(null, ''),
  progress: Joi.number().default(0),
  duration: Joi.string().allow(null, '')
});
// Helper function to validate course
export const validateCourse = (data: any) => {
  return courseSchema.validate(data, { convert: true });
};

