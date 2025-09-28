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

  async run(client, interaction, args) {
    try {
      if (typeof interaction.deferReply !== 'function') {
        return interaction.reply({ content: 'Interaction type not supported.', flags: 1 << 6 });
      }
      await interaction.deferReply();

      const rawCityInput =
        interaction.options?.getString?.('city') ??
        (Array.isArray(args) ? args[0] : undefined);

      const rawCity = typeof rawCityInput === 'string' ? rawCityInput.trim() : '';
      const apiKey = '3c4048f209bab356f911291f74507907';

      if (!apiKey) return interaction.editReply('Weather API key is missing. Please contact the administrator.');
      if (!rawCity) return interaction.editReply('Please provide a valid city name.');

      const cityFormatted = rawCity
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
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

      // 5-day / 3-hour forecast
      const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { q: rawCity, appid: apiKey, units: 'metric' },
        timeout: 15000
      });

      if (!data || !Array.isArray(data.list)) {
        return interaction.editReply('Failed to fetch weather data. Please try again later.');
      }

      const tzOffsetSec = Number(data?.city?.timezone) || 0;

      // Group 3-hour entries by LOCAL calendar day at the target location
      const daysMap = new Map();
      for (const it of data.list) {
        const localTsMs = (Number(it.dt) + tzOffsetSec) * 1000;
        const d = new Date(localTsMs);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        if (!daysMap.has(key)) daysMap.set(key, []);
        daysMap.get(key).push(it);
      }

      // Build up to 5 consecutive day summaries starting from today (in that location)
      const dayKeys = Array.from(daysMap.keys()).slice(0, 5);
      if (dayKeys.length === 0) {
        return interaction.editReply('No forecast data available for this city.');
      }

      const capWords = s => String(s ?? '').replace(/\b\w/g, c => c.toUpperCase());
      const fmtDate = (key) => {
        const [y, m, d] = key.split('-').map(Number);
        // Reconstruct a local date label
        const dt = new Date(Date.UTC(y, m - 1, d));
        const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dt.getUTCDay()];
        const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dt.getUTCMonth()];
        return `${wd} ${mon} ${String(d).padStart(2, '0')}`;
      };

      const embed = new EmbedBuilder()
        .setTitle(`5-Day Forecast • ${cityFormatted}`)
        .setColor(0x0099ff)
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/4052/4052984.png')
        .setTimestamp();

      for (const key of dayKeys) {
        const bucket = daysMap.get(key);

        // True daily extremes: use main.temp across all 3-hour slots
        let dailyHigh = -Infinity;
        let dailyLow = Infinity;

        // Pick a representative condition: prefer around local 12:00, else first slot
        let representative = null;
        let nearestNoonDiff = Infinity;

        for (const it of bucket) {
          const t = Number(it?.main?.temp);
          if (Number.isFinite(t)) {
            if (t > dailyHigh) dailyHigh = t;
            if (t < dailyLow) dailyLow = t;
          }

          const localTs = (Number(it.dt) + tzOffsetSec) * 1000;
          const local = new Date(localTs);
          const diff = Math.abs(local.getHours() - 12); // closeness to noon
          if (diff < nearestNoonDiff) {
            nearestNoonDiff = diff;
            representative = it;
          }
        }

        if (!Number.isFinite(dailyHigh) || !Number.isFinite(dailyLow)) continue;

        const desc = String(representative?.weather?.[0]?.description ?? '');
        const pop = Math.round((Number(representative?.pop) || 0) * 100);

        let emoji = '☀️';
        for (const [condition, icon] of Object.entries(emojiMap)) {
          if (desc.toLowerCase().includes(condition)) { emoji = icon; break; }
        }

        const lines = [];
        lines.push(`${emoji} **${capWords(desc)}**`);
        lines.push(`High: **${dailyHigh.toFixed(1)}°C**`);
        lines.push(`Low: **${dailyLow.toFixed(1)}°C**`);
        if (!Number.isNaN(pop) && pop > 0) lines.push(`Precipitation: ${pop}%`);

        embed.addFields({
          name: fmtDate(key),
          value: lines.join('\n'),
          inline: true
        });
      }

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Weather error:', error?.response?.status, error?.response?.data || error?.message || error);
      if (error?.response?.status === 404) {
        return interaction.editReply('City not found. Please check the spelling and try again.');
      }
      if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timeout')) {
        return interaction.editReply('Weather service timed out. Please try again in a moment.');
      }
      return interaction.editReply('Failed to fetch weather data. Please try again later.');
    }
  }
};
