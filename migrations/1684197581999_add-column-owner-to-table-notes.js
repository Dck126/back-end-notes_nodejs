/* eslint-disable camelcase */

// menambahkan kolom baru sebagai identitas pemilik dari catatan (id user) yang disimpan. Beri nama kolom tersebut dengan “owner”.
exports.up = (pgm) => {
  pgm.addColumn("notes", {
    owner: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("notes", "owner");
};
