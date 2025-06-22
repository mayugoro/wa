module.exports = async function handleStiker(client, msg) {
  try {
    const metadata = {
      author: "Na'am🗿",
      pack: "Stiker Bot",
    };

    // Fungsi untuk ambil perintah dari teks, tanpa prefix
    const getCommand = (input) =>
      input?.toLowerCase().trim().replace(/^\/|^\./, "").split(" ")[0] || "";

    const commandFromCaption = getCommand(msg.caption);
    const commandFromText = msg.type === "chat" ? getCommand(msg.body) : null;
    const command = commandFromCaption || commandFromText;

    const isStikerCommand = ["stiker", "sticker"].includes(command);

    // CASE 1: Kirim media + caption "stiker"
    if (msg.mimetype && commandFromCaption && isStikerCommand) {
      const mediaData = await client.downloadMedia(msg);
      if (!mediaData || typeof mediaData !== "string") {
        return client.sendText(
          msg.from,
          "❌ Gagal mengambil media. Mungkin media rusak atau kadaluarsa."
        );
      }

      if (msg.type === "image") {
        return client.sendImageAsSticker(msg.from, mediaData, { metadata });
      } else if (msg.type === "video") {
        return client.sendVideoAsSticker(msg.from, mediaData, { metadata });
      } else {
        return client.sendText(msg.from, "❌ Format media tidak didukung.");
      }
    }

    // CASE 2: Reply ke media + kirim teks "stiker"
    if (msg.quotedMsg?.mimetype && isStikerCommand) {
      const quoted = msg.quotedMsg;
      const mediaData = await client.downloadMedia(quoted);
      if (!mediaData || typeof mediaData !== "string") {
        return client.sendText(
          msg.from,
          "❌ Gagal mengambil media dari pesan yang dibalas."
        );
      }

      if (quoted.type === "image") {
        return client.sendImageAsSticker(msg.from, mediaData, { metadata });
      } else if (quoted.type === "video") {
        return client.sendVideoAsSticker(msg.from, mediaData, { metadata });
      } else {
        return client.sendText(msg.from, "❌ Format media tidak didukung.");
      }
    }

    // CASE 3: Tidak sesuai format
    return client.sendText(
      msg.from,
      "❌ Kirim gambar/video dengan caption: /stiker\nAtau balas media lalu ketik /stiker"
    );

  } catch (err) {
    console.error("❌ ERROR stiker:", err);
    return client.sendText(msg.from, "❌ Terjadi kesalahan saat membuat stiker.");
  }
};
