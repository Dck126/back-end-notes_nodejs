const { Pool } = require("pg");
const InvanriantError = require("../../exceptions/InvariantError");
// Buat Authentications Notes
// AuthenticationService ini akan bertanggung jawab dalam menangani pengelolaan data refresh token
/*
TODO LIST:
Memasukkan refresh token (addRefreshToken).
Memverifikasi atau memastikan refresh token ada di database (verifyRefreshToken).
Menghapus refresh token (deleteRefreshToken).
*/
class AuthenticationsNotesService {
  constructor() {
    this._pool = new Pool();
  }

  //Menambahkan Refresh Token
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    // Di dalam fungsi ini, lakukan kueri mendapatkan refresh token berdasarkan token yang dibawa oleh parameter
    // mengecek keberadaan token yang ada didatabase
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const resultAuthentications = await this._pool.query(query);
    if (!resultAuthentications.rows.length) {
      throw new InvanriantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsNotesService;
