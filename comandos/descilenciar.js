
module.exports = {
    name: 'descilenciar',
    description: 'Desilencia um membro do servidor.',
    async execute(message, args) {
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
    },
  };
  