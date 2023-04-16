// Validation Data dengan menggunakan tool Joi
/*
berkas index.js akan fokus dalam membuat fungsi sebagai validator yang menggunakan schema dari schema.js.

Di dalam folder validator ini kita akan menyimpan seluruh berkas yang berhubungan dengan validasi data menggunakan Joi, 
seperti membuat schema dan fungsi dalam memvalidasi data atau payload itu sendiri.
*/
const InvariantError = require("../../exceptions/InvariantError");
const { NotePayloadSchema } = require("./schema");

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NotesValidator;
