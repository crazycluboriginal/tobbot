const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');
const apiKey = 'kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB';

module.exports = {
  name: 'rhyme',
  description: 'Find rhyming words for a given word',
  options: [
    {
      name: 'word',
      description: 'The word to find rhymes for',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const wordQuery = interaction.options.getString('word');
    const apiUrl = `https://api.api-ninjas.com/v1/rhyme?word=${encodeURIComponent(wordQuery)}`;
    try {
      const response = await fetch(apiUrl, {
        headers: { 'X-Api-Key': apiKey }
      });
      if (!response.ok) {
        console.error(`Fetch failed with status: ${response.status}`);
        return interaction.reply({ content: 'Oops! Something went wrong while fetching the rhyming words.', ephemeral: true });
      }

      const rhymingWords = await response.json();
      if (Array.isArray(rhymingWords) && rhymingWords.length > 0) {
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 0xFFFFFF))
          .setTitle(`Rhyming Words for "${wordQuery}"`)
          .setDescription(rhymingWords.join('\n'));

        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({ content: `No rhyming words found for "${wordQuery}".`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error fetching rhyming words:', error);
      return interaction.reply({ content: 'Oops! Something went wrong while fetching the rhyming words.', ephemeral: true });
    }
  },
};
