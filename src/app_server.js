// app_server.js merupakan berkas conf untuk web-server
// mengimport konfigurasi .env
require("dotenv").config();
// Berkas ini menampung kode untuk membuat, mengonfigurasi, dan menjalankan HTTP server menggunakan Hapi.

// Notes
const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const Jwt = require("@hapi/jwt");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");
// users
const users = require("./api/users");
const UsersNotesService = require("./services/postgres/UsersNotesService");
const UsersValidator = require("./validator/users");
// Authentications
const authenticaitons = require("./api/authentications");
const AuthenticationsNotesService = require("./services/postgres/AuthenticationsNotesService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");
// Collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

const init = async () => {
  // create instance will be used to all Service
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersNotesService = new UsersNotesService();
  const authenticationsNotesService = new AuthenticationsNotesService();

  // Megonfigurasi HTTP server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    // error log
    debug: {
      request: ["error"],
    },
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // memasang plugin JWT
  await server.register([
    // Plugin JWT/@hapi
    {
      plugin: Jwt,
    },
  ]);

  /**
   * Buat strategies yang mengimplementasikan schema or plugin JWT’.
   */
  server.auth.strategy("notesapp_jwt_strategy", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // memasang plugin
  await server.register([
    // Plugin Notes
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    // Plugin Users
    {
      plugin: users,
      options: {
        service: usersNotesService,
        validator: UsersValidator,
      },
    },
    // Plugin Authentications
    {
      plugin: authenticaitons,
      options: {
        service: authenticationsNotesService,
        usersNotesService,
        validator: AuthenticationsValidator,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
