require("dotenv").config();

module.exports = async function handleSetNameBot(client, msg) {
  try {
    const ADMIN_NUMBERS = process.env.ADMIN_NUMBER?.split(",") || [];

    if (!ADMIN_NUMBERS.includes(msg.sender.id)) {
      return client.sendText(msg.from, "❌ Kamu tidak diizinkan mengganti nama bot.");
    }

    const text = msg.body || msg.caption || "";
    const args = text.trim().split(" ");
    args.shift(); // hapus perintah setnamebot

    const newName = args.join(" ").trim();

    if (!newName) {
      return client.sendText(
        msg.from,
        "❌ Format salah!\nContoh: *setnamebot NamaBaru*"
      );
    }

    await client.setProfileName(newName);
    return client.sendText(
      msg.from,
      `✅ Nama bot berhasil diganti menjadi: *${newName}*`
    );
  } catch (err) {
    console.error("❌ ERROR setnamebot:", err);
    return client.sendText(msg.from, "❌ Gagal mengubah nama bot.");
  }
};
