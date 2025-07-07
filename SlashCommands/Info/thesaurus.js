const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');
const apiKey = process.env.API_NINJAS_KEY;

module.exports = {
  name: 'thesaurus',
  description: 'Find synonyms and antonyms for any word of your choice!',
  options: [
    {
      name: 'word',
      description: 'The word to find synonyms and antonyms for',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    try {
      const word = interaction.options.getString('word');
      const apiUrl = `https://api.api-ninjas.com/v1/thesaurus?word=${encodeURIComponent(word)}`;

      const response = await fetch(apiUrl, {
        headers: { 'X-Api-Key': apiKey }
      });
      if (!response.ok) {
        console.error(`Fetch failed with status: ${response.status}`);
        return interaction.reply({ content: 'Oops! Something went wrong while fetching synonyms and antonyms.', ephemeral: true });
      }

      const thesaurusData = await response.json();
      const synonyms = Array.isArray(thesaurusData.synonyms) && thesaurusData.synonyms.length
        ? thesaurusData.synonyms.join(', ')
        : 'None found';
      const antonyms = Array.isArray(thesaurusData.antonyms) && thesaurusData.antonyms.length
        ? thesaurusData.antonyms.join(', ')
        : 'None found';

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setTitle(`Synonyms and Antonyms for "${word}"`)
        .addFields(
          { name: 'Synonyms', value: synonyms, inline: false },
          { name: 'Antonyms', value: antonyms, inline: false }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching synonyms and antonyms:', error);
      await interaction.reply({ content: 'Oops! Something went wrong while fetching synonyms and antonyms.', ephemeral: true });
    }
  },
};
