const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const he = require('he');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bibleverse')
    .setDescription('Fetch the Bible Verse of the Day'),

  run: async (client, interaction, args) => {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://www.biblegateway.com/votd/get/?format=json');
      const verseData = res.data.votd;
      const verseText = he.decode(verseData.text.replace(/<[^>]*>/g, '')); 
      const reference = verseData.reference;
      const permalink = verseData.permalink;

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Bible Verse of the Day')
        .setURL(permalink)
        .setDescription(verseText)
        .setFooter({ text: reference })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply('Unable to retrieve a verse at this time. Please try again later.');
    }
  },
};
