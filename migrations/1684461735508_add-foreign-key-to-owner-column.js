/* eslint-disable camelcase */

// exports.shorthands = undefined;

/**
 * untuk menerapkan foreign key (fk) pada column owner yang ada pada tabe 'notes' kita harus pastikan nilainya
 * tidak NULL, ketika kita memutuskan column owner dengan foerign key, maka column tersebut tidak boleh bernilai selain
 * dari nilai column itu sendiri, walaupun nilainya null.
 */

exports.up = (pgm) => {
  // Membuat users baru dengan nilai id yang ditentukan
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')"
  );
  //mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL");

  //Memberikan nilai constraint foreign key pada owner terhadap table users
  pgm.addConstraint(
    "notes",
    "fk_notes.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  // menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint("notes", "fk_notes.owner_users.id");

  // mengubah nilai owner old_notes pada note menjadi null
  pgm.dropConstraint(
    "UPDATE notes SET owner = NULL WHERE owner = 'old_notes' "
  );

  //menghapus user baru
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
