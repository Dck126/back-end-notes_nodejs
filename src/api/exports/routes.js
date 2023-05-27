const routes = (handler) => [
  {
    method: "POST",
    path: "/export/notes",
    handler: handler.postExportNotesHandler,
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
];

module.exports = routes;
