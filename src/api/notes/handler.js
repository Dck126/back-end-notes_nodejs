// berkas handler akan menampung seluruh logika & method untuk request client
// jadi semuah method dan logika yang ada di handler di teruskan ke routes untuk d atur pathnya.

class NotesHandler {
  // buat cunstru
  constructor(service) {
    this._service = service;

    // menetapkan nilai this
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteEditHandler = this.putNoteEditHandler.bind(this);
    this.deleteNoteHandler = this.deleteNoteHandler.bind(this);
  }

  // method untuk menambahkan Note
  postNoteHandler(request, h) {
    try {
      const { title = "untitled", body, tags } = request.payload;

      const noteId = this._service.addNote({ title, body, tags });

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
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

  // method untuk menampilkan semua catatan
  getNotesHandler() {
    const notes = this._service.getNotes();

    return {
      status: "success",
      data: {
        notes,
      },
    };
  }

  //   method untuk menampilkan Note by Id
  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const note = this._service.getNoteById(id);
      return {
        status: "success",
        data: {
          note,
        },
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  //   method untuk mengedit
  putNoteEditHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.editNoteById(id, request.payload);

      return {
        status: "success",
        message: "Catatan berhasil diperbarui",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  //   method untuk menghapus
  deleteNoteHandler(request, h) {
    try {
      const { id } = request.params;

      this._service.deleteNoteById(id);

      return {
        status: "success",
        message: "Catatan berhasil dihapus",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });

      response.code(404);
      return response;
    }
  }
}

module.exports = NotesHandler;
