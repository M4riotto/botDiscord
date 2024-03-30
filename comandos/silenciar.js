
module.exports = {
    name: 'silenciar',
    description: 'Silencia um membro do servidor.',
    async execute(message, args) {
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
    },
  };
  