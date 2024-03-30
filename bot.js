const { Client, GatewayIntentBits, ChannelType  } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
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


client.on('voiceStateUpdate', async (oldState, newState) => {
  // Criar canal de voz quando o usuário entrar no canal "Clique aqui ✅"
  if (!oldState.channel && newState.channel && newState.channel.name === 'Clique aqui ✅') {
    const userName = client.users.cache.get(newState.id)?.username || 'Usuário';

    try {
      const category = newState.channel.parent; // Obter a categoria do canal "Clique aqui ✅"

      const channel = await newState.guild.channels.create({
        name: userName,
        type: ChannelType.GuildVoice,
        parent: category.id, // Definir a categoria do novo canal
      });

      await newState.guild.channels.fetch();
      await newState.setChannel(channel);

      console.log(`Canal de voz criado: ${channel.name}`);
    } catch (error) {
      console.error('Erro ao criar canal de voz:', error);
    }
  }

  // Excluir canal de voz quando o usuário sair do canal "[username]'s Channel"
  if (oldState.channel && !newState.channel && oldState.channel.name === `${client.users.cache.get(oldState.id)?.username}`) {
    try {
      await oldState.channel.delete();
    } catch (error) {
      console.error('Erro ao excluir canal de voz:', error);
    }
  }
});



client.login(token);
