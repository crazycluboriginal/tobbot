const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forecast')
    .setDescription('Get a 5-day weather forecast for any city')
    .addStringOption(option =>
      option.setName('city')
            .setDescription('The name of the city of your choice')
            .setRequired(true)
    ),

  async run(client, interaction, args) {  // <<<< MUST be .run for your handler
    if (!interaction.deferReply) {
      return interaction.reply({ content: 'Interaction type not supported.', flags: 1 << 6 });
    }

    await interaction.deferReply();

    const rawCity = args[0]?.trim();
    const apiKey = "3c4048f209bab356f911291f74507907";

    if (!apiKey) {
      return await interaction.editReply('Weather API key is missing. Please contact the administrator.');
    }

    if (!rawCity) {
      return await interaction.editReply('Please provide a valid city name.');
    }

    const cityFormatted = rawCity
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const emojiMap = {
      rain: '🌧️',
      cloud: '☁️',
      snow: '🌨️',
      thunder: '⛈️',
      few: '🌤️',
      broken: '⛅️',
      scattered: '🌤️',
      mist: '🌫️',
      fog: '🌁',
    };

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { q: rawCity, appid: apiKey, units: 'metric' }
      });

      const data = response.data;
      const forecastEntries = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

      if (forecastEntries.length === 0) {
        return await interaction.editReply('No forecast data available for this city.');
      }

      const weatherEmbed = new EmbedBuilder()
        .setTitle(`5-Day Weather Forecast for ${cityFormatted}`)
        .setColor('#0099ff')
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/4052/4052984.png')
        .setTimestamp();

      forecastEntries.forEach(day => {
        const date = new Date(day.dt * 1000).toDateString();
        const tempHigh = day.main.temp_max.toFixed(1);
        const tempLow = day.main.temp_min.toFixed(1);
        const desc = day.weather[0].description;

        let emoji = '☀️';
        for (const [condition, icon] of Object.entries(emojiMap)) {
          if (desc.toLowerCase().includes(condition)) {
            emoji = icon;
            break;
          }
        }

        const temperature = tempHigh === tempLow
          ? `${tempHigh}°C`
          : `${tempHigh}°C / ${tempLow}°C`;

        weatherEmbed.addFields({
          name: date,
          value: `${emoji} ${temperature}\n**${desc}**`,
          inline: true
        });
      });

      await interaction.editReply({ embeds: [weatherEmbed] });

    } catch (error) {
      console.error('Weather error:', error);
      if (error.response && error.response.status === 404) {
        await interaction.editReply('City not found. Please check the spelling and try again.');
      } else {
        await interaction.editReply('Failed to fetch weather data. Please try again later.');
      }
    }
  }
};
