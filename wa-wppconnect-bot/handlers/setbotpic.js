require("dotenv").config();

module.exports = async function handleSetBotPic(client, msg) {
  try {
    const ADMIN_NUMBERS = process.env.ADMIN_NUMBER?.split(",") || [];

    if (!ADMIN_NUMBERS.includes(msg.sender.id)) {
      return client.sendText(msg.from, "❌ Kamu tidak diizinkan mengganti foto profil bot.");
    }

    const isImage = msg.mimetype?.startsWith("image");

    // CASE 1: Kirim gambar dengan caption setbotpic
    if (isImage && msg.caption?.toLowerCase().includes("setbotpic")) {
      const mediaData = await client.downloadMedia(msg);
      if (!mediaData || typeof mediaData !== "string") {
        return client.sendText(msg.from, "❌ Gagal mengambil gambar. Kirim ulang.");
      }

      await client.setProfilePic(mediaData);
      return client.sendText(msg.from, "✅ Foto profil bot berhasil diperbarui.");
    }

    // CASE 2: Balas gambar lalu ketik setbotpic
    if (
      msg.body?.toLowerCase().includes("setbotpic") &&
      msg.quotedMsg &&
      msg.quotedMsg.mimetype?.startsWith("image")
    ) {
      const mediaData = await client.downloadMedia(msg.quotedMsg);
      if (!mediaData || typeof mediaData !== "string") {
        return client.sendText(msg.from, "❌ Gagal mengambil gambar dari pesan yang dibalas.");
      }

      await client.setProfilePic(mediaData);
      return client.sendText(msg.from, "✅ Foto profil bot berhasil diperbarui.");
    }

    return client.sendText(
      msg.from,
      "❌ Kirim gambar dengan caption: `setbotpic`\nAtau balas gambar lalu ketik `setbotpic`."
    );
  } catch (err) {
    console.error("❌ ERROR setbotpic:", err);
    return client.sendText(msg.from, "❌ Terjadi kesalahan saat mengganti foto profil.");
  }
};
