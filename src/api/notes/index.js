// Folder api menampung semuah folder plugin
// Folder notes berisi berkas yang berfungsi sebagai plugin
/*
Berkas index.js merupakan tempat di mana kita membuat plugin Hapi itu sendiri. 
Lalu bagaimana dengan routes.js dan handler.js? Tentu Anda sudah tahu fungsinya kan? 
Yap! Keduanya digunakan untuk mendefinisikan route /notes (routes.js) dan menampung function handler pada route /notes (handler.js).
Kedua berkas tersebut (routes.js dan handler.js) tentu akan digunakan oleh berkas index.js.
*/

const NotesHandler = require("../notes/handler");
const routes = require("../notes/routes");

module.exports = {
  name: "notes",
  version: "1.0.0",
  register: async (server, { service }) => {
    const notesHandler = new NotesHandler(service);

    server.route(routes(notesHandler));
  },
};
