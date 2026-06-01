const { ApiError } = require('../utils/apiError');

/**
 * validate - Zod schema validation middleware factory.
 * Usage: router.post('/route', validate(zodSchema, 'body'), controller)
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate
 * @param {'body' | 'query'} source - Request source to validate (default: 'body')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const dataToValidate = req[source];
  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field:   e.path.join('.'),
      message: e.message,
    }));
    return next(new ApiError(422, 'Validation failed. Please check the submitted data.', errors));
  }

  // Replace the request source data with the parsed (and coerced) values
  req[source] = result.data;
  next();
};

module.exports = { validate };
