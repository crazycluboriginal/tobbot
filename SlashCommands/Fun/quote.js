const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a random inspirational quote'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const { data } = await axios.get('https://api.quotable.io/random');
      const embed = new EmbedBuilder()
        .setTitle('💬 Random Quote')
        .setDescription(`"${data.content}" — ${data.author}`)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Error fetching quote:', err);
      await interaction.editReply('Sorry, I couldn’t fetch a quote right now.');
    }
  },
};
