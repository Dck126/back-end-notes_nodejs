// Berkas schema.js akan digunakan untuk fokus membuat dan menuliskan objek schema data notes.

const Joi = require("joi");

// membuat object schema dengan nama NotePayLoadSchema
const NotePayloadSchema = Joi.object({
  // title harus diisi dan berupa string
  title: Joi.string().required(),
  // body harus diisi dan berupa string
  body: Joi.string().required(),
  // tags harus diisi dan berupa array dari string
  tags: Joi.array().items(Joi.string()).required(),
});

module.exports = { NotePayloadSchema };
