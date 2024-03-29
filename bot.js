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
    client.user.setActivity(`Eus estou em ${client.guilds.cache.size} servidores`);
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
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    // coamdno ping
    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }

});

client.on("messageCreate", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const comando = args.shift().toLowerCase();

    if (comando === "mute") {
        // Verifica se o autor da mensagem tem permissões de gerenciar membros
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.reply("Você não tem permissão para mutar membros.");
        }

        // Verifica se um membro foi mencionado na mensagem
        const member = message.mentions.members.first();
        if (!member) {
            return message.reply("Por favor, mencione o membro que você deseja mutar.");
        }

        // Verifica se o membro mencionado está mutado
        if (member.roles.cache.some(role => role.name === "Muted")) {
            return message.reply("Este membro já está mutado.");
        }

        // Obtém o cargo "Muted" do servidor ou cria um novo se não existir
        let mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.roles.create({
                    name: "Muted",
                    permissions: []
                });

                // Define as permissões do cargo Muted
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(mutedRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch (err) {
                console.log(err);
                return message.reply("Ocorreu um erro ao criar o cargo Muted.");
            }
        }

        // Muta o membro
        try {
            await member.roles.add(mutedRole);
            message.reply(`${member.user.tag} foi mutado.`);

            // Define um temporizador para remover o cargo de mute após um determinado período
            const tempo = args[1] ? parseInt(args[1]) * 1000 : 60000; // Tempo padrão de 60 segundos
            setTimeout(async () => {
                await member.roles.remove(mutedRole);
                message.channel.send(`${member.user.tag} foi desmutado após o tempo expirar.`);
            }, tempo);
        } catch (err) {
            console.log(err);
            return message.reply("Ocorreu um erro ao mutar o membro.");
        }
    }
});


client.login(token);
