const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require('discord.js');
const axios = require('axios');
const apiKey = process.env.API_NINJAS_KEY;

module.exports = {
  name: 'inflation',
  description: 'Get current inflation percentages for any country of your choice',
  options: [
    {
      name: 'country',
      description: 'The country for which you want inflation data',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const country = interaction.options.getString('country');
    try {
      const response = await axios.get('https://api.api-ninjas.com/v1/inflation', {
        params: { country },
        headers: { 'X-Api-Key': apiKey },
      });
      const body = response.data;

      if (Array.isArray(body) && body.length > 0) {
        const inf = body[0];
        const embed = new EmbedBuilder()
          .setTitle(`Inflation Data for ${inf.country}`)
          .setColor(Colors.Blue)
          .addFields(
            { name: 'Currency', value: inf.currency, inline: true },
            { name: 'Year', value: inf.year.toString(), inline: true },
            { name: 'Monthly Rate (%)', value: inf.monthly_rate_pct.toFixed(2), inline: true },
            { name: 'Yearly Rate (%)', value: inf.yearly_rate_pct.toFixed(2), inline: true }
          )
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({ content: `No inflation data found for ${country}.`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error fetching inflation data:', error);
      return interaction.reply({ content: 'Oops! Something went wrong while fetching the inflation data.', ephemeral: true });
    }
  },
};
