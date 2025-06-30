const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('advice')
    .setDescription('Get a random piece of advice'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();
      const advice = data.slip.advice;

      const embed = new EmbedBuilder()
        .setTitle('💡 Useful Life Advice 💡')
        .setDescription(advice)
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Advice command error:', error);
      await interaction.editReply({ content: 'Failed to fetch advice. Please try again later.', ephemeral: true });
    }
  },
};
