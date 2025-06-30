const { SlashCommandBuilder } = require('discord.js');
const { Connect4 } = require('discord-gamecord');

module.exports = {
  name: 'connect4',
  data: new SlashCommandBuilder()
    .setName('connect4')
    .setDescription('Play a game of Connect 4 with another user.')
    .addUserOption(option =>
      option
        .setName('opponent')
        .setDescription('The user to challenge')
        .setRequired(true)
    ),

  async execute(interaction) {
    const challenger = interaction.user;
    const opponent = interaction.options.getUser('opponent');
    if (opponent.id === challenger.id) {
      return interaction.reply({ content: 'You cannot challenge yourself!', ephemeral: true });
    }

    await interaction.deferReply();

    new Connect4({
      interaction,
      opponent,
      embed: {
        title: 'Connect 4',
        color: '#5865F2',
      },
      emojis: {
        player1: '🔵',
        player2: '🟡',
      },
      turnMessage: '{emoji} | It’s now **{player}**\'s turn!',
      winMessage: '{emoji} | **{winner}** won the game!',
      gameEndMessage: 'The game went unfinished :(',
      drawMessage: 'It was a draw!',
      askMessage: 'Hey {opponent}, {challenger} challenged you for a game of Connect 4!',
      cancelMessage: 'Looks like they refused to play Connect 4. :(',
      timeEndMessage: 'Since the opponent didn’t answer, I dropped the game!',
    }).startGame();
  },

  // alias run for prefix loader
  run: async (client, interaction) => {
    await module.exports.execute(interaction);
  },
};
