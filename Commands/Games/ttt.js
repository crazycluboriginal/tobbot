const { SlashCommandBuilder } = require('@discordjs/builders');
const simplydjs = require('simply-djs');

module.exports = {
  name: 'ttt',
  data: new SlashCommandBuilder()
    .setName('ttt')
    .setDescription('Play Tic Tac Toe with the bot'),

  async execute(interaction) {
    await simplydjs.tictactoe(interaction, {
      embed: {
        title: 'Tic Tac Toe',
        color: '#5865F2',
      },
      buttons: {
        x: '❌',
        o: '⭕',
      },
      othersMessage: 'You cannot use these buttons for this game!',
      time: 60000,
    });
  },

  run: async (_client, interaction) => {
    await module.exports.execute(interaction);
  },
};
