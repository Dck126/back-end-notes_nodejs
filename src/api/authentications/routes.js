// routing agar server dapat merespons permintaan sesuai dengan method dan url yang diminta oleh client
const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthenticationHandler,
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
