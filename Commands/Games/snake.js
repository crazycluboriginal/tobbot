const { SlashCommandBuilder } = require('@discordjs/builders');
const { Snake } = require('discord-gamecord');

module.exports = {
  name: 'snake',
  data: new SlashCommandBuilder()
    .setName('snake')
    .setDescription('Play a Snake game in Discord!'),

  async execute(interaction) {
    await interaction.deferReply();

    new Snake({
      interaction,
      embed: {
        title: 'Snake Game',
        color: '#5865F2',
        overTitle: 'Game Over',
      },
      snake: {
        head: '🟢',
        body: '🟩',
        tail: '🟢',
      },
      emojis: {
        board: '⬛',
        food: '🍎',
        up: '⬆️',
        right: '➡️',
        down: '⬇️',
        left: '⬅️',
      },
      othersMessage: 'You are not allowed to use buttons for this message!',
    }).startGame();
  },

  run: async (_client, interaction) => {
    await module.exports.execute(interaction);
  },
};
