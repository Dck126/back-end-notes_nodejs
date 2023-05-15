/* 
Mulai saat ini kita akan coba menetapkan standar pada penamaan dari fungsi handler.
Pemberian nama fungsi handler diambil dari kombinasi method, kemudian path, dan diakhiri dengan kata ‘Handler’. 
Bila di path mengandung parameter, kita bisa kombinasikan juga parameter tersebut sesuai dengan penggunaannya.

Perhatikan juga bahwa penggunaan kata plural dan singular perlu disesuaikan. 
Bila handler hanya menerima atau mengembalikan satu data (single), maka gunakan kata singular daripada plural (note daripada notes).
Jika handler menerima atau mengembalikan banyak data, maka gunakan plural daripada singular (notes daripada note).

tujuannya tentu tak lain agar Anda lebih konsisten dalam memberikan nama fungsi handler. 
Mungkin saat ini belum begitu terasa karena masih segelintir fungsi yang dibuat. 
Namun, saat Anda telah membuat banyak fungsi dan proyek yang Anda buat sudah kompleks, 
tentu akan sulit untuk mencari fungsi bila tidak dinamai secara konsisten.
*/

const routes = (handler) => [
  {
    method: "POST",
    path: "/notes",
    handler: handler.postNoteHandler, //hanya mempost or menambahkan 1 data (single) yang berarti note
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
  {
    method: "GET",
    path: "/notes",
    handler: handler.getNotesHandler, //menampilkan banyak data (plural) yang berarti notes
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
  {
    method: "GET",
    path: "/notes/{id}",
    handler: handler.getNoteByIdHandler, //menampilkan 1 data (single) sesuai id yang berarti note
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
  {
    method: "PUT",
    path: "/notes/{id}",
    handler: handler.putNoteEditHandler, //menampilkan 1 data (single) untuk di edit yang berarti note
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
  {
    method: "DELETE",
    path: "/notes/{id}",
    handler: handler.deleteNoteHandler, //menampilkan 1 data (single) untuk di hapus yang berarti note
    options: {
      auth: "notesapp_jwt_strategy",
    },
  },
];

module.exports = routes;
