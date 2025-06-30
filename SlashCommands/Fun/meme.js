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

  run: async (client, interaction, args) => {
    await interaction.deferReply();

    const category = interaction.options.getString('category') || 'meme';

    try {
      const response = await fetch(`https://meme-api.com/gimme/${category}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      if (!data || !data.url) {
        return interaction.editReply({ content: "Couldn't find a meme in that category or the API response was invalid!" });
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setURL(data.postLink)
        .setImage(data.url)
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setFooter({ text: `👍 ${data.ups}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Meme command error:', error);
      if (interaction.deferred) {
        await interaction.editReply({ content: 'Something went wrong while fetching your meme.' });
      } else {
        await interaction.reply({ content: 'Something went wrong while fetching your meme.', ephemeral: true });
      }
    }
  },
};
