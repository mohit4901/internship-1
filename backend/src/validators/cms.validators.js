const { z } = require('zod');

const VALID_KEYS = ['homepage', 'about', 'contact', 'faq'];

const updateCmsSchema = z.object({
  key: z.enum(VALID_KEYS, {
    required_error: 'CMS content key is required',
    invalid_type_error: `CMS key must be one of: ${VALID_KEYS.join(', ')}`,
  }),
  value: z.any({
    required_error: 'CMS content value is required',
  }),
});

module.exports = {
  updateCmsSchema,
};
