module.exports = async (client, msg) => {
  const text = `Menu bot
• .Tiktok downloader :
  - kirim langsung link tiktok -

• .Stiker :
  - kirim media lalu beri perintah:
  - /stiker`;

  await client.sendText(msg.from, text);
};
