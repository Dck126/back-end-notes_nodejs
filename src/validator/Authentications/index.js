const InvanriantError = require("../../exceptions/InvariantError");
const {
  PostAuthenticationsPayloadSchema,
  PutAuthenticationsPayloadSchema,
  DeleteAuthenticationsPayloadSchema,
} = require("./schema");

const AuthenticationsValidator = {
  validatePostAuthenticationsPayloadSchema: (payload) => {
    const validationResult = PostAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvanriantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationsPayloadSchema: (payload) => {
    const validationResult = PutAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvanriantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationsPayloadSchema: (payload) => {
    const validationResult =
      DeleteAuthenticationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvanriantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
