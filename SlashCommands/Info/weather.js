const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const fetch = require("node-fetch");
const apiKey = '3c4048f209bab356f911291f74507907';

module.exports = {
  name: "weather",
  description: "Get current weather information for a city",
  options: [
    {
      name: "city",
      description: "The name of the city you want to get weather info from",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const city = interaction.options.getString("city");
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`Fetch failed with status: ${response.status}`);
        return interaction.reply({ content: `Error: ${response.statusText}`, ephemeral: true });
      }

      const JSONObj = await response.json();
      const temp = JSONObj.main.temp;
      let sky = JSONObj.weather[0].description;

      // Capitalize the first letter of each word
      sky = sky.replace(/\b\w/g, (char) => char.toUpperCase());

      const emojiMap = {
        rain: '🌧️',
        cloud: '☁️',
        snow: '🌨️',
        thunder: '⛈️',
        few: '🌤️',
        broken: '⛅️',
        scattered: '⛅️',
        mist: '🌫️',
        fog: '🌫️',
        smoke: '💨',
      };

      let emoji = '☀️';
      for (const [condition, emojiCode] of Object.entries(emojiMap)) {
        if (sky.toLowerCase().includes(condition)) {
          emoji = emojiCode;
          break;
        }
      }

      let cityname = city.replace(/\b\w/g, (char) => char.toUpperCase());

      const weatherEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Weather in ${cityname}`)
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/4052/4052984.png')
        .addFields(
          { name: 'Temperature', value: `${temp}°C`, inline: true },
          { name: 'Conditions', value: `${emoji} ${sky}`, inline: true },
        )
        .setTimestamp();

      await interaction.reply({ embeds: [weatherEmbed] })
        .catch((err) => console.error('Failed to send weather embed:', err));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      await interaction.reply({ content: 'Oops! Something went wrong while fetching the weather information.', ephemeral: true });
    }
  },
};
