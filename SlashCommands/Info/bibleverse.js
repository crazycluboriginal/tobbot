const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bibleverse')
    .setDescription('Fetch a random Bible verse'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/verses/random', {
        headers: { 'api-key': process.env.BIBLE_API_KEY }
      });
      const verse = res.data.data;
      const embed = new EmbedBuilder()
        .setTitle(`${verse.reference}`)
        .setDescription(verse.content.replace(/<\/?[^>]+(>|$)/g, '')) // strip HTML
        .setFooter({ text: verse.bibleName })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Error fetching bible verse:', err);
      await interaction.editReply('Couldn’t retrieve a Bible verse at this time.');
    }
  },
};
