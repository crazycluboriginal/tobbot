const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('animal')
    .setDescription('Get a picture and fact about a specific animal')
    .addStringOption(option =>
      option
        .setName('animal')
        .setDescription('Pick an animal and get a cute pic of it!')
        .setRequired(true)
        .addChoices(
          { name: 'Duck', value: 'duck' },
          { name: 'Lion', value: 'lion' },
          { name: 'Giraffe', value: 'giraffe' },
          { name: 'Dog', value: 'dog' },
          { name: 'Horse', value: 'horse' },
          { name: 'Bird', value: 'bird' },
          { name: 'Cat', value: 'cat' },
          { name: 'Pig', value: 'pig' },
          { name: 'Panda', value: 'panda' }
        )
    ),

  run: async (client, interaction) => {
    const animal = interaction.options.getString('animal');
    const animalNameMap = {
      duck: 'Duck',
      lion: 'Lion',
      giraffe: 'Giraffe 🦒',
      dog: 'AWW look at this Dawg!',
      horse: 'Adorable horse',
      bird: 'Birds Are Real.',
      cat: 'Cat Gaming',
      pig: 'Oinky 🐷 Pig',
      panda: 'Awww, check out this panda!'
    };

    try {
      // Always defer immediately
      await interaction.deferReply();

      const response = await fetch(`https://api.amymals.xyz/animal/${animal}`, { timeout: 5000 });
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const data = await response.json();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(animalNameMap[animal] || 'Animal')
        .setDescription(data.description || 'No description available.')
        .setImage(data.image || '')
        .setFooter({ text: data.fact || '' });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Animal command error:', error);
      try {
        // Always send something back
        await interaction.editReply({ content: `❌ Failed to fetch ${animalNameMap[animal] || 'animal'}. Please try again.` });
      } catch (e) {
        console.error('Failed to edit reply:', e);
      }
    }
  }
};
