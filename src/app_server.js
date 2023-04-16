// app_server.js merupakan berkas conf untuk web-server
// Berkas ini menampung kode untuk membuat, mengonfigurasi, dan menjalankan HTTP server menggunakan Hapi.
const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./service/inMemory/NotesService");
const NotesValidator = require("./validator/notes");

const init = async () => {
  const notesService = new NotesService();

  // Megonfigurasi HTTP server
  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // memasang plugin
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
