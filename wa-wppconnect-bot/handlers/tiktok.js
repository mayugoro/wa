const { request } = require("undici");

async function handleTikTok(client, msg) {
  const url = msg.body?.trim();
  if (!url || !url.includes("tiktok.com")) return;

  await client.sendText(msg.from, "⏳ Tunggu sebentar, sedang diproses...");

  try {
    // Ambil metadata dari API Tikwm
    const response = await request(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const raw = await response.body.text();
    const json = JSON.parse(raw);

    console.log("🎯 JSON hasil Tikwm:", json);

    if (json.code !== 0 || !json.data?.play) {
      await client.sendText(msg.from, "❌ Gagal mengambil video dari TikTok.");
      return;
    }

    const videoUrl = json.data.play;

    // Ambil video dan konversi ke base64
    const videoRes = await request(videoUrl);
    const arrayBuffer = await videoRes.body.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length === 0) {
      await client.sendText(msg.from, "❌ Video tidak ditemukan atau gagal diunduh.");
      return;
    }

    const mimetype = "video/mp4";
    const base64 = buffer.toString("base64");

    // Kirim ke WA
    await client.sendFile(
      msg.from,
      `data:${mimetype};base64,${base64}`,
      "video.mp4",
      "✅ Ini videonya!"
    );
  } catch (err) {
    console.error("❌ ERROR saat ambil video:", err);
    await client.sendText(msg.from, "❌ Terjadi kesalahan saat mengambil video.");
  }
}

module.exports = handleTikTok;
