const amqp = require("amqplib");

const ProducerService = {
  sendMessage: async (queue, message) => {
    // create connection
    const connection = await amqp.connect(process.env.CLOUDAMQP_SERVER);
    // create channel
    const channel = await connection.createChannel();

    // Sebelum mengirimkan pesan ke queue, kita perlu memastikan dulu bahwa queue dengan nama dicoding sudah dibuat.
    // Caranya dengan menggunakan fungsi channel.assertQueue
    await channel.assertQueue(queue, {
      durable: true,
    });
    // kirim pesan dalam bentuk Buffer ke queue dengan menggunakan perintah channel.sendToQueue.
    await channel.sendToQueue(queue, Buffer.from(message));

    // tutup koneksi setelah satu detik berlangsung dari pengiriman pesan
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
