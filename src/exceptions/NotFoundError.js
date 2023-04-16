/*
NotFoundError (extends dari ClientError) : Custom error yang mengindikasikan eror karena resource yang diminta client tidak ditemukan.
*/

const ClientError = require("./ClientError");

// Custom Error NotFoundError
// Buat class NotFoundError yang mewarisi ClientError
// this.name mereferensikan Object NotfoundError
class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = NotFoundError;
  }
}

module.exports = NotFoundError;
