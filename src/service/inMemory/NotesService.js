// folder services akan menampung segala fungsi yang digunakan untuk menulis, mendapatkan, mengubah, atau menghapus sebuah resource.
// folder service akan manangani operasi CRUD pada resource sedangkan handler akan fokus pada request handling or response client.
// berkas NotesService.js digunakan untuk mengelola folder books dalam inMemory (didalam memory menggunakan array)
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

// Object NoteService menampung operasi CRUD.
// pada constructor terdapat array, yang akan manmpung seluruh resource dari berkas NoteService.js
class NotesService {
  constructor() {
    this._notes = [];
  }
  // membuat operasi CRUD untuk mengelola data pada this._notes.

  // method menambahkan note
  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = { title, body, tags, id, createdAt, updatedAt };

    this._notes.push(newNote);

    // cek apakah id ada atau tidak
    const isNoteSuccess =
      this._notes.filter((note) => note.id === id).length > 0;

    if (!isNoteSuccess) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }
    return id;
  }

  // menampilkan keseluruhan note
  getNotes() {
    return this._notes;
  }

  // menampilkan detail note sesuai id
  getNoteById(id) {
    const note = this._notes.filter((n) => n.id === id)[0];

    if (!note) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }
    return note;
  }

  // method mengedit note
  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }

    const updatedAt = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  // method menghapus note
  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
