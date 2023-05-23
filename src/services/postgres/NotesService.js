// berkas CRUD untuk mengelola Table yang dibuat menggunakan PostgreSQL.
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
/* Kita akan gunakan teknik pool daripada client. 
 Selain lebih mudah, tentu karena aplikasi yang kita buat akan sering sekali berinteraksi dengan database.*/
class NotesService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }
  //   menambahkan notes
  /*
  fungsi query() berjalan secara asynchronous, dengan begitu kita perlu menambahkan async pada addNote dan await pada pemanggilan query().
  */

  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // menggunakan query berparameter, RETURNING id akan mengembalikan id notes;
    // parameter 1,2,3,4,5,6 merupakan parameter dari column table
    const query = {
      text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  //   menampilkan notes
  async getNotes(owner) {
    //Overall, this query retrieves all columns from the "notes" table,
    //  including records where the owner matches the given parameter or where there is a matching
    // collaboration in the "collaborations" table.
    // The result set is then grouped by the "id" column of the "notes" table.
    const query = {
      text: `SELECT notes.* FROM notes
      LEFT JOIN collaborations ON collaborations.note_id = notes.id
      WHERE notes.owner = $1 OR collaborations.user_id = $1
      GROUP BY notes.id`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  // menampilkan note by id
  async getNotebyId(id) {
    const query = {
      text: `SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
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
      text: "DELETE FROM notes WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
      // throw new NotFoundError("Catatan tidak ditemukan");
    }
  }

  // this method will be used to note Owner
  async verifyNoteOwner(id, owner) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Resource yang Anda minta tidak ditemukan");
    }
    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  // this method will be used to define access rights owner and collaborator
  async verifyNoteAccess(noteId, userId) {
    try {
      // this will be used to verify Note Owner
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // this will be used to verify collaborator based noteId, userId.
      // this._collaborationService used to call method verifyCollaborator to verify.

      try {
        await this._collaborationsService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }

  async getUsersByUsername(username) {
    const query = {
      // By using the % wildcard character at the end of the parameter value (``${username}%),
      // the query will match any username` that starts with the provided value.
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`${username}%`],
    };

    const resultUsers = await this._pool.query(query);
    return resultUsers.rows;
  }
}

module.exports = NotesService;
