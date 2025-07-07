const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');
const apiKey = process.env.API_NINJAS_KEY;

module.exports = {
  name: 'recipe',
  description: 'Get recipes for any food of your choice',
  options: [
    {
      name: 'query',
      description: 'What do you want a recipe for?',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const query = interaction.options.getString('query');
    const apiUrl = `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(apiUrl, {
        headers: { 'X-Api-Key': apiKey }
      });
      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        return interaction.reply({ content: 'Oops! Something went wrong while fetching the recipes.', ephemeral: true });
      }

      const recipes = await response.json();
      if (Array.isArray(recipes) && recipes.length > 0) {
        const embed = new EmbedBuilder()
          .setColor(Math.floor(Math.random() * 0xFFFFFF))
          .setTitle(`Recipes for "${query}"`)
          .setDescription(
            recipes
              .map(r => `**${r.title}**\nServings: ${r.servings}\n${r.instructions}`)
              .join('\n\n')
          );

        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({ content: `No recipes found for "${query}".`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return interaction.reply({ content: 'Oops! Something went wrong while fetching the recipes.', ephemeral: true });
    }
  },
};
