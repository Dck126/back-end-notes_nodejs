// berkas handler akan menampung seluruh logika & method untuk request client
// jadi semuah method dan logika yang ada di handler di teruskan ke routes untuk diatur pathnya.

const ClientError = require("../../exceptions/ClientError");
// const autoBind = require("auto-bind");

// kita buat Object NotesHandler yang menampung logika yang menghandle permintaan client
class NotesHandler {
  constructor(service, validator) {
    //this._service akan diberikan nanti nilai dari Noteservice;
    this._service = service;
    this._validator = validator;
    /*
    Fungsi bind berfungsi untuk mengikat implementasi function agar ia tetap memiliki konteks sesuai nilai yang ditetapkan
    pada argumen yang diberikan pada fungsi bind tersebut.
    */
    // autoBind(this); //mem-bind nilai this untuk seluruh method sekaligus
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteEditHandler = this.putNoteEditHandler.bind(this);
    this.deleteNoteHandler = this.deleteNoteHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { title = "untitled", body, tags } = request.payload;

      // mendapatkan user id pengguna yang terautentikasi melalui request.auth.credentials.id.
      const { id: credentialId } = request.auth.credentials;

      const noteId = await this._service.addNote({
        title,
        body,
        tags,
        owner: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Catatan berhasil ditambahkan",
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getNotesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status: "success",
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);

      const note = await this._service.getNotebyId(id);
      return {
        status: "success",
        data: {
          note,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putNoteEditHandler(request, h) {
    try {
      this._validator.validateNotePayload(request.payload);
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);

      await this._service.putNotebyId(id, request.payload);

      return {
        status: "success",
        message: "Catatan berhasil diperbarui",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteNoteHandler(request, h) {
    try {
      const { id } = request.params;

      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);

      await this._service.deletNotebyId(id);

      return {
        status: "success",
        message: "Catatan berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = NotesHandler;
