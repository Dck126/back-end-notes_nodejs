/*
Berkas InvariantError.js (extends dari ClientError) : merupakan 
Custom error yang mengindikasikan eror karena kesalahan bisnis logic pada data yang dikirimkan oleh client.
Kesalahan validasi data merupakan salah satu InvariantError.
*/

const ClientError = require("./ClientError");

// Custom Error untuk InvariantError
//Buat class InvariantError yang mewarisi ClientError
//Panggil fungsi super untuk membawa nilai parameter message
//this.name mereferensikan InvariantError yang menjalankan fungsi saat ini
class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = InvariantError;
  }
}

module.exports = InvariantError;
