const { z } = require('zod');

/**
 * Validator schema for user registration.
 */
const registerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(3, 'Name must be at least 3 characters long'),
    email: z.string({
      required_error: 'Email is required',
    }).email('Not a valid email format'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
  }),
});

/**
 * Validator schema for user login.
 */
const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Not a valid email format'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

/**
 * Express middleware to validate request using Zod schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  validate,
};
