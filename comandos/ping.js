const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

module.exports = {
  name: 'ping',
  description: 'Envia uma mensagem de "pong!" para o canal.',
  async execute(message) {
    const m = await message.channel.send("Ping?");
    m.edit({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. `)
          .setColor(0x0099FF)
      ]
    });
  },
};
