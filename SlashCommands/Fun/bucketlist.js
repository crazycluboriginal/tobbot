const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bucketlist')
    .setDescription('Get a random bucket list item'),

  async execute(interaction) {
    await interaction.deferReply();

    const apiUrl = 'https://api.api-ninjas.com/v1/bucketlist';
    const headers = { 'X-Api-Key': "kUbHc84s5XrO12w/Kk7eCg==4X74mFYTQRjACVwB"}; 

    try {
      const response = await axios.get(apiUrl, { headers });
      const item = response.data.item;

      const embed = new EmbedBuilder()
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setTitle('🎯 Bucket List Item')
        .setDescription(item);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching bucket list item:', error);
      await interaction.editReply('Oops! Something went wrong while fetching the bucket list item.');
    }
  }
};
