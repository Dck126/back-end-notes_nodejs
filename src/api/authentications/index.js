const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authenticaitons",
  version: "1.0.0",
  register: async (
    server,
    { service, usersNotesService, tokenManager, validator }
  ) => {
    //di dalam fungsi asynchronous register kita buat instance dari authenticationsHandler dan gunakan instance tersebut pada routes konfigurasi
    const authenticationsHandler = new AuthenticationsHandler(
      service,
      usersNotesService,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
