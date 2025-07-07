const { EmbedBuilder, Colors, ApplicationCommandOptionType } = require("discord.js");
const axios = require("axios");
const apiKey = process.env.API_NINJAS_KEY;

module.exports = {
  name: "history",
  description: "Fetch a historical event based on a text query",
  options: [
    {
      name: "event",
      description: "Enter the historical event you want to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const textQuery = interaction.options.getString("event");
    const apiUrl = `https://api.api-ninjas.com/v1/historicalevents?text=${encodeURIComponent(textQuery)}`;
    const headers = { 'X-Api-Key': apiKey };

    try {
      const response = await axios.get(apiUrl, { headers });
      if (response.status !== 200) {
        console.error('Request failed:', response.status);
        return interaction.reply({ content: 'Oops! Something went wrong while fetching the historical event.', ephemeral: true });
      }

      const eventData = response.data;
      if (!eventData.length) {
        return interaction.reply({ content: 'No historical events found.', ephemeral: true });
      }

      const event = eventData[0];
      const dateValue = `${event.day}/${event.month}/${event.year}`;
      const eventEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle('Historical Event')
        .addFields(
          { name: 'Date', value: dateValue, inline: true },
          { name: 'Event', value: event.event, inline: false }
        );

      await interaction.reply({ embeds: [eventEmbed] });
    } catch (err) {
      console.error('Error fetching historical event:', err);
      await interaction.reply({ content: 'Oops! Something went wrong while fetching the historical event.', ephemeral: true });
    }
  },
};
