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

const { app, prefix } = require('./config.js');
const prefixo = prefix.command
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

client.on('messageCreate', async message => {
  // Verificar se a mensagem não foi enviada por um bot
  if (message.author.bot) return;

  // Verificar se a mensagem está em um canal específico e contém um link
  if (message.channel.id === '1223853315880779817' && message.content.match(/(http(s)?:\/\/[^ ]*)/)) {
    // Excluir a mensagem que contém o link
    await message.delete();

    // Punição - exemplo: enviar uma mensagem de aviso e/ou aplicar uma punição ao autor
    const member = message.member;
    // Aqui você pode aplicar um mute, banimento, ou qualquer outra ação que desejar
    // Por exemplo, enviar uma mensagem de aviso:
    await message.channel.send(`${member}, links não são permitidos neste canal. Por favor, leia as regras.`);
    await member.timeout(300_000); // Punição de 5 minutos

    // Interromper a execução para evitar a execução do segundo evento
    return;
  }

  // Se a mensagem não contém link ou não está no canal específico, executar o código normalmente
  const args = message.content.slice(prefixo.length).trim().split(/ +/);
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



client.login(app.token);
