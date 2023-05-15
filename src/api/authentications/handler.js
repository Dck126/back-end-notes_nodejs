const ClientError = require("../../exceptions/ClientError");
// const autoBind = require("auto-bind");

// Login Proccess
class AuthenticationsHandler {
  constructor(service, usersNotesService, tokenManager, validator) {
    this._service = service;
    this._usersNotesService = usersNotesService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    // autoBind(this); //mem-bind nilai this untuk seluruh method sekaligus

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  //
  async postAuthenticationHandler(request, h) {
    try {
      // validasi permintaan Authentications
      this._validator.validatePostAuthenticationsPayloadSchema(request.payload);
      // request username,password
      const { username, password } = request.payload;
      // verify username, password dengan Id
      const id = await this._usersNotesService.verifyUserCredential(
        username,
        password
      );
      /**
       * kita bisa lanjutkan dengan membuat access token dan refresh token.
       * Untuk membuat kedua token tersebut, kita gunakan fungsi this._tokenManager.generateAccessToken dan
       * this._tokenManager.generateRefreshToken, serta membawa objek payload yang memiliki properti id user
       */
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      // perlu menyimpan dulu refreshToken ke database agar server mengenali refreshToken bila pengguna ingin memperbarui accessToken.
      await this._service.addRefreshToken(refreshToken);

      const response = h.response({
        status: "success",
        message: "Authentication berhasil ditambahkan",
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //
  async putAuthenticationHandler(request, h) {
    try {
      // memastikan payload request mengandung properti refreshToken yang bernilai string
      this._validator.validatePutAuthenticationsPayloadSchema(request.payload);
      // dapatkan nilai refreshToken pada request.payload
      const { refreshToken } = request.payload;
      // verifikasi refreshToken baik dari sisi database maupun signature token
      await this._service.verifyRefreshToken(refreshToken);
      // menampung nilai id dari objek payload yang dikembalikan this._tokenManager.verifyRefreshToken.
      // Nilai id tersebut nantinya kita akan gunakan dalam membuat accessToken baru agar identitas pengguna tidak berubah
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      // membuat accessToken baru
      const accessToken = this._tokenManager.generateAccessToken({ id });

      const response = h.response({
        status: "success",
        message: "Access Token berhasil diperbarui",
        data: {
          accessToken,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //Fungsi handler ini akan dijalankan ketika ada request ke DELETE /authentications
  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationsPayloadSchema(
        request.payload
      );
      // dapatkan nilai refreshToken dari request payload
      const { refreshToken } = request.payload;
      // sebelum menghapusnya kita perlu memastikan refreshToken tersebut ada di database gunakan fungsi this._authenticationsService.verifyRefreshToken.
      await this._service.verifyRefreshToken(refreshToken);
      // Setelah proses verifikasi refreshToken selesai, kita bisa lanjut menghapusnya dari database
      // menggunakan fungsi this._authenticationsService.deleteRefreshToken.
      await this._service.deleteRefreshToken(refreshToken);
      return {
        status: "success",
        message: "Refresh token berhasil dihapus",
      };
    } catch (error) {
      // Error Handling
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
