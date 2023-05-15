const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const AuthenticationsError = require("../../exceptions/AuthenticationsError");

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

  async getUserById(usersId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [usersId],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return resultUsers.rows[0];
  }

  // Verifikasi Username
  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };
    const resultUsers = await this._pool.query(query);

    if (!resultUsers.rows.length) {
      throw new AuthenticationsError("Kredensial yang Anda berikan salah");
    }
    /*
    Properti password sedang diganti namanya hashedPasswordmenggunakan :sintaks,
    yang memungkinkan anda menentukan nama alternatif untuk properti selama destrukturisasi
    */
    const { id, password: hashedpassword } = resultUsers.rows[0];

    /**
     * bcrypt.compare()membutuhkan dua argumen: 
        kata sandi plaintext untuk dibandingkan (password),dan kata sandi yang sebelumnya di-hash ( hashedPassword).

     * Metode ini membandingkan kata sandi plaintext dengan kata sandi yang di-hash dengan terlebih dahulu
        melakukan hashing pada kata sandi plaintext menggunakan salt dan jumlah putaran yang sama dengan kata sandi yang di-hash,
        lalu membandingkan hash yang dihasilkan dengan kata sandi yang di-hash.
        Jika kedua hash cocok, metode mengembalikan true. Jika tidak, ia mengembalikan false.

      * Metode compare() mengembalikan promise, mengapa await 
         digunakan untuk menunggu hasil perbandingan sebelum menugaskannya ke variabel match.

      * Setelah baris kode ini dijalankan, match variabel akan berisi nilai boolean yang menunjukkan
         apakah kata sandi plaintext cocok dengan kata sandi yang di-hash sebelumnya.
     */
    const match = await bcrypt.compare(password, hashedpassword);

    if (!match) {
      throw new AuthenticationsError("Kredensial yang Anda berikan salah");
    }
    return id;
  }
}

module.exports = UsersNotesService;
