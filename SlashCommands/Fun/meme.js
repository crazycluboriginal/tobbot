const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Sends a random meme; you can pick a category (optional)')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Choose a category for memes')
        .setRequired(false)
        .addChoices(
          { name: 'Programming', value: 'programming' },
          { name: 'Dark jokes',  value: 'darkjokes'  },
          { name: 'Wholesome',   value: 'wholesome'  },
          { name: 'Pun',         value: 'pun'        },
          { name: 'Cats',        value: 'cats'       }
        )
    ),

  run: async (client, interaction) => {
    await interaction.deferReply();

    const category = interaction.options.getString('category');
    const url = category
      ? `https://meme-api.com/gimme/${category}`
      : 'https://meme-api.com/gimme';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return interaction.editReply('❌ Could not fetch meme. Try again later.');
      }

      const data = await response.json();
      if (!data.url) {
        return interaction.editReply('❌ Invalid meme data received.');
      }

      const embed = new EmbedBuilder()
        .setTitle(data.title || 'Meme')
        .setURL(data.postLink)
        .setImage(data.url)
        .setColor(Math.floor(Math.random() * 0xFFFFFF))
        .setFooter({ text: `👍 ${data.ups || 0}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Meme command error:', error);
      await interaction.editReply('❌ Something went wrong while fetching your meme.');
    }
  },
};
