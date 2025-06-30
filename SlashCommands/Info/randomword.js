const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const he = require('he');
const { EmbedBuilder } = require('discord.js');

// Wordnik API key - replace with your actual key
const WORDNIK_API_KEY = 'lcwzt69rcg3xdo3lqm8ew5439zhm89pbtigty4os863b6d2hy';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randomword')
    .setDescription('Find a completely random word in the dictionary!'),

  async execute(client, interaction) {
    try {
      const response = await fetch(
        `https://api.wordnik.com/v4/words.json/randomWord?api_key=${WORDNIK_API_KEY}`
      );
      const data = await response.json();
      const word = he.decode(data.word);

      const definitionResponse = await fetch(
        `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&api_key=${WORDNIK_API_KEY}`
      );
      const definitionData = await definitionResponse.json();
      const definition = definitionData[0]?.text.replace(/<\/?xref>/g, '') || 'No definition found.';
      const decodedDefinition = he.decode(definition);

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setTitle(word)
        .setDescription(decodedDefinition);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('An error occurred:', error);
      await interaction.reply({ content: 'Failed to fetch a random word.', ephemeral: true });
    }
  }
};
