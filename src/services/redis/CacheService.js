const redis = require("redis");
class CacheService {
  // membuat private properti this._client yang bernilai client Redis.
  // Client tersebut dibuat menggunakan perintah createClient yang memanfaatkan package redis.
  // Melalui properti this._client inilah nantinya kita bisa mengoperasikan Redis server.
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on("error", (error) => {
      console.error(error);
    });
    this._client.connect();
  }

  //cara penyimpanan nilai pada Redis menggunakan Redis client, di mana kita menggunakan fungsi this._client.
  //set dan memberikan key, value, serta waktu kedaluwarsa dari nilai parameter fungsi CacheService.set
  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  // membuat operasi dalam mendapatkan nilai pada key di Redis.
  // Bila di redis-cli kita menggunakan perintah GET, di sini kita menggunakan fungsi asynchronous this._client.get.
  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error("Cache tidak ditemukan");
    return result;
  }

  //membuat operasi dalam menghapus nilai pada key di Redis.
  //Bila di redis-cli kita menggunakan perintah DEL, di sini kita menggunakan fungsi this._client.del.
  //Fungsi this._client.del mengembalikan jumlah nilai yang dihapus pada cache nilai tersebut
  //bisa kita manfaatkan sebagai nilai kembalian dari fungsi delete.
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
