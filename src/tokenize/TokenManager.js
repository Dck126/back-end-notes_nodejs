const Jwt = require("@hapi/jwt");
const InvanriantError = require("../exceptions/InvariantError");
/**
 * ToDo List:
 * Membuat atau men-generate access token (generateAccessToken).
 * Membuat atau men-generate refresh token (generateRefreshToken).
 * Memverifikasi refresh token (verifyRefreshToken).
 */

const TokenManager = {
  /**
   * Membuat access token
   * Parameter payload merupakan objek yang disimpan ke dalam salah satu artifacts JWT.
   * Fungsi generate menerima dua parameter, yang pertama adalah payload dan kedua adalah secretKey.
   * Pada parameter payload, kita akan memberikan nilai payload yang ada di parameter fungsi.
   * Kemudian secretKey, sesuai namanya ia adalah kunci yang digunakan algoritma enkripsi
   * sebagai kombinasi untuk membuat JWT token. Kunci ini bersifat rahasia, jadi jangan disimpan di source code secara transparan.
   * Kita akan simpan key di dalam environment variable ACCESS_TOKEN_KEY.
   */
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  /**
   * Membuat refresh token
   * Proses verifikasi ini bertujuan untuk memastikan refresh token tidak diubah atau
   * dimanipulasi sedemikian rupa untuk mendapatkan akses yang tidak berhak
   */
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

  /**
   * Memverifikasi refresh token
   * Proses verifikasi ini bertujuan untuk memastikan refresh token tidak diubah atau
   * dimanipulasi sedemikian rupa untuk mendapatkan akses yang tidak berhak
   */
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvanriantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
