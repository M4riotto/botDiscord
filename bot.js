const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

const { token, prefix } = require('./config.json');

client.on("ready", () => {
  console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, ${client.channels.cache.size} canais e ${client.guilds.cache.size} servidores.`);
  client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidores`);
});

client.on("guildCreate", guild => {
  console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros.`);
  client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
});

client.on("guildDelete", guild => {
  console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id}).`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servidores`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const comando = args.shift().toLowerCase();

  // Carrega o comando do arquivo correspondente
  const commandFile = require(`./comandos/${comando}.js`);

  // Executa o comando
  if (commandFile) commandFile.execute(message, args);
});

client.login(token);
