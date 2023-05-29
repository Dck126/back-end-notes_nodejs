// rute dikonfigurasikan untuk menerima data formulir multi-part untuk unggahan gambar dan mengalirkan data untuk diproses.
// Fungsi tersebut handler.postUploadImageHandlerakan
// bertanggung jawab untuk menangani gambar yang diunggah dan melakukan operasi apa pun yang diperlukan,
// seperti menyimpannya ke disk atau memprosesnya lebih lanjut.
const path = require("path");
const routes = (handler) => [
  {
    method: "POST",
    path: "/upload/images",
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
      },
    },
  },
  {
    method: "GET",
    path: "/upload/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file"),
      },
    },
  },
];

module.exports = routes;
