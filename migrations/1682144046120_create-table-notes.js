/* eslint-disable camelcase */
// berkas migration baru
// migrate Up: digunakan untuk menjalankan seluruh up migration yang belum dijalankan.
// migrate down: Digunakan untuk menjalankan satu down migration dari keadaan saat ini.
// migrate redo: Digunakan untuk menjalankan ulang migration sebelumnya (menjalankan down migration kemudian up migration).

// pada fungsi exports.up kita menuliskan kode untuk membuat tabel notes menggunakan pgm (pg-node-migrate)
exports.up = (pgm) => {
  // membuat table notes dengan fungsi pgm
  pgm.createTable("notes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    tags: {
      type: "TEXT[]",
      notNull: true,
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
};

// fungsi exports.down, di fungsi ini kita tuliskan aksi negasi dari yang kita lakukan di fungsi up. Yakni menghapus tabel notes.
exports.down = (pgm) => {
  pgm.dropTable("notes");
};
