// berkas CRUD untuk mengelola Table yang dibuat menggunakan PostgreSQL.
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
/* Kita akan gunakan teknik pool daripada client. 
 Selain lebih mudah, tentu karena aplikasi yang kita buat akan sering sekali berinteraksi dengan database.*/
class NotesService {
  constructor() {
    this._pool = new Pool();
  }
  //   menambahkan notes
  /*
  fungsi query() berjalan secara asynchronous, dengan begitu kita perlu menambahkan async pada addNote dan await pada pemanggilan query().
  */

  async addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // menggunakan query berparameter, RETURNING id akan mengembalikan id notes;
    // parameter 1,2,3,4,5,6 merupakan parameter dari column table
    const query = {
      text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, title, body, tags, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    } else {
      return result.rows[0].id;
    }
  }

  //   menampilkan notes
  async getNotes() {
    const result = await this._pool.query("SELECT * FROM notes");
    return result.rows.map(mapDBToModel);
  }

  // menampilkan note by id
  async getNotebyId(id) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }
    return result.rows.map(mapDBToModel)[0];
  }

  //   memperbarui note
  async putNotebyId(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
      values: [title, body, tags, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }
  }

  //   menghapus notes
  async deletNotebyId(id) {
    const query = {
      text: "DELETE FROM notes WHERE id=$1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = NotesService;
