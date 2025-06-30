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

  async execute(interaction) {
    await interaction.deferReply();
    const rawCity = interaction.options.getString('city');
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // Capitalise each word of the city input as user formatted
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
      fog: '🌫️',
    };

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { q: rawCity, appid: apiKey, units: 'metric' }
      });
      const data = response.data;

      // Select one entry per day (every 8th entry)
      const forecastEntries = [];
      for (let i = 0; i < data.list.length && forecastEntries.length < 5; i += 8) {
        forecastEntries.push(data.list[i]);
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
      console.error('Error fetching weather forecast:', error);
      await interaction.editReply('Oops! Something went wrong while fetching the weather forecast.');
    }
  }
};
