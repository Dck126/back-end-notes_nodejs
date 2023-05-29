// app_server.js merupakan berkas conf untuk web-server
// mengimport konfigurasi .env
require("dotenv").config();
// Berkas ini menampung kode untuk membuat, mengonfigurasi, dan menjalankan HTTP server menggunakan Hapi.
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const path = require("path");
// Notes
const notes = require("./api/notes");
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
// message broker
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");
// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");
// cache with redis
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  // create instance will be used to all Service
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const notesService = new NotesService(collaborationsService, cacheService);
  const usersNotesService = new UsersNotesService();
  const authenticationsNotesService = new AuthenticationsNotesService();
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );

  // Megonfigurasi HTTP server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    // error log
    // debug: {
    //   request: ["error"],
    // },
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
    {
      plugin: Inert,
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
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
