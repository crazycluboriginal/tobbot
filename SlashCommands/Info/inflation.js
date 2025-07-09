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

        const currency = inf.currency ?? 'N/A';
        const year = inf.year !== undefined ? inf.year.toString() : 'N/A';
        const monthly = inf.monthly_rate_pct !== undefined ? inf.monthly_rate_pct.toFixed(2) : 'N/A';
        const yearly = inf.yearly_rate_pct !== undefined ? inf.yearly_rate_pct.toFixed(2) : 'N/A';

        const embed = new EmbedBuilder()
          .setTitle(`Inflation Data for ${inf.country || country}`)
          .setColor(Colors.Blue)
          .addFields(
            { name: 'Currency', value: currency, inline: true },
            { name: 'Year', value: year, inline: true },
            { name: 'Monthly Rate (%)', value: monthly, inline: true },
            { name: 'Yearly Rate (%)', value: yearly, inline: true }
          )
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({ content: `No inflation data found for ${country}.`, flags: 1 << 6 });
      }
    } catch (error) {
      console.error('Error fetching inflation data:', error);
      return interaction.reply({ content: 'Failed to fetch inflation data.', flags: 1 << 6 });
    }
  },
};
