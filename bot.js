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

    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latência da API é ${Math.round(client.ws.ping)}ms`);
    }  else if (comando === "silenciar") {
        silenceCommand(message, args);
    } else if (comando === "descilenciar") {
        unsilenceCommand(message, args);
    }
});

async function silenceCommand(message, args) {
    // Verifica se o autor da mensagem tem permissões de gerenciar membros
    if (!message.member.permissions.has("MANAGE_ROLES")) {
        return message.reply("Você não tem permissão para silenciar membros.");
    }

    // Verifica se um membro foi mencionado na mensagem
    const member = message.mentions.members.first();
    if (!member) {
        return message.reply("Por favor, mencione o membro que você deseja silenciar.");
    }

    // Silencia o membro revogando permissões nos canais de texto e voz
    try {
        await member.edit({
            mute: true,
            deaf: true
        });
        message.reply(`${member.user.tag} foi silenciado.`);
    } catch (err) {
        console.log(err);
        return message.reply("Ocorreu um erro ao silenciar o membro.");
    }
}

async function unsilenceCommand(message, args) {
    // Verifica se o autor da mensagem tem permissões de gerenciar membros
    if (!message.member.permissions.has("MANAGE_ROLES")) {
        return message.reply("Você não tem permissão para desilenciar membros.");
    }

    // Verifica se um membro foi mencionado na mensagem
    const member = message.mentions.members.first();
    if (!member) {
        return message.reply("Por favor, mencione o membro que você deseja desilenciar.");
    }

    // Desilencia o membro restaurando suas permissões nos canais de voz
    try {
        await member.edit({
            mute: false,
            deaf: false
        });
        message.reply(`${member.user.tag} foi desilenciado.`);
    } catch (err) {
        console.log(err);
        return message.reply("Ocorreu um erro ao desilenciar o membro.");
    }
}

client.login(token);
