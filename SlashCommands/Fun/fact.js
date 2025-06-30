const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fact')
    .setDescription('Generate a random useless fact'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const { text } = response.data;

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('✨ Random Fact')
        .setDescription(`> ${text}`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching random fact:', error);
      await interaction.editReply('Sorry, I couldn’t fetch a fact right now.');
    }
  },
};
