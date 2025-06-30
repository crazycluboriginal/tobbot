const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Sends a random joke'),

  run: async (client, interaction, args) => {
    await interaction.deferReply();
    try {
      const response = await fetch('https://sv443.net/jokeapi/v2/joke/Any');
      const joke = await response.json();

      let jokeText = '';
      if (joke.type === 'single') {
        jokeText = joke.joke;
      } else if (joke.type === 'twopart') {
        jokeText = `${joke.setup}\n${joke.delivery}`;
      }

      const embed = new EmbedBuilder()
        .setColor('#FF9900')
        .setTitle('Random Joke')
        .setDescription(jokeText)
        .setFooter({ text: '🤣😅😆😂' });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      await interaction.editReply('Oops! Something went wrong while fetching the joke.');
    }
  },
};
