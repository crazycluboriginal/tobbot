const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Get the definition of a word')
    .addStringOption(option =>
      option
        .setName('word')
        .setDescription('The word to define')
        .setRequired(true)
    ),

  run: async (client, interaction, args) => {
    const word = interaction.options.getString('word');
    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=c77d705d-1d6f-4d29-a823-21dcc5c5940e`
      );
      const data = await response.json();

      if (!data.length) {
        return interaction.reply(
          `Sorry, I couldn't find a definition for the word "${word}".`
        );
      }

      const definition = data[0].shortdef
        ? String(data[0].shortdef[0])
        : 'N/A';
      const example = data[0].def &&
        data[0].def[0] &&
        data[0].def[0].sseq &&
        data[0].def[0].sseq[0] &&
        data[0].def[0].sseq[0][0] &&
        data[0].def[0].sseq[0][0][1] &&
        data[0].def[0].sseq[0][0][1].dt &&
        data[0].def[0].sseq[0][0][1].dt[1]
        ? String(data[0].def[0].sseq[0][0][1].dt[1][1])
        : 'N/A';
      const synonyms = data[0].meta &&
        data[0].meta.syns &&
        data[0].meta.syns.length > 0
        ? data[0].meta.syns[0]
            .map(synonym => String(synonym))
            .join(', ')
        : 'N/A';

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(word)
        .setDescription(definition)
        .addFields(
          { name: 'Example', value: example },
          { name: 'Synonyms', value: synonyms }
        );

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply(
        `Sorry, there was an error retrieving the definition for "${word}".`
      );
    }
  },
};
