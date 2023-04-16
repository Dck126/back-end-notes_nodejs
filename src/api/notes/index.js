// Folder api menampung semuah folder plugin
// Folder notes dan tiga berkas di dalamnya adalah Hapi plugin
// Folder notes berisi berkas yang berfungsi sebagai plugin
// Plugin notes ini akan bertanggung jawab untuk menangani setiap permintaan yang mengarah ke url /notes.

/*Untuk request handling akan disimpan pada handler.js, untuk masalah routing akan disimpan di dalam routes.js, 
 dan untuk pluginnya sendiri akan disimpan pada index.js */

/*Berkas index.js merupakan tempat di mana kita membuat plugin Hapi itu sendiri. 
Lalu bagaimana dengan routes.js dan handler.js? Tentu Anda sudah tahu fungsinya kan? 
Yap! Keduanya digunakan untuk mendefinisikan route /notes (routes.js) dan menampung function handler pada route /notes (handler.js).
Kedua berkas tersebut (routes.js dan handler.js) tentu akan digunakan oleh berkas index.js.*/

const NotesHandler = require("./handler");
const routes = require("./routes");

// Module Export berguna untuk mengeksport property plugin
// Property register berfungsi untuk menjalankan plugin pada Hapi server
// pada fungsi register memiliki 2 parameter Server & Options
module.exports = {
  name: "notes",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(service, validator);
    server.route(routes(notesHandler));
  },
};

/* Parameter server merupakan nilai dari server yang menggunakan plugin tersebut.
 Dengan begitu, kita dapat memanfaatkan nilai ini untuk melakukan konfigurasi ketika menginisialisasi server Hapi, 
 sama halnya saat Anda melakukan hal tersebut tanpa plugin. 
 */
/*
Parameter kedua adalah options. Parameter ini dapat menampung nilai-nilai yang dibutuhkan dalam menggunakan plugin
*/
