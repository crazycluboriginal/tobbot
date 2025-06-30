const { EmbedBuilder } = require('discord.js');

// Use environment variables instead of config.json for customizable settings
const DEFAULT_PREFIX = process.env.PREFIX || '!';

module.exports = {
  /**
   * Formats a duration (in milliseconds) into a human-readable string
   * @param {number} ms
   * @returns {string}
   */
  formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return [hours, minutes, seconds]
      .map((v, i) => String(v).padStart(2, '0'))
      .join(':');
  },

  /**
   * Creates a standardized embed with default colour and footer
   * @param {object} options
   * @returns {EmbedBuilder}
   */
  createEmbed({ title, description, fields = [], colour, footer } = {}) {
    const embed = new EmbedBuilder()
      .setTitle(title || '')
      .setDescription(description || '')
      .setColor(colour || 0x00AE86)
      .setTimestamp();

    fields.forEach(f => embed.addFields(f));

    if (footer) embed.setFooter({ text: footer });
    return embed;
  },

  /**
   * Retrieves the command prefix from environment or default
   * @returns {string}
   */
  getPrefix() {
    return DEFAULT_PREFIX;
  }
};
