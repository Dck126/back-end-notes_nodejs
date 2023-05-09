// app_server.js merupakan berkas conf untuk web-server
// mengimport konfigurasi .env
require("dotenv").config();
// Berkas ini menampung kode untuk membuat, mengonfigurasi, dan menjalankan HTTP server menggunakan Hapi.
const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./service/postgres/NotesService");
const NotesValidator = require("./validator/notes");
// users
const users = require("./api/users");
const UsersNotesService = require("./service/postgres/UsersNotesService");
const UsersValidator = require("./validator/users");

const init = async () => {
  const notesService = new NotesService();
  const usersNotesService = new UsersNotesService();
  // Megonfigurasi HTTP server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // memasang plugin
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersNotesService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
