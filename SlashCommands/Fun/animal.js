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

  async execute(interaction) {
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

    await interaction.deferReply();
    try {
      const response = await fetch(`https://api.amymals.xyz/animal/${animal}`);
      const data = await response.json();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(animalNameMap[animal])
        .setDescription(data.description)
        .setImage(data.image)
        .setFooter({ text: data.fact });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: `Failed to fetch a ${animalNameMap[animal]} picture. Please try again later.` });
    }
  }
};
