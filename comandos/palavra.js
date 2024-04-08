const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'palavra',
    description: 'Envia um versículo da Bíblia.',
    async execute(message, args) {
        try {
            const verse = await getBibleVerse();

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Versículo da Bíblia')
                        .setDescription(verse.text)
                        .addFields(
                            {
                                name: ' ',
                                value: verse.reference,
                            }
                        )
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar versículo:', error);
            message.channel.send('Desculpe, houve um erro ao buscar o versículo da Bíblia.');
        }

        async function getBibleVerse() {
            const response = await axios.get('https://bible-api.com/?random=verse&translation=almeida');
            const data = response.data;
            return data;
        }
    },
};
