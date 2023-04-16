// pada Folder exceptions berisi berkas yang menangani Custom Error untuk client dan server

/*
 Berkas ClientError.js (extends dari Error) : Custom error yang mengindikasikan eror karena masalah yang terjadi pada client.
 ClientError ini bersifat abstrak karena client error bisa lebih spesifik. 
 Sehingga, sebaiknya Anda tidak membangkitkan error dengan menggunakan class ini secara langsung, tetapi gunakanlah turunannya.
*/

// Buat class ClientError yang mewarisi class Error, dan berisikan constructor yg memiliki 2 parameter
// menggunakan keyword super untuk mengakses properti method

class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

module.exports = ClientError;
