const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

class UsersNotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    //   TODO:Verif User, pastikan belum terdaftar
    await this.verifyNewUsername(username);
    // TODO:Bila Verif lolos, maka masukkan user ke database
    const id = `user-${nanoid(16)}`;
    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    // query
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedpassword, fullname],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return resultUsers.rows[0].id;
  }

  //  verifikasi Username
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const resultUsers = await this._pool.query(query);

    if (resultUsers.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
    // return resultUsers.rows.length;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id FROM users WHERE id = $1",
      values: [userId],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new NotFoundError("User Id tidak ditemukan");
    }
    return resultUsers.rows[0];
  }
}

module.exports = UsersNotesService;
