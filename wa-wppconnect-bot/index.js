require("dotenv").config();
const wpp = require("@wppconnect-team/wppconnect");
const chalk = require("chalk");

// Import handler fitur
const handleTikTok = require("./handlers/tiktok");
const handleSetBotPic = require("./handlers/setbotpic");
const handleStiker = require("./handlers/stiker");
const handleTes = require("./handlers/tes");
const handleMenu = require("./handlers/menu");

wpp
  .create({
    sessionId: "tiktok-bot",
    multiDevice: true,
    headless: true,
    qrTimeout: 0,
    useChrome: false,
    browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"], // ← Penting untuk VPS
  })
  .then((client) => {
    console.log(chalk.green.bold("✅ BOT AKTIF — kirim perintah atau link TikTok"));

    client.onMessage(async (msg) => {
      try {
        if (msg.isGroupMsg) return;

        const isMedia = msg.mimetype && (msg.type === 'image' || msg.type === 'video');
        const body = (!isMedia && msg.body) ? msg.body.trim().toLowerCase() : null;
        const caption = msg.caption?.trim().toLowerCase() || null;

        const getCommand = (input) =>
          input?.replace(/^\/|^\./, "").split(" ")[0] || null;

        const command = getCommand(body) || getCommand(caption);

        // Debug
        console.log("📥 Pesan diterima:", {
          from: msg.from,
          type: msg.type,
          body,
          caption,
          command,
        });

        // === Handler perintah ===
        if (["tes", "test"].includes(command)) return handleTes(client, msg);
        if (["setbotpic"].includes(command)) return handleSetBotPic(client, msg);
        if (["menu"].includes(command)) return handleMenu(client, msg);
        if (["stiker", "sticker"].includes(command)) return handleStiker(client, msg);

        // === Handler link TikTok ===
        if (body?.includes("tiktok.com") || body?.includes("vt.tiktok.com")) {
          return handleTikTok(client, msg);
        }

      } catch (err) {
        console.error("❌ Error saat menangani pesan:", err);
        await client.sendText(msg.from, "❌ Terjadi kesalahan internal.");
      }
    });
  })
  .catch((err) => {
    console.error(chalk.red("❌ Gagal membuat koneksi WhatsApp:"), err);
  });
