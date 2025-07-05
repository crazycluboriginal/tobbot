const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Sends a random meme from Meme API. You can also pick a category (optional)')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Choose a category for memes (optional)')
        .setRequired(false)
        .addChoices(
          { name: 'General', value: 'meme' },
          { name: 'Programming', value: 'programming' },
          { name: 'Dark', value: 'dark' },
          { name: 'Wholesome', value: 'wholesome' },
          { name: 'Pun', value: 'pun' },
          { name: 'Cat', value: 'cat' }
        )
    ),

  run: async (client, interaction) => {
    try {
      // Always defer immediately to avoid 3-second timeout
      await interaction.deferReply();

      const category = interaction.options.getString('category') || 'meme';
      const response = await fetch(`https://meme-api.com/gimme/${category}`, { timeout: 3000 });

      if (!response.ok) {
        await interaction.editReply({ content: '❌ Could not fetch meme. Try again later.' });
        return;
      }

      const data = await response.json();
      if (!data || !data.url) {
        await interaction.editReply({ content: '❌ Invalid meme data received.' });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title || 'Meme')
        .setURL(data.postLink || 'https://reddit.com/r/memes')
        .setImage(data.url)
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setFooter({ text: `👍 ${data.ups || 0}` });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Meme command error:', error);
      // Always safe: editReply only, since deferReply was guaranteed
      try {
        await interaction.editReply({ content: '❌ Something went wrong while fetching your meme.' });
      } catch (e) {
        console.error('Failed to edit reply:', e);
      }
    }
  },
};
