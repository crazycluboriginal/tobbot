const { SlashCommandBuilder } = require('@discordjs/builders');
const simplydjs = require('simply-djs');

module.exports = {
  name: 'rps',
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors with the bot'),

  async execute(interaction) {
    // Play Rock Paper Scissors
    await simplydjs.rps(interaction, {
      embed: {
        title: 'Rock Paper Scissors',
        color: '#5865F2',
      },
      buttons: {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️',
      },
      time: 60000,
    });
  },

  run: async (_client, interaction) => {
    await module.exports.execute(interaction);
  },
};
