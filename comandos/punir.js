const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'punir',
  description: 'Pune um membro do servidor.',
  async execute(message, args) {
    // Verifica se o autor da mensagem tem permissões para punir membros
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.reply("Você não tem permissão para punir membros.");
    }

    // Verifica se um membro foi mencionado na mensagem
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Por favor, mencione o membro que você deseja punir.");
    }

    // Verifica se o tempo de punição foi especificado
    if (!args[1]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`!punir [usuário] [tempo] [motivo]`)
            .setColor(0x0099FF)
        ]
      });
    }

    // Converte o tempo de punição para segundos
    const timeInSeconds = parseInt(args[1]);

    // Verifica se o tempo de punição é válido
    if (timeInSeconds <= 0 || timeInSeconds > 60 * 60 * 24 * 7) {
      return message.reply("O tempo de punição deve ser entre 1 minuto e 7 dias.");
    }

    try {
      // const time = parseInt(timeInSeconds + "_000");

      await member.timeout(timeInSeconds * 60 * 1000);

      const embed = new EmbedBuilder()
        .setDescription(`${member.user.tag} foi punido por ${args[1]} minutos. Motivo: ${args.slice(2).join(" ")}.`)
        .setColor(0x0099FF)

      // Notificar o membro
      member.send(`Você foi punido por ${args[1]} minutos. Motivo: ${args.slice(2).join(" ")}.`);


      return await message.reply({ ephemeral: true, embeds: [embed] });


    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Ocorreu um erro ao punir o membro." . err)
            .setColor(0x0099FF)

        ]
      });
    }
  },
};
