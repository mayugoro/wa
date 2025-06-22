module.exports = async (client, msg) => {
  await client.reply(msg.from, "*✅ ONLINE*", msg.id);
};
